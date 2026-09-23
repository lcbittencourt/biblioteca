const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const state = { screen: "home", data: {}, editing: {}, permissionGranted: false, picker: null };
const labels = {
    nacionalidade: { BR:"Brasil", CN:"China", DE:"Alemanha", FR:"França", GB:"Reino Unido", IN:"Índia", IT:"Itália", JP:"Japão", RU:"Rússia", US:"Estados Unidos" },
    genero: { "Narrativo_Épico":"Narrativo / Épico", "Lírico":"Lírico", "Drámatico":"Dramático", Jornalismo:"Jornalismo" }
};

const crudConfig = {
    autores: {
        title:"Autores", subtitle:"Gerencie as pessoas responsáveis pelas obras do acervo.", endpoint:"/autores", singular:"autor",
        fields:`<div class="field"><label>Nome completo</label><input name="nome" required minlength="2" maxlength="100" placeholder="Ex.: Machado de Assis"></div>
        <div class="field"><label>Nacionalidade</label><select name="nacionalidade" required><option value="">Selecione</option>${Object.entries(labels.nacionalidade).map(([v,l])=>`<option value="${v}">${l}</option>`).join("")}</select></div>
        <div class="field"><label>Data de nascimento</label><input name="dataNascimento" type="date" required></div>
        <div class="field"><label>Gênero literário</label><select name="generoLiterario" required><option value="">Selecione</option>${Object.entries(labels.genero).map(([v,l])=>`<option value="${v}">${l}</option>`).join("")}</select></div>`,
        columns:["ID","Autor","Nacionalidade","Nascimento","Situação"], payload:f=>({nome:f.nome,nacionalidade:f.nacionalidade,dataNascimento:f.dataNascimento,generoLiterario:f.generoLiterario}),
        row:o=>[`<strong>#${o.id}</strong>`,`<div class="record-title">${esc(o.nome)}</div><div class="record-subtitle">${esc(labels.genero[o.generoLiterario]||o.generoLiterario)}</div>`,esc(labels.nacionalidade[o.nacionalidade]||o.nacionalidade),dateBR(o.dataNascimento),statusPill(o.ativa)]
    },
    categorias: {
        title:"Categorias", subtitle:"Organize os livros por assunto e classificação.", endpoint:"/categorias", singular:"categoria",
        fields:`<div class="field"><label>Nome</label><input name="nome" required minlength="2" maxlength="60" placeholder="Ex.: Literatura brasileira"></div><div class="field"><label>Descrição</label><textarea name="descricao" maxlength="250" placeholder="Descreva brevemente esta categoria"></textarea></div>`,
        columns:["ID","Categoria","Descrição","Situação"], payload:f=>({nome:f.nome,descricao:f.descricao}),
        row:o=>[`<strong>#${o.id}</strong>`,`<div class="record-title">${esc(o.nome)}</div>`,esc(o.descricao||"Sem descrição"),statusPill(o.ativa)]
    },
    livros: {
        title:"Livros", subtitle:"Controle títulos, estoque e vínculos do acervo.", endpoint:"/livros", singular:"livro",
        fields:`<div class="field"><label>Título</label><input name="titulo" required maxlength="150" placeholder="Ex.: Dom Casmurro"></div><div class="field"><label>ISBN</label><input name="isbn" required minlength="10" maxlength="14" placeholder="9788535910663"></div><div class="field"><label>Ano de publicação</label><input name="anoPublicacao" type="number" min="1000" max="9999" required></div><div class="field"><label>Quantidade</label><input name="quantidade" type="number" min="0" required></div><div class="field"><label>Autor</label><select name="autorId" required data-options="autores"><option value="">Selecione um autor</option></select></div><div class="field"><label>Categoria</label><select name="categoriaId" required data-options="categorias"><option value="">Selecione uma categoria</option></select></div>`,
        columns:["ID","Livro","Autor / Categoria","Estoque","Situação"], payload:f=>({titulo:f.titulo,isbn:f.isbn,anoPublicacao:Number(f.anoPublicacao),quantidade:Number(f.quantidade),autorId:Number(f.autorId),categoriaId:Number(f.categoriaId)}),
        row:o=>[`<strong>#${o.id}</strong>`,`<div class="record-title">${esc(o.titulo)}</div><div class="record-subtitle">ISBN ${esc(o.isbn)} • ${o.anoPublicacao}</div>`,`<div class="record-title">${esc(o.autor?.nome||"—")}</div><div class="record-subtitle">${esc(o.categoria?.nome||"Sem categoria")}</div>`,`<strong>${o.quantidade}</strong> unidade${o.quantidade===1?"":"s"}`,statusPill(o.ativo)],
        fill:(form,o)=>{form.autorId.value=o.autor?.id||"";form.categoriaId.value=o.categoria?.id||""}
    },
    leitores: {
        title:"Leitores", subtitle:"Mantenha dados pessoais e contatos atualizados.", endpoint:"/leitores", singular:"leitor",
        fields:`<div class="field"><label>Nome completo</label><input name="nome" required minlength="2" maxlength="100"></div><div class="field"><label>CPF</label><input name="cpf" required inputmode="numeric" pattern="[0-9]{11}" maxlength="11" placeholder="Somente números"></div><div class="field"><label>Data de nascimento</label><input name="dataNascimento" type="date" required></div><div class="field"><label>Telefone</label><input name="numeroTelefone" required minlength="13" maxlength="14" placeholder="(11)99999-9999"></div><div class="field"><label>Rua</label><input name="rua" required maxlength="200"></div><div class="field"><label>Número</label><input name="numeroCasa" required maxlength="5"></div><div class="field"><label>Complemento</label><input name="complemento" maxlength="50"></div><div class="field"><label>Bairro</label><input name="bairro" required maxlength="100"></div><div class="field"><label>Cidade</label><input name="cidade" required maxlength="100"></div><div class="field"><label>Estado</label><input name="estado" required minlength="2" maxlength="2" placeholder="SP" style="text-transform:uppercase"></div><div class="field"><label>CEP</label><input name="cep" required minlength="8" maxlength="9" placeholder="01001000"></div>`,
        columns:["Código","ID","Leitor","Contato","Situação"], payload:f=>({nome:f.nome,cpf:f.cpf,dataNascimento:f.dataNascimento,numeroTelefone:f.numeroTelefone,rua:f.rua,numeroCasa:f.numeroCasa,complemento:f.complemento||"",bairro:f.bairro,cidade:f.cidade,estado:f.estado.toUpperCase(),cep:f.cep}),
        row:o=>[`<span class="record-code">${esc(o.codigo||"Não gerado")}</span>`,`<strong>#${o.id}</strong>`,`<div class="record-title">${esc(o.nome)}</div><div class="record-subtitle">CPF ${esc(o.cpf)}</div>`,`<div>${esc(o.numeroTelefone)}</div><div class="record-subtitle">${esc(o.cidade)} / ${esc(o.estado)}</div>`,statusPill(o.ativo)]
    }
};

document.addEventListener("DOMContentLoaded", () => {
    setupTheme(); setupNavigation(); setupModal(); setupLoans();
    Object.keys(crudConfig).forEach(renderCrud);
    setToday(); loadDashboard();
});

function setupTheme(){
    const saved=localStorage.getItem("biblio-theme");
    const theme=saved||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
    document.documentElement.dataset.theme=theme;
    $("#themeToggle").addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;localStorage.setItem("biblio-theme",next)});
}
function setupNavigation(){
    document.addEventListener("click",e=>{const button=e.target.closest("[data-go]");if(button) navigate(button.dataset.go)});
    addEventListener("popstate",()=>navigate(location.hash.slice(1)||"home",false));
    const initial=location.hash.slice(1);if(initial&&$("#screen-"+initial)) navigate(initial,false);
}
async function navigate(name,push=true){
    const next=$("#screen-"+name);if(!next)return;
    $$(".screen.active").forEach(s=>s.classList.remove("active"));next.classList.add("active");state.screen=name;
    if(push) history.pushState({},"","#"+name);scrollTo({top:0,behavior:"smooth"});
    if(crudConfig[name]) await loadCrud(name);
    if(name==="retirada") await prepareWithdrawal();
    if(name==="devolucao") await loadWithdrawalReaders();
    if(name==="home") loadDashboard();
}

function renderCrud(name){
    const c=crudConfig[name], mount=$(`[data-crud="${name}"]`);
    mount.innerHTML=`<div class="crud-layout"><div class="crud-heading"><div><button class="back-button" type="button" data-go="cadastros">← <span>Cadastros</span></button><span class="eyebrow">Gerenciamento</span><h1>${c.title}</h1><p>${c.subtitle}</p></div></div><form class="panel crud-form" id="form-${name}"><div class="panel-title"><div><span class="panel-kicker">Novo registro</span><h2 id="form-title-${name}">Cadastrar ${capitalize(c.singular)}</h2></div></div><div class="form-grid">${c.fields}</div><div class="form-actions"><button class="button ghost cancel-edit" type="button" hidden>Cancelar</button><button class="button primary" type="submit">Salvar ${c.singular}</button></div></form><div class="panel crud-list"><div class="toolbar"><div><span class="panel-kicker">Registros</span><h2>Lista de ${c.title.toLowerCase()}</h2></div><div class="search-box"><input type="search" placeholder="Buscar..." data-search="${name}"></div></div><div class="table-wrap"><table><thead><tr>${c.columns.map(x=>`<th>${x}</th>`).join("")}<th class="align-right">Ações</th></tr></thead><tbody id="table-${name}">${emptyRow(c.columns.length+1,"Carregando registros...")}</tbody></table></div></div></div>`;
    const form=$(`#form-${name}`);
    form.addEventListener("submit",e=>submitCrud(e,name));
    $(".cancel-edit",form).addEventListener("click",()=>resetCrudForm(name));
    $(`[data-search="${name}"]`).addEventListener("input",e=>drawCrudRows(name,e.target.value));
}

async function loadCrud(name){
    const c=crudConfig[name];
    try{
        if(name==="livros") await loadBookRelations();
        state.data[name]=await api(c.endpoint);drawCrudRows(name);
    }catch(e){showTableError(`#table-${name}`,c.columns.length+1,e.message)}
}
function drawCrudRows(name,query=""){
    const c=crudConfig[name],data=(state.data[name]||[]).filter(o=>JSON.stringify(o).toLowerCase().includes(query.toLowerCase())),tbody=$(`#table-${name}`);
    if(!data.length){tbody.innerHTML=emptyRow(c.columns.length+1,query?"Nenhum resultado encontrado.":"Nenhum registro cadastrado.");return}
    tbody.innerHTML=data.map(o=>{const active=isRecordActive(o);return `<tr>${c.row(o).map(v=>`<td>${v}</td>`).join("")}<td><div class="row-actions"><button class="button tiny secondary" type="button" data-edit="${name}" data-id="${o.id}">Editar</button><button class="button tiny ${active?"danger":"primary"}" type="button" data-status="${name}" data-id="${o.id}" data-active="${active}">${active?"Desativar":"Reativar"}</button></div></td></tr>`}).join("");
    $$(`[data-edit="${name}"]`,tbody).forEach(b=>b.onclick=()=>editCrud(name,Number(b.dataset.id)));
    $$(`[data-status="${name}"]`,tbody).forEach(b=>b.onclick=()=>changeCrudStatus(name,Number(b.dataset.id),b.dataset.active==="true"));
}
async function submitCrud(event,name){
    event.preventDefault();const c=crudConfig[name],form=event.currentTarget,raw=Object.fromEntries(new FormData(form)),payload=c.payload(raw),id=state.editing[name];
    try{await api(c.endpoint+(id?`/${id}`:""),{method:id?"PUT":"POST",body:JSON.stringify(payload)});toast(`${capitalize(c.singular)} ${id?"atualizado":"cadastrado"} com sucesso.`);resetCrudForm(name);await loadCrud(name);loadDashboard()}
    catch(e){modal("Não foi possível salvar",e.message,"error")}
}
function editCrud(name,id){
    const c=crudConfig[name],o=(state.data[name]||[]).find(x=>x.id===id),form=$(`#form-${name}`);if(!o)return;
    state.editing[name]=id;Object.keys(o).forEach(k=>{if(form.elements[k]&&o[k]!=null)form.elements[k].value=o[k]});if(c.fill)c.fill(form,o);
    $(`#form-title-${name}`).textContent=`Editar ${capitalize(c.singular)}`;$("button[type=submit]",form).textContent="Salvar alterações";$(".cancel-edit",form).hidden=false;form.scrollIntoView({behavior:"smooth",block:"center"});
}
function resetCrudForm(name){const form=$(`#form-${name}`);form.reset();delete state.editing[name];$(`#form-title-${name}`).textContent=`Cadastrar ${capitalize(crudConfig[name].singular)}`;$("button[type=submit]",form).textContent=`Salvar ${crudConfig[name].singular}`;$(".cancel-edit",form).hidden=true}
async function deleteCrud(name,id){
    const ok=await confirmModal("Desativar registro?","O item ficará inativo, mas seu histórico será preservado.");if(!ok)return;
    try{await api(`${crudConfig[name].endpoint}/${id}`,{method:"DELETE"});toast("Registro desativado.");await loadCrud(name);loadDashboard()}catch(e){modal("Não foi possível desativar",e.message,"error")}
}
async function changeCrudStatus(name,id,active){
    if(active){await deleteCrud(name,id);return}
    const ok=await confirmModal("Reativar registro?","O item voltará a ficar disponível no sistema.");if(!ok)return;
    try{await api(`${crudConfig[name].endpoint}/${id}/reativar`,{method:"PUT"});toast("Registro reativado.");await loadCrud(name);loadDashboard()}catch(e){modal("Não foi possível reativar",e.message,"error")}
}
async function loadBookRelations(){
    const [authors,categories]=await Promise.all([api("/autores"),api("/categorias")]);state.data.autores=authors;state.data.categorias=categories;
    fillSelect('[data-options="autores"]',authors.filter(x=>x.ativa!==false),"Selecione um autor",x=>x.nome);
    fillSelect('[data-options="categorias"]',categories.filter(x=>x.ativa!==false),"Selecione uma categoria",x=>x.nome);
}

function setupLoans(){
    $("#consultReader").onclick=()=>openPicker("reader");$("#consultBook").onclick=()=>openPicker("book");$("#consultReturnReader").onclick=()=>openPicker("returnReader");$("#checkPermission").onclick=checkPermission;$("#loanTerm").onchange=calculateDueDate;
    $("#loanForm").addEventListener("submit",submitLoan);$("#loanForm").addEventListener("reset",()=>setTimeout(resetLoan,0));
    $("#searchLoans").onclick=searchActiveLoans;
    $("#pickerInput").addEventListener("input",drawPickerResults);$("#pickerClose").onclick=closePicker;$("#pickerBackdrop").addEventListener("click",e=>{if(e.target.id==="pickerBackdrop")closePicker()});
}
async function prepareWithdrawal(){await Promise.all([loadWithdrawalReaders(),populateAvailableBooks()]);resetLoan()}
async function loadWithdrawalReaders(){try{state.data.leitores=await api("/leitores")}catch(e){toast(e.message,"error")}}
async function populateReaders(selector){try{const readers=await api("/leitores");state.data.leitores=readers;fillSelect(selector,readers.filter(x=>x.ativo!==false),"Selecione um leitor",x=>`${x.nome} • CPF ${x.cpf}`)}catch(e){toast(e.message,"error")}}
async function populateAvailableBooks(){try{state.data.livros=await api("/livros")}catch(e){toast(e.message,"error")}}
async function checkPermission(){
    const id=Number($("#loanReader").value);if(!id){toast("Selecione um leitor.","error");return}
    try{const allowed=await api(`/emprestimos/permissao/${id}`);state.permissionGranted=allowed;const badge=$("#permissionBadge"),msg=$("#permissionMessage");badge.className=`permission ${allowed?"allowed":"denied"}`;badge.textContent=allowed?"Leitor permitido":"Empréstimo bloqueado";msg.textContent=allowed?"Cadastro regular. Consulte e selecione o livro.":"O leitor está inativo ou possui empréstimo em atraso.";$("#consultBook").disabled=!allowed;$("#loanTerm").disabled=!allowed;$("#confirmLoan").disabled=!allowed||!$("#loanBook").value;if(allowed){setLoanStep(2);calculateDueDate()}else{modal("Empréstimo não permitido",msg.textContent,"error")}}
    catch(e){modal("Não foi possível validar",e.message,"error")}
}
function resetLoan(){state.permissionGranted=false;const today=isoToday();$("#loanDate").value=today;$("#loanDueDate").value="";$("#loanReader").value="";$("#loanReaderName").value="";$("#loanBook").value="";$("#loanBookName").value="";$("#consultBook").disabled=true;$("#loanTerm").disabled=true;$("#confirmLoan").disabled=true;$("#permissionBadge").className="permission neutral";$("#permissionBadge").textContent="Aguardando leitor";$("#permissionMessage").textContent="Consulte e selecione um leitor para verificar a situação.";setLoanStep(1)}
function calculateDueDate(){const date=new Date(`${isoToday()}T12:00:00`);date.setDate(date.getDate()+Number($("#loanTerm").value||30));$("#loanDueDate").value=date.toISOString().slice(0,10);updateLoanSteps()}
function updateLoanSteps(){if(state.permissionGranted&&$("#loanBook").value)setLoanStep(3)}
function openPicker(type){
    if(type==="book"&&!state.permissionGranted)return;
    const isReader=type!=="book";state.picker=type;$("#pickerTitle").textContent=isReader?"Localizar leitor":"Localizar livro";$("#pickerHint").textContent=isReader?"Digite o nome, o código ou o ID do leitor e clique no resultado desejado.":"Digite o título ou o ID do livro e clique no resultado desejado.";$("#pickerInput").placeholder=isReader?"Nome, código ou ID do leitor...":"Título ou ID do livro...";$("#pickerInput").value="";drawPickerResults();$("#pickerBackdrop").classList.add("open");$("#pickerBackdrop").setAttribute("aria-hidden","false");setTimeout(()=>$("#pickerInput").focus(),80)
}
function closePicker(){$("#pickerBackdrop").classList.remove("open");$("#pickerBackdrop").setAttribute("aria-hidden","true");state.picker=null}
function drawPickerResults(){
    const type=state.picker;if(!type)return;const isReader=type!=="book";const query=normalizeText($("#pickerInput").value);const source=isReader?(state.data.leitores||[]).filter(x=>x.ativo!==false):(state.data.livros||[]).filter(x=>x.ativo!==false&&x.quantidade>0);const matches=source.filter(x=>normalizeText(`${x.id} ${isReader?`${x.codigo||""} ${x.nome}`:x.titulo}`).includes(query));const box=$("#pickerResults");
    if(!matches.length){box.innerHTML=`<div class="picker-empty">Nenhum ${isReader?"leitor":"livro"} encontrado.</div>`;return}
    box.innerHTML=matches.map(x=>`<button class="picker-option" type="button" data-picker-id="${x.id}"><span><strong>${esc(isReader?x.nome:x.titulo)}</strong><small>${isReader?`Código ${esc(x.codigo||"não gerado")} • ID #${x.id} • CPF ${esc(x.cpf)}`:`ID #${x.id} • ${x.quantidade} unidade${x.quantidade===1?"":"s"} disponível${x.quantidade===1?"":"is"}`}</small></span><span>Selecionar →</span></button>`).join("");$$('[data-picker-id]',box).forEach(b=>b.onclick=()=>selectPickerItem(Number(b.dataset.pickerId)))
}
function selectPickerItem(id){
    const type=state.picker;if(type==="returnReader"){const item=(state.data.leitores||[]).find(x=>x.id===id);if(!item)return;$("#returnReader").value=item.id;$("#returnReaderName").value=`${item.codigo||"#"+item.id} — ${item.nome}`;$("#loanCount").textContent="0 empréstimos";$("#activeLoansTable").innerHTML=emptyRow(5,"Clique em Buscar para visualizar os empréstimos.")}else if(type==="reader"){const item=(state.data.leitores||[]).find(x=>x.id===id);if(!item)return;$("#loanReader").value=item.id;$("#loanReaderName").value=`${item.codigo||"#"+item.id} — ${item.nome}`;$("#loanBook").value="";$("#loanBookName").value="";state.permissionGranted=false;$("#consultBook").disabled=true;$("#loanTerm").disabled=true;$("#confirmLoan").disabled=true;$("#permissionBadge").className="permission neutral";$("#permissionBadge").textContent="Aguardando verificação";$("#permissionMessage").textContent="Leitor selecionado. Clique em Verificar."}else{const item=(state.data.livros||[]).find(x=>x.id===id);if(!item)return;$("#loanBook").value=item.id;$("#loanBookName").value=`#${item.id} — ${item.titulo}`;$("#confirmLoan").disabled=false;updateLoanSteps()}closePicker()
}
function normalizeText(value){return String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}
function setLoanStep(n){$$('[data-loan-step]').forEach((x,i)=>{x.classList.toggle("active",i+1===n);x.classList.toggle("done",i+1<n)})}
async function submitLoan(e){e.preventDefault();if(!state.permissionGranted||!$("#loanBook").value){toast("Selecione um livro disponível.","error");return}const payload={leitorId:Number($("#loanReader").value),livroId:Number($("#loanBook").value),prazoDias:Number($("#loanTerm").value)};try{const loan=await api("/emprestimos",{method:"POST",body:JSON.stringify(payload)});modal("Empréstimo confirmado",`${loan.livro?.titulo||"Livro"} deve ser devolvido até ${dateBR(loan.dataPrevistaDevolucao)}.`);e.target.reset();await populateAvailableBooks();loadDashboard()}catch(err){modal("Não foi possível emprestar",err.message,"error")}}
async function searchActiveLoans(){
    const id=Number($("#returnReader").value);if(!id){toast("Selecione um leitor.","error");return}
    try{const loans=await api(`/emprestimos/leitor/${id}/ativos`);state.data.activeLoans=loans;drawActiveLoans(loans)}catch(e){showTableError("#activeLoansTable",5,e.message)}
}
function drawActiveLoans(loans){const tbody=$("#activeLoansTable");$("#loanCount").textContent=`${loans.length} empréstimo${loans.length===1?"":"s"}`;if(!loans.length){tbody.innerHTML=emptyRow(5,"Este leitor não possui empréstimos ativos.");return}tbody.innerHTML=loans.map(l=>`<tr><td><div class="record-title">${esc(l.livro?.titulo||"Livro")}</div><div class="record-subtitle">Empréstimo #${l.id}</div></td><td>${dateBR(l.dataEmprestimo)}</td><td>${dateBR(l.dataPrevistaDevolucao)}</td><td>${duePill(l.dataPrevistaDevolucao)}</td><td><div class="row-actions"><button class="button tiny secondary" data-renew="${l.id}">Renovar</button><button class="button tiny primary" data-return="${l.id}">Devolver</button></div></td></tr>`).join("");$$('[data-return]',tbody).forEach(b=>b.onclick=()=>returnLoan(Number(b.dataset.return)));$$('[data-renew]',tbody).forEach(b=>b.onclick=()=>renewLoan(Number(b.dataset.renew)))}
async function returnLoan(id){if(!await confirmModal("Confirmar devolução?","O exemplar voltará imediatamente ao estoque disponível."))return;try{await api(`/emprestimos/${id}/devolver`,{method:"PUT"});modal("Devolução concluída","O livro foi devolvido e já está disponível no acervo.");await searchActiveLoans();loadDashboard()}catch(e){modal("Não foi possível devolver",e.message,"error")}}
async function renewLoan(id){const term=await renewalModal();if(!term)return;try{const loan=await api(`/emprestimos/${id}/renovar`,{method:"PUT",body:JSON.stringify({prazoDias:term})});modal("Empréstimo renovado",`Nova data prevista: ${dateBR(loan.dataPrevistaDevolucao)}.`);await searchActiveLoans()}catch(e){modal("Não foi possível renovar",e.message,"error")}}

async function loadDashboard(){try{const [books,readers,authors]=await Promise.all([api("/livros"),api("/leitores"),api("/autores")]);$("#statBooks").textContent=books.filter(x=>x.ativo!==false).reduce((n,x)=>n+(x.quantidade||0),0);$("#statReaders").textContent=readers.filter(x=>x.ativo!==false).length;$("#statAuthors").textContent=authors.filter(x=>x.ativa!==false).length;$("#apiStatus").classList.remove("offline");$("#apiStatus span").textContent="Sistema online"}catch{$("#apiStatus").classList.add("offline");$("#apiStatus span").textContent="API indisponível"}}
async function api(url,options={}){const bar=$("#loadingBar");bar.classList.add("active");try{const response=await fetch(url,{headers:{"Content-Type":"application/json",...(options.headers||{})},...options});const text=await response.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}if(!response.ok)throw new Error(extractError(data)||`Erro ${response.status}`);return data}finally{bar.classList.remove("active")}}
function extractError(data){if(!data)return null;if(typeof data==="string")return data;if(data.message&&!data.message.startsWith("Validation failed"))return data.message;if(data.errors)return Object.values(data.errors).join(" • ");return data.error||null}

function setupModal(){["#modalClose","#modalOk"].forEach(s=>$(s).onclick=closeModal);$("#modalBackdrop").onclick=e=>{if(e.target.id==="modalBackdrop")closeModal()}}
function modal(title,text,type="success"){$("#modalTitle").textContent=title;$("#modalText").textContent=text;$("#modalIcon").textContent=type==="error"?"!":"✓";$("#modalIcon").className=`modal-icon ${type==="error"?"error":""}`;$("#modalActions").innerHTML='<button class="button primary" type="button" id="modalOk">Continuar</button>';$("#modalOk").onclick=closeModal;openModal()}
function confirmModal(title,text){return new Promise(resolve=>{$("#modalTitle").textContent=title;$("#modalText").textContent=text;$("#modalIcon").textContent="?";$("#modalIcon").className="modal-icon";$("#modalActions").innerHTML='<button class="button ghost" id="cancelConfirm">Cancelar</button><button class="button primary" id="acceptConfirm">Confirmar</button>';$("#cancelConfirm").onclick=()=>{closeModal();resolve(false)};$("#acceptConfirm").onclick=()=>{closeModal();resolve(true)};openModal()})}
function renewalModal(){return new Promise(resolve=>{$("#modalTitle").textContent="Renovar empréstimo";$("#modalText").innerHTML='Escolha o novo prazo:<select id="renewTerm" style="margin-top:16px"><option value="30">30 dias</option><option value="45">45 dias</option><option value="60">60 dias</option></select>';$("#modalIcon").textContent="↻";$("#modalIcon").className="modal-icon";$("#modalActions").innerHTML='<button class="button ghost" id="cancelRenew">Cancelar</button><button class="button primary" id="acceptRenew">Renovar</button>';$("#cancelRenew").onclick=()=>{closeModal();resolve(null)};$("#acceptRenew").onclick=()=>{const v=Number($("#renewTerm").value);closeModal();resolve(v)};openModal()})}
function openModal(){$("#modalBackdrop").classList.add("open");$("#modalBackdrop").setAttribute("aria-hidden","false")}function closeModal(){$("#modalBackdrop").classList.remove("open");$("#modalBackdrop").setAttribute("aria-hidden","true")}
function toast(message,type="success"){const el=document.createElement("div");el.className=`toast ${type}`;el.textContent=message;$("#toastStack").append(el);setTimeout(()=>el.remove(),4000)}

function fillSelect(selector,data,placeholder,label){const select=$(selector);if(!select)return;const current=select.value;select.innerHTML=`<option value="">${placeholder}</option>`+data.map(x=>`<option value="${x.id}">${esc(label(x))}</option>`).join("");select.value=current}
function emptyRow(cols,text){return `<tr class="empty-row"><td colspan="${cols}"><span>⌕</span><strong>${esc(text)}</strong><small>Os dados aparecerão aqui.</small></td></tr>`}
function showTableError(selector,cols,text){$(selector).innerHTML=emptyRow(cols,text);toast(text,"error")}
function statusPill(active){return `<span class="status-pill ${active?"active":"inactive"}">${active?"Ativo":"Inativo"}</span>`}
function isRecordActive(record){return record.ativa !== undefined ? record.ativa : record.ativo}
function duePill(date){const late=new Date(`${date}T23:59:59`)<new Date();return `<span class="status-pill ${late?"inactive":"active"}">${late?"Atrasado":"No prazo"}</span>`}
function dateBR(value){if(!value)return"—";return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR")}
function isoToday(){const d=new Date(),offset=d.getTimezoneOffset();return new Date(d.getTime()-offset*60000).toISOString().slice(0,10)}
function setToday(){$("#todayLabel").textContent=new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"});$("#loanDate").value=isoToday()}
function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function esc(value){return String(value??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]))}

import{h as $,render as ne}from"https://esm.sh/preact";import{useState as p,useEffect as j,useCallback as W}from"https://esm.sh/preact/hooks";import C from"https://esm.sh/htm";import{HashRouter as ce,Routes as de,Route as D,Navigate as V}from"https://esm.sh/react-router-dom@6?alias=react:preact/compat,react-dom:preact/compat";import{Layout as se,LogIn as me,UserPlus as ue,ArrowRight as Z,Trophy as J,ArrowLeft as H,X as U,Plus as ee,Trash2 as le,ExternalLink as pe,Check as X,Copy as oe,LogOut as be,Users as G,Settings as xe,Search as fe,Edit3 as ge,Save as he,ShieldCheck as re,Calendar as ve}from"https://esm.sh/lucide-preact";(function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const we="modulepreload",Ne=function(e,l){return new URL(e,l).href},te={},S=function(l,t,a){let s=Promise.resolve();if(t&&t.length>0){let c=function(i){return Promise.all(i.map(g=>Promise.resolve(g).then(x=>({status:"fulfilled",value:x}),x=>({status:"rejected",reason:x}))))};const d=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),u=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=c(t.map(i=>{if(i=Ne(i,a),i in te)return;te[i]=!0;const g=i.endsWith(".css"),x=g?'[rel="stylesheet"]':"";if(!!a)for(let v=d.length-1;v>=0;v--){const b=d[v];if(b.href===i&&(!g||b.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${i}"]${x}`))return;const m=document.createElement("link");if(m.rel=g?"stylesheet":we,g||(m.as="script"),m.crossOrigin="",m.href=i,u&&m.setAttribute("nonce",u),document.head.appendChild(m),g)return new Promise((v,b)=>{m.addEventListener("load",v),m.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${i}`)))})}))}function r(c){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=c,window.dispatchEvent(d),!d.defaultPrevented)throw c}return s.then(c=>{for(const d of c||[])d.status==="rejected"&&r(d.reason);return l().catch(r)})},$e=C.bind($);function ye({config:e}){return e!=null&&e.primaryColor,e!=null&&e.secondaryColor,$e`
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center gap-2 cursor-pointer group" onClick=${()=>window.location.hash="/"}>
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
              <${se} className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
              ${(e==null?void 0:e.platformName)||"Rifa Digital"}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#funciona" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Como Funciona</a>
            <a href="#modelos" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Modelos</a>
            <a href="#precos" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Preços</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick=${()=>window.location.hash="/login"}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors"
            >
              <${me} className="w-4 h-4" />
              Entrar
            </button>
            <button 
              onClick=${()=>window.location.hash="/cadastro"}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-slate-200 active:scale-95"
            >
              <${ue} className="w-4 h-4" />
              Criar Conta
            </button>
          </div>
        </div>
      </div>
    </header>
  `}const ke=C.bind($);function Se({config:e}){return ke`
    <footer className="bg-slate-900 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">R</span>
              </div>
              <span className="text-xl font-black text-white">${(e==null?void 0:e.platformName)||"Rifa Digital"}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              A maior e mais segura plataforma para criação e gestão de rifas digitais e bolões esportivos do Brasil.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Plataforma</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Como funciona</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de uso</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Suporte</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Central de ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Email</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Social</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-600 cursor-pointer transition-colors text-white">
                <i className="fab fa-instagram"></i>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-600 cursor-pointer transition-colors text-white">
                <i className="fab fa-facebook"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-xs">
            ${(e==null?void 0:e.footerText)||"© 2026 Rifa Digital. Todos os direitos reservados."}
          </p>
        </div>
      </div>
    </footer>
  `}const Ce=C.bind($);function Pe({config:e}){return Ce`
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-100/30 blur-[120px] rounded-full -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-orange-100 shadow-sm mb-8 animate-bounce">
          <span className="flex h-2 w-2 rounded-full bg-orange-600"></span>
          <span className="text-xs font-bold text-orange-900 uppercase tracking-widest">Novo: Bolões Esportivos Disponíveis</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
          ${(e==null?void 0:e.heroTitle)||"Crie sua Rifa Digital em minutos"}
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-12 font-medium leading-relaxed">
          ${(e==null?void 0:e.heroSub)||"A plataforma mais completa para gerenciar seus sorteios online com segurança e transparência."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-10 py-5 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-700 hover:scale-105 transition-all active:scale-95 text-lg">
            Começar Agora Grátis
          </button>
          <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 font-black rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all text-lg">
            Ver Demonstração
          </button>
        </div>

        <div className="mt-20 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-[2rem] blur opacity-20"></div>
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
            className="relative rounded-[2rem] border border-white shadow-2xl w-full max-w-5xl mx-auto"
            alt="Dashboard Preview"
          />
        </div>
      </div>
    </section>
  `}const A=C.bind($);function Re(){var o,u;const[e,l]=p(null),[t,a]=p([]),[s,r]=p([]),[c,d]=p(!0);return j(()=>{async function i(){try{const{fsGetGlobalConfig:g,fsGetCollection:x}=await S(async()=>{const{fsGetGlobalConfig:b,fsGetCollection:P}=await import("./firebase-BNeoOC_q.js");return{fsGetGlobalConfig:b,fsGetCollection:P}},[],import.meta.url),f=await g();l(f);const m=await x("rifas"),v=await x("boloes");a(m.filter(b=>b.status==="ativo").slice(0,4)),r(v.filter(b=>b.status==="ativo").slice(0,4))}catch(g){console.error(g)}finally{d(!1)}}i()},[]),A`
    <div className="min-h-screen">
      <${ye} config=${e} />
      
      <main>
        <${Pe} config=${e} />

        <!-- Dynamic Items Section -->
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
               <div>
                  <span className="text-orange-600 font-bold text-sm uppercase tracking-widest">Participe Agora</span>
                  <h2 className="text-4xl font-black text-slate-900 mt-2">Sorteios em Destaque</h2>
               </div>
            </div>

            ${c?A`
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
            `:A`
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${t.map(i=>A`
                  <div key=${i.id} onClick=${()=>window.location.hash=`/rifa/${i.slug}`} className="cursor-pointer group">
                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-100 mb-4">
                      <img src=${i.bannerUrl||"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-black rounded-full uppercase">Rifa</span>
                        </div>
                        <h3 className="text-white font-black text-xl leading-tight">${i.nome}</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2">
                       <span className="text-slate-500 text-sm font-bold">Cota: <span className="text-slate-900">R$ ${i.pricePerParticipant.toFixed(2)}</span></span>
                       <span className="text-orange-600 font-black text-xs uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">Ver agora <${Z} className="w-3 h-3" /></span>
                    </div>
                  </div>
                `)}

                ${s.map(i=>A`
                  <div key=${i.id} onClick=${()=>window.location.hash=`/bolao/${i.slug}`} className="cursor-pointer group">
                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-blue-900 mb-4">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                         <${J} className="w-32 h-32 text-white" />
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black rounded-full uppercase">Bolão</span>
                        </div>
                        <h3 className="text-white font-black text-xl leading-tight">${i.nome}</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2">
                       <span className="text-slate-500 text-sm font-bold">Cota: <span className="text-slate-900">R$ ${i.pricePerParticipant.toFixed(2)}</span></span>
                       <span className="text-blue-600 font-black text-xs uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">Palpitar <${Z} className="w-3 h-3" /></span>
                    </div>
                  </div>
                `)}
              </div>
            `}
          </div>
        </section>
        
        <!-- Features Section -->
        <section id="funciona" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-orange-600 font-bold text-sm uppercase tracking-widest">${(e==null?void 0:e.featuresLabel)||"Benefícios"}</span>
              <h2 className="text-4xl font-black text-slate-900 mt-2">${(e==null?void 0:e.featuresTitle)||"Por que escolher nossa plataforma?"}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${(o=e==null?void 0:e.features)==null?void 0:o.map(i=>A`
                <div key=${i.title} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-all group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">${i.title}</h3>
                  <p className="text-slate-600 leading-relaxed">${i.desc}</p>
                </div>
              `)}
            </div>
          </div>
        </section>

        <!-- Pricing Section -->
        <section id="precos" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Planos Simples e Transparentes</h2>
            <p className="text-slate-600 mb-12">Escolha o plano que melhor se adapta ao seu sorteio.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-left">
                <h3 className="text-xl font-bold mb-2">Básico</h3>
                <div className="text-3xl font-black mb-6">Grátis <span className="text-sm text-slate-400 font-normal">/setup</span></div>
                <ul className="space-y-4 text-slate-600 mb-8">
                  <li>✅ Até 100 números</li>
                  <li>✅ Taxa de 10%</li>
                  <li>✅ Suporte por Email</li>
                </ul>
                <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Selecionar</button>
              </div>

              <div className="p-8 bg-white rounded-3xl border-2 border-orange-500 shadow-xl shadow-orange-100 text-left relative overflow-hidden scale-105">
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase">Mais Popular</div>
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="text-3xl font-black mb-6">R$ 49 <span className="text-sm text-slate-400 font-normal">/setup</span></div>
                <ul className="space-y-4 text-slate-600 mb-8">
                  <li>✅ Até 10.000 números</li>
                  <li>✅ Taxa de 5%</li>
                  <li>✅ Suporte WhatsApp VIP</li>
                </ul>
                <button className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors">Selecionar</button>
              </div>

              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-left">
                <h3 className="text-xl font-bold mb-2">Elite</h3>
                <div className="text-3xl font-black mb-6">R$ 199 <span className="text-sm text-slate-400 font-normal">/setup</span></div>
                <ul className="space-y-4 text-slate-600 mb-8">
                  <li>✅ Números Ilimitados</li>
                  <li>✅ Taxa de 2.5%</li>
                  <li>✅ Gerente de Contas</li>
                </ul>
                <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Selecionar</button>
              </div>
            </div>
          </div>
        </section>

        <!-- FAQ Section -->
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-black text-slate-900 text-center mb-12">Perguntas Frequentes</h2>
            <div className="space-y-4">
              ${(u=e==null?void 0:e.faqs)==null?void 0:u.map(i=>A`
                <div key=${i.q} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">${i.q}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">${i.a}</p>
                </div>
              `)}
            </div>
          </div>
        </section>
      </main>

      <${Se} config=${e} />
    </div>
  `}const M=C.bind($);function ae({isRegister:e=!1,onLogin:l}){const[t,a]=p({username:"",password:"",nome:"",role:"user"}),[s,r]=p(!1),[c,d]=p(null);return M`
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative">
      <button 
        onClick=${()=>window.location.hash="/"}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-all group"
      >
        <${H} className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar
      </button>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-200">
            <span className="text-white font-black text-3xl">R</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">${e?"Criar Conta":"Boas-vindas!"}</h1>
          <p className="text-slate-500 text-sm font-medium">Acesse a plataforma de sorteios número 1.</p>
        </div>

        <form onSubmit=${async u=>{u.preventDefault(),r(!0),d(null);try{const{fsQueryCollection:i,fsSetDocument:g}=await S(async()=>{const{fsQueryCollection:x,fsSetDocument:f}=await import("./firebase-BNeoOC_q.js");return{fsQueryCollection:x,fsSetDocument:f}},[],import.meta.url);if(e){if((await i("usuarios","username","==",t.username)).length>0)throw new Error("Usuário já existe");const f={...t,id:"u_"+Date.now(),status:"ativo",saldo:0,createdAt:new Date().toISOString()};await g("usuarios",f.id,f),localStorage.setItem("user",JSON.stringify(f)),l(f),window.location.hash="/dashboard"}else{const f=(await i("usuarios","username","==",t.username)).find(m=>m.password===t.password);if(!f)throw new Error("Credenciais inválidas");localStorage.setItem("user",JSON.stringify(f)),l(f),window.location.hash=f.role==="super_admin"?"/admin":"/dashboard"}}catch(i){d(i.message)}finally{r(!1)}}} className="space-y-4">
          ${e&&M`
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Nome Completo</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium text-slate-900"
                value=${t.nome}
                onInput=${u=>a({...t,nome:u.target.value})}
              />
            </div>
          `}
          
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Usuário</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium text-slate-900"
              value=${t.username}
              onInput=${u=>a({...t,username:u.target.value})}
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Senha</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium text-slate-900"
              value=${t.password}
              onInput=${u=>a({...t,password:u.target.value})}
            />
          </div>

          ${c&&M`<p className="text-red-500 text-xs font-bold text-center">${c}</p>`}

          <button 
            disabled=${s}
            className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            ${s?"Processando...":e?"Criar Minha Conta":"Entrar na Plataforma"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick=${()=>window.location.hash=e?"/login":"/cadastro"}
            className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors"
          >
            ${e?"Já tenho uma conta? Entrar":"Não tem conta? Cadastrar-se"}
          </button>
        </div>
      </div>
    </div>
  `}const Ie=C.bind($);function _e({user:e,onClose:l,onCreated:t}){const[a,s]=p({nome:"",description:"",pricePerParticipant:10,maxParticipants:100,bannerUrl:"",slug:""}),[r,c]=p(!1);return Ie`
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Nova Rifa</h2>
          <button onClick=${l} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <${U} className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit=${async o=>{o.preventDefault(),c(!0);try{const{fsSetDocument:u}=await S(async()=>{const{fsSetDocument:f}=await import("./firebase-BNeoOC_q.js");return{fsSetDocument:f}},[],import.meta.url),i="rifa_"+Date.now(),g=a.slug||a.nome.toLowerCase().replace(/ /g,"-").replace(/[^\w-]/g,""),x={...a,id:i,userId:e.id,slug:g,status:"ativo",bookedNumbers:[],createdAt:new Date().toISOString()};await u("rifas",i,x),t(),l()}catch(u){alert("Erro ao criar rifa: "+u.message)}finally{c(!1)}}} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Título da Rifa</label>
            <input 
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
              value=${a.nome}
              onInput=${o=>s({...a,nome:o.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Preço por Cota</label>
              <input 
                type="number"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                value=${a.pricePerParticipant}
                onInput=${o=>s({...a,pricePerParticipant:parseFloat(o.target.value)})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Qtd Números</label>
              <input 
                type="number"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                value=${a.maxParticipants}
                onInput=${o=>s({...a,maxParticipants:parseInt(o.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Banner URL (Opcional)</label>
            <input 
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
              placeholder="https://..."
              value=${a.bannerUrl}
              onInput=${o=>s({...a,bannerUrl:o.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Descrição</label>
            <textarea 
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium min-h-[100px]"
              value=${a.description}
              onInput=${o=>s({...a,description:o.target.value})}
            />
          </div>

          <button 
            disabled=${r}
            className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            ${r?"Criando...":"Criar Rifa Agora"}
          </button>
        </form>
      </div>
    </div>
  `}const Ee=C.bind($);function De({user:e,onClose:l,onCreated:t}){const[a,s]=p({nome:"",description:"",pricePerParticipant:20,slug:""}),[r,c]=p(!1);return Ee`
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Novo Bolão</h2>
          <button onClick=${l} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <${U} className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit=${async o=>{o.preventDefault(),c(!0);try{const{fsSetDocument:u}=await S(async()=>{const{fsSetDocument:f}=await import("./firebase-BNeoOC_q.js");return{fsSetDocument:f}},[],import.meta.url),i="bolao_"+Date.now(),g=a.slug||a.nome.toLowerCase().replace(/ /g,"-").replace(/[^\w-]/g,""),x={...a,id:i,userId:e.id,slug:g,status:"ativo",createdAt:new Date().toISOString()};await u("boloes",i,x),t(),l()}catch(u){alert("Erro ao criar bolão: "+u.message)}finally{c(!1)}}} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Título do Bolão</label>
            <input 
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
              value=${a.nome}
              onInput=${o=>s({...a,nome:o.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Preço da Cota</label>
            <input 
              type="number"
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
              value=${a.pricePerParticipant}
              onInput=${o=>s({...a,pricePerParticipant:parseFloat(o.target.value)})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Descrição</label>
            <textarea 
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium min-h-[100px]"
              value=${a.description}
              onInput=${o=>s({...a,description:o.target.value})}
            />
          </div>

          <button 
            disabled=${r}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            ${r?"Criando...":"Criar Bolão Agora"}
          </button>
        </form>
      </div>
    </div>
  `}const y=C.bind($);function Ae({user:e,onLogout:l}){const[t,a]=p("overview"),[s,r]=p({raffles:0,boloes:0,balance:0}),[c,d]=p([]),[o,u]=p(!0),[i,g]=p(!1),[x,f]=p(!1),[m,v]=p(null),b=W(async()=>{u(!0);try{const{fsQueryCollection:h}=await S(async()=>{const{fsQueryCollection:n}=await import("./firebase-BNeoOC_q.js");return{fsQueryCollection:n}},[],import.meta.url),_=await h("rifas","userId","==",e.id),R=await h("boloes","userId","==",e.id);r({raffles:_.length,boloes:R.length,balance:e.saldo||0}),d(t==="rifas"?_:t==="boloes"?R:[])}catch(h){console.error(h)}finally{u(!1)}},[e.id,t,e.saldo]);j(()=>{b()},[b]);const P=async(h,_)=>{if(confirm("Tem certeza que deseja excluir?"))try{const{fsDeleteDocument:R}=await S(async()=>{const{fsDeleteDocument:n}=await import("./firebase-BNeoOC_q.js");return{fsDeleteDocument:n}},[],import.meta.url);await R(h,_),b()}catch(R){alert("Erro ao excluir: "+R.message)}},O=(h,_,R)=>{const N=`${window.location.origin+window.location.pathname}#/${_}/${h}`;navigator.clipboard.writeText(N),v(R),setTimeout(()=>v(null),2e3)};return y`
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <!-- Sidebar -->
      <aside className="w-72 bg-slate-900 flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">R</span>
            </div>
            <span className="text-white font-black text-xl tracking-tight">Organizador</span>
          </div>

          <nav className="space-y-2">
            ${["overview","rifas","boloes","financeiro","config"].map(h=>y`
              <button 
                key=${h}
                onClick=${()=>a(h)}
                className=${`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${t===h?"bg-orange-600 text-white shadow-lg shadow-orange-900/20":"text-slate-400 hover:bg-slate-800 hover:text-white"}`}
              >
                <span className="capitalize">${h}</span>
              </button>
            `)}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <button 
            onClick=${l}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            Sair da Conta
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-900">Olá, ${e.nome}!</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Disponível</p>
              <p className="text-lg font-black text-orange-600">R$ ${s.balance.toLocaleString("pt-BR",{minimumFractionDigits:2})}</p>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          ${t==="overview"&&y`
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Suas Rifas</p>
                <p className="text-4xl font-black text-slate-900">${s.raffles}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Seus Bolões</p>
                <p className="text-4xl font-black text-slate-900">${s.boloes}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Participantes</p>
                <p className="text-4xl font-black text-slate-900">0</p>
              </div>
            </div>
          `}
          
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 capitalize">${t}</h3>
              
              ${t==="rifas"&&y`
                <button onClick=${()=>g(!0)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95">
                  <${ee} className="w-4 h-4" /> Nova Rifa
                </button>
              `}
              ${t==="boloes"&&y`
                <button onClick=${()=>f(!0)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95">
                  <${ee} className="w-4 h-4" /> Novo Bolão
                </button>
              `}
            </div>

            ${o?y`
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
            `:c.length===0?y`
              <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                <span className="text-6xl mb-4">📂</span>
                <p className="font-bold">Nenhum registro encontrado.</p>
                <p className="text-xs">Comece criando seu primeiro conteúdo agora mesmo.</p>
              </div>
            `:y`
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${c.map(h=>y`
                  <div key=${h.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-slate-900 text-lg">${h.nome}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">${h.status}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick=${()=>O(h.slug,t==="rifas"?"rifa":"bolao",h.id)}
                          className="p-2.5 bg-white text-slate-400 hover:text-blue-600 rounded-xl border border-slate-100 shadow-sm transition-all"
                          title="Copiar Link"
                        >
                          ${m===h.id?y`<${X} className="w-4 h-4 text-emerald-500" />`:y`<${oe} className="w-4 h-4" />`}
                        </button>
                        <button 
                          onClick=${()=>P(t,h.id)}
                          className="p-2.5 bg-white text-slate-400 hover:text-red-600 rounded-xl border border-slate-100 shadow-sm transition-all"
                          title="Excluir"
                        >
                          <${le} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Valor:</span>
                        <span className="text-sm font-black text-slate-900">R$ ${h.pricePerParticipant.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick=${()=>window.open(`#/${t==="rifas"?"rifa":"bolao"}/${h.slug}`,"_blank")}
                        className="flex items-center gap-2 text-xs font-black text-orange-600 hover:underline uppercase tracking-widest"
                      >
                        Ver Página <${pe} className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                `)}
              </div>
            `}
          </div>
        </div>
      </main>

      ${i&&y`<${_e} user=${e} onClose=${()=>g(!1)} onCreated=${b} />`}
      ${x&&y`<${De} user=${e} onClose=${()=>f(!1)} onCreated=${b} />`}
    </div>
  `}const k=C.bind($);function Le({user:e,onLogout:l}){const[t,a]=p("overview"),[s,r]=p({users:0,raffles:0,boloes:0,totalSaldo:0}),[c,d]=p([]),[o,u]=p(null),[i,g]=p(!0),[x,f]=p(""),[m,v]=p(null),b=W(async()=>{g(!0);try{const{fsGetCollection:n,fsGetDocument:N}=await S(async()=>{const{fsGetCollection:q,fsGetDocument:z}=await import("./firebase-BNeoOC_q.js");return{fsGetCollection:q,fsGetDocument:z}},[],import.meta.url),I=await n("usuarios"),K=await n("rifas"),Y=await n("boloes"),ie=await N("config","main");r({users:I.length,raffles:K.length,boloes:Y.length,totalSaldo:I.reduce((q,z)=>q+(z.saldo||0),0)}),u(ie),d(t==="usuarios"?I:t==="rifas"?K:t==="boloes"?Y:[])}catch(n){console.error(n)}finally{g(!1)}},[t]);j(()=>{b()},[b]);const P=async n=>{n.preventDefault();try{const{fsSetDocument:N}=await S(async()=>{const{fsSetDocument:I}=await import("./firebase-BNeoOC_q.js");return{fsSetDocument:I}},[],import.meta.url);await N("config","main",o),alert("Configurações atualizadas!")}catch(N){alert("Erro: "+N.message)}},O=async n=>{if(confirm("Excluir este usuário permanentemente?"))try{const{fsDeleteDocument:N}=await S(async()=>{const{fsDeleteDocument:I}=await import("./firebase-BNeoOC_q.js");return{fsDeleteDocument:I}},[],import.meta.url);await N("usuarios",n),b()}catch(N){alert("Erro: "+N.message)}},h=async()=>{try{const{fsSetDocument:n}=await S(async()=>{const{fsSetDocument:N}=await import("./firebase-BNeoOC_q.js");return{fsSetDocument:N}},[],import.meta.url);await n("usuarios",m.id,m),v(null),b()}catch(n){alert("Erro: "+n.message)}},_=[{id:"overview",label:"Visão Geral",icon:se},{id:"usuarios",label:"Usuários",icon:G},{id:"rifas",label:"Rifas",icon:G},{id:"boloes",label:"Bolões",icon:G},{id:"config",label:"Configurações",icon:xe}],R=c.filter(n=>{var N,I;return((N=n.nome)==null?void 0:N.toLowerCase().includes(x.toLowerCase()))||((I=n.username)==null?void 0:I.toLowerCase().includes(x.toLowerCase()))});return k`
    <div className="flex h-screen bg-slate-950 overflow-hidden text-white">
      <!-- Sidebar -->
      <aside className="w-72 bg-slate-900 border-r border-white/5 flex-shrink-0 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-slate-900 font-black text-xl">A</span>
            </div>
            <span className="font-black text-xl tracking-tight">Admin Master</span>
          </div>

          <nav className="space-y-1">
            ${_.map(n=>k`
              <button 
                key=${n.id}
                onClick=${()=>a(n.id)}
                className=${`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${t===n.id?"bg-white text-slate-950 shadow-lg shadow-white/10":"text-slate-400 hover:bg-white/5 hover:text-white"}`}
              >
                <${n.icon} className="w-4 h-4" />
                <span>${n.label}</span>
              </button>
            `)}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button 
            onClick=${l}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <${be} className="w-4 h-4" />
            Sair do Painel
          </button>
        </div>
      </aside>

      <!-- Main -->
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/5 p-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">Painel Administrativo</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Gestão Global da Plataforma</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saldo em Custódia</p>
              <p className="text-xl font-black text-emerald-400">R$ ${s.totalSaldo.toLocaleString("pt-BR",{minimumFractionDigits:2})}</p>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          ${t==="overview"&&k`
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Usuários</p>
                <p className="text-4xl font-black">${s.users}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Rifas Ativas</p>
                <p className="text-4xl font-black text-orange-500">${s.raffles}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Bolões Ativos</p>
                <p className="text-4xl font-black text-blue-500">${s.boloes}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Novos Hoje</p>
                <p className="text-4xl font-black text-emerald-500">2</p>
              </div>
            </div>
          `}

          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 min-h-[400px]">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black capitalize">${t}</h3>
                ${["usuarios","rifas","boloes"].includes(t)&&k`
                  <div className="relative">
                    <${fe} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Pesquisar..." 
                      className="bg-white/5 border border-white/10 rounded-full pl-11 pr-6 py-2.5 text-sm focus:ring-2 focus:ring-white/20 transition-all"
                      onInput=${n=>f(n.target.value)}
                    />
                  </div>
                `}
             </div>

             ${i?k`
               <div className="flex items-center justify-center py-20">
                 <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
               </div>
             `:t==="usuarios"?k`
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                       <th className="pb-4 px-4">Nome / Usuário</th>
                       <th className="pb-4 px-4">Saldo</th>
                       <th className="pb-4 px-4">Role</th>
                       <th className="pb-4 px-4">Status</th>
                       <th className="pb-4 px-4 text-right">Ações</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     ${R.map(n=>{var N;return k`
                       <tr key=${n.id} className="group hover:bg-white/5 transition-colors">
                         <td className="py-4 px-4">
                           <p className="font-bold text-sm">${n.nome}</p>
                           <p className="text-xs text-slate-500">@${n.username}</p>
                         </td>
                         <td className="py-4 px-4">
                           ${(m==null?void 0:m.id)===n.id?k`
                             <input 
                               type="number" 
                               className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-24 text-sm"
                               value=${m.saldo}
                               onInput=${I=>v({...m,saldo:parseFloat(I.target.value)})}
                             />
                           `:k`<span className="font-bold text-sm text-emerald-400">R$ ${(N=n.saldo)==null?void 0:N.toFixed(2)}</span>`}
                         </td>
                         <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase">${n.role}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
                              <span className=${`w-1.5 h-1.5 rounded-full ${n.status==="ativo"?"bg-emerald-500":"bg-red-500"}`}></span>
                              ${n.status}
                            </span>
                         </td>
                         <td className="py-4 px-4 text-right">
                           <div className="flex justify-end gap-2">
                             ${(m==null?void 0:m.id)===n.id?k`
                               <button onClick=${h} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                                 <${X} className="w-4 h-4" />
                               </button>
                               <button onClick=${()=>v(null)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                 <${U} className="w-4 h-4" />
                               </button>
                             `:k`
                               <button onClick=${()=>v(n)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                                 <${ge} className="w-4 h-4" />
                               </button>
                               <button onClick=${()=>O(n.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                                 <${le} className="w-4 h-4" />
                               </button>
                             `}
                           </div>
                         </td>
                       </tr>
                     `})}
                   </tbody>
                 </table>
               </div>
             `:t==="config"?k`
                <form onSubmit=${P} className="max-w-2xl space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nome da Plataforma</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                        value=${o==null?void 0:o.platformName}
                        onInput=${n=>u({...o,platformName:n.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">E-mail de Contato</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                        value=${o==null?void 0:o.contactEmail}
                        onInput=${n=>u({...o,contactEmail:n.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">WhatsApp de Suporte</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                      value=${o==null?void 0:o.suporteWhatsapp}
                      onInput=${n=>u({...o,suporteWhatsapp:n.target.value})}
                    />
                  </div>

                  <button className="flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black shadow-xl shadow-white/10 hover:bg-slate-200 transition-all active:scale-95">
                    <${he} className="w-5 h-5" /> Salvar Configurações
                  </button>
                </form>
             `:k`
               <div className="flex flex-col items-center justify-center h-full py-20 opacity-30">
                 <span className="text-6xl mb-4">⚙️</span>
                 <p className="font-bold">Módulo em migração...</p>
                 <p className="text-xs">As listagens de Rifas e Bolões serão restauradas com filtros globais.</p>
               </div>
             `}
          </div>
        </div>
      </main>
    </div>
  `}const L=C.bind($);function Oe({rifa:e,selectedNumbers:l,onClose:t,onFinish:a}){const[s,r]=p("form"),[c,d]=p({nome:"",whatsapp:""}),[o,u]=p(!1),[i,g]=p(!1),x=l.length*e.pricePerParticipant,f=async b=>{b.preventDefault(),r("payment")},m=async()=>{u(!0);try{const{fsSetDocument:b,fsGetDocument:P}=await S(async()=>{const{fsSetDocument:R,fsGetDocument:n}=await import("./firebase-BNeoOC_q.js");return{fsSetDocument:R,fsGetDocument:n}},[],import.meta.url),O=await P("rifas",e.id),h=[...O.bookedNumbers||[],...l];await b("rifas",e.id,{...O,bookedNumbers:h});const _="part_"+Date.now();await b("participacoes",_,{id:_,rifaId:e.id,buyer:c,numbers:l,total:x,status:"pago",createdAt:new Date().toISOString()}),r("success")}catch(b){alert("Erro ao processar: "+b.message)}finally{u(!1)}},v=()=>{navigator.clipboard.writeText("00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540510.005802BR5913RIFA DIGITAL6009SAO PAULO62070503***6304E228"),g(!0),setTimeout(()=>g(null),2e3)};return L`
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Finalizar Compra</h2>
            <button onClick=${t} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <${U} className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          ${s==="form"&&L`
            <form onSubmit=${f} className="space-y-6">
               <div className="bg-slate-50 p-6 rounded-3xl mb-6">
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resumo</p>
                 <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">${l.length} Números</span>
                    <span className="text-xl font-black text-orange-600">R$ ${x.toFixed(2)}</span>
                 </div>
               </div>

               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Seu Nome Completo</label>
                 <input 
                   required
                   className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                   value=${c.nome}
                   onInput=${b=>d({...c,nome:b.target.value})}
                 />
               </div>

               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Seu WhatsApp</label>
                 <input 
                   required
                   placeholder="(00) 00000-0000"
                   className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                   value=${c.whatsapp}
                   onInput=${b=>d({...c,whatsapp:b.target.value})}
                 />
               </div>

               <button className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95">
                 Ir para Pagamento
               </button>
            </form>
          `}

          ${s==="payment"&&L`
            <div className="text-center">
              <div className="w-48 h-48 bg-slate-100 rounded-3xl mx-auto mb-8 flex items-center justify-center p-4">
                <!-- Mock QR Code -->
                <div className="w-full h-full bg-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center">
                   <div className="grid grid-cols-4 gap-2 opacity-20">
                      ${Array.from({length:16}).map((b,P)=>L`<div key=${P} className="w-4 h-4 bg-slate-900 rounded"></div>`)}
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-slate-400 font-black text-xs uppercase tracking-widest">QR Code PIX</span>
                   </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2">Escaneie o QR Code</h3>
              <p className="text-slate-500 text-sm mb-8">Ou copie o código abaixo para pagar via Pix Copia e Cola.</p>

              <button 
                onClick=${v}
                className="w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-slate-100 transition-all mb-10"
              >
                <span className="text-slate-400 text-xs font-bold truncate pr-4">00020126360014BR.GOV.BCB.PIX...</span>
                ${i?L`<span className="text-emerald-500 font-bold text-xs flex items-center gap-1"><${X} className="w-4 h-4" /> Copiado!</span>`:L`<${oe} className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />`}
              </button>

              <button 
                disabled=${o}
                onClick=${m}
                className="w-full py-5 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all"
              >
                ${o?"Confirmando...":"Já fiz o pagamento"}
              </button>
            </div>
          `}

          ${s==="success"&&L`
             <div className="text-center py-10">
               <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <${re} className="w-10 h-10" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 mb-2">Sucesso!</h2>
               <p className="text-slate-500 font-medium mb-8">Sua reserva foi confirmada. Boa sorte!</p>
               
               <button 
                onClick=${()=>{a(),t()}}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl"
               >
                 Voltar para Rifa
               </button>
             </div>
          `}
        </div>
      </div>
    </div>
  `}const F=C.bind($);function je(){const[e,l]=p(null),[t,a]=p([]),[s,r]=p(!0),[c,d]=p(!1),o=window.location.hash.split("/").pop(),u=W(async()=>{try{const{fsQueryCollection:x}=await S(async()=>{const{fsQueryCollection:m}=await import("./firebase-BNeoOC_q.js");return{fsQueryCollection:m}},[],import.meta.url),f=await x("rifas","slug","==",o);f.length>0&&l(f[0])}catch(x){console.error(x)}finally{r(!1)}},[o]);j(()=>{u()},[u]);const i=x=>{var f;(f=e.bookedNumbers)!=null&&f.includes(x)||(t.includes(x)?a(t.filter(m=>m!==x)):a([...t,x]))},g=()=>{a([]),u()};return s?F`
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
    </div>
  `:e?F`
    <div className="min-h-screen bg-white pb-20">
      <button 
        onClick=${()=>window.location.hash="/"}
        className="fixed top-8 left-8 z-50 p-3 bg-white/80 backdrop-blur-md border border-slate-100 rounded-full shadow-lg hover:bg-white transition-all group"
      >
        <${H} className="w-6 h-6 text-slate-900 group-hover:-translate-x-1 transition-transform" />
      </button>

      <!-- Rifa Hero -->
      <div className="relative h-[50vh] bg-slate-900 overflow-hidden">
        <img src=${e.bannerUrl||"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=2000"} className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
               <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
               <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Sorteio Ativo</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">${e.nome}</h1>
            <p className="text-slate-500 font-medium">${e.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Selection Grid -->
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Escolha seus números</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Toque nos números para selecionar</p>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest bg-slate-50 px-6 py-3 rounded-full border border-slate-100">
                <span className="flex items-center gap-2 text-slate-400"><span className="w-3 h-3 bg-white border border-slate-200 rounded-sm"></span> Livre</span>
                <span className="flex items-center gap-2 text-orange-600"><span className="w-3 h-3 bg-orange-600 rounded-sm"></span> Selecionado</span>
                <span className="flex items-center gap-2 text-slate-900"><span className="w-3 h-3 bg-slate-900 rounded-sm"></span> Reservado</span>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3">
              ${Array.from({length:e.maxParticipants}).map((x,f)=>{var P;const m=f+1,v=(P=e.bookedNumbers)==null?void 0:P.includes(m),b=t.includes(m);return F`
                  <button 
                    key=${m}
                    disabled=${v}
                    onClick=${()=>i(m)}
                    className=${`aspect-square flex items-center justify-center rounded-2xl font-black text-sm transition-all ${v?"bg-slate-950 text-white cursor-not-allowed opacity-20":b?"bg-orange-600 text-white shadow-xl shadow-orange-200 scale-105 z-10":"bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-transparent hover:border-slate-200"}`}
                  >
                    ${m}
                  </button>
                `})}
            </div>
          </div>

          <!-- Summary / Checkout -->
          <div className="space-y-6">
            <div className="bg-slate-950 rounded-[3rem] p-10 sticky top-10 text-white shadow-2xl shadow-slate-900/20">
              <h4 className="text-xl font-black mb-8">Resumo da Reserva</h4>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                  <span>Números selecionados</span>
                  <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white">${t.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                  <span>Preço por número</span>
                  <span className="text-white">R$ ${e.pricePerParticipant.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-black text-white pt-6 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-orange-500">R$ ${(t.length*e.pricePerParticipant).toFixed(2)}</span>
                </div>
              </div>

              <button 
                disabled=${t.length===0}
                onClick=${()=>d(!0)}
                className="w-full py-5 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-900/20 hover:bg-orange-700 transition-all disabled:opacity-30 disabled:grayscale active:scale-95"
              >
                Reservar Números Agora
              </button>

              <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                     <span className="text-lg">🛡️</span>
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Transação Segura</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Criptografia de 256 bits</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${c&&F`<${Oe} rifa=${e} selectedNumbers=${t} onClose=${()=>d(!1)} onFinish=${g} />`}
    </div>
  `:F`<div className="p-20 text-center font-bold text-slate-500">Rifa não encontrada.</div>`}const Q=C.bind($);function Fe(){const[e,l]=p(null),[t,a]=p(!0),s=window.location.hash.split("/").pop();return j(()=>{async function r(){try{const{fsQueryCollection:c}=await S(async()=>{const{fsQueryCollection:o}=await import("./firebase-BNeoOC_q.js");return{fsQueryCollection:o}},[],import.meta.url),d=await c("boloes","slug","==",s);d.length>0&&l(d[0])}catch(c){console.error(c)}finally{a(!1)}}r()},[s]),t?Q`
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  `:e?Q`
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <button 
        onClick=${()=>window.location.hash="/"}
        className="fixed top-8 left-8 z-50 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-lg hover:bg-white/10 transition-all group"
      >
        <${H} className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
      </button>

      <!-- Bolão Header -->
      <div className="relative h-[60vh] bg-blue-900/20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
           <${J} className="w-96 h-96" />
        </div>
        
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Inscrições Abertas</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">${e.nome}</h1>
          <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto leading-relaxed">${e.description}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-white/5 p-10 rounded-[3rem]">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-2xl font-black flex items-center gap-3">
                     <${ve} className="text-blue-500" /> Próximas Partidas
                   </h3>
                </div>
                
                <div className="flex flex-col items-center justify-center py-20 opacity-20 border-2 border-dashed border-white/10 rounded-[2rem]">
                  <span className="text-5xl mb-4">⚽</span>
                  <p className="text-sm font-bold">Aguardando definição dos confrontos...</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-white/5 p-10 rounded-[3rem]">
                <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
                  <${G} className="text-blue-500" /> Ranking Global
                </h3>
                <p className="text-slate-500 text-sm font-medium">O ranking será atualizado automaticamente assim que as partidas começarem.</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-blue-600 p-10 rounded-[3.5rem] shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                   <${J} className="w-24 h-24" />
                </div>
                
                <h4 className="text-2xl font-black mb-2">Entre no Jogo</h4>
                <p className="text-blue-100 text-sm mb-10 font-medium leading-relaxed">Faça seus palpites agora e concorra ao prêmio acumulado deste bolão.</p>
                
                <div className="space-y-4 mb-10 pt-8 border-t border-blue-500/30">
                   <div className="flex justify-between items-center text-blue-200 text-sm font-bold">
                      <span>Cota Individual</span>
                      <span className="text-white">R$ ${e.pricePerParticipant.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-200">Prêmio Estimado</span>
                      <span className="text-3xl font-black">R$ 1.250,00</span>
                   </div>
                </div>

                <button className="w-full py-5 bg-white text-blue-600 font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 text-lg">
                  Quero Participar
                </button>

                <div className="mt-8 flex items-center gap-3 text-blue-200/60">
                   <${re} className="w-5 h-5" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Participação Garantida</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-white/5 p-10 rounded-[3rem]">
                <h4 className="text-lg font-black mb-4">Regulamento</h4>
                <ul className="space-y-3 text-slate-500 text-xs font-medium list-disc pl-4">
                  <li>Acerte o placar exato: 25 pontos</li>
                  <li>Acerte o vencedor e diferença: 15 pontos</li>
                  <li>Acerte apenas o vencedor: 10 pontos</li>
                  <li>O prêmio será dividido entre os 3 primeiros.</li>
                </ul>
              </div>
           </div>
        </div>
      </div>
    </div>
  `:Q`<div className="p-20 text-center text-white bg-slate-950 min-h-screen">Bolão não encontrado.</div>`}const E=C.bind($);function Be(){const[e,l]=p(null);j(()=>{const a=localStorage.getItem("user");a&&l(JSON.parse(a))},[]);const t=()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),l(null),window.location.hash="/login"};return E`
    <${ce}>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-orange-100 selection:text-orange-900">
        <${de}>
          <${D} path="/" element=${E`<${Re} />`} />
          <${D} path="/rifa/:slug" element=${E`<${je} />`} />
          <${D} path="/bolao/:slug" element=${E`<${Fe} />`} />
          
          <${D} path="/login" element=${E`<${ae} onLogin=${a=>l(a)} />`} />
          <${D} path="/cadastro" element=${E`<${ae} isRegister onLogin=${a=>l(a)} />`} />

          <${D} 
            path="/admin" 
            element=${(e==null?void 0:e.role)==="super_admin"?E`<${Le} user=${e} onLogout=${t} />`:E`<${V} to="/login" />`} 
          />
          <${D} 
            path="/dashboard" 
            element=${e?E`<${Ae} user=${e} onLogout=${t} />`:E`<${V} to="/login" />`} 
          />
          
          <${D} path="*" element=${E`<${V} to="/" />`} />
        <//>
      </div>
    <//>
  `}const w={CONFIG:"rifa_config",USERS:"rifa_users",RIFAS:"rifa_raffles",BOLOES:"rifa_boloes"},Te=e=>JSON.parse(localStorage.getItem(e)||"[]"),B=(e,l)=>localStorage.setItem(e,JSON.stringify(l));function Ge(){if(!localStorage.getItem(w.USERS)){const e={id:"admin-1",username:"admin",password:"admin",nome:"Administrador",whatsapp:"11999999999",documento:"000.000.000-00",email:"admin@admin.com",role:"super_admin",status:"ativo",saldo:0,createdAt:new Date().toISOString()},l={id:"user-1",username:"demo",password:"123",nome:"Organizador Demo",whatsapp:"11988888888",documento:"111.111.111-11",email:"demo@demo.com",role:"user",status:"ativo",saldo:1250.5,createdAt:new Date().toISOString()};B(w.USERS,[e,l])}if(!localStorage.getItem(w.CONFIG)){const e={platformName:"Rifa Digital",platformLogo:"",primaryColor:"#FFFFFF",secondaryColor:"#FF8C00",contactEmail:"suporte@rifadigital.com",contactWhatsApp:"11977777777",suporteWhatsapp:"11977777777",heroTitle:"Crie sua Rifa Digital em minutos",heroSub:"A plataforma mais completa para gerenciar seus sorteios online.",featuresTitle:"Por que escolher nossa plataforma?",featuresLabel:"Benefícios",features:[{title:"Rápido e Fácil",desc:"Crie sua rifa em menos de 2 minutos.",icon:"Bike"},{title:"Pagamento Seguro",desc:"Integração direta com Mercado Pago.",icon:"ShieldCheck"},{title:"Gestão Completa",desc:"Painel administrativo para controle total.",icon:"Settings"}],faqs:[{q:"Como crio uma rifa?",a:"Basta se cadastrar e clicar no botão Criar Rifa."},{q:"Quais as taxas?",a:"Cobramos apenas 5% sobre o valor total arrecadado."}],testimonials:[{name:"João Silva",role:"Organizador",content:"Plataforma incrível, vendi todas as cotas em 3 dias!"},{name:"Maria Santos",role:"Participante",content:"Muito fácil de usar e o suporte é nota 10."}],footerText:"© 2026 Rifa Digital. Todos os direitos reservados."};localStorage.setItem(w.CONFIG,JSON.stringify(e))}if(!localStorage.getItem(w.RIFAS)){const e={id:"demo-rifa-1",userId:"user-1",nome:"iPhone 15 Pro Max",slug:"iphone-15-pro-max",description:"Participe e concorra a um iPhone 15 Pro Max novinho!",pricePerParticipant:10,maxParticipants:1e3,bookedNumbers:[1,5,10,55],logoUrl:"",bannerUrl:"",theme:"default",status:"ativo",createdAt:new Date().toISOString()};B(w.RIFAS,[e])}if(!localStorage.getItem(w.BOLOES)){const e={id:"demo-bolao-1",userId:"user-1",nome:"Brasileirão 2026 - Rodada 1",slug:"brasileirao-2026-r1",description:"Faça seus palpites e ganhe prêmios em dinheiro!",pricePerParticipant:20,maxParticipants:100,logoUrl:"",bannerUrl:"",status:"ativo",createdAt:new Date().toISOString()};B(w.BOLOES,[e])}}const T={getCollection:async e=>{const l=e.toLowerCase();let t=e;return(l==="usuarios"||l==="users")&&(t=w.USERS),(l==="rifas"||l==="raffles")&&(t=w.RIFAS),(l==="boloes"||l==="bolões")&&(t=w.BOLOES),Te(t)},getDocument:async(e,l)=>e==="config"?JSON.parse(localStorage.getItem(w.CONFIG)||"{}"):(await T.getCollection(e)).find(a=>a.id===l),setDocument:async(e,l,t)=>{if(e==="config"){const d=JSON.parse(localStorage.getItem(w.CONFIG)||"{}");localStorage.setItem(w.CONFIG,JSON.stringify({...d,...t}));return}const a=await T.getCollection(e),s=a.findIndex(d=>d.id===l);s>=0?a[s]={...a[s],...t}:a.push({id:l,...t});const r=e.toLowerCase();let c=e;(r==="usuarios"||r==="users")&&(c=w.USERS),(r==="rifas"||r==="raffles")&&(c=w.RIFAS),(r==="boloes"||r==="bolões")&&(c=w.BOLOES),B(c,a)},deleteDocument:async(e,l)=>{const a=(await T.getCollection(e)).filter(c=>c.id!==l),s=e.toLowerCase();let r=e;(s==="usuarios"||s==="users")&&(r=w.USERS),(s==="rifas"||s==="raffles")&&(r=w.RIFAS),(s==="boloes"||s==="bolões")&&(r=w.BOLOES),B(r,a)},queryCollection:async(e,l,t,a)=>(await T.getCollection(e)).filter(r=>t==="=="?r[l]===a:t==="!="?r[l]!==a:!1)};window.addEventListener("load",()=>{const e=document.getElementById("loading-screen");e&&(e.style.display="none")});Ge();ne($(Be),document.getElementById("root"));export{T as d,Ge as s};

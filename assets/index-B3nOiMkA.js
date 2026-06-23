import{h as I,render as Ce}from"https://esm.sh/preact";import{useState as b,useEffect as Q,useCallback as ne}from"https://esm.sh/preact/hooks";import E from"https://esm.sh/htm";import{HashRouter as Se,Routes as Pe,Route as B,Navigate as le}from"https://esm.sh/react-router-dom@6?alias=react:preact/compat,react-dom:preact/compat";import{Layout as H,LogIn as _e,UserPlus as De,ArrowRight as ue,Trophy as ie,ArrowLeft as ce,X as O,Plus as be,Landmark as Re,Trash2 as X,ExternalLink as Ie,Check as de,Copy as he,LogOut as Ee,Users as ve,Settings as xe,Search as Te,Edit3 as Ae,Save as je,ShieldCheck as me,Calendar as Le}from"https://esm.sh/lucide-preact";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const m of o)if(m.type==="childList")for(const c of m.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function a(o){const m={};return o.integrity&&(m.integrity=o.integrity),o.referrerPolicy&&(m.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?m.credentials="include":o.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function s(o){if(o.ep)return;o.ep=!0;const m=a(o);fetch(o.href,m)}})();const Fe="modulepreload",Be=function(e,n){return new URL(e,n).href},fe={},_=function(n,a,s){let o=Promise.resolve();if(a&&a.length>0){let c=function(l){return Promise.all(l.map(d=>Promise.resolve(d).then(x=>({status:"fulfilled",value:x}),x=>({status:"rejected",reason:x}))))};const h=document.getElementsByTagName("link"),u=document.querySelector("meta[property=csp-nonce]"),g=(u==null?void 0:u.nonce)||(u==null?void 0:u.getAttribute("nonce"));o=c(a.map(l=>{if(l=Be(l,s),l in fe)return;fe[l]=!0;const d=l.endsWith(".css"),x=d?'[rel="stylesheet"]':"";if(!!s)for(let r=h.length-1;r>=0;r--){const i=h[r];if(i.href===l&&(!d||i.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${x}`))return;const w=document.createElement("link");if(w.rel=d?"stylesheet":Fe,d||(w.as="script"),w.crossOrigin="",w.href=l,g&&w.setAttribute("nonce",g),document.head.appendChild(w),d)return new Promise((r,i)=>{w.addEventListener("load",r),w.addEventListener("error",()=>i(new Error(`Unable to preload CSS for ${l}`)))})}))}function m(c){const h=new Event("vite:preloadError",{cancelable:!0});if(h.payload=c,window.dispatchEvent(h),!h.defaultPrevented)throw c}return o.then(c=>{for(const h of c||[])h.status==="rejected"&&m(h.reason);return n().catch(m)})},qe=E.bind(I);function Oe({config:e}){return e!=null&&e.primaryColor,e!=null&&e.secondaryColor,qe`
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center gap-2 cursor-pointer group" onClick=${()=>window.location.hash="/"}>
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
              <${H} className="text-white w-6 h-6" />
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
              <${_e} className="w-4 h-4" />
              Entrar
            </button>
            <button 
              onClick=${()=>window.location.hash="/cadastro"}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-slate-200 active:scale-95"
            >
              <${De} className="w-4 h-4" />
              Criar Conta
            </button>
          </div>
        </div>
      </div>
    </header>
  `}const Ve=E.bind(I);function Me({config:e}){return Ve`
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
  `}const ze=E.bind(I);function Ge({config:e}){return ze`
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
  `}const M=E.bind(I);function Ue(){var u,g;const[e,n]=b(null),[a,s]=b([]),[o,m]=b([]),[c,h]=b(!0);return Q(()=>{async function l(){try{const{fsGetGlobalConfig:d,fsGetCollection:x}=await _(async()=>{const{fsGetGlobalConfig:i,fsGetCollection:v}=await import("./firebase-CH7o5ZTX.js");return{fsGetGlobalConfig:i,fsGetCollection:v}},[],import.meta.url),f=await d();n(f);const w=await x("rifas"),r=await x("boloes");s(w.filter(i=>i.status==="ativo").slice(0,4)),m(r.filter(i=>i.status==="ativo").slice(0,4))}catch(d){console.error(d)}finally{h(!1)}}l()},[]),M`
    <div className="min-h-screen">
      <${Oe} config=${e} />
      
      <main>
        <${Ge} config=${e} />

        <!-- Dynamic Items Section -->
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
               <div>
                  <span className="text-orange-600 font-bold text-sm uppercase tracking-widest">Participe Agora</span>
                  <h2 className="text-4xl font-black text-slate-900 mt-2">Sorteios em Destaque</h2>
               </div>
            </div>

            ${c?M`
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
            `:M`
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${a.map(l=>M`
                  <div key=${l.id} onClick=${()=>window.location.hash=`/rifa/${l.slug}`} className="cursor-pointer group">
                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-100 mb-4">
                      <img src=${l.bannerUrl||"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-black rounded-full uppercase">Rifa</span>
                        </div>
                        <h3 className="text-white font-black text-xl leading-tight">${l.nome}</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2">
                       <span className="text-slate-500 text-sm font-bold">Cota: <span className="text-slate-900">R$ ${l.pricePerParticipant.toFixed(2)}</span></span>
                       <span className="text-orange-600 font-black text-xs uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">Ver agora <${ue} className="w-3 h-3" /></span>
                    </div>
                  </div>
                `)}

                ${o.map(l=>M`
                  <div key=${l.id} onClick=${()=>window.location.hash=`/bolao/${l.slug}`} className="cursor-pointer group">
                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-blue-900 mb-4">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                         <${ie} className="w-32 h-32 text-white" />
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black rounded-full uppercase">Bolão</span>
                        </div>
                        <h3 className="text-white font-black text-xl leading-tight">${l.nome}</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2">
                       <span className="text-slate-500 text-sm font-bold">Cota: <span className="text-slate-900">R$ ${l.pricePerParticipant.toFixed(2)}</span></span>
                       <span className="text-blue-600 font-black text-xs uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">Palpitar <${ue} className="w-3 h-3" /></span>
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
              ${(u=e==null?void 0:e.features)==null?void 0:u.map(l=>M`
                <div key=${l.title} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-all group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">${l.title}</h3>
                  <p className="text-slate-600 leading-relaxed">${l.desc}</p>
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
              ${(g=e==null?void 0:e.faqs)==null?void 0:g.map(l=>M`
                <div key=${l.q} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">${l.q}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">${l.a}</p>
                </div>
              `)}
            </div>
          </div>
        </section>
      </main>

      <${Me} config=${e} />
    </div>
  `}const oe=E.bind(I);function ge({isRegister:e=!1,onLogin:n}){const[a,s]=b({username:"",password:"",nome:"",role:"user"}),[o,m]=b(!1),[c,h]=b(null);return oe`
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative">
      <button 
        onClick=${()=>window.location.hash="/"}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-all group"
      >
        <${ce} className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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

        <form onSubmit=${async g=>{g.preventDefault(),m(!0),h(null);try{const{fsQueryCollection:l,fsSetDocument:d}=await _(async()=>{const{fsQueryCollection:x,fsSetDocument:f}=await import("./firebase-CH7o5ZTX.js");return{fsQueryCollection:x,fsSetDocument:f}},[],import.meta.url);if(e){if((await l("usuarios","username","==",a.username)).length>0)throw new Error("Usuário já existe");const f={...a,id:"u_"+Date.now(),status:"ativo",saldo:0,createdAt:new Date().toISOString()};await d("usuarios",f.id,f),localStorage.setItem("user",JSON.stringify(f)),n(f),window.location.hash="/dashboard"}else{if(a.username==="admin"&&a.password==="admin"){const w={id:"admin",username:"admin",nome:"Administrador",role:"super_admin",status:"ativo"};localStorage.setItem("user",JSON.stringify(w)),n(w),window.location.hash="/admin";return}const f=(await l("usuarios","username","==",a.username)).find(w=>w.password===a.password);if(!f)throw new Error("Credenciais inválidas");localStorage.setItem("user",JSON.stringify(f)),n(f),window.location.hash=f.role==="super_admin"?"/admin":"/dashboard"}}catch(l){h(l.message)}finally{m(!1)}}} className="space-y-4">
          ${e&&oe`
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Nome Completo</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium text-slate-900"
                value=${a.nome}
                onInput=${g=>s({...a,nome:g.target.value})}
              />
            </div>
          `}
          
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Usuário</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium text-slate-900"
              value=${a.username}
              onInput=${g=>s({...a,username:g.target.value})}
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Senha</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium text-slate-900"
              value=${a.password}
              onInput=${g=>s({...a,password:g.target.value})}
            />
          </div>

          ${c&&oe`<p className="text-red-500 text-xs font-bold text-center">${c}</p>`}

          <button 
            disabled=${o}
            className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            ${o?"Processando...":e?"Criar Minha Conta":"Entrar na Plataforma"}
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
  `}const K=E.bind(I);function Ke({user:e,onClose:n,onCreated:a}){const[s,o]=b({nome:"",description:"",tipo:"normal",tema:"neutro",corSecundaria:"#ea580c",pricePerParticipant:10,maxParticipants:100,bannerUrl:"",slug:"",faixas:[]}),[m,c]=b(!1),[h,u]=b(!1),g=()=>{o({...s,faixas:[...s.faixas,{de:1,ate:10,valor:10}]})},l=r=>{const i=[...s.faixas];i.splice(r,1),o({...s,faixas:i})},d=(r,i,v)=>{const C=[...s.faixas];C[r][i]=v,o({...s,faixas:C})},x=async r=>{r.preventDefault(),u(!0);try{const{fsSetDocument:i}=await _(async()=>{const{fsSetDocument:y}=await import("./firebase-CH7o5ZTX.js");return{fsSetDocument:y}},[],import.meta.url),v="rifa_"+Date.now(),C=s.slug||s.nome.toLowerCase().replace(/ /g,"-").replace(/[^\w-]/g,""),$={...s,id:v,userId:e.id,slug:C,status:"ativo",bookedNumbers:[],createdAt:new Date().toISOString()};await i("rifas",v,$),a(),n()}catch(i){alert("Erro ao criar rifa: "+i.message)}finally{u(!1)}},f=[{id:"normal",label:"Rifa Tradicional"},{id:"cha-rifa",label:"Chá Rifa"},{id:"cha-fraldas",label:"Chá de Fraldas"},{id:"cha-revelacao",label:"Chá Revelação"}],w=[{id:"neutro",label:"Neutro"},{id:"bebe",label:"Bebê"},{id:"moto",label:"Moto"},{id:"carro",label:"Carro"},{id:"futebol",label:"Futebol"},{id:"evento",label:"Evento"}];return K`
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Configurar Campanha</h2>
          <button onClick=${n} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <${O} className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit=${x} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tipo de Campanha</label>
              <select 
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                value=${s.tipo}
                onChange=${r=>o({...s,tipo:r.target.value})}
              >
                ${f.map(r=>K`<option value=${r.id}>${r.label}</option>`)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tema Visual</label>
              <select 
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                value=${s.tema}
                onChange=${r=>o({...s,tema:r.target.value})}
              >
                ${w.map(r=>K`<option value=${r.id}>${r.label}</option>`)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Título da Rifa</label>
            <input 
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
              value=${s.nome}
              onInput=${r=>o({...s,nome:r.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Cor Secundária</label>
              <input 
                type="color"
                className="w-full h-12 p-1 bg-slate-50 border-0 rounded-2xl cursor-pointer"
                value=${s.corSecundaria}
                onInput=${r=>o({...s,corSecundaria:r.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Qtd Números</label>
              <input 
                type="number"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                value=${s.maxParticipants}
                onInput=${r=>o({...s,maxParticipants:parseInt(r.target.value)})}
              />
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuração de Preços</label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400">Preços por Faixa?</span>
                <button 
                  type="button"
                  onClick=${()=>c(!m)}
                  className=${`w-10 h-5 rounded-full transition-all relative ${m?"bg-orange-600":"bg-slate-300"}`}
                >
                  <span className=${`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${m?"left-6":"left-1"}`}></span>
                </button>
              </div>
            </div>

            ${m?K`
              <div className="space-y-3">
                ${s.faixas.map((r,i)=>K`
                  <div key=${i} className="flex gap-2 items-center">
                    <input type="number" placeholder="De" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs" value=${r.de} onInput=${v=>d(i,"de",parseInt(v.target.value))} />
                    <input type="number" placeholder="Até" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs" value=${r.ate} onInput=${v=>d(i,"ate",parseInt(v.target.value))} />
                    <input type="number" placeholder="Valor R$" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold" value=${r.valor} onInput=${v=>d(i,"valor",parseFloat(v.target.value))} />
                    <button type="button" onClick=${()=>l(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><${O} className="w-4 h-4" /></button>
                  </div>
                `)}
                <button type="button" onClick=${g} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-xs font-black text-slate-400 hover:bg-slate-100 uppercase tracking-widest">+ Adicionar Faixa</button>
              </div>
            `:K`
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Preço Fixo por Cota</label>
                <input 
                  type="number"
                  required
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                  value=${s.pricePerParticipant}
                  onInput=${r=>o({...s,pricePerParticipant:parseFloat(r.target.value)})}
                />
              </div>
            `}
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Banner URL (Opcional)</label>
            <input 
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
              placeholder="https://..."
              value=${s.bannerUrl}
              onInput=${r=>o({...s,bannerUrl:r.target.value})}
            />
          </div>

          <button 
            disabled=${h}
            className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            ${h?"Configurando...":"Criar Campanha Agora"}
          </button>
        </form>
      </div>
    </div>
  `}const re=E.bind(I);function Je({user:e,onClose:n,onCreated:a}){const[s,o]=b({nome:"",description:"",pricePerParticipant:20,slug:"",matches:[]}),[m,c]=b(!1),h=()=>{o({...s,matches:[...s.matches,{id:"m_"+Date.now(),home:"",away:"",date:""}]})},u=d=>{const x=[...s.matches];x.splice(d,1),o({...s,matches:x})},g=(d,x,f)=>{const w=[...s.matches];w[d][x]=f,o({...s,matches:w})};return re`
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Configurar Bolão</h2>
          <button onClick=${n} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <${O} className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit=${async d=>{if(d.preventDefault(),s.matches.length===0){alert("Adicione pelo menos uma partida ao bolão.");return}c(!0);try{const{fsSetDocument:x}=await _(async()=>{const{fsSetDocument:i}=await import("./firebase-CH7o5ZTX.js");return{fsSetDocument:i}},[],import.meta.url),f="bolao_"+Date.now(),w=s.slug||s.nome.toLowerCase().replace(/ /g,"-").replace(/[^\w-]/g,""),r={...s,id:f,userId:e.id,slug:w,status:"ativo",createdAt:new Date().toISOString()};await x("boloes",f,r),a(),n()}catch(x){alert("Erro ao criar bolão: "+x.message)}finally{c(!1)}}} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Título do Bolão</label>
              <input 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
                value=${s.nome}
                onInput=${d=>o({...s,nome:d.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Preço da Cota (R$)</label>
              <input 
                type="number"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
                value=${s.pricePerParticipant}
                onInput=${d=>o({...s,pricePerParticipant:parseFloat(d.target.value)})}
              />
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partidas do Bolão</h3>
              <button type="button" onClick=${h} className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black rounded-xl hover:bg-blue-700 transition-all uppercase tracking-widest">
                + Adicionar Jogo
              </button>
            </div>

            <div className="space-y-4">
              ${s.matches.map((d,x)=>re`
                <div key=${d.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end p-4 bg-white rounded-2xl border border-slate-100 shadow-sm relative">
                   <div>
                     <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Mandante</label>
                     <input required className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-bold" value=${d.home} onInput=${f=>g(x,"home",f.target.value)} />
                   </div>
                   <div>
                     <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Visitante</label>
                     <input required className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-bold" value=${d.away} onInput=${f=>g(x,"away",f.target.value)} />
                   </div>
                   <div>
                     <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Data/Hora</label>
                     <input required type="datetime-local" className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-bold" value=${d.date} onInput=${f=>g(x,"date",f.target.value)} />
                   </div>
                   <div className="flex justify-end">
                     <button type="button" onClick=${()=>u(x)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                       <${O} className="w-4 h-4" />
                     </button>
                   </div>
                </div>
              `)}

              ${s.matches.length===0&&re`
                <div className="text-center py-10 opacity-30">
                  <p className="text-xs font-bold">Nenhuma partida adicionada ainda.</p>
                </div>
              `}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Descrição / Premiação</label>
            <textarea 
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium min-h-[100px]"
              value=${s.description}
              onInput=${d=>o({...s,description:d.target.value})}
            />
          </div>

          <button 
            disabled=${m}
            className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            ${m?"Configurando...":"Publicar Bolão Agora"}
          </button>
        </form>
      </div>
    </div>
  `}const Qe=E.bind(I);function We({user:e,config:n,onClose:a,onCreated:s}){const[o,m]=b({valorBruto:0,pixKey:"",pixKeyType:"CPF"}),[c,h]=b(!1),u=n.taxaPercentual||5,g=o.valorBruto*u/100,l=o.valorBruto-g,d=async x=>{if(x.preventDefault(),o.valorBruto>e.saldo)return alert("Saldo insuficiente!");if(o.valorBruto<=0)return alert("Valor inválido!");h(!0);try{const{fsSetDocument:f}=await _(async()=>{const{fsSetDocument:i}=await import("./firebase-CH7o5ZTX.js");return{fsSetDocument:i}},[],import.meta.url),w="saque_"+Date.now(),r={id:w,userId:e.id,userNome:e.nome,valorBruto:o.valorBruto,valorTaxa:g,valorLiquido:l,taxaAplicada:u,pixKey:o.pixKey,pixKeyType:o.pixKeyType,status:"pendente",createdAt:new Date().toISOString()};await f("saques",w,r),await f("usuarios",e.id,{...e,saldo:e.saldo-o.valorBruto}),s(),a()}catch(f){alert("Erro ao solicitar saque: "+f.message)}finally{h(!1)}};return Qe`
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Solicitar Saque</h2>
          <button onClick=${a} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <${O} className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="bg-orange-50 p-6 rounded-3xl mb-8 border border-orange-100">
           <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Saldo Disponível</p>
           <p className="text-3xl font-black text-orange-700">R$ ${e.saldo.toFixed(2)}</p>
        </div>

        <form onSubmit=${d} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Valor do Saque (R$)</label>
            <input 
              type="number"
              required
              step="0.01"
              max=${e.saldo}
              className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-black text-xl"
              value=${o.valorBruto}
              onInput=${x=>m({...o,valorBruto:parseFloat(x.target.value)||0})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tipo de Chave</label>
               <select 
                 className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold text-sm"
                 value=${o.pixKeyType}
                 onChange=${x=>m({...o,pixKeyType:x.target.value})}
               >
                 <option>CPF</option>
                 <option>CNPJ</option>
                 <option>E-mail</option>
                 <option>Celular</option>
                 <option>Chave Aleatória</option>
               </select>
             </div>
             <div>
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Chave PIX</label>
               <input 
                 required
                 className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold text-sm"
                 value=${o.pixKey}
                 onInput=${x=>m({...o,pixKey:x.target.value})}
               />
             </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl space-y-2">
             <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Taxa da Plataforma (${u}%)</span>
                <span>- R$ ${g.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Você Receberá</span>
                <span className="text-emerald-600">R$ ${l.toFixed(2)}</span>
             </div>
          </div>

          <button 
            disabled=${c||o.valorBruto<=0}
            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
          >
            ${c?"Processando...":"Confirmar Solicitação"}
          </button>
        </form>
      </div>
    </div>
  `}const D=E.bind(I);function He({user:e,onLogout:n}){const[a,s]=b("overview"),[o,m]=b({raffles:0,boloes:0,balance:0}),[c,h]=b([]),[u,g]=b(null),[l,d]=b(!0),[x,f]=b(!1),[w,r]=b(!1),[i,v]=b(!1),[C,$]=b(null),y=ne(async()=>{d(!0);try{const{fsQueryCollection:p,fsGetDocument:R}=await _(async()=>{const{fsQueryCollection:Y,fsGetDocument:Z}=await import("./firebase-CH7o5ZTX.js");return{fsQueryCollection:Y,fsGetDocument:Z}},[],import.meta.url),T=await p("rifas","userId","==",e.id),L=await p("boloes","userId","==",e.id),V=await p("saques","userId","==",e.id),G=await R("config","main");g(G),m({raffles:T.length,boloes:L.length,balance:e.saldo||0}),h(a==="rifas"?T:a==="boloes"?L:a==="financeiro"?V:[])}catch(p){console.error(p)}finally{d(!1)}},[e.id,a,e.saldo]);Q(()=>{y()},[y]);const S=async(p,R)=>{if(confirm("Tem certeza que deseja mover para a lixeira?"))try{const{fsSetDocument:T,fsDeleteDocument:L}=await _(async()=>{const{fsSetDocument:V,fsDeleteDocument:G}=await import("./firebase-CH7o5ZTX.js");return{fsSetDocument:V,fsDeleteDocument:G}},[],import.meta.url);await T(`_lixeira_${p}`,R.id,{...R,deletedAt:new Date().toISOString(),originalCollection:p}),await L(p,R.id),y()}catch(T){alert("Erro ao mover para lixeira: "+T.message)}},A=(p,R,T)=>{const V=`${window.location.origin+window.location.pathname}#/${R}/${p}`;navigator.clipboard.writeText(V),$(T),setTimeout(()=>$(null),2e3)};return D`
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
            ${["overview","rifas","boloes","financeiro","config"].map(p=>D`
              <button 
                key=${p}
                onClick=${()=>s(p)}
                className=${`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${a===p?"bg-orange-600 text-white shadow-lg shadow-orange-900/20":"text-slate-400 hover:bg-slate-800 hover:text-white"}`}
              >
                <span className="capitalize">${p}</span>
              </button>
            `)}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <button 
            onClick=${n}
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
              <p className="text-lg font-black text-orange-600">R$ ${o.balance.toLocaleString("pt-BR",{minimumFractionDigits:2})}</p>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          ${a==="overview"&&D`
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Saldo Bruto</p>
                <p className="text-4xl font-black text-slate-900">R$ ${o.balance.toFixed(2)}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Suas Rifas</p>
                <p className="text-4xl font-black text-orange-600">${o.raffles}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Seus Bolões</p>
                <p className="text-4xl font-black text-blue-600">${o.boloes}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Taxa Saque</p>
                <p className="text-4xl font-black text-emerald-600">${(u==null?void 0:u.taxaPercentual)||5}%</p>
              </div>
            </div>
          `}
          
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 capitalize">${a}</h3>
              
              ${a==="rifas"&&D`
                <button onClick=${()=>f(!0)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95">
                  <${be} className="w-4 h-4" /> Nova Rifa
                </button>
              `}
              ${a==="boloes"&&D`
                <button onClick=${()=>r(!0)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95">
                  <${be} className="w-4 h-4" /> Novo Bolão
                </button>
              `}
              ${a==="financeiro"&&D`
                <button onClick=${()=>v(!0)} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all active:scale-95">
                  <${Re} className="w-4 h-4" /> Solicitar Saque
                </button>
              `}
            </div>

            ${l?D`
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
            `:a==="financeiro"?D`
               <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saldo Atual</p>
                       <p className="text-2xl font-black text-slate-900">R$ ${e.saldo.toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aguardando Saque</p>
                       <p className="text-2xl font-black text-slate-900">R$ ${c.filter(p=>p.status==="pendente").reduce((p,R)=>p+R.valorBruto,0).toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Sacado</p>
                       <p className="text-2xl font-black text-emerald-600">R$ ${c.filter(p=>p.status==="pago").reduce((p,R)=>p+R.valorBruto,0).toFixed(2)}</p>
                    </div>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                          <th className="pb-4 px-4">Data</th>
                          <th className="pb-4 px-4">Valor Bruto</th>
                          <th className="pb-4 px-4">Líquido</th>
                          <th className="pb-4 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        ${c.map(p=>D`
                          <tr key=${p.id}>
                            <td className="py-4 px-4 text-sm font-bold text-slate-600">${new Date(p.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 px-4 text-sm font-black">R$ ${p.valorBruto.toFixed(2)}</td>
                            <td className="py-4 px-4 text-sm font-black text-emerald-600">R$ ${p.valorLiquido.toFixed(2)}</td>
                            <td className="py-4 px-4">
                              <span className=${`px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.status==="pago"?"bg-emerald-100 text-emerald-600":p.status==="pendente"?"bg-orange-100 text-orange-600":"bg-red-100 text-red-600"}`}>
                                ${p.status}
                              </span>
                            </td>
                          </tr>
                        `)}
                      </tbody>
                    </table>
                 </div>
               </div>
            `:c.length===0?D`
              <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                <span className="text-6xl mb-4">📂</span>
                <p className="font-bold">Nenhum registro encontrado.</p>
                <p className="text-xs">Comece criando seu primeiro conteúdo agora mesmo.</p>
              </div>
            `:D`
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${c.map(p=>D`
                  <div key=${p.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-slate-900 text-lg">${p.nome}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">${p.status}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick=${()=>A(p.slug,a==="rifas"?"rifa":"bolao",p.id)}
                          className="p-2.5 bg-white text-slate-400 hover:text-blue-600 rounded-xl border border-slate-100 shadow-sm transition-all"
                          title="Copiar Link"
                        >
                          ${C===p.id?D`<${de} className="w-4 h-4 text-emerald-500" />`:D`<${he} className="w-4 h-4" />`}
                        </button>
                        <button 
                          onClick=${()=>S(a,p)}
                          className="p-2.5 bg-white text-slate-400 hover:text-red-600 rounded-xl border border-slate-100 shadow-sm transition-all"
                          title="Mover para Lixeira"
                        >
                          <${X} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Valor:</span>
                        <span className="text-sm font-black text-slate-900">R$ ${p.pricePerParticipant.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick=${()=>window.open(`#/${a==="rifas"?"rifa":"bolao"}/${p.slug}`,"_blank")}
                        className="flex items-center gap-2 text-xs font-black text-orange-600 hover:underline uppercase tracking-widest"
                      >
                        Ver Página <${Ie} className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                `)}
              </div>
            `}
          </div>
        </div>
      </main>

      ${x&&D`<${Ke} user=${e} onClose=${()=>f(!1)} onCreated=${y} />`}
      ${w&&D`<${Je} user=${e} onClose=${()=>r(!1)} onCreated=${y} />`}
      ${i&&D`<${We} user=${e} config=${u} onClose=${()=>v(!1)} onCreated=${y} />`}
    </div>
  `}const P=E.bind(I);function Xe({user:e,onLogout:n}){var G,Y,Z;const[a,s]=b("overview"),[o,m]=b({users:0,raffles:0,boloes:0,totalSaldo:0}),[c,h]=b("usuarios"),[u,g]=b([]),[l,d]=b(null),[x,f]=b(!0),[w,r]=b(""),[i,v]=b(null),C=ne(async()=>{f(!0);try{const{fsGetCollection:t,fsGetDocument:N}=await _(async()=>{const{fsGetCollection:ae,fsGetDocument:se}=await import("./firebase-CH7o5ZTX.js");return{fsGetCollection:ae,fsGetDocument:se}},[],import.meta.url),k=await t("usuarios"),F=await t("rifas"),U=await t("boloes"),W=await t("saques"),Ne=await t("usuarios_lixeira"),ye=await t("rifas_lixeira"),$e=await t("boloes_lixeira"),ke=await N("config","main");m({users:k.length,raffles:F.length,boloes:U.length,totalSaldo:k.reduce((ae,se)=>ae+(se.saldo||0),0)}),d(ke),a==="usuarios"?g(k):a==="rifas"?g(F):a==="boloes"?g(U):a==="saques"?g(W):a==="lixeira"?c==="usuarios"?g(Ne):c==="rifas"?g(ye):c==="boloes"&&g($e):g([])}catch(t){console.error(t)}finally{f(!1)}},[a]);Q(()=>{C()},[C]);const $=async t=>{t.preventDefault();try{const{fsSetDocument:N}=await _(async()=>{const{fsSetDocument:k}=await import("./firebase-CH7o5ZTX.js");return{fsSetDocument:k}},[],import.meta.url);await N("config","main",l),alert("Configurações atualizadas!")}catch(N){alert("Erro: "+N.message)}},y=async()=>{try{const N=await(await fetch("/api/admin/test-mp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accessToken:l.mercadopago.accessToken})})).json();N.success?alert("Conexão com Mercado Pago bem sucedida!"):alert("Erro: "+N.error)}catch(t){alert("Erro: "+t.message)}},S=async(t,N)=>{try{const{fsSetDocument:k}=await _(async()=>{const{fsSetDocument:F}=await import("./firebase-CH7o5ZTX.js");return{fsSetDocument:F}},[],import.meta.url);await k("saques",t.id,{...t,status:N}),C()}catch(k){alert("Erro: "+k.message)}},A=async(t,N)=>{if(confirm(`Mover ${N.nome||N.username} para a lixeira?`))try{const{fsSetDocument:k,fsDeleteDocument:F}=await _(async()=>{const{fsSetDocument:U,fsDeleteDocument:W}=await import("./firebase-CH7o5ZTX.js");return{fsSetDocument:U,fsDeleteDocument:W}},[],import.meta.url);await k(`${t}_lixeira`,N.id,N),await F(t,N.id),C()}catch(k){alert("Erro: "+k.message)}},p=async(t,N)=>{try{const{fsSetDocument:k,fsDeleteDocument:F}=await _(async()=>{const{fsSetDocument:U,fsDeleteDocument:W}=await import("./firebase-CH7o5ZTX.js");return{fsSetDocument:U,fsDeleteDocument:W}},[],import.meta.url);await k(t,N.id,N),await F(`${t}_lixeira`,N.id),C()}catch(k){alert("Erro: "+k.message)}},R=async(t,N)=>{if(confirm("Excluir permanentemente? Esta ação não pode ser desfeita."))try{const{fsDeleteDocument:k}=await _(async()=>{const{fsDeleteDocument:F}=await import("./firebase-CH7o5ZTX.js");return{fsDeleteDocument:F}},[],import.meta.url);await k(t,N),C()}catch(k){alert("Erro: "+k.message)}},T=async()=>{try{const{fsSetDocument:t}=await _(async()=>{const{fsSetDocument:N}=await import("./firebase-CH7o5ZTX.js");return{fsSetDocument:N}},[],import.meta.url);await t("usuarios",i.id,i),v(null),C()}catch(t){alert("Erro: "+t.message)}},L=[{id:"overview",label:"Visão Geral",icon:H},{id:"usuarios",label:"Usuários",icon:ve},{id:"rifas",label:"Rifas",icon:H},{id:"boloes",label:"Bolões",icon:H},{id:"saques",label:"Saques",icon:xe},{id:"lixeira",label:"Lixeira",icon:X},{id:"config",label:"Configurações",icon:xe}],V=u.filter(t=>{var N,k;return((N=t.nome)==null?void 0:N.toLowerCase().includes(w.toLowerCase()))||((k=t.username)==null?void 0:k.toLowerCase().includes(w.toLowerCase()))});return P`
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
            ${L.map(t=>P`
              <button 
                key=${t.id}
                onClick=${()=>s(t.id)}
                className=${`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${a===t.id?"bg-white text-slate-950 shadow-lg shadow-white/10":"text-slate-400 hover:bg-white/5 hover:text-white"}`}
              >
                <${t.icon} className="w-4 h-4" />
                <span>${t.label}</span>
              </button>
            `)}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button 
            onClick=${n}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <${Ee} className="w-4 h-4" />
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
              <p className="text-xl font-black text-emerald-400">R$ ${o.totalSaldo.toLocaleString("pt-BR",{minimumFractionDigits:2})}</p>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          ${a==="overview"&&P`
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Usuários</p>
                <p className="text-4xl font-black">${o.users}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Rifas Ativas</p>
                <p className="text-4xl font-black text-orange-500">${o.raffles}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Bolões Ativos</p>
                <p className="text-4xl font-black text-blue-500">${o.boloes}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Novos Hoje</p>
                <p className="text-4xl font-black text-emerald-500">2</p>
              </div>
            </div>
          `}

          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 min-h-[400px]">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black capitalize">${a}</h3>
                ${["usuarios","rifas","boloes"].includes(a)&&P`
                  <div className="relative">
                    <${Te} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Pesquisar..." 
                      className="bg-white/5 border border-white/10 rounded-full pl-11 pr-6 py-2.5 text-sm focus:ring-2 focus:ring-white/20 transition-all"
                      onInput=${t=>r(t.target.value)}
                    />
                  </div>
                `}
             </div>

             ${x?P`
               <div className="flex items-center justify-center py-20">
                 <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
               </div>
             `:a==="usuarios"?P`
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
                     ${V.map(t=>{var N;return P`
                       <tr key=${t.id} className="group hover:bg-white/5 transition-colors">
                         <td className="py-4 px-4">
                           <p className="font-bold text-sm">${t.nome}</p>
                           <p className="text-xs text-slate-500">@${t.username}</p>
                         </td>
                         <td className="py-4 px-4">
                           ${(i==null?void 0:i.id)===t.id?P`
                             <input 
                               type="number" 
                               className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-24 text-sm"
                               value=${i.saldo}
                               onInput=${k=>v({...i,saldo:parseFloat(k.target.value)})}
                             />
                           `:P`<span className="font-bold text-sm text-emerald-400">R$ ${(N=t.saldo)==null?void 0:N.toFixed(2)}</span>`}
                         </td>
                         <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase">${t.role}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
                              <span className=${`w-1.5 h-1.5 rounded-full ${t.status==="ativo"?"bg-emerald-500":"bg-red-500"}`}></span>
                              ${t.status}
                            </span>
                         </td>
                         <td className="py-4 px-4 text-right">
                           <div className="flex justify-end gap-2">
                             ${(i==null?void 0:i.id)===t.id?P`
                               <button onClick=${T} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                                 <${de} className="w-4 h-4" />
                               </button>
                               <button onClick=${()=>v(null)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                 <${O} className="w-4 h-4" />
                               </button>
                             `:P`
                               <button onClick=${()=>v(t)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                                 <${Ae} className="w-4 h-4" />
                               </button>
                               <button onClick=${()=>A("usuarios",t)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                                 <${X} className="w-4 h-4" />
                               </button>
                             `}
                           </div>
                         </td>
                       </tr>
                     `})}
                   </tbody>
                 </table>
               </div>
              `:a==="rifas"?P`
                <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                       <th className="pb-4 px-4">Campanha</th>
                       <th className="pb-4 px-4">Organizador</th>
                       <th className="pb-4 px-4">Cotas</th>
                       <th className="pb-4 px-4">Status</th>
                       <th className="pb-4 px-4 text-right">Ações</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     ${u.map(t=>{var N,k;return P`
                       <tr key=${t.id} className="group hover:bg-white/5 transition-colors">
                         <td className="py-4 px-4">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                               <${H} className="w-5 h-5 text-orange-500" />
                             </div>
                             <div>
                               <p className="font-bold text-sm">${t.nome}</p>
                               <div className="flex items-center gap-2">
                                 <span className="text-[8px] text-slate-500 uppercase font-black px-1.5 py-0.5 bg-white/5 rounded">${t.tipo||"normal"}</span>
                                 <span className="text-[8px] text-emerald-500 uppercase font-black px-1.5 py-0.5 bg-emerald-500/10 rounded">R$ ${(((N=t.bookedNumbers)==null?void 0:N.length)||0)*(t.pricePerParticipant||0)}</span>
                               </div>
                             </div>
                           </div>
                         </td>
                         <td className="py-4 px-4">
                            <span className="text-sm opacity-60">ID: ${t.userId}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className="text-sm font-bold text-slate-300">${((k=t.bookedNumbers)==null?void 0:k.length)||0}</span>
                            <span className="text-[10px] text-slate-600 ml-1">/ ${t.maxParticipants}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className=${`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.status==="ativo"?"bg-emerald-500/10 text-emerald-500":"bg-white/10 text-slate-400"}`}>${t.status}</span>
                         </td>
                         <td className="py-4 px-4 text-right">
                           <button onClick=${()=>A("rifas",t)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                             <${X} className="w-4 h-4" />
                           </button>
                         </td>
                       </tr>
                     `})}
                   </tbody>
                 </table>
               </div>
             `:a==="boloes"?P`
                <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                       <th className="pb-4 px-4">Bolão</th>
                       <th className="pb-4 px-4">Organizador</th>
                       <th className="pb-4 px-4">Status</th>
                       <th className="pb-4 px-4 text-right">Ações</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     ${u.map(t=>P`
                       <tr key=${t.id} className="group hover:bg-white/5 transition-colors">
                         <td className="py-4 px-4">
                           <p className="font-bold text-sm">${t.nome}</p>
                         </td>
                         <td className="py-4 px-4">
                            <span className="text-sm opacity-60">ID: ${t.userId}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase">${t.status}</span>
                         </td>
                         <td className="py-4 px-4 text-right">
                            <button onClick=${()=>A("boloes",t)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                             <${X} className="w-4 h-4" />
                           </button>
                         </td>
                       </tr>
                     `)}
                   </tbody>
                 </table>
               </div>
             `:a==="saques"?P`
                <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                       <th className="pb-4 px-4">Usuário / Chave PIX</th>
                       <th className="pb-4 px-4">Valor Bruto</th>
                       <th className="pb-4 px-4">Taxa (${l==null?void 0:l.taxaPercentual}%)</th>
                       <th className="pb-4 px-4">Valor Líquido</th>
                       <th className="pb-4 px-4">Status</th>
                       <th className="pb-4 px-4 text-right">Ações</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     ${u.map(t=>P`
                       <tr key=${t.id} className="group hover:bg-white/5 transition-colors">
                         <td className="py-4 px-4">
                           <p className="font-bold text-sm">${t.userNome}</p>
                           <p className="text-xs text-slate-500">${t.pixKey} (${t.pixKeyType})</p>
                         </td>
                         <td className="py-4 px-4">
                           <span className="font-bold text-sm">R$ ${t.valorBruto.toFixed(2)}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className="text-sm text-red-400">- R$ ${t.valorTaxa.toFixed(2)}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className="font-bold text-sm text-emerald-400">R$ ${t.valorLiquido.toFixed(2)}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase">${t.status}</span>
                         </td>
                         <td className="py-4 px-4 text-right">
                           <div className="flex justify-end gap-2">
                             ${t.status==="pendente"&&P`
                               <button onClick=${()=>S(t,"pago")} className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-lg hover:bg-emerald-600 uppercase">
                                 Pagar
                               </button>
                               <button onClick=${()=>S(t,"recusado")} className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-black rounded-lg hover:bg-red-600 uppercase">
                                 Recusar
                               </button>
                             `}
                           </div>
                         </td>
                       </tr>
                     `)}
                   </tbody>
                 </table>
               </div>
             `:a==="lixeira"?P`
                <div className="space-y-6">
                  <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit">
                    ${["usuarios","rifas","boloes"].map(t=>P`
                      <button 
                        onClick=${()=>{h(t),C()}}
                        className=${`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${c===t?"bg-white text-slate-950 shadow-lg":"text-slate-500 hover:text-white"}`}
                      >
                        ${t}
                      </button>
                    `)}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                          <th className="pb-4 px-4">Item</th>
                          <th className="pb-4 px-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        ${u.map(t=>P`
                          <tr key=${t.id} className="group hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4">
                              <p className="font-bold text-sm">${t.nome||t.username||t.id}</p>
                              <p className="text-[10px] text-slate-500">ID: ${t.id}</p>
                            </td>
                            <td className="py-4 px-4 text-right space-x-2">
                              <button onClick=${()=>p(c,t)} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-lg hover:bg-emerald-500 hover:text-white uppercase">
                                Restaurar
                              </button>
                              <button onClick=${()=>R(`${c}_lixeira`,t.id)} className="px-3 py-1.5 bg-red-500/10 text-red-500 text-[10px] font-black rounded-lg hover:bg-red-500 hover:text-white uppercase">
                                Excluir Permanentemente
                              </button>
                            </td>
                          </tr>
                        `)}
                      </tbody>
                    </table>
                  </div>
                </div>
             `:a==="config"?P`
                <form onSubmit=${$} className="max-w-4xl space-y-12">
                  <!-- General Config -->
                  <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 pb-2 border-b border-white/5">Configurações Gerais</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nome da Plataforma</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                          value=${l==null?void 0:l.platformName}
                          onInput=${t=>d({...l,platformName:t.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">E-mail de Contato</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                          value=${l==null?void 0:l.contactEmail}
                          onInput=${t=>d({...l,contactEmail:t.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Taxa da Plataforma (%)</label>
                      <input 
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                        value=${l==null?void 0:l.taxaPercentual}
                        onInput=${t=>d({...l,taxaPercentual:parseFloat(t.target.value)})}
                      />
                      <p className="text-[10px] text-slate-500 mt-2">Este percentual será retido no momento do saque do organizador.</p>
                    </div>
                  </div>

                  <!-- Mercado Pago Config -->
                  <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 pb-2 border-b border-white/5">Integração Mercado Pago</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Access Token</label>
                        <input 
                          type="password"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                          value=${(G=l==null?void 0:l.mercadopago)==null?void 0:G.accessToken}
                          onInput=${t=>d({...l,mercadopago:{...l.mercadopago,accessToken:t.target.value}})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Public Key</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                          value=${(Y=l==null?void 0:l.mercadopago)==null?void 0:Y.publicKey}
                          onInput=${t=>d({...l,mercadopago:{...l.mercadopago,publicKey:t.target.value}})}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-0" 
                            checked=${(Z=l==null?void 0:l.mercadopago)==null?void 0:Z.isProduction}
                            onChange=${t=>d({...l,mercadopago:{...l.mercadopago,isProduction:t.target.checked}})}
                          />
                          <span className="text-sm font-bold">Modo Produção</span>
                       </label>
                       <button type="button" onClick=${y} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                          Testar Conexão
                       </button>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">URL de Webhook</p>
                       <code className="text-xs text-emerald-400 break-all">${window.location.origin}/api/webhooks/mercadopago</code>
                       <p className="text-[10px] text-slate-500 mt-2">Configure esta URL nas configurações de notificações da sua aplicação no Mercado Pago.</p>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black shadow-xl shadow-white/10 hover:bg-slate-200 transition-all active:scale-95">
                    <${je} className="w-5 h-5" /> Salvar Todas as Configurações
                  </button>
                </form>
             `:P`
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
  `}const z=E.bind(I);function Ye({rifa:e,selectedNumbers:n,onClose:a,onFinish:s}){const[o,m]=b("form"),[c,h]=b({nome:"",whatsapp:""}),[u,g]=b(!1),[l,d]=b(!1),x=n.length*e.pricePerParticipant,f=async i=>{i.preventDefault(),g(!0);try{const{fsSetDocument:v}=await _(async()=>{const{fsSetDocument:S}=await import("./firebase-CH7o5ZTX.js");return{fsSetDocument:S}},[],import.meta.url),C="part_"+Date.now();await v("participacoes",C,{id:C,rifaId:e.id,buyer:c,numbers:n,total:x,status:"pendente",createdAt:new Date().toISOString()});const y=await(await fetch("/api/payments/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:`Rifa: ${e.nome}`,unit_price:e.pricePerParticipant,quantity:n.length,metadata:{type:"rifa",participation_id:C,rifa_id:e.id,numbers:n}})})).json();if(y.error)throw new Error(y.error);window.location.href=y.init_point}catch(v){alert("Erro ao processar: "+v.message)}finally{g(!1)}},w=async()=>{m("success")},r=()=>{navigator.clipboard.writeText("00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540510.005802BR5913RIFA DIGITAL6009SAO PAULO62070503***6304E228"),d(!0),setTimeout(()=>d(null),2e3)};return z`
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Finalizar Compra</h2>
            <button onClick=${a} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <${O} className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          ${o==="form"&&z`
            <form onSubmit=${f} className="space-y-6">
               <div className="bg-slate-50 p-6 rounded-3xl mb-6">
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resumo</p>
                 <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">${n.length} Números</span>
                    <span className="text-xl font-black text-orange-600">R$ ${x.toFixed(2)}</span>
                 </div>
               </div>

               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Seu Nome Completo</label>
                 <input 
                   required
                   className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                   value=${c.nome}
                   onInput=${i=>h({...c,nome:i.target.value})}
                 />
               </div>

               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Seu WhatsApp</label>
                 <input 
                   required
                   placeholder="(00) 00000-0000"
                   className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                   value=${c.whatsapp}
                   onInput=${i=>h({...c,whatsapp:i.target.value})}
                 />
               </div>

               <button className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95">
                 Ir para Pagamento
               </button>
            </form>
          `}

          ${o==="payment"&&z`
            <div className="text-center">
              <div className="w-48 h-48 bg-slate-100 rounded-3xl mx-auto mb-8 flex items-center justify-center p-4">
                <!-- Mock QR Code -->
                <div className="w-full h-full bg-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center">
                   <div className="grid grid-cols-4 gap-2 opacity-20">
                      ${Array.from({length:16}).map((i,v)=>z`<div key=${v} className="w-4 h-4 bg-slate-900 rounded"></div>`)}
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-slate-400 font-black text-xs uppercase tracking-widest">QR Code PIX</span>
                   </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2">Escaneie o QR Code</h3>
              <p className="text-slate-500 text-sm mb-8">Ou copie o código abaixo para pagar via Pix Copia e Cola.</p>

              <button 
                onClick=${r}
                className="w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-slate-100 transition-all mb-10"
              >
                <span className="text-slate-400 text-xs font-bold truncate pr-4">00020126360014BR.GOV.BCB.PIX...</span>
                ${l?z`<span className="text-emerald-500 font-bold text-xs flex items-center gap-1"><${de} className="w-4 h-4" /> Copiado!</span>`:z`<${he} className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />`}
              </button>

              <button 
                disabled=${u}
                onClick=${w}
                className="w-full py-5 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all"
              >
                ${u?"Confirmando...":"Já fiz o pagamento"}
              </button>
            </div>
          `}

          ${o==="success"&&z`
             <div className="text-center py-10">
               <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <${me} className="w-10 h-10" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 mb-2">Sucesso!</h2>
               <p className="text-slate-500 font-medium mb-8">Sua reserva foi confirmada. Boa sorte!</p>
               
               <button 
                onClick=${()=>{s(),a()}}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl"
               >
                 Voltar para Rifa
               </button>
             </div>
          `}
        </div>
      </div>
    </div>
  `}const q=E.bind(I);function Ze(){var v,C;const[e,n]=b(null),[a,s]=b([]),[o,m]=b(!0),[c,h]=b(!1),u=window.location.hash.split("/").pop(),g=ne(async()=>{try{const{fsQueryCollection:$}=await _(async()=>{const{fsQueryCollection:S}=await import("./firebase-CH7o5ZTX.js");return{fsQueryCollection:S}},[],import.meta.url),y=await $("rifas","slug","==",u);y.length>0&&n(y[0])}catch($){console.error($)}finally{m(!1)}},[u]);Q(()=>{g()},[g]);const l=$=>{var y;(y=e.bookedNumbers)!=null&&y.includes($)||(a.includes($)?s(a.filter(S=>S!==$)):s([...a,$]))},d=()=>!e.faixas||e.faixas.length===0?a.length*(e.pricePerParticipant||0):a.reduce(($,y)=>{const S=e.faixas.find(A=>y>=A.de&&y<=A.ate);return $+(S?S.valor||0:e.pricePerParticipant||0)},0),x=$=>{if(!e.faixas||e.faixas.length===0)return e.pricePerParticipant||0;const y=e.faixas.find(S=>$>=S.de&&$<=S.ate);return y?y.valor:e.pricePerParticipant},f=d(),r=(()=>{const $=e.corSecundaria||"#ea580c";switch(e.tema){case"bebe":return{bg:"bg-pink-50",text:"text-pink-600",primary:"bg-pink-600",border:"border-pink-200"};case"moto":return{bg:"bg-slate-900",text:"text-orange-500",primary:"bg-orange-600",border:"border-white/10",dark:!0};case"carro":return{bg:"bg-zinc-900",text:"text-blue-500",primary:"bg-blue-600",border:"border-white/10",dark:!0};case"futebol":return{bg:"bg-emerald-950",text:"text-yellow-400",primary:"bg-emerald-600",border:"border-white/10",dark:!0};default:return{bg:"bg-slate-50",text:`text-[${$}]`,primary:`bg-[${$}]`,border:"border-slate-200"}}})(),i=e.corSecundaria||"#ea580c";return o?q`
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
    </div>
  `:e?q`
    <div className=${`min-h-screen ${r.dark?"bg-slate-950 text-white":"bg-white text-slate-900"} pb-20`}>
      <button 
        onClick=${()=>window.location.hash="/"}
        className="fixed top-8 left-8 z-50 p-3 bg-white/80 backdrop-blur-md border border-slate-100 rounded-full shadow-lg hover:bg-white transition-all group"
      >
        <${ce} className="w-6 h-6 text-slate-900 group-hover:-translate-x-1 transition-transform" />
      </button>

      <!-- Rifa Hero -->
      <div className=${`relative h-[50vh] overflow-hidden ${r.dark?"bg-slate-900":r.primary} flex items-center justify-center`}>
        <img src=${e.bannerUrl||"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=2000"} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className=${`absolute inset-0 bg-gradient-to-t ${r.dark?"from-slate-950 via-slate-950/50":"from-white via-white/50"} to-transparent`}></div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
          <div className=${`${r.dark?"bg-slate-900 border-white/5":"bg-white border-slate-100"} p-10 rounded-[3rem] shadow-2xl border text-center`}>
            <div className="flex items-center justify-center gap-2 mb-4">
               <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
               <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">${((v=e.tipo)==null?void 0:v.replace("-"," "))||"Sorteio Ativo"}</span>
            </div>
            <h1 className="text-4xl font-black mb-2 uppercase italic tracking-tighter">${e.nome}</h1>
            <p className="opacity-60 font-medium">${e.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Selection Grid -->
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <h3 className="text-2xl font-black">Escolha seus números</h3>
                <p className="opacity-40 text-sm font-medium mt-1">Toque nos números para selecionar</p>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest bg-slate-50 px-6 py-3 rounded-full border border-slate-100 text-slate-950">
                <span className="flex items-center gap-2 opacity-40"><span className="w-3 h-3 bg-white border border-slate-200 rounded-sm"></span> Livre</span>
                <span className="flex items-center gap-2 text-orange-600"><span className="w-3 h-3 bg-orange-600 rounded-sm"></span> Selecionado</span>
                <span className="flex items-center gap-2 text-slate-900"><span className="w-3 h-3 bg-slate-900 rounded-sm"></span> Reservado</span>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3">
              ${Array.from({length:e.maxParticipants}).map(($,y)=>{var T,L;const S=y+1,A=(T=e.bookedNumbers)==null?void 0:T.includes(S),p=a.includes(S),R=x(S);return q`
                  <button 
                    key=${S}
                    disabled=${A}
                    onClick=${()=>l(S)}
                    title=${`Valor: R$ ${R.toFixed(2)}`}
                    className=${`relative aspect-square flex items-center justify-center rounded-2xl font-black text-sm transition-all ${A?"bg-slate-950 text-white cursor-not-allowed opacity-20":p?"bg-orange-600 text-white shadow-xl shadow-orange-200 scale-105 z-10":"bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-transparent hover:border-slate-200"}`}
                    style=${p?{backgroundColor:i}:{}}
                  >
                    ${S}
                    ${!A&&!p&&((L=e.faixas)==null?void 0:L.length)>0&&q`
                        <span className="absolute -bottom-1 -right-1 bg-white text-[8px] px-1 rounded text-slate-950 shadow-sm border border-slate-200">
                          R$ ${R}
                        </span>
                    `}
                  </button>
                `})}
            </div>
          </div>

          <!-- Summary / Checkout -->
          <div className="space-y-6">
            <div className=${`${r.dark?"bg-slate-900":"bg-slate-950"} rounded-[3rem] p-10 sticky top-10 text-white shadow-2xl`}>
              <h4 className="text-xl font-black mb-8">Resumo da Reserva</h4>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                  <span>Números selecionados</span>
                  <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white">${a.length}</span>
                </div>
                ${!e.faixas||e.faixas.length===0?q`
                  <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                    <span>Preço por número</span>
                    <span className="text-white">R$ ${(C=e.pricePerParticipant)==null?void 0:C.toFixed(2)}</span>
                  </div>
                `:q`
                   <div className="flex flex-col gap-1 text-[10px] font-black uppercase tracking-widest text-slate-500 pt-2 border-t border-white/5">
                      <p>Valores por faixa aplicados</p>
                   </div>
                `}
                <div className="flex justify-between items-center text-2xl font-black text-white pt-6 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-orange-500">R$ ${f.toFixed(2)}</span>
                </div>
              </div>

              <button 
                disabled=${a.length===0}
                onClick=${()=>h(!0)}
                className="w-full py-5 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-900/20 hover:bg-orange-700 transition-all disabled:opacity-30 disabled:grayscale active:scale-95"
                style=${{backgroundColor:i}}
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

      ${c&&q`<${Ye} rifa=${e} selectedNumbers=${a} total=${f} onClose=${()=>h(!1)} onFinish=${onFinishPurchase} />`}
    </div>
  `:q`<div className="p-20 text-center font-bold text-slate-500">Rifa não encontrada.</div>`}const ee=E.bind(I);function et({bolao:e,onClose:n}){var f,w;const[a,s]=b(1),[o,m]=b(!1),[c,h]=b({nome:"",whatsapp:"",email:""}),[u,g]=b(((f=e.matches)==null?void 0:f.reduce((r,i)=>({...r,[i.id]:{home:0,away:0}}),{}))||{}),l=(r,i,v)=>{g({...u,[r]:{...u[r],[i]:parseInt(v)}})};return ee`
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Participar do Bolão</h2>
          <button onClick=${n} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <${O} className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        ${a===1?ee`
          <form onSubmit=${r=>{r.preventDefault(),s(2)}} className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-3xl mb-8 border border-blue-100 flex justify-between items-center">
               <div>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Valor da Inscrição</p>
                 <p className="text-3xl font-black text-blue-700">R$ ${e.pricePerParticipant.toFixed(2)}</p>
               </div>
               <${me} className="w-10 h-10 text-blue-400 opacity-30" />
            </div>

            <div className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Seu Nome Completo</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" value=${c.nome} onInput=${r=>h({...c,nome:r.target.value})} />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">WhatsApp</label>
                    <input required className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" value=${c.whatsapp} onInput=${r=>h({...c,whatsapp:r.target.value})} />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">E-mail</label>
                    <input required type="email" className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" value=${c.email} onInput=${r=>h({...c,email:r.target.value})} />
                 </div>
               </div>
            </div>

            <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95 text-lg uppercase tracking-tight">
              Próximo: Registrar Palpites
            </button>
          </form>
        `:ee`
          <form onSubmit=${async r=>{r.preventDefault(),m(!0);try{const{fsSetDocument:i}=await _(async()=>{const{fsSetDocument:y}=await import("./firebase-CH7o5ZTX.js");return{fsSetDocument:y}},[],import.meta.url),v="part_bolao_"+Date.now();await i("participacoes_bolao",v,{id:v,bolaoId:e.id,buyer:c,palpites:u,total:e.pricePerParticipant,status:"pendente",createdAt:new Date().toISOString()});const $=await(await fetch("/api/payments/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:`Bolão: ${e.nome}`,unit_price:e.pricePerParticipant,quantity:1,metadata:{type:"bolao",participation_id:v,bolao_id:e.id,palpites:JSON.stringify(u)}})})).json();if($.error)throw new Error($.error);window.location.href=$.init_point}catch(i){alert("Erro ao processar: "+i.message)}finally{m(!1)}}} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Seus Palpites</h3>
              <button type="button" onClick=${()=>s(1)} className="text-xs font-bold text-blue-600 hover:underline">Alterar Dados</button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              ${(w=e.matches)==null?void 0:w.map(r=>{var i,v;return ee`
                <div key=${r.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-right">
                      <p className="text-xs font-black uppercase tracking-tight mb-2">${r.home}</p>
                      <input 
                        type="number" 
                        min="0"
                        required
                        className="w-16 h-12 bg-white border border-slate-200 rounded-xl text-center font-black text-lg focus:ring-2 focus:ring-blue-500"
                        value=${(i=u[r.id])==null?void 0:i.home}
                        onInput=${C=>l(r.id,"home",C.target.value)}
                      />
                    </div>
                    <div className="text-slate-300 font-black italic">VS</div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-black uppercase tracking-tight mb-2">${r.away}</p>
                      <input 
                        type="number" 
                        min="0"
                        required
                        className="w-16 h-12 bg-white border border-slate-200 rounded-xl text-center font-black text-lg focus:ring-2 focus:ring-blue-500"
                        value=${(v=u[r.id])==null?void 0:v.away}
                        onInput=${C=>l(r.id,"away",C.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-[8px] text-center text-slate-400 mt-4 font-black uppercase tracking-widest">
                    ${new Date(r.date).toLocaleString()}
                  </p>
                </div>
              `})}
            </div>

            <button 
              disabled=${o}
              className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95 text-lg uppercase tracking-tight"
            >
              ${o?"Processando...":"Confirmar e Pagar Inscrição"}
            </button>
          </form>
        `}
        
        <p className="text-[10px] text-center text-slate-400 uppercase font-black tracking-widest mt-8">Pagamento 100% Seguro via Mercado Pago</p>
      </div>
    </div>
  `}const te=E.bind(I);function tt(){const[e,n]=b(null),[a,s]=b(!0),[o,m]=b(!1),c=window.location.hash.split("/").pop();return Q(()=>{async function h(){try{const{fsQueryCollection:u}=await _(async()=>{const{fsQueryCollection:l}=await import("./firebase-CH7o5ZTX.js");return{fsQueryCollection:l}},[],import.meta.url),g=await u("boloes","slug","==",c);g.length>0&&n(g[0])}catch(u){console.error(u)}finally{s(!1)}}h()},[c]),a?te`
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  `:e?te`
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <button 
        onClick=${()=>window.location.hash="/"}
        className="fixed top-8 left-8 z-50 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-lg hover:bg-white/10 transition-all group"
      >
        <${ce} className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
      </button>

      <!-- Bolão Header -->
      <div className="relative h-[60vh] bg-blue-900/20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
           <${ie} className="w-96 h-96" />
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
                     <${Le} className="text-blue-500" /> Próximas Partidas
                   </h3>
                </div>
                
                <div className="flex flex-col items-center justify-center py-20 opacity-20 border-2 border-dashed border-white/10 rounded-[2rem]">
                  <span className="text-5xl mb-4">⚽</span>
                  <p className="text-sm font-bold">Aguardando definição dos confrontos...</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-white/5 p-10 rounded-[3rem]">
                <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
                  <${ve} className="text-blue-500" /> Ranking Global
                </h3>
                <p className="text-slate-500 text-sm font-medium">O ranking será atualizado automaticamente assim que as partidas começarem.</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-blue-600 p-10 rounded-[3.5rem] shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                   <${ie} className="w-24 h-24" />
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

                <button onClick=${()=>m(!0)} className="w-full py-5 bg-white text-blue-600 font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 text-lg">
                  Quero Participar
                </button>

                <div className="mt-8 flex items-center gap-3 text-blue-200/60">
                   <${me} className="w-5 h-5" />
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
      ${o&&te`<${et} bolao=${e} onClose=${()=>m(!1)} />`}
    </div>
  `:te`<div className="p-20 text-center text-white bg-slate-950 min-h-screen">Bolão não encontrado.</div>`}const j=E.bind(I);function at(){const[e,n]=b(null);Q(()=>{const s=localStorage.getItem("user");s&&n(JSON.parse(s))},[]);const a=()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),n(null),window.location.hash="/login"};return j`
    <${Se}>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-orange-100 selection:text-orange-900">
        <${Pe}>
          <${B} path="/" element=${j`<${Ue} />`} />
          <${B} path="/rifa/:slug" element=${j`<${Ze} />`} />
          <${B} path="/bolao/:slug" element=${j`<${tt} />`} />
          
          <${B} path="/login" element=${j`<${ge} onLogin=${s=>n(s)} />`} />
          <${B} path="/cadastro" element=${j`<${ge} isRegister onLogin=${s=>n(s)} />`} />

          <${B} 
            path="/admin" 
            element=${(e==null?void 0:e.role)==="super_admin"?j`<${Xe} user=${e} onLogout=${a} />`:j`<${le} to="/login" />`} 
          />
          <${B} 
            path="/dashboard" 
            element=${e?j`<${He} user=${e} onLogout=${a} />`:j`<${le} to="/login" />`} 
          />
          
          <${B} path="*" element=${j`<${le} to="/" />`} />
        <//>
      </div>
    <//>
  `}const pe="/api/db",we=async e=>{try{return await(await fetch(`${pe}/${e}`)).json()}catch(n){return console.error(n),[]}},st=async(e,n,a)=>{try{await fetch(`${pe}/${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:a,data:n})})}catch(s){console.error(s)}};async function lt(){const e=await we("usuarios");if(!e||e.length===0){const a={id:"admin-1",username:"admin",password:"admin",nome:"Administrador",whatsapp:"11999999999",documento:"000.000.000-00",email:"admin@admin.com",role:"super_admin",status:"ativo",saldo:0,createdAt:new Date().toISOString()},s={id:"user-1",username:"demo",password:"123",nome:"Organizador Demo",whatsapp:"11988888888",documento:"111.111.111-11",email:"demo@demo.com",role:"user",status:"ativo",saldo:1250.5,createdAt:new Date().toISOString()};await J.setDocument("usuarios",a.id,a),await J.setDocument("usuarios",s.id,s)}const n=await J.getDocument("config","main");if(!n||!n.platformName){const a={id:"main",platformName:"Rifa Digital",platformLogo:"",primaryColor:"#FFFFFF",secondaryColor:"#FF8C00",contactEmail:"suporte@rifadigital.com",contactWhatsApp:"11977777777",suporteWhatsapp:"11977777777",heroTitle:"Crie sua Rifa Digital em minutos",heroSub:"A plataforma mais completa para gerenciar seus sorteios online.",featuresTitle:"Por que escolher nossa plataforma?",featuresLabel:"Benefícios",features:[{title:"Rápido e Fácil",desc:"Crie sua rifa em menos de 2 minutos.",icon:"Bike"},{title:"Pagamento Seguro",desc:"Integração direta com Mercado Pago.",icon:"ShieldCheck"},{title:"Gestão Completa",desc:"Painel administrativo para controle total.",icon:"Settings"}],faqs:[{q:"Como crio uma rifa?",a:"Basta se cadastrar e clicar no botão Criar Rifa."},{q:"Quais as taxas?",a:"Cobramos apenas 5% sobre o valor total arrecadado."}],testimonials:[{name:"João Silva",role:"Organizador",content:"Plataforma incrível, vendi todas as cotas em 3 dias!"},{name:"Maria Santos",role:"Participante",content:"Muito fácil de usar e o suporte é nota 10."}],footerText:"© 2026 Rifa Digital. Todos os direitos reservados.",taxaPercentual:5,mercadopago:{accessToken:"",publicKey:"",isProduction:!1}};await J.setDocument("config","main",a)}}const J={getCollection:async e=>we(e),getDocument:async(e,n)=>{const a=await J.getCollection(e);return e==="config"&&n==="main"?a.find(s=>s.id==="main")||a[0]:a.find(s=>s.id===n)},setDocument:async(e,n,a)=>{await st(e,a,n)},deleteDocument:async(e,n)=>{try{await fetch(`${pe}/${e}/${n}`,{method:"DELETE"})}catch(a){console.error(a)}},queryCollection:async(e,n,a,s)=>(await J.getCollection(e)).filter(m=>a==="=="?m[n]===s:a==="!="?m[n]!==s:!1)};window.addEventListener("load",()=>{const e=document.getElementById("loading-screen");e&&(e.style.display="none")});lt();Ce(I(at),document.getElementById("root"));export{J as d,lt as s};

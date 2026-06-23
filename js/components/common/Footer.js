
import { h } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';

const html = htm.bind(h);

export function Footer({ config }) {
  return html`
    <footer className="bg-slate-900 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">R</span>
              </div>
              <span className="text-xl font-black text-white">${config?.platformName || 'Rifa Digital'}</span>
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
            ${config?.footerText || '© 2026 Rifa Digital. Todos os direitos reservados.'}
          </p>
        </div>
      </div>
    </footer>
  `;
}

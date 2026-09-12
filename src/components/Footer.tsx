import { Instagram, Linkedin, Video, ArrowUp, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  designerName: string;
  designerTitle: string;
  onScrollToTop: () => void;
}

export function Footer({ designerName, designerTitle, onScrollToTop }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Instagram',
      handle: '@musta__phavfx',
      url: 'https://www.instagram.com/musta__phavfx/',
      icon: Instagram
    },
    {
      name: 'TikTok',
      handle: '@mustapha__vfx',
      url: 'https://www.tiktok.com/@mustapha__vfx',
      icon: Video
    },
    {
      name: 'LinkedIn',
      handle: 'Mustapha Tamerdjent',
      url: 'https://www.linkedin.com/in/mustapha-tamerdjent-88179b431/?skipRedirect=true',
      icon: Linkedin
    }
  ];

  return (
    <footer id="footer" className="relative w-full bg-[#070709] border-t border-white/[0.08] pt-16 sm:pt-20 pb-12 sm:pb-16 px-6 sm:px-8 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-14">
        {/* Socials Contact Buttons Grid */}
        <div>
          <div className="text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-4">
            CONNECT & FOLLOW
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.name}
                  id={`footer-social-${social.name.toLowerCase()}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
                        {social.name}
                      </div>
                      <div className="text-xs font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors truncate max-w-[140px] sm:max-w-[160px]">
                        {social.handle}
                      </div>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-white/30 transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom Line: Copyright, Identity & Return to Top */}
        <div className="pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-5 text-xs font-mono text-zinc-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-center sm:text-left">
            <span className="text-zinc-300 font-bold uppercase">{designerName}</span>
            <span className="text-zinc-700 hidden sm:inline">//</span>
            <span className="text-zinc-400">{designerTitle}</span>
            <span className="text-zinc-700 hidden sm:inline">//</span>
            <span>© {currentYear} ALL RIGHTS RESERVED</span>
          </div>

          <button
            id="footer-back-to-top-btn"
            onClick={onScrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <span>RETURN TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

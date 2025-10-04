// SplashScreen.js - Upscale animated splash with SVG logo and welcome dialog
(function(){
  const e = React.createElement;

  // Elegant SVG logo for ConversaTrait
  function Logo({ className = '', animate = true }) {
    const [phase, setPhase] = React.useState(0);
    React.useEffect(() => {
      if (!animate) return;
      let raf;
      let start;
      const loop = (t) => {
        if (!start) start = t;
        const elapsed = (t - start) / 1000;
        setPhase(elapsed);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }, [animate]);

    const glow = 0.5 + 0.5 * Math.sin(phase * 1.2);

    return e('svg', {
      className,
      viewBox: '0 0 512 128',
      role: 'img',
      'aria-label': 'ConversaTrait logo'
    }, [
      // Mark
      e('defs', { key: 'defs' }, [
        e('radialGradient', { id: 'ctGlow', cx: '50%', cy: '50%', r: '60%' }, [
          e('stop', { key: 's0', offset: '0%', stopColor: 'rgba(99,102,241,0.9)' }),
          e('stop', { key: 's1', offset: '60%', stopColor: 'rgba(168,85,247,0.4)' }),
          e('stop', { key: 's2', offset: '100%', stopColor: 'rgba(0,0,0,0)' })
        ])
      ]),
      e('g', { key: 'mark', transform: 'translate(16,16)' }, [
        e('circle', { key: 'g', cx: 48, cy: 48, r: 48, fill: 'url(#ctGlow)', opacity: (0.45 + glow*0.25).toFixed(2) }),
        e('path', {
          key: 'c',
          d: 'M48 16c-17.67 0-32 14.33-32 32s14.33 32 32 32c6.1 0 11.78-1.72 16.6-4.7l9.9 9.9c2.34 2.34 6.14 2.34 8.48 0s2.34-6.14 0-8.48l-9.9-9.9C66.28 59.78 64 54.1 64 48c0-17.67-14.33-32-32-32z',
          fill: 'none', style: { opacity: (0.7 + glow*0.3).toFixed(2), stroke: 'url(#ctGlow)' }
        })
      ]),
      // Wordmark
      e('g', { key: 'word', transform: 'translate(120,20)' }, [
        e('text', {
          key: 'conversa', x: 0, y: 42, fill: '#E5E7EB', fontSize: 40, fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto',
          style: { letterSpacing: '0.5px', fontWeight: 700 }
        }, 'Conversa'),
        e('text', {
          key: 'trait', x: 210, y: 42, fill: '#A78BFA', fontSize: 40, fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto',
          style: { letterSpacing: '0.5px', fontWeight: 700 }
        }, 'Trait')
      ])
    ]);
  }

  function FeatureList() {
    const items = (window.ANALYSIS_TYPES || []).map(x => ({
      id: x.id,
      title: x.title,
      desc: x.description
    }));

    return e('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 max-h-[40vh] overflow-auto pr-1' },
      items.map((it, idx) => e('div', {
        key: it.id,
        className: 'rounded-lg p-3 bg-gray-800/60 border border-gray-700/60 hover:border-gray-600/80 transition-colors'
      }, [
        e('div', { key: 't', className: 'text-sm font-semibold text-white mb-1' }, `${idx+1}. ${it.title}`),
        e('div', { key: 'd', className: 'text-xs text-gray-300 leading-relaxed' }, it.desc)
      ]))
    );
  }

  const SplashScreen = React.memo(function SplashScreen({ onContinue }){
    const [visible, setVisible] = React.useState(true);
    const [fadeOut, setFadeOut] = React.useState(false);

    React.useEffect(() => {
      // Prevent scroll jank while splash shown
      document.documentElement.style.overflow = 'hidden';
      return () => { document.documentElement.style.overflow = ''; };
    }, []);

    const handleContinue = () => {
      try {
        setFadeOut(true);
        // Flag main menu to animate its entrance
        window.__shouldAnimateMainMenu = true;
  // If the main menu is already mounted, trigger the animation directly too
  try { setTimeout(() => { if (typeof window.__animateMainMenu === 'function') window.__animateMainMenu(); }, 120); } catch(_) {}
        setTimeout(() => {
          setVisible(false);
          onContinue?.();
        }, 550);
      } catch (_) { onContinue?.(); }
    };

    if (!visible) return null;

    return e('div', {
      className: `fixed inset-0 z-[999] flex items-center justify-center px-6 ${fadeOut ? 'ct-splash-fadeout' : 'ct-splash-fadein'}`,
      style: {
        background: 'radial-gradient(1200px 600px at 20% 10%, rgba(99,102,241,0.12), transparent), radial-gradient(1200px 600px at 80% 90%, rgba(139,92,246,0.10), transparent), #0B1220'
      }
    }, [
      e('div', { key: 'panel', className: 'w-full max-w-3xl rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-xl p-6 shadow-2xl' }, [
        e('div', { key: 'logoWrap', className: 'flex items-center justify-center mb-4' },
          e(Logo, { className: 'w-full max-w-[520px] h-auto drop-shadow-[0_0_20px_rgba(99,102,241,0.35)]' })
        ),
        e('p', { key: 'tag', className: 'text-center text-sm text-gray-300' }, 'Advanced Personality & Conversation Intelligence'),
        e('div', { key: 'hr', className: 'h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4' }),
        e('div', { key: 'welcome', className: 'text-gray-300 text-sm leading-relaxed' }, [
          e('p', { key: 'p1' }, 'Welcome. This beta is intended for educational and entertainment purposes. It provides structured insights, not clinical or legal advice.'),
          e('p', { key: 'p2', className: 'mt-2' }, 'Choose from a suite of analysis modes designed to illuminate patterns in tone, reasoning, personality, and social context.'),
        ]),
        e(FeatureList, { key: 'features' }),
        e('div', { key: 'cta', className: 'mt-6 flex justify-center' },
          e('button', {
            className: 'px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-900/30 transition-colors',
            onClick: handleContinue
          }, "OK, let's go →")
        )
      ])
    ]);
  });

  try { window.SplashScreen = SplashScreen; window.componentLoadMonitor?.log('SplashScreen'); } catch (_) {}
})();

'use strict';

(function(){
  // Simple error boundary to avoid crashing the whole page on a renderer error
  class ErrorBoundary extends React.Component {
    constructor(props){
      super(props);
      this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error){
      return { hasError: true, error };
    }
    componentDidCatch(error, info){
      console.error('[ResultsContainer] Render error:', error, info);
    }
    render(){
      if(this.state.hasError){
        return React.createElement('div', { className: 'p-4 rounded-lg border border-red-500/30 bg-red-900/20 text-red-300 text-sm space-y-1' }, [
          React.createElement('div', { key:'t', className:'font-semibold' }, 'Visualization Renderer Issue'),
          React.createElement('div', { key:'m', className:'text-xs opacity-80' }, 'The visualization hit an internal error. No unsafe fallback or raw JSON will be shown. Please retry the analysis or report this if it persists.')
        ]);
      }
      return this.props.children;
    }
  }

  // Try to infer analysis type from data payload
  function inferTypeFromData(data){
    const m = data?.metadata || data?.meta || {};
    const explicit = (
      data?.analysis_type || m.analysis_type ||
      data?.analysis_metadata?.analysis_type ||
      data?.results?.analysis_metadata?.analysis_type ||
      data?.type || m.type ||
      data?.mode || m.mode ||
      null
    );
    if(explicit) return explicit;
    // Heuristic: comprehensive profile detection
    try {
      const root = data?.results || data || {};
      const profile = root.personality_profile || root.personalityProfile || root.profile || {};
      const bigFiveObj = profile.big_five || profile.bigFive || profile.bigfive || profile.traits || null;
      const hasBigFive = !!bigFiveObj;
      const relDyn = root.relationship_dynamics || root.relationshipDynamics || root.relationship_profile || root.social_dynamics || null;
      const hasRelDyn = !!relDyn;
      const recs = root.recommendations || root.recs || profile.recommendations || [];
      const hasRecommendations = Array.isArray(recs) && recs.length > 2;
      if(hasBigFive && (hasRelDyn || hasRecommendations)){
        return 'comprehensive';
      }
    } catch(_){}
    return null;
  }

  // Alias map to handle variations
  const TYPE_ALIASES = {
    big_five: 'personality_analysis',
    personality: 'personality_analysis',
    mbti: 'mbti_analysis',
    iq: 'iq_estimation',
    romance: 'romance_indicator',
    emotion: 'emotion_analysis',
    bullshit: 'bullshit_detector',
    argument_visual: 'argument',
    conflict: 'conflict_resolution',
    evolution: 'evolution_tracking',
    comprehensive_profile: 'comprehensive',
    comprehensive_analysis: 'comprehensive',
    full_profile: 'comprehensive'
  };

  function getPrettyTitle(type){
    if(!type) return 'Results';
    return String(type)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, s => s.toUpperCase());
  }

  function pickComponentKey(type, config, registry){
    const keys = [];
    if(config?.status === 'coming_soon') keys.push('coming_soon');
    if(config?.component) keys.push(config.component);
    if(type) keys.push(type);
    if(type && TYPE_ALIASES[type]) keys.push(TYPE_ALIASES[type]);
    // heuristic: strip common suffixes
    if(type && /_(analysis|profile)$/.test(type)){
      const base = type.replace(/_(analysis|profile)$/,'');
      if(TYPE_ALIASES[base]) keys.push(TYPE_ALIASES[base]);
      keys.push(base);
    }
    keys.push('generic');
    for(const k of keys){
      if(k && registry[k]) return k;
    }
    return 'generic';
  }

  function ResultsContainer({ analysisType, data }){
    const [config, setConfig] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [registryReadyTick, setRegistryReadyTick] = React.useState(0);
    // Debug toggles removed per strict no-raw policy

    const inferredType = React.useMemo(() => analysisType || inferTypeFromData(data) || 'generic', [analysisType, data]);

    // Some backends wrap the actual results in a top-level { status, results, analysis_metadata } envelope.
    // Normalize here so visuals receive the core domain payload they expect.
  const coreData = React.useMemo(() => {
      if (!data || typeof data !== 'object') return data;
      // Unwrap common envelopes like { status, results, analysis_metadata }
      let unwrapped = data;
      if (unwrapped && typeof unwrapped.results === 'object' && !Array.isArray(unwrapped.results)) {
        unwrapped = unwrapped.results;
      }

      // Some providers nest another level: { results: { ..., results: { personality_traits: {...} } } }
      if (unwrapped && typeof unwrapped.results === 'object' && !Array.isArray(unwrapped.results)) {
        const maybe = unwrapped.results;
        const hasTraits = !!(maybe && (maybe.personality_traits || maybe.mbti || maybe.cognitive_assessment || maybe.overall_assessment));
        if (hasTraits) {
          unwrapped = maybe;
        }
      }

      // Special handling for IQ data: if visualization_data contains IQ information, merge it to top level
      if (unwrapped && typeof unwrapped.visualization_data === 'object' && unwrapped.visualization_data.type === 'iq_estimation') {
        const vizData = unwrapped.visualization_data;
        if (vizData.cognitive_assessment) {
          unwrapped.cognitive_assessment = vizData.cognitive_assessment;
        }
        if (vizData.overall_iq_estimate) {
          unwrapped.overall_iq_estimate = vizData.overall_iq_estimate;
        }
        if (vizData.summary) {
          unwrapped.summary = vizData.summary;
        }
        if (vizData.methodology) {
          unwrapped.methodology = vizData.methodology;
        }
        if (vizData.reasoning) {
          unwrapped.reasoning = vizData.reasoning;
        }
        if (vizData.improvement_suggestions) {
          unwrapped.improvement_suggestions = vizData.improvement_suggestions;
        }
      }

      return unwrapped;
    }, [data]);

    React.useEffect(() => {
      let mounted = true;
      (async () => {
        setLoading(true);
        const cfg = await window.VisualizationConfigLoader?.loadConfig(inferredType);
        if(mounted) {
          setConfig(cfg);
          setLoading(false);
        }
      })();
      return () => { mounted = false; };
    }, [inferredType]);

  if(!coreData) return React.createElement('div', { className: 'text-gray-400' }, 'No data');

    // Wait until at least the generic visual is registered to avoid early render crashes
    React.useEffect(() => {
      if(window.AnalysisVisualsRegistry && window.AnalysisVisualsRegistry.generic){
        // Already ready
        return;
      }
      let attempts = 0;
      const id = setInterval(() => {
        attempts++;
        if(window.AnalysisVisualsRegistry && window.AnalysisVisualsRegistry.generic){
          clearInterval(id);
          setRegistryReadyTick(t => t + 1);
        } else if(attempts > 120) { // ~6s @50ms
          clearInterval(id);
          console.warn('[ResultsContainer] Registry generic visual not found after waiting. Proceeding without it.');
          setRegistryReadyTick(t => t + 1);
        }
      }, 50);
      return () => clearInterval(id);
    }, [data, analysisType]);

    const registry = window.AnalysisVisualsRegistry || {};
    const compKey = pickComponentKey(inferredType, config, registry);
    const Cmp = registry[compKey] || registry['generic'];

    if(!Cmp){
      return React.createElement('div', { className:'text-xs text-gray-400 italic' }, 'Preparing visualization components…');
    }

    // --- Global Export Utilities ---
    function redactKeyPath(path){
      const s = path.join('.').toLowerCase();
      // Redact meta/system and secrets
      return (
        s.includes('system_prompt') || s.includes('prompt_metadata') || s.includes('provider_http') ||
        s.includes('headers') || s.includes('authorization') || s.includes('api_key') || s.includes('token') ||
        s.includes('openai') || s.includes('openrouter') || s.includes('internal')
      );
    }

    function stringifyValue(v){
      if (v === null) return 'null';
      if (typeof v === 'number' || typeof v === 'boolean') return String(v);
      if (typeof v === 'string') return v;
      try { return JSON.stringify(v, null, 2); } catch(_) { return String(v); }
    }

    function buildStructuredMarkdown(obj){
      const lines = [];
      const walk = (val, path=[]) => {
        if (redactKeyPath(path)) return; // skip redacted keys entirely
        if (val === null || typeof val !== 'object'){
          // primitive or string -> bullet with path
          const label = path.length ? `**${path.join('.')}**` : '**value**';
          lines.push(`- ${label}: ${stringifyValue(val)}`);
          return;
        }
        if (Array.isArray(val)){
          const label = path.length ? `**${path.join('.')}**` : '**list**';
          lines.push(`- ${label}:`);
          if (val.length === 0){ lines.push('  - (empty)'); return; }
          val.forEach((item, i) => {
            const p = path.concat([String(i)]);
            if (item && typeof item === 'object'){
              lines.push(`  - [${i}]`);
              walk(item, p);
            } else {
              lines.push(`  - ${stringifyValue(item)}`);
            }
          });
          return;
        }
        // object
        const keys = Object.keys(val);
        if (path.length === 0) lines.push('');
        keys.forEach(k => {
          walk(val[k], path.concat([k]));
        });
      };
      walk(obj, []);
      return lines.join('\n');
    }

    function nowIso(){ return new Date().toISOString(); }

    function buildMarkdownReport(){
      const title = config?.title || getPrettyTitle(inferredType);
      const mdParts = [];
      mdParts.push(`# ${title}`);
      mdParts.push('');
      mdParts.push(`- Type: ${inferredType}`);
      mdParts.push(`- Generated: ${nowIso()}`);
      const sessionId = data?.analysis_metadata?.session_id || data?.metadata?.session_id || coreData?.analysis_metadata?.session_id;
      if (sessionId) mdParts.push(`- Session: ${sessionId}`);
      mdParts.push('');
      // Include narrative markdown if present
      if (mdown && typeof mdown === 'string' && mdown.trim().length > 0){
        mdParts.push('## Narrative Report');
        mdParts.push('');
        mdParts.push(mdown);
        mdParts.push('');
      }
      // Add structured dump (non-truncated)
      mdParts.push('## Structured Results');
      mdParts.push('');
      mdParts.push(buildStructuredMarkdown(coreData));
      mdParts.push('');
      // Optional raw JSON for completeness (redacting meta/system)
      try {
        const clone = (function redact(obj){
          if (obj === null || typeof obj !== 'object') return obj;
          if (Array.isArray(obj)) return obj.map(redact);
          const out = {};
          Object.keys(obj).forEach(k => {
            const path = [k];
            if (redactKeyPath(path)) return; // drop
            out[k] = redact(obj[k]);
          });
          return out;
        })(coreData);
        mdParts.push('## Raw Data (JSON, redacted meta)');
        mdParts.push('');
        mdParts.push('```json');
        mdParts.push(JSON.stringify(clone, null, 2));
        mdParts.push('```');
      } catch(_) {}
      return mdParts.join('\n');
    }

    function exportMarkdown(){
      try {
        const md = buildMarkdownReport();
        const blob = new Blob([md], { type: 'text/markdown' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        const fname = `${(config?.title || inferredType || 'report').toLowerCase().replace(/\s+/g,'_')}_${Date.now()}.md`;
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 900);
      } catch(err){ console.error('[ResultsContainer] Markdown export failed:', err); }
    }

    function mdToBasicHtml(md){
      // Lightweight MD -> HTML for print view (headings, lists, hr, bold/italic, code)
      function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
      const lines = String(md||'').replace(/\r\n/g,'\n').split('\n');
      const out = [];
      let inUl=false, inOl=false;
      const flush=()=>{ if(inUl){ out.push('</ul>'); inUl=false;} if(inOl){ out.push('</ol>'); inOl=false;} };
      for(const raw of lines){
        const line = raw;
        const hr = /^\s*---+\s*$/.test(line);
        if(hr){ flush(); out.push('<hr/>'); continue; }
        const h = line.match(/^\s*(#{1,6})\s+(.*)$/);
        if(h){ flush(); const lvl=h[1].length; out.push(`<h${lvl}>${esc(h[2])}</h${lvl}>`); continue; }
        const ul = line.match(/^\s*[-*+]\s+(.*)$/);
        if(ul){ if(!inUl){ flush(); out.push('<ul>'); inUl=true; } out.push(`<li>${esc(ul[1])}</li>`); continue; }
        const ol = line.match(/^\s*\d+\.\s+(.*)$/);
        if(ol){ if(!inOl){ flush(); out.push('<ol>'); inOl=true; } out.push(`<li>${esc(ol[1])}</li>`); continue; }
        flush();
        let text = esc(line)
          .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
          .replace(/__(.+?)__/g,'<strong>$1</strong>')
          .replace(/(^|\W)\*(?!\s)(.+?)(?!\s)\*(\W|$)/g,'$1<em>$2</em>$3')
          .replace(/(^|\W)_(?!\s)(.+?)(?!\s)_(\W|$)/g,'$1<em>$2</em>$3')
          .replace(/`([^`]+)`/g,'<code>$1</code>');
        out.push(text.trim().length ? `<p>${text}</p>` : '<br/>');
      }
      flush();
      return out.join('\n');
    }

    function exportPDF(){
      try {
        const md = buildMarkdownReport();
        const html = mdToBasicHtml(md);
        const doc = `<!doctype html><html><head><meta charset="utf-8"><title>${(config?.title || getPrettyTitle(inferredType))} – Report</title>
          <style>
            html,body{margin:0;padding:0;background:#0b1220;color:#e5e7eb;font-family:Inter,Segoe UI,system-ui,Arial,sans-serif;}
            .container{max-inline-size:880px;margin:24px auto;padding:0 20px;}
            h1,h2,h3,h4{color:#fff;margin-block-start:1.2em;margin-block-end:0.6em;}
            p,li{line-height:1.6;font-size:14px;color:#d1d5db;}
            code{background:#111827;padding:2px 4px;border-radius:4px;color:#93c5fd;}
            hr{border:none;border-block-start:1px solid #374151;margin-block:16px;}
            ul,ol{padding-inline-start:20px;}
            .meta{font-size:12px;color:#9ca3af;margin-block-end:12px;}
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style></head><body>
          <div class="container">
            ${html}
          </div>
          <script>window.onload = function(){ setTimeout(()=>window.print(), 150); }<\/script>
        </body></html>`;
        const w = window.open('', '_blank', 'noopener,noreferrer');
        if(!w){ console.warn('Popup blocked while exporting PDF'); return; }
        w.document.open();
        w.document.write(doc);
        w.document.close();
      } catch(err){ console.error('[ResultsContainer] PDF export failed:', err); }
    }

    const header = React.createElement('div', { key: 'header', className: 'flex items-center justify-between' }, [
      React.createElement('div', { key: 'titles' }, [
        React.createElement('div', { key: 'title', className: 'text-lg font-semibold text-white' }, config?.title || getPrettyTitle(inferredType)),
        config?.subtitle && React.createElement('div', { key: 'subtitle', className: 'text-xs text-gray-400 mt-0.5' }, config.subtitle)
      ]),
      React.createElement('div', { key: 'actions', className: 'flex items-center gap-2' }, [
        React.createElement('button', { key: 'md', onClick: exportMarkdown, className: 'text-xs px-2 py-1 rounded bg-sky-600/70 hover:bg-sky-500 text-white font-semibold tracking-wide' }, 'Export Markdown'),
        React.createElement('button', { key: 'pdf', onClick: exportPDF, className: 'text-xs px-2 py-1 rounded bg-violet-600/70 hover:bg-violet-500 text-white font-semibold tracking-wide' }, 'Export PDF'),
        config?.status === 'coming_soon' && React.createElement('span', { key: 'badge', className: 'px-2 py-1 text-xs rounded-full bg-yellow-400 text-black font-semibold' }, 'Coming Soon')
      ])
    ]);

    const loadingNode = loading && React.createElement('div', { key: 'loading', className: 'text-xs text-gray-400 animate-pulse' }, 'Loading visualization config…');

    // Lightweight exhaustive renderer using <details>/<summary>
    function Key({k}){ return React.createElement('span', { className:'text-sky-300' }, String(k)); }
    function Val({v}){
      const t = typeof v;
      if (v === null) return React.createElement('span', { className:'text-gray-400' }, 'null');
      if (t === 'number') return React.createElement('span', { className:'text-indigo-300' }, String(v));
      if (t === 'boolean') return React.createElement('span', { className:'text-amber-300' }, String(v));
      if (t === 'string'){
        const short = v.length > 220 ? v.slice(0, 200) + '…' : v;
        return React.createElement('span', { className:'text-gray-200' }, JSON.stringify(short));
      }
      return React.createElement('span', { className:'text-gray-300' }, String(v));
    }
    function Node({ label, value }){
      const isArr = Array.isArray(value);
      const isObj = value && typeof value === 'object' && !isArr;
      if (!isObj && !isArr){
        return React.createElement('div', { className:'pl-3 py-0.5' }, [
          label!=null && React.createElement('span', { key:'k', className:'text-xs mr-2' }, [React.createElement(Key, {k:label}), ': ']),
          React.createElement('span', { key:'v', className:'text-xs' }, React.createElement(Val, { v: value }))
        ]);
      }
      const count = isArr ? value.length : Object.keys(value||{}).length;
      return React.createElement('details', { className:'pl-2', open: false }, [
        React.createElement('summary', { key:'s', className:'cursor-pointer text-xs text-gray-300 hover:text-white' }, [
          label!=null && React.createElement('span', { className:'mr-2' }, React.createElement(Key, {k:label})),
          React.createElement('span', { className:'text-gray-400' }, isArr ? `[${count}]` : `{${count}}`)
        ]),
        React.createElement('div', { key:'c', className:'ml-3 border-l border-gray-800/70 pl-2 my-1 space-y-0.5' }, (
          isArr ? value.map((v,i)=> React.createElement(Node, { key:i, label:i, value:v }))
                : Object.entries(value).map(([k,v])=> React.createElement(Node, { key:k, label:k, value:v }))
        ))
      ]);
    }
    // Full structured output and raw JSON removed per policy

    // Extract optional markdown report from either the root or coreData
    function findMarkdownCandidate(obj){
      if (!obj || typeof obj !== 'object') return null;
      const direct = obj.markdown_report || obj.md || obj.report_markdown || obj.markdown || obj.pretty_report;
      if (typeof direct === 'string' && direct.trim().length > 50) return direct;
      // Look into common containers
      const containers = [obj.results, obj.analysis, obj.overview, obj.personality_report, obj.personality_traits, obj.summary];
      for (const c of containers){
        if (typeof c === 'string' && c.includes('\n# ')) return c;
        if (c && typeof c === 'object'){
          for (const [k,v] of Object.entries(c)){
            if (typeof v === 'string' && (v.includes('\n# ') || /^#\s+/.test(v) || /\*\*.+\*\*/.test(v)) && v.length > 80){
              return v;
            }
          }
        }
      }
      return null;
    }
    const mdown = findMarkdownCandidate(data) || findMarkdownCandidate(coreData);

    return React.createElement('div', { className: 'space-y-4' }, [
      header,
      config?.description && React.createElement('div', { key: 'desc', className: 'text-sm text-gray-300' }, config.description),
      loadingNode,
    // Pretty-printed markdown, if available
      (mdown ? React.createElement(window.MarkdownCard || 'div', { key:'md', title:'Report', markdown: mdown }) : null),
  React.createElement(ErrorBoundary, { key: 'boundary' }, React.createElement(Cmp, { config, data: coreData })),
      // No AutoResultsGrid or raw JSON per strict UX policy
    ]);
  }

  window.ResultsContainer = ResultsContainer;
})();

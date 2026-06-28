// Injeta os widgets de conversão usando as variáveis CSS da página gerada
// (var(--primary), var(--bg-alt)...), então fica coerente com o tema. Texto
// vem dos materiais coletados no Briefing Room.
export function injectWidgets(
  html: string,
  elementos: string[],
  materiais: Record<string, string>,
): string {
  let inj = ''

  if (elementos.includes('countdown-timer')) {
    const msg = materiais.timer_mensagem?.trim() || 'Oferta por tempo limitado'
    inj += `
<div style="position:fixed;top:0;left:0;right:0;z-index:9999;background:var(--primary);color:var(--text-inv);text-align:center;padding:10px;font-size:14px;font-weight:600;font-family:var(--font-body,system-ui)">
  ${msg} <span id="pz-timer" style="font-weight:800"></span>
</div>
<style>body{padding-top:46px}</style>
<script>
(function(){var e=Date.now()+86400000,t=document.getElementById("pz-timer");function u(){var s=Math.max(0,e-Date.now()),h=Math.floor(s/3600000),m=Math.floor(s%3600000/60000),sc=Math.floor(s%60000/1000);t.textContent=h+"h "+String(m).padStart(2,"0")+"m "+String(sc).padStart(2,"0")+"s";if(s>0)setTimeout(u,1000)}u()})()
</script>`
  }

  if (elementos.includes('social-proof-toast')) {
    const msgs = [materiais.toast_texto_1, materiais.toast_texto_2, materiais.toast_texto_3]
      .map((m) => m?.trim())
      .filter(Boolean)
    if (msgs.length) {
      inj += `
<div id="pz-toast" style="position:fixed;bottom:24px;left:24px;z-index:9998;background:var(--bg-alt);color:var(--text);border:1px solid var(--primary);border-radius:12px;padding:12px 16px;font-size:13px;font-family:var(--font-body,system-ui);box-shadow:0 4px 20px rgba(0,0,0,.4);max-width:280px;display:none;align-items:center;gap:10px">
  <span style="font-size:18px">✅</span><span id="pz-toast-t"></span>
</div>
<script>
(function(){var msgs=${JSON.stringify(msgs)},i=0,el=document.getElementById("pz-toast"),txt=document.getElementById("pz-toast-t");function show(){txt.textContent=msgs[i%msgs.length];el.style.display="flex";setTimeout(function(){el.style.display="none";i++;setTimeout(show,5000)},4000)}setTimeout(show,3000)})()
</script>`
    }
  }

  if (elementos.includes('sticky-cta')) {
    const txt = materiais.cta_texto?.trim() || 'Quero começar agora'
    inj += `
<div style="position:fixed;bottom:0;left:0;right:0;z-index:9997;background:var(--bg-dark);opacity:.97;backdrop-filter:blur(8px);padding:12px 24px;display:flex;justify-content:center;border-top:1px solid rgba(255,255,255,.1)">
  <button onclick="window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})" style="background:var(--primary);color:var(--text-inv);font-weight:700;font-size:15px;padding:12px 32px;border-radius:10px;border:none;cursor:pointer;font-family:var(--font-body,system-ui)">
    ${txt} →
  </button>
</div>
<style>body{padding-bottom:70px}</style>`
  }

  if (!inj) return html
  return html.includes('</body>') ? html.replace('</body>', `${inj}\n</body>`) : html + inj
}

const HERO_PLACEHOLDER = '__HERO_IMAGE__'

// Substitui o placeholder do hero pelo data URI base64, ou remove o <img> se não houver imagem.
export function applyHeroImage(html: string, dataUri?: string): string {
  if (dataUri && dataUri.startsWith('data:')) {
    return html.split(HERO_PLACEHOLDER).join(dataUri)
  }
  // sem imagem: remove qualquer <img> que tenha sobrado com o placeholder
  return html.replace(new RegExp(`<img[^>]*src=["']${HERO_PLACEHOLDER}["'][^>]*>`, 'gi'), '')
}

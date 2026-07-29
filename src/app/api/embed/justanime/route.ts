import { getJustAnimePayload, type JustAnimeAudio, type JustAnimeProvider } from "@/lib/justanime";

export const dynamic = "force-dynamic";

function esc(s: string) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

export async function GET(request: Request) {
  const reqUrl = new URL(request.url);
  // Build base URL for absolute paths (works in iframe)
  const baseUrl = `${reqUrl.protocol}//${reqUrl.host}`;
  
  const animeId = Number(reqUrl.searchParams.get("animeId"));
  const episode = Number(reqUrl.searchParams.get("ep"));
  const provider = (reqUrl.searchParams.get("provider") || "neko") as JustAnimeProvider;
  const audio = (reqUrl.searchParams.get("audio") || "sub") as JustAnimeAudio;
  const title = reqUrl.searchParams.get("title") || "Player";

  if (!animeId || !episode) return new Response("Missing params", { status: 400 });

  const payload = await getJustAnimePayload(animeId, episode, provider, audio);
  if (!payload || !payload.sources?.length) {
    return new Response(
      `<!doctype html><html><body style="margin:0;background:#000;color:#999;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;text-align:center"><div><p style="font-size:16px">Stream not available</p><p style="font-size:12px;opacity:.6">Try another server</p></div></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  // Best quality source
  const sorted = [...payload.sources].sort((a, b) => {
    return (parseInt((b.quality||"0").replace(/\D/g,""))||0) - (parseInt((a.quality||"0").replace(/\D/g,""))||0);
  });
  const source = sorted[0];
  // ABSOLUTE URL for media proxy (works inside iframe)
  const proxySrc = `${baseUrl}/api/stream/media?url=${encodeURIComponent(source.url)}&provider=${encodeURIComponent(provider)}`;

  // Subtitles with ABSOLUTE URLs
  const allSubs = [...(payload.subtitles || []), ...(payload.tracks || [])];
  const subs = allSubs.map((t, i) => {
    const file = t.file || t.url;
    if (!file) return null;
    const label = t.label || t.lang || "English";
    const lang = label.toLowerCase().includes("eng") ? "en" : label.toLowerCase().includes("spa") ? "es" : label.toLowerCase().includes("por") ? "pt" : label.toLowerCase().includes("jap") ? "ja" : "en";
    // ABSOLUTE URL for subtitle proxy
    return { src: `${baseUrl}/api/stream/subtitle?url=${encodeURIComponent(file)}`, label, lang, def: i === 0 };
  }).filter(Boolean) as { src: string; label: string; lang: string; def: boolean }[];

  const html = `<!doctype html>
<html><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(title)}</title>
<script src="https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:#000;height:100%;overflow:hidden}
video{width:100%;height:100%;background:#000}
video::cue{background:rgba(0,0,0,.8);color:#fff;font-size:clamp(14px,2.5vw,20px);padding:2px 6px}
</style>
</head><body>
<video id="v" controls autoplay playsinline crossorigin="anonymous"></video>
<script>
(function(){
var v=document.getElementById('v');
var src=${JSON.stringify(proxySrc)};
var subs=${JSON.stringify(subs)};

// Add subtitle tracks
subs.forEach(function(s){
  var t=document.createElement('track');
  t.kind='subtitles';
  t.src=s.src;
  t.label=s.label;
  t.srclang=s.lang;
  if(s.def) t.default=true;
  v.appendChild(t);
});

// Load HLS or direct
if(window.Hls&&Hls.isSupported()&&src.indexOf('m3u8')!==-1){
  var h=new Hls({enableWorker:true,startLevel:-1});
  h.loadSource(src);
  h.attachMedia(v);
  h.on(Hls.Events.MANIFEST_PARSED,function(){v.play().catch(function(){})});
  h.on(Hls.Events.ERROR,function(e,d){if(d.fatal){h.destroy();v.src=src;v.play().catch(function(){});}});
}else{
  v.src=src;
  v.play().catch(function(){});
}

// Force enable subtitles on video
function showSubs(){
  if(!v.textTracks||!v.textTracks.length)return;
  v.textTracks[0].mode='showing';
}
v.addEventListener('loadedmetadata',showSubs);
v.addEventListener('canplay',showSubs);
v.addEventListener('playing',showSubs);
setTimeout(showSubs,500);
setTimeout(showSubs,2000);
setTimeout(showSubs,4000);
})();
<\/script>
</body></html>`;

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

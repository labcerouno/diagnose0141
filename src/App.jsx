import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { createClient } from "@supabase/supabase-js";
import {
  APP_TEXT,
  ARCHETYPE_LABELS,
  CONDITIONAL_QUESTION_TEXT,
  EDUCATION_TEXT,
  NEEDS_TEXT,
  PROFILE_TEXT,
  QUESTION_TEXT,
  REPORT_TEXT,
  RISK_TEXT,
  STATS_TEXT,
} from "./appText";
import oxyLogo from "./assets/Oxy_blanco.png";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const DIAG_TABLE = "diagnosticos_ia";
const DIAG_LOCAL_KEY = "diag:entries";

function getLocalEntries() {
  try {
    const raw = localStorage.getItem(DIAG_LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveLocalEntry(entry) {
  try {
    const entries = getLocalEntries();
    entries.unshift(entry);
    localStorage.setItem(DIAG_LOCAL_KEY, JSON.stringify(entries.slice(0, 500)));
  } catch (error) {
    // Ignore local persistence errors to avoid blocking UX.
  }
}

async function saveDiagnosis(entry) {
  if (!supabase) {
    console.warn(APP_TEXT.supabaseInitWarning);
    saveLocalEntry(entry);
    return;
  }

  const { error } = await supabase
    .from(DIAG_TABLE)
    .insert({ payload: entry });

  if (error) {
    console.error(APP_TEXT.supabaseWriteError, {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    saveLocalEntry(entry);
  }
}

const C = {
  bg:"#0f1923", card:"#1c2b36", accent:"#3a9e8f", accentLight:"#4fc4b0",
  text:"#e8edf1", muted:"#8a9baa", dim:"#5a6f7e", white:"#fff",
  botBub:"#1e3040", userBub:"#3a9e8f", pillBd:"#3a5565",
  danger:"#e85d4a", purple:"#9b6dff", purpleFade:"rgba(155,109,255,0.12)",
  accentFade:"rgba(58,158,143,0.15)",
};

function formatText(template, values = {}) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? "");
}

function buildScoredOptions(questionId) {
  return QUESTION_TEXT[questionId].opts.map((label, index) => ({ l: label, s: index + 1 }));
}

function scoreBand(score) {
  if (score <= 2.4) return "low";
  if (score <= 3.7) return "mid";
  return "high";
}

function getCapMicrocopy(scores) {
  const avg = (scores.q11 + scores.q12 + scores.q13) / 3;
  return APP_TEXT.microcopy.cap[scoreBand(avg)];
}

function getVolMicrocopy(scores) {
  const avg = (scores.q21 + scores.q22 + scores.q23) / 3;
  return APP_TEXT.microcopy.vol[scoreBand(avg)];
}

function getClarityMicrocopy(scores) {
  const avg = (scores.q31 + scores.q32) / 2;
  return APP_TEXT.microcopy.cla[scoreBand(avg)];
}

const QS = [
  { id:"name",type:"text",bot:QUESTION_TEXT.name.bot },
  { id:"rubro",type:"choice",bot:QUESTION_TEXT.rubro.bot,opts:QUESTION_TEXT.rubro.opts },
  { id:"size",type:"choice",bot:QUESTION_TEXT.size.bot,opts:QUESTION_TEXT.size.opts },
  { id:"q11",type:"scored",dim:"cap",bot:QUESTION_TEXT.q11.bot,opts:buildScoredOptions("q11") },
  { id:"q12",type:"scored",dim:"cap",isEdu:true,bot:QUESTION_TEXT.q12.bot,opts:buildScoredOptions("q12") },
  { id:"q13",type:"scored",dim:"cap",bot:QUESTION_TEXT.q13.bot,opts:buildScoredOptions("q13") },
  { id:"q21",type:"scored",dim:"vol",bot:QUESTION_TEXT.q21.bot,opts:buildScoredOptions("q21") },
  { id:"q22",type:"scored",dim:"vol",bot:QUESTION_TEXT.q22.bot,opts:buildScoredOptions("q22") },
  { id:"q23",type:"scored",dim:"vol",bot:QUESTION_TEXT.q23.bot,opts:buildScoredOptions("q23") },
  { id:"q31",type:"scored",dim:"cla",bot:QUESTION_TEXT.q31.bot,opts:buildScoredOptions("q31") },
  { id:"q32",type:"scored",dim:"cla",bot:QUESTION_TEXT.q32.bot,opts:buildScoredOptions("q32") },
  { id:"q33",type:"text",bot:QUESTION_TEXT.q33.bot },
];

const COND = {id:"cond",type:"choice",bot:CONDITIONAL_QUESTION_TEXT.bot,opts:CONDITIONAL_QUESTION_TEXT.opts};

const pick = arr => arr[Math.floor(Math.random()*arr.length)];
function cls(s,d){const m={cap:[["Fundacional",2],["En construcción",3.5],["Habilitada",5]],vol:[["Exploratoria",2],["Comprometida",3.5],["Acelerada",5]],cla:[["Difusa",2],["Enfocándose",3.5],["Cristalizada",5]]};for(const[l,x]of m[d])if(s<=x)return l;return m[d][2][0];}
function lv(s){return s<=2?"bajo":s<=3.5?"medio":"alto";}
function getArch(c,v,cl,e,ht){const lc=lv(c),lv2=lv(v),lcl=lv(cl);if(lc==="alto"&&lv2==="alto"&&lcl==="alto")return ht?"autonomo":"listo";if(lc==="bajo"&&lcl==="bajo"&&lv2==="bajo")return"curioso";if(lc==="bajo"&&(lv2==="medio"||lv2==="alto"))return"ansioso";if(lc==="bajo")return"curioso";if(lc==="alto"&&lcl==="medio")return"constructor";if(lc==="alto"&&lcl==="alto")return"listo";return"informado";}

function getStat(rubro){return pick([...(STATS_TEXT[rubro]||[]),...STATS_TEXT.default]);}

function getProfile(ar, name) {
  const profile = PROFILE_TEXT[ar];
  return {
    intro: formatText(profile.intro, { name }),
    bullets: profile.bullets,
    close: profile.close,
  };
}

function getRisk(ar,rubro){
  return formatText(RISK_TEXT[ar], { stat: getStat(rubro) });
}

function eduFind(a,e){
  if(e>=4)return null;
  return EDUCATION_TEXT[a]?.[e]||EDUCATION_TEXT.fallback;
}

const A_COLORS={"curioso":"#FFE0B2","ansioso":"#FFCDD2","informado":"#90CAF9","constructor":"#A5D6A7","listo":"#81D4FA","autonomo":"#C8E6C9"};

function makeReportPdf(r){
  const p = getProfile(r.ar, r.nm);
  const doc = new jsPDF({ unit:"pt", format:"a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 44;
  const contentW = pageW - margin * 2;
  const ctaUrl = "https://oxy46.com";
  let y = margin;

  const ensureSpace = (need = 26) => {
    if (y + need > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const addTitle = (text) => {
    ensureSpace(32);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(20, 28, 35);
    doc.text(text, margin, y);
    y += 22;
  };

  const addSection = (text, color = [20, 28, 35]) => {
    const lines = doc.splitTextToSize(text, contentW);
    const lineH = 16;
    ensureSpace(lines.length * lineH + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(lines, margin, y);
    y += lines.length * lineH + 8;
  };

  addTitle(REPORT_TEXT.title);
  addSection(formatText(REPORT_TEXT.profileSummary, { name: r.nm || "Empresa", label: ARCHETYPE_LABELS[r.ar] || r.ar }), [58, 158, 143]);

  addTitle(REPORT_TEXT.diagnosisTitle);
  addSection(p.intro);
  p.bullets.forEach((b) => addSection(`- ${b}`));
  addSection(p.close, [89, 111, 126]);

  addTitle(REPORT_TEXT.riskTitle);
  r.risk.split("\n\n").forEach((x, i) => addSection(x, i > 0 ? [89, 111, 126] : [20, 28, 35]));

  if (r.ef) {
    addTitle(REPORT_TEXT.educationGapTitle);
    addSection(r.ef);
  }

  addTitle(REPORT_TEXT.needsTitle);
  NEEDS_TEXT[r.ar].split("\n\n").forEach((x) => addSection(x));

  addTitle(REPORT_TEXT.nextStepTitle);
  if (r.ar === "autonomo") {
    addSection(REPORT_TEXT.noSellCopy);
  } else {
    addSection(formatText(REPORT_TEXT.nextStepWithChallenge, { challenge: r.des }));
  }

  ensureSpace(56);
  const btnX = margin;
  const btnY = y + 4;
  const btnW = contentW;
  const btnH = 38;
  doc.setFillColor(58, 158, 143);
  doc.roundedRect(btnX, btnY, btnW, btnH, 8, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(REPORT_TEXT.scheduleConversationButton, btnX + btnW / 2, btnY + 24, { align:"center" });
  doc.link(btnX, btnY, btnW, btnH, { url: ctaUrl });

  return doc;
}

function Bub({t,f}){
  if(f==="user")return <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8,animation:"fs .25s ease-out"}}><div style={{background:C.userBub,borderRadius:"16px 4px 16px 16px",padding:"10px 16px",maxWidth:"78%",fontSize:14,fontWeight:600,color:C.white}}>{t}</div></div>;
  return <div style={{display:"flex",gap:10,marginBottom:8,animation:"fs .35s ease-out"}}><div style={{width:28,height:28,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><span style={{fontSize:11,fontWeight:700,color:C.white}}>O</span></div><div style={{background:C.botBub,borderRadius:"4px 16px 16px 16px",padding:"10px 14px",maxWidth:"82%",fontSize:14,lineHeight:1.5,color:C.text}} dangerouslySetInnerHTML={{__html:t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}}/></div>;
}

function Res({r}){
  const [sharing, setSharing] = useState(false);
  if(!r)return null;const p=getProfile(r.ar, r.nm);
  const isAutonomo = r.ar === "autonomo";

  const shareReport = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const doc = makeReportPdf(r);
      const safeName = (r.nm || "empresa").replace(/[^a-z0-9-_]+/gi, "_").toLowerCase();
      const fileName = `${REPORT_TEXT.filePrefix}-${safeName}.pdf`;
      const blob = doc.output("blob");
      const file = new File([blob], fileName, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: REPORT_TEXT.shareTitle, text: REPORT_TEXT.shareText, files: [file] });
      } else {
        doc.save(fileName);
      }
    } catch (e) {
      const doc = makeReportPdf(r);
      const safeName = (r.nm || "empresa").replace(/[^a-z0-9-_]+/gi, "_").toLowerCase();
      doc.save(`${REPORT_TEXT.filePrefix}-${safeName}.pdf`);
    } finally {
      setSharing(false);
    }
  };

  return <div style={{animation:"fs .5s ease-out"}}><div style={{background:C.botBub,borderRadius:"4px 16px 16px 16px",padding:"18px 16px",marginBottom:8,marginLeft:38}}>
    <div style={{fontSize:13.5,lineHeight:1.75,color:C.text}}>
      <p style={{margin:"0 0 14px"}}>{p.intro}</p>
      {p.bullets.map((b,i)=><div key={i} style={{display:"flex",gap:10,margin:"8px 0"}}><span style={{color:C.accent,fontWeight:700,flexShrink:0,marginTop:2}}>→</span><span>{b}</span></div>)}
      <p style={{margin:"14px 0 0",color:C.muted,fontStyle:"italic",fontSize:13}}>{p.close}</p>

      <div style={{height:1,background:"rgba(255,255,255,.06)",margin:"20px 0"}}/>
      <p style={{margin:"0 0 8px",fontWeight:700,color:C.danger,fontSize:11,textTransform:"uppercase",letterSpacing:1}}>{REPORT_TEXT.riskTitle}</p>
      {r.risk.split("\n\n").map((x,i)=><p key={i} style={{margin:"0 0 10px",fontSize:13,lineHeight:1.65,...(i>0?{color:C.muted,fontSize:12.5}:{})}}>{x}</p>)}

      {r.ef&&<><div style={{height:1,background:"rgba(155,109,255,.15)",margin:"20px 0"}}/><p style={{margin:"0 0 8px",fontWeight:700,color:C.purple,fontSize:11,textTransform:"uppercase",letterSpacing:1}}>{REPORT_TEXT.educationGapTitle}</p><p style={{margin:"0 0 10px",fontSize:13,lineHeight:1.65}}>{r.ef}</p></>}

      <div style={{height:1,background:"rgba(255,255,255,.06)",margin:"20px 0"}}/>
      <p style={{margin:"0 0 8px",fontWeight:700,color:C.accentLight,fontSize:11,textTransform:"uppercase",letterSpacing:1}}>{REPORT_TEXT.needsTitle}</p>
      {NEEDS_TEXT[r.ar].split("\n\n").map((x,i)=><p key={i} style={{margin:"0 0 12px",fontSize:13,lineHeight:1.65}}>{x}</p>)}
    </div></div>
    <div style={{background:C.botBub,borderRadius:"4px 16px 16px 16px",padding:"14px 16px",marginLeft:38,marginTop:8}}>
      <p style={{margin:0,fontSize:13.5,lineHeight:1.6,color:C.text}}>
        {isAutonomo?REPORT_TEXT.noSellCopy
          :<>{formatText(REPORT_TEXT.nextStepWithChallenge, { challenge: r.des }).split(`"${r.des}"`)[0]}<em style={{color:C.accentLight}}>"{r.des}"</em>.</>}
      </p>
      <button onClick={()=>window.open("https://oxy46.com","_blank")} style={{marginTop:12,background:C.accent,color:C.white,border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer",width:"100%",transition:"background .2s"}} onMouseEnter={e=>e.target.style.background=C.accentLight} onMouseLeave={e=>e.target.style.background=C.accent}>{isAutonomo?APP_TEXT.learnMoreButton:REPORT_TEXT.scheduleConversationButton}</button>
      <button onClick={shareReport} disabled={sharing} style={{marginTop:10,background:"transparent",color:C.accentLight,border:`1px solid ${C.accentLight}`,borderRadius:10,padding:"11px 24px",fontSize:14,fontWeight:700,cursor:sharing?"wait":"pointer",width:"100%",opacity:sharing?0.7:1}}>{sharing?APP_TEXT.shareLoading:APP_TEXT.shareButton}</button>
    </div></div>;
}

export default function App(){
  const[msgs,setMsgs]=useState([]);const[step,setStep]=useState(0);const[ans,setAns]=useState({});const[sc,setSc]=useState({});
  const[showIn,setShowIn]=useState(false);const[iv,setIv]=useState("");const[res,setRes]=useState(null);
  const[typ,setTyp]=useState(false);
  const[nc,setNc]=useState(false);const[cd,setCd]=useState(false);
  const[awaitingRubroOther,setAwaitingRubroOther]=useState(false);
  const cr=useRef(null);const ir=useRef(null);const rr=useRef(null);const un=useRef("");
  const scr=()=>setTimeout(()=>{if(cr.current)cr.current.scrollTop=cr.current.scrollHeight;},100);
  const ab=async ms=>{setTyp(true);for(let i=0;i<ms.length;i++){await new Promise(r=>setTimeout(r,i===0?400:700));setMsgs(p=>[...p,{f:"bot",t:ms[i]}]);scr();}setTyp(false);};
  useEffect(()=>{
    let active = true;

    const showInitialMessages = async () => {
      setTyp(true);

      for (let i = 0; i < QS[0].bot.length; i++) {
        await new Promise(r=>setTimeout(r,i===0?400:700));
        if (!active) return;
        setMsgs(p=>[...p,{f:"bot",t:QS[0].bot[i]}]);
        scr();
      }

      if (active) setTyp(false);
    };

    showInitialMessages();

    return () => {
      active = false;
    };
  },[]);
  useEffect(()=>{
    if(!res||!cr.current||!rr.current)return;
    const id=setTimeout(()=>{
      const cRect=cr.current.getBoundingClientRect();
      const rRect=rr.current.getBoundingClientRect();
      cr.current.scrollTo({top:cr.current.scrollTop+(rRect.top-cRect.top)-16,behavior:"smooth"});
    },80);
    return ()=>clearTimeout(id);
  },[res]);
  const cQ=step<QS.length?QS[step]:null;

  const proc=async(txt,sv)=>{
    setMsgs(p=>[...p,{f:"user",t:txt}]);scr();

    if(awaitingRubroOther&&cQ?.id==="rubro"){
      const nA={...ans,rubro:`Otro (${txt})`,rubro_otro:txt};
      const nS={...sc};
      setAns(nA);
      setSc(nS);
      setAwaitingRubroOther(false);
      setShowIn(false);
      const nx=step+1;
      setStep(nx);
      const nQ=QS[nx];
      if(nQ){
        await ab(nQ.bot);
        if(nQ.type==="text"){
          setShowIn(true);
          setTimeout(()=>ir.current?.focus(),300);
        }
      }
      return;
    }

    if(cQ?.id==="rubro"&&txt==="Otro"){
      setAns(p=>({...p,rubro:"Otro"}));
      setAwaitingRubroOther(true);
      setShowIn(true);
      await ab([APP_TEXT.rubroOtherPrompt]);
      setTimeout(()=>ir.current?.focus(),300);
      return;
    }

    const nA={...ans,[cQ?.id||"cond"]:txt};const nS={...sc};
    if(sv!==undefined&&cQ)nS[cQ.id]=sv;setAns(nA);setSc(nS);
    if(step===0)un.current=txt.split(/[·\/]/)[0].trim().split(" ")[0];
    const nx=step+1;
    if(nx>=QS.length&&!nc&&!cd){const cap=(nS.q11+nS.q12+nS.q13)/3,vol=(nS.q21+nS.q22+nS.q23)/3,cla=(nS.q31+nS.q32)/2;if(cap>=3.6&&vol>=3.6&&cla>=3.6){setStep(nx);setNc(true);await ab(COND.bot);return;}}
    if(nc&&!cd){setCd(true);setAns(p=>({...p,cond:txt}));gen(nS,nA,txt.includes("equipo")||txt.includes("Sí"));return;}
    if(nx>=QS.length&&!nc){setStep(nx);gen(nS,nA,null);return;}
    setStep(nx);const nQ=QS[nx];
    if(nQ){
      const intro=[];
      if(cQ?.id==="q13")intro.push(getCapMicrocopy(nS));
      if(cQ?.id==="q23")intro.push(getVolMicrocopy(nS));
      if(cQ?.id==="q32")intro.push(getClarityMicrocopy(nS));
      const nextBot=nx===1&&un.current?[formatText(APP_TEXT.welcomeBack, { name: un.current }),...nQ.bot]:nQ.bot;
      await ab([...intro,...nextBot]);
      if(nQ.type==="text"){
        setShowIn(true);
        setTimeout(()=>ir.current?.focus(),300);
      }else setShowIn(false);
    }
  };

  const gen=async(s,a,ht)=>{
    const cap=+((s.q11+s.q12+s.q13)/3).toFixed(1),vol=+((s.q21+s.q22+s.q23)/3).toFixed(1),cla=+((s.q31+s.q32)/2).toFixed(1),edu=s.q12;
    const ar=getArch(cap,vol,cla,edu,ht);const rub=a.rubro||"default";
    const r={ar,nm:un.current||"",risk:getRisk(ar,rub),ef:eduFind(ar,edu),des:a.q33||""};
    const entry={ts:new Date().toISOString(),nm:un.current,emp:a.name?.split(/[·\/]/)[1]?.trim()||"",rub:a.rubro||"",emp_s:a.size||"",q11:s.q11,q12:s.q12,q13:s.q13,q21:s.q21,q22:s.q22,q23:s.q23,q31:s.q31,q32:s.q32,des:a.q33||"",cap,vol,cla,edu,ar};
    await saveDiagnosis(entry);
    setTyp(true);await new Promise(r=>setTimeout(r,1500));
    setMsgs(p=>[...p,{f:"bot",t:formatText(APP_TEXT.diagnosisReady, { name: un.current || "" })}]);scr();
    await new Promise(r=>setTimeout(r,800));setTyp(false);setRes(r);
  };

  const sub=()=>{if(!iv.trim())return;const v=iv.trim();setIv("");setShowIn(false);proc(v);};
  const so=!res&&!typ&&(!!cQ||(nc&&!cd&&step>=QS.length));

  return <><style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}@keyframes fs{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}@keyframes pulse{0%,100%{opacity:.3;}50%{opacity:1;}}input::placeholder{color:${C.dim};}`}</style>
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,height:"100vh",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto",position:"relative"}}>
      <div style={{padding:"14px 16px",background:C.card,borderBottom:`1px solid ${C.pillBd}`,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <div style={{width:40,height:40,borderRadius:10,background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}><img src={oxyLogo} alt={APP_TEXT.logoAlt} style={{width:"100%",height:"100%",objectFit:"contain",padding:4}}/></div>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:C.text}}>{APP_TEXT.assistantTitle}</div><div style={{fontSize:11,color:C.accent,display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:C.accent,display:"inline-block"}}/>{APP_TEXT.statusActive}</div></div></div>
      <div ref={cr} style={{flex:1,overflow:"auto",padding:"16px 16px 8px",display:"flex",flexDirection:"column"}}>
        {msgs.map((m,i)=><Bub key={i} t={m.t} f={m.f}/>)}
        {typ&&<div style={{display:"flex",gap:10,marginBottom:8}}><div style={{width:28,height:28,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:11,fontWeight:700,color:C.white}}>O</span></div><div style={{background:C.botBub,borderRadius:"4px 16px 16px 16px",padding:"12px 18px",display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.muted,animation:`pulse 1.2s ease-in-out ${i*.2}s infinite`}}/>)}</div></div>}
        {res&&<div ref={rr}><Res r={res}/></div>}<div style={{height:8}}/></div>
      {!res&&<div style={{flexShrink:0,padding:"8px 16px 16px",background:`linear-gradient(transparent, ${C.bg} 20%)`}}>
        {so&&cQ?.type==="scored"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>{cQ.opts.map((o,i)=><button key={i} onClick={()=>proc(o.l,o.s)} style={{background:"transparent",border:`1.5px solid ${cQ.isEdu?"rgba(155,109,255,.3)":C.pillBd}`,borderRadius:12,padding:"11px 16px",color:C.text,fontSize:13.5,fontWeight:500,cursor:"pointer",textAlign:"left",transition:"all .15s"}} onMouseEnter={e=>{e.target.style.background=cQ.isEdu?C.purpleFade:C.accentFade;e.target.style.borderColor=cQ.isEdu?C.purple:C.accent;}} onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.borderColor=cQ.isEdu?"rgba(155,109,255,.3)":C.pillBd;}}>{o.l}</button>)}</div>}
        {so&&cQ?.type==="choice"&&!awaitingRubroOther&&<div style={{display:"flex",flexDirection:"column",alignItems:"stretch",gap:8}}>{cQ.opts.map((o,i)=><button key={i} onClick={()=>proc(o)} style={{background:"transparent",border:`1.5px solid ${C.pillBd}`,borderRadius:12,padding:"11px 16px",color:C.text,fontSize:13.5,fontWeight:500,cursor:"pointer",transition:"all .15s",textAlign:"left"}} onMouseEnter={e=>{e.target.style.background=C.accentFade;e.target.style.borderColor=C.accent;}} onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.borderColor=C.pillBd;}}>{o}</button>)}</div>}
        {so&&nc&&!cd&&step>=QS.length&&<div style={{display:"flex",flexDirection:"column",gap:8}}>{COND.opts.map((o,i)=><button key={i} onClick={()=>proc(o)} style={{background:"transparent",border:`1.5px solid ${C.pillBd}`,borderRadius:12,padding:"11px 16px",color:C.text,fontSize:13.5,fontWeight:500,cursor:"pointer",textAlign:"left",transition:"all .15s"}} onMouseEnter={e=>{e.target.style.background=C.accentFade;e.target.style.borderColor=C.accent;}} onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.borderColor=C.pillBd;}}>{o}</button>)}</div>}
        {(showIn||(so&&cQ?.type==="text"))&&!nc&&<div style={{display:"flex",gap:8}}><input ref={ir} value={iv} onChange={e=>setIv(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sub()} placeholder={step===0?APP_TEXT.namePlaceholder:APP_TEXT.answerPlaceholder} style={{flex:1,background:C.card,border:`1.5px solid ${C.pillBd}`,borderRadius:12,padding:"12px 16px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.pillBd}/><button onClick={sub} style={{background:C.accent,border:"none",borderRadius:12,padding:"0 18px",color:C.white,fontWeight:700,fontSize:14,cursor:"pointer"}}>→</button></div>}
      </div>}</div></>;
}

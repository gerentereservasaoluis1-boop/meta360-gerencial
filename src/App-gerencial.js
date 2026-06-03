/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";

var G={bg:"#030304",card:"#0a0a0c",card2:"#111115",border:"#1c1c22",white:"#f4f4f6",muted:"#52525b",muted2:"#27272a",green:"#22c55e",amber:"#f59e0b",red:"#ef4444"};

function fR(v){ return "R$ "+Number(v||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}); }
function fRk(v){ v=v||0; if(v>=1000) return "R$"+(v/1000).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})+"k"; return "R$"+Math.round(v); }
function pRS(s){ return parseFloat(((s||"")+"").replace(/\./g,"").replace(",","."))||0; }
function dsk(ano,mes,dia){ return ano+"-"+String(mes+1).padStart(2,"0")+"-"+String(dia).padStart(2,"0"); }
function dim(ano,mes){ return new Date(ano,mes+1,0).getDate(); }
function dow(ano,mes,dia){ return new Date(ano,mes,dia).getDay(); }

/* ── FERIADOS SAO LUIS ── */
function getFeriados(ano){
  var a2=ano%19,b2=Math.floor(ano/100),c2=ano%100,d2=Math.floor(b2/4),e2=b2%4;
  var f2=Math.floor((b2+8)/25),g2=Math.floor((b2-f2+1)/3);
  var h2=(19*a2+b2-d2-g2+15)%30;
  var ii2=Math.floor(c2/4),k2=c2%4,l2=(32+2*e2+2*ii2-h2-k2)%7;
  var mm2=Math.floor((a2+11*h2+22*l2)/451);
  var pMonth=Math.floor((h2+l2-7*mm2+114)/31);
  var pDay=((h2+l2-7*mm2+114)%31)+1;
  var pasc=new Date(ano,pMonth-1,pDay);
  function addD(dt,n){ var x=new Date(dt); x.setDate(x.getDate()+n); return x; }
  function fmt(dt){ return dt.getFullYear()+"-"+String(dt.getMonth()+1).padStart(2,"0")+"-"+String(dt.getDate()).padStart(2,"0"); }
  var map={};
  var list=[
    [ano+"-01-01","Confraternizacao"],[ano+"-04-21","Tiradentes"],[ano+"-05-01","Dia do Trabalho"],
    [ano+"-09-07","Independencia"],[ano+"-10-12","N.Sra.Aparecida"],[ano+"-11-02","Finados"],
    [ano+"-11-15","Republica"],[ano+"-11-20","Consciencia Negra"],[ano+"-12-25","Natal"],
    [ano+"-01-20","Sao Sebastiao (SL)"],[ano+"-07-28","Aniversario de SL"],[ano+"-08-28","Sao Luis Rei"],
    [ano+"-09-08","N.Sra.de Nazare (SL)"],[ano+"-10-08","Sao Francisco (SL)"],
    [ano+"-01-02","Ponto Facultativo"],[ano+"-12-24","Vespera Natal"],[ano+"-12-31","Vespera Ano Novo"],
    [fmt(addD(pasc,-48)),"Segunda Carnaval"],[fmt(addD(pasc,-47)),"Terca Carnaval"],
    [fmt(addD(pasc,-2)),"Sexta-Feira Santa"],[fmt(pasc),"Pascoa"],[fmt(addD(pasc,60)),"Corpus Christi"],
  ];
  for(var i=0;i<list.length;i++){ map[list[i][0]]=list[i][1]; }
  return map;
}

/* ── SAZONALIDADES ── */
function getSazon(ano){
  var map={};
  function mark(base,dias,lbl,emoji){
    for(var i=-dias;i<=0;i++){
      var d=new Date(base.getFullYear(),base.getMonth(),base.getDate()+i);
      var k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
      if(!map[k]) map[k]={label:lbl,emoji:emoji};
    }
  }
  mark(new Date(ano,1,14),7,"Namorados","💕");
  mark(new Date(ano,4,10),10,"Dia das Maes","💐");
  mark(new Date(ano,5,12),10,"Namorados","💕");
  mark(new Date(ano,5,24),5,"Sao Joao","🎆");
  mark(new Date(ano,7,9),10,"Dia dos Pais","🎩");
  mark(new Date(ano,9,12),5,"Criancas","🎈");
  mark(new Date(ano,10,28),7,"Black Friday","🔥");
  mark(new Date(ano,11,24),12,"Natal","🎄");
  return map;
}

var BONIF=[
  {id:"meta",label:"100%",color:"#22c55e",bonif:1000,medal:"🥇"},
  {id:"extra",label:"110%",color:"#cd7f32",bonif:1500,medal:"🥉"},
  {id:"super",label:"120%",color:"#94a3b8",bonif:2000,medal:"🥈"},
  {id:"ouro",label:"130%",color:"#fbbf24",bonif:2500,medal:"🏅"},
];
var MS=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
var MESES=["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

/* ── LOCAL STORAGE ── */
function loadLS(k,d){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } }
function saveLS(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

function getCascata(base){
  var m0=base; var m1=Math.round(m0*1.10*100)/100;
  var m2=Math.round(m1*1.10*100)/100; var m3=Math.round(m2*1.10*100)/100;
  return [m0,m1,m2,m3];
}

/* ── GOAL ANIMATION ── */
function GoalAnim(props){
  var level=props.level; var onClose=props.onClose; var onGoHome=props.onGoHome;
  var [stage,setStage]=useState(0);
  var [count,setCount]=useState(0);
  var isPika=props.isPika;

  useEffect(function(){
    var t1=setTimeout(function(){setStage(1);},500);
    var t2=setTimeout(function(){setStage(2);},1400);
    var t3=setTimeout(function(){setStage(3);},3200);
    return function(){clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[]);

  useEffect(function(){
    if(stage!==2) return;
    var target=level.com||0; var steps=50; var cur=0; var ti;
    ti=setInterval(function(){ cur+=target/steps; if(cur>=target){setCount(target);clearInterval(ti);}else setCount(Math.round(cur)); },35);
    return function(){clearInterval(ti);};
  },[stage]);

  if(isPika) return (
    <div style={{position:"fixed",inset:0,zIndex:500,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <style>{"@keyframes rn{0%{transform:translateY(-60px) rotate(0);opacity:1}100%{transform:translateY(105vh) rotate(540deg);opacity:0}} @keyframes glg{0%,100%{text-shadow:0 0 30px #fbbf24}50%{text-shadow:0 0 80px #fbbf24}}"}</style>
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(function(i){
        return <div key={i} style={{position:"absolute",top:0,left:(i*13%101)+"%",fontSize:24,animation:"rn "+(1.2+i%5*.3)+"s "+(i*.12%1.8)+"s linear infinite",zIndex:1}}>
          {["💵","💰","💸","💎","🤑"][i%5]}
        </div>;
      })}
      <div style={{position:"relative",zIndex:10,textAlign:"center",padding:"0 28px"}}>
        <div style={{fontSize:52,fontWeight:900,color:"#fbbf24",animation:"glg 1.5s infinite",letterSpacing:-2,marginBottom:8}}>{fR(count||level.com)}</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginBottom:4}}>VOCE E</div>
        <div style={{fontSize:50,fontWeight:900,color:"#fbbf24",animation:"glg 1s infinite"}}>PIKAAA!</div>
        <div style={{fontSize:18,fontWeight:700,color:"#fff",marginTop:6}}>{props.nome?props.nome.toUpperCase():"GERENTE"}! 🎉</div>
        <button onClick={function(){onClose();if(onGoHome)onGoHome();}} style={{marginTop:20,padding:"14px 48px",borderRadius:20,background:"linear-gradient(135deg,#fbbf24,#d97706)",border:"none",color:"#000",fontWeight:900,fontSize:16,cursor:"pointer"}}>FECHAR</button>
      </div>
    </div>
  );

  var nextB=BONIF.filter(function(b){return b.bonif>level.bonif;})[0]||null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:500,background:"radial-gradient(ellipse at 50% 0%,#101010,#000)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <style>{"@keyframes bI{0%{transform:scale(0);opacity:0}65%{transform:scale(1.15);}100%{opacity:1;transform:scale(1)}} @keyframes cU{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes rL{0%{transform:translateY(-60px);opacity:1}100%{transform:translateY(105vh);opacity:0}}"}</style>
      {stage>=1&&[0,1,2,3,4].map(function(i){
        return <div key={i} style={{position:"absolute",top:0,left:(i*20%100)+"%",fontSize:14,animation:"rL "+(1.4+i*.3)+"s "+(i*.2)+"s linear infinite",opacity:.4,zIndex:0}}>💰</div>;
      })}
      <div style={{textAlign:"center",padding:"0 26px",width:"100%",maxWidth:360,position:"relative",zIndex:2}}>
        {stage>=0&&<div style={{fontSize:100,animation:"bI .7s ease both",marginBottom:8,filter:"drop-shadow(0 0 32px "+level.color+")"}}>{level.medal}</div>}
        {stage>=1&&<div style={{animation:"cU .5s ease both",marginBottom:8}}>
          <div style={{fontSize:12,color:level.color,fontWeight:800,letterSpacing:3,marginBottom:5}}>{level.label} BATIDA!</div>
          <div style={{fontSize:38,fontWeight:900,color:"#fff",lineHeight:1}}>{fR(level.metaVal||0)}</div>
        </div>}
        {stage>=2&&<div style={{background:level.color+"20",border:"2px solid "+level.color,borderRadius:20,padding:"16px",marginBottom:10}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,.6)",marginBottom:4}}>COMISSAO ACUMULADA</div>
          <div style={{fontSize:42,fontWeight:900,color:level.color,lineHeight:1,letterSpacing:-1}}>{fR(count)}</div>
        </div>}
        {stage>=3&&<div style={{animation:"cU .5s ease both",width:"100%"}}>
          {nextB&&<div style={{background:nextB.color+"20",border:"2px solid "+nextB.color+"55",borderRadius:18,padding:"12px",marginBottom:12,textAlign:"left"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,.5)",marginBottom:4}}>PROXIMO NIVEL</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:24}}>{nextB.medal}</span>
              <div><div style={{fontSize:15,fontWeight:900,color:nextB.color}}>{nextB.label}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>Bonus: {fR(nextB.bonif)}</div></div>
            </div>
          </div>}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {nextB&&<button onClick={function(){onClose();if(onGoHome)onGoHome();}} style={{padding:"14px",borderRadius:14,background:"linear-gradient(135deg,"+nextB.color+","+nextB.color+"bb)",border:"none",color:"#000",fontWeight:900,fontSize:15,cursor:"pointer"}}>RUMO A {nextB.label}!</button>}
            <button onClick={function(){onClose();if(onGoHome)onGoHome();}} style={{padding:"11px",borderRadius:14,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.4)",fontWeight:600,fontSize:12,cursor:"pointer"}}>Fechar</button>
          </div>
        </div>}
      </div>
    </div>
  );
}

export default function App(){
  var hoje=new Date();
  var anoG=hoje.getFullYear(); var mesG=hoje.getMonth(); var diaG=hoje.getDate();

  /* ── STATE ── */
  var [cfg,setCfgRaw]=useState(function(){ return loadLS("m360ger_cfg",{nome:"Gerente",metaLoja:350000,diasTrab:22,foto:null,mes:mesG,ano:anoG}); });
  function setCfg(p){ setCfgRaw(function(prev){ var n=Object.assign({},prev,p); saveLS("m360ger_cfg",n); return n; }); }

  var [vendasG,setVendasGRaw]=useState(function(){ return loadLS("m360ger_vendas",{}); });
  function setVendasG(fn){ setVendasGRaw(function(p){ var n=typeof fn==="function"?fn(p):fn; saveLS("m360ger_vendas",n); return n; }); }

  var [page,setPage]=useState("home");
  var [showAtu,setShowAtu]=useState(false);
  var [atuDia,setAtuDia]=useState("");
  var [atuQtd,setAtuQtd]=useState("");

  var [mediasG,setMediasGRaw]=useState(function(){ return loadLS("m360ger_medias",{}); });
  function setMediasG(fn){ setMediasGRaw(function(p){ var n=typeof fn==="function"?fn(p):fn; saveLS("m360ger_medias",n); return n; }); }
  var [mediaEdit,setMediaEdit]=useState(null);
  var [mediaVal,setMediaVal]=useState("");

  var [goalAnim,setGoalAnim]=useState(null);
  var prevNivel=useRef(-1);

  var [ferModal,setFerModal]=useState(null);

  /* ── CALC ── */
  var metaLoja=cfg.metaLoja||350000;
  var diasEf=cfg.diasTrab||22;
  var mes=cfg.mes!=null?cfg.mes:mesG;
  var ano=cfg.ano||anoG;
  var diasNoMes=dim(ano,mes);
  var prefixG=ano+"-"+String(mes+1).padStart(2,"0");

  var feriados=getFeriados(ano);
  var sazon=getSazon(ano);

  /* total vendido = soma das vendas do mes */
  var totalVendasG=Object.keys(vendasG).filter(function(k){ return k.indexOf(prefixG)===0; }).reduce(function(a,k){ return a+(vendasG[k]||0); },0);

  /* dias decorridos e dias restantes */
  var diasDecor=0; var diasRest=0;
  for(var di=1;di<=diasNoMes;di++){
    var dw=dow(ano,mes,di);
    var ds2=dsk(ano,mes,di);
    var isFer=feriados[ds2]!==undefined;
    if(dw===0||dw===6||isFer) continue; /* skip dom/sab/feriado */
    if(ano===anoG&&mes===mesG&&di<=diaG) diasDecor++;
    else if(ano===anoG&&mes===mesG&&di>diaG) diasRest++;
    else if(ano<anoG||(ano===anoG&&mes<mesG)) diasDecor++;
    else diasRest++;
  }
  var diasRestEf=Math.max(0, diasEf - diasDecor);

  var vendido=totalVendasG;
  var cascata=getCascata(metaLoja);
  var pct=metaLoja>0?(vendido/metaLoja)*100:0;
  var comissao=vendido*0.01;

  /* diaria original e redistribuida */
  var diariaOriginal=diasEf>0?metaLoja/diasEf:0;
  var restante=Math.max(0,metaLoja-vendido);
  var diariaHoje=diasRestEf>0?restante/diasRestEf:0;

  var projecao=diasDecor>0?(vendido/diasDecor)*diasEf:0;

  var nivelAtual=null;
  for(var ni=cascata.length-1;ni>=0;ni--){ if(vendido>=cascata[ni]){nivelAtual=BONIF[ni];break;} }
  var proxNivel=null;
  for(var pi=0;pi<cascata.length;pi++){ if(vendido<cascata[pi]){proxNivel=BONIF[pi];break;} }

  /* ── CHECK GOAL ── */
  useEffect(function(){
    var cur=-1; for(var i=0;i<cascata.length;i++){if(vendido>=cascata[i])cur=i;}
    if(prevNivel.current>=0&&cur>prevNivel.current&&cur>=0){
      var b=BONIF[cur];
      setGoalAnim({id:b.id,label:b.label,color:b.color,bonif:b.bonif,medal:b.medal,com:comissao,metaVal:cascata[cur]});
    }
    prevNivel.current=cur;
  },[vendido]);

  /* ── MEDIAS ── */
  var mediaAnual=MS.map(function(_m,i){
    var key=ano+"-"+i;
    var entry=mediasG[key]||{};
    var metaM=entry.meta!=null?entry.meta:null;
    var vendeuM=i===mes&&ano===anoG&&totalVendasG>0?totalVendasG:(entry.vendeu!=null?entry.vendeu:null);
    var metaBase=metaM!=null?metaM:metaLoja;
    var resultado=vendeuM!=null?vendeuM-metaBase:null;
    var pctM=metaBase>0&&vendeuM!=null?(vendeuM/metaBase)*100:null;
    var isAuto=i===mes&&ano===anoG&&totalVendasG>0;
    return {mes:i,metaM:metaM,vendeuM:vendeuM,resultado:resultado,pctM:pctM,key:key,isAuto:isAuto};
  });
  var comV=mediaAnual.filter(function(m){ return m.vendeuM!=null; });
  var fatAnual=comV.reduce(function(a,m){ return a+(m.vendeuM||0); },0);
  var metaAnualT=comV.reduce(function(a,m){ return a+(m.metaM!=null?m.metaM:metaLoja); },0)||metaLoja;
  var pctAnual=metaAnualT>0?(fatAnual/metaAnualT)*100:0;

  function commitMedia(){
    if(!mediaEdit) return;
    var v=pRS(mediaVal);
    setMediasG(function(p){
      var prev=p[mediaEdit.key]||{};
      var upd=Object.assign({},prev);
      if(mediaVal===""){ delete upd[mediaEdit.field]; } else { upd[mediaEdit.field]=v; }
      var r=Object.assign({},p); r[mediaEdit.key]=upd; return r;
    });
    setMediaEdit(null);
  }

  /* ── CALENDAR HELPERS ── */
  function isNT(ds){ return feriados[ds]!==undefined; }
  function isFimSem(ano2,mes2,di2){ var dw2=dow(ano2,mes2,di2); return dw2===0||dw2===6; }

  return (
    <div style={{minHeight:"100vh",background:G.bg,color:G.white,fontFamily:"'Sora',sans-serif",paddingBottom:90,maxWidth:420,margin:"0 auto",position:"relative",overflow:"hidden"}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap'); *{box-sizing:border-box;margin:0;padding:0} button{cursor:pointer;font-family:inherit} input{font-family:inherit} input:focus{outline:none} .tap:active{transform:scale(.96)} @keyframes fUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} .fu{animation:fUp .3s ease}"}</style>

      {goalAnim&&<GoalAnim level={goalAnim} onClose={function(){setGoalAnim(null);}} onGoHome={function(){setPage("home");}} nome={cfg.nome} isPika={pct>=130}/>}

      {/* ══ HOME ══ */}
      {page==="home"&&(
        <div className="fu" style={{position:"relative",zIndex:1}}>
          <div style={{padding:"48px 20px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={function(){setPage("config");}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:"#111",border:"2px solid rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"rgba(255,255,255,.5)"}}>
                {(cfg.nome||"G").charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{fontSize:10,color:G.muted}}>Gerencial 👋</div>
                <div style={{fontSize:16,fontWeight:900}}>{cfg.nome||"Gerente"}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>Gerente de Vendas</div>
              </div>
            </div>
            <div style={{background:G.card2,border:"1px solid "+(nivelAtual?nivelAtual.color+"44":G.border),borderRadius:10,padding:"5px 10px",fontSize:10,fontWeight:700,color:nivelAtual?nivelAtual.color:G.muted}}>
              {nivelAtual?nivelAtual.medal+" "+nivelAtual.label+" ✅":"Sem nivel"}
            </div>
          </div>

          {/* HERO */}
          <div style={{margin:"0 20px",borderRadius:22,padding:"20px",background:"linear-gradient(135deg,#111115,#0a0a0c)",border:"1.5px solid rgba(255,255,255,.1)",boxShadow:"0 16px 48px rgba(0,0,0,.8)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,.35)",fontWeight:700,letterSpacing:1}}>FATURAMENTO DA LOJA</div>
              <div style={{position:"relative",width:56,height:56}}>
                <svg width="56" height="56" viewBox="0 0 56 56" style={{transform:"rotate(-90deg)"}}>
                  <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="5"/>
                  <circle cx="28" cy="28" r="22" fill="none" stroke={pct>=100?"#22c55e":pct>=65?"#f59e0b":"rgba(255,255,255,.55)"} strokeWidth="5"
                    strokeDasharray={String(2*Math.PI*22*Math.min(100,pct)/100)+" "+String(2*Math.PI*22)} strokeLinecap="round" style={{transition:"stroke-dasharray 1s ease"}}/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:pct>=100?"#22c55e":pct>=65?"#f59e0b":"rgba(255,255,255,.8)"}}>{Math.round(pct)}%</div>
              </div>
            </div>
            <div style={{fontSize:9,color:"rgba(255,255,255,.3)",fontWeight:600,marginBottom:2}}>META DA LOJA</div>
            <div style={{fontSize:30,fontWeight:900,color:"#fff",letterSpacing:-1,marginBottom:6}}>{fR(metaLoja)}</div>
            <div style={{height:1,background:"rgba(255,255,255,.08)",marginBottom:8}}/>
            <div style={{fontSize:9,color:"rgba(255,255,255,.3)",fontWeight:600,marginBottom:2}}>VENDIDO</div>
            <div style={{fontSize:20,fontWeight:900,color:pct>=100?"#4ade80":"#fff",marginBottom:6}}>
              {vendido>0?fR(vendido):<span style={{color:"rgba(255,255,255,.25)",fontSize:15}}>Toque 🔄 para lancar por dia</span>}
            </div>
            <div style={{height:5,background:"rgba(255,255,255,.07)",borderRadius:3,overflow:"hidden",marginBottom:5}}>
              <div style={{height:"100%",width:Math.min(100,pct)+"%",background:pct>=100?"#22c55e":pct>=65?"#f59e0b":"rgba(255,255,255,.5)",borderRadius:3,transition:"width .8s"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:10}}>
              <span style={{color:"rgba(255,255,255,.5)",fontWeight:700}}>{pct.toFixed(1)}%{proxNivel?" → "+proxNivel.label:" 🏆"}</span>
              <span style={{color:projecao>=metaLoja?"rgba(34,197,94,.7)":"rgba(255,100,100,.7)"}}>{projecao>=metaLoja?"✅ Vai bater":"⚠️ Abaixo"}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
              <div style={{background:"rgba(255,255,255,.05)",borderRadius:10,padding:"8px 9px"}}>
                <div style={{fontSize:7,color:"rgba(255,255,255,.3)",fontWeight:700,marginBottom:2}}>FALTA META</div>
                <div style={{fontSize:11,fontWeight:900,color:"#fff"}}>{vendido>=metaLoja?"✅":fRk(metaLoja-vendido)}</div>
              </div>
              <div style={{background:"rgba(255,255,255,.05)",borderRadius:10,padding:"8px 9px"}}>
                <div style={{fontSize:7,color:"rgba(255,255,255,.3)",fontWeight:700,marginBottom:2}}>DIARIA ↺</div>
                <div style={{fontSize:11,fontWeight:900,color:diariaHoje>diariaOriginal?"#f59e0b":"#fff"}}>{fRk(diariaHoje)}</div>
              </div>
              <div style={{background:"rgba(255,255,255,.07)",borderRadius:10,padding:"8px 9px",border:"1px solid rgba(255,255,255,.08)"}}>
                <div style={{fontSize:7,color:"rgba(255,255,255,.3)",fontWeight:700,marginBottom:2}}>PROJECAO</div>
                <div style={{fontSize:11,fontWeight:900,color:projecao>=metaLoja?"#4ade80":"#fff"}}>{fRk(projecao)}</div>
                <div style={{fontSize:7,color:projecao>=metaLoja?"rgba(34,197,94,.6)":"rgba(255,100,100,.6)",marginTop:1}}>{projecao>=metaLoja?"✅":"⚠️"}</div>
              </div>
            </div>
          </div>

          {/* COMISSAO */}
          <div style={{margin:"10px 20px 0",background:"linear-gradient(135deg,#052012,#081810)",border:"1px solid rgba(34,197,94,.35)",borderRadius:18,padding:"16px"}}>
            <div style={{fontSize:9,color:G.green,fontWeight:700,letterSpacing:2,marginBottom:6}}>💰 COMISSAO ACUMULADA</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,.4)",marginBottom:4}}>1% SOBRE O FATURAMENTO</div>
            <div style={{fontSize:52,fontWeight:900,color:"#4ade80",lineHeight:1,letterSpacing:-2,textShadow:"0 0 40px rgba(74,222,128,.9)",marginBottom:6}}>{fR(comissao)}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:10}}>sobre {fR(vendido)} vendido</div>
            <div style={{height:5,background:"rgba(34,197,94,.1)",borderRadius:3,overflow:"hidden",marginBottom:6}}>
              <div style={{height:"100%",width:Math.min(100,pct)+"%",background:"linear-gradient(90deg,#22c55e,#16a34a)",borderRadius:3,boxShadow:"0 0 10px rgba(34,197,94,.4)",transition:"width .8s"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,.4)"}}>
              <span>{pct.toFixed(1)}% da meta</span>
              <span style={{color:"rgba(34,197,94,.7)",fontWeight:700}}>{vendido>=metaLoja?"✅ Meta batida!":proxNivel?"Proximo: +R$"+proxNivel.bonif+" ("+proxNivel.label+")":"🏆"}</span>
            </div>
          </div>

          {/* CASCATA */}
          <div style={{margin:"12px 20px 4px",fontSize:12,fontWeight:800}}>Metas em Cascata</div>
          <div style={{display:"flex",gap:10,overflowX:"auto",padding:"0 20px 8px"}}>
            {cascata.map(function(metaN,i){
              var b=BONIF[i]; var atingiu=vendido>=metaN;
              var pctN=metaN>0?Math.min(100,(vendido/metaN)*100):0;
              var com=metaN*0.01+b.bonif;
              return <div key={i} style={{flexShrink:0,width:160,background:G.card,border:"1px solid "+(atingiu?b.color+"55":G.border),borderRadius:16,padding:"14px"}}>
                <div style={{fontSize:22}}>{b.medal}</div>
                <div style={{fontSize:11,fontWeight:800,color:atingiu?b.color:G.muted,marginTop:4}}>{b.label} {atingiu?"✅":""}</div>
                <div style={{fontSize:15,fontWeight:900,color:"#fff",marginTop:2}}>{fRk(metaN)}</div>
                <div style={{fontSize:8,color:G.muted,marginTop:6,marginBottom:2}}>comissao + bonus</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.5)"}}>{fR(metaN*0.01)} + {fR(b.bonif)}</div>
                <div style={{fontSize:20,fontWeight:900,color:atingiu?"#4ade80":"#22c55e",lineHeight:1,marginTop:3,textShadow:atingiu?"0 0 20px rgba(74,222,128,.6)":"none"}}>{fR(com)}</div>
                <div style={{marginTop:8,height:3,background:G.muted2,borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:pctN+"%",background:atingiu?b.color:"rgba(255,255,255,.2)",borderRadius:2}}/>
                </div>
                <div style={{fontSize:8,color:G.muted,marginTop:2}}>{pctN.toFixed(0)}%{!atingiu?" — falta "+fRk(metaN-vendido):""}</div>
              </div>;
            })}
          </div>
        </div>
      )}

      {/* ══ CALENDARIO ══ */}
      {page==="calendario"&&(
        <div className="fu" style={{position:"relative",zIndex:1,padding:"52px 0 0"}}>
          <div style={{padding:"0 20px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:20,fontWeight:900}}>{MESES[mes]} {ano}</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={function(){var m2=mes-1; var a2=ano; if(m2<0){m2=11;a2--;} setCfg({mes:m2,ano:a2});}} style={{width:32,height:32,borderRadius:8,border:"1px solid "+G.border,background:G.card2,color:G.muted,fontSize:16,fontWeight:700}}>‹</button>
              <button onClick={function(){var m2=mes+1; var a2=ano; if(m2>11){m2=0;a2++;} setCfg({mes:m2,ano:a2});}} style={{width:32,height:32,borderRadius:8,border:"1px solid "+G.border,background:G.card2,color:G.muted,fontSize:16,fontWeight:700}}>›</button>
            </div>
          </div>

          {/* cabecalho dias */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",padding:"0 16px",marginBottom:4}}>
            {["D","S","T","Q","Q","S","S"].map(function(d,i){
              return <div key={i} style={{textAlign:"center",fontSize:11,fontWeight:700,color:i===0||i===6?G.red:G.muted,padding:"4px 0"}}>{d}</div>;
            })}
          </div>

          {/* dias */}
          <div style={{padding:"0 16px"}}>
            {(function(){
              var rows=[]; var cells=[];
              var firstDow=dow(ano,mes,1);
              for(var fi=0;fi<firstDow;fi++) cells.push(<div key={"e"+fi}/>);
              for(var di2=1;di2<=diasNoMes;di2++){
                var ds3=dsk(ano,mes,di2);
                var dw3=dow(ano,mes,di2);
                var isFer3=feriados[ds3]!==undefined;
                var isSazon=sazon[ds3]!==undefined;
                var isWknd=dw3===0||dw3===6;
                var isHoje3=di2===diaG&&mes===mesG&&ano===anoG;
                var temVenda=vendasG[ds3]>0;
                var semVenda=!temVenda&&!isWknd&&!isFer3&&(ano<anoG||(ano===anoG&&mes<mesG)||(ano===anoG&&mes===mesG&&di2<diaG));
                var venda=vendasG[ds3]||0;

                var bg="transparent"; var numC=isWknd?G.muted2:G.white;
                if(isFer3){ bg="rgba(139,92,246,.15)"; numC="#a78bfa"; }
                else if(isHoje3){ bg="rgba(255,255,255,.12)"; numC="#fff"; }
                else if(temVenda){ bg="rgba(34,197,94,.12)"; numC="#4ade80"; }
                else if(semVenda){ bg="rgba(239,68,68,.1)"; numC=G.red; }

                var cell=(
                  <div key={di2} onClick={function(d3,ds4,fer3,isFer4){ return function(){
                    if(isFer4){ setFerModal({dia:d3,nome:feriados[ds4],ds:ds4}); return; }
                    if(!isWknd){ setAtuDia(ds4); setAtuQtd(vendasG[ds4]>0?String(vendasG[ds4]):""); setShowAtu(true); }
                  };}(di2,ds3,feriados[ds3],isFer3)}
                    style={{background:bg,borderRadius:8,padding:"4px 2px",minHeight:52,display:"flex",flexDirection:"column",alignItems:"center",cursor:isWknd?"default":"pointer",position:"relative"}}>
                    <div style={{fontSize:12,fontWeight:isHoje3?900:600,color:numC,lineHeight:1,marginTop:2}}>{di2}</div>
                    {temVenda&&<div style={{fontSize:8,fontWeight:900,color:numC,marginTop:2}}>{fRk(venda).replace("R$","")}</div>}
                    {semVenda&&<div style={{fontSize:7,fontWeight:800,color:G.red,marginTop:2,background:"rgba(239,68,68,.2)",borderRadius:3,padding:"1px 3px"}}>FALTA</div>}
                    {isFer3&&<div style={{fontSize:10,marginTop:1}}>🏛️</div>}
                    {isSazon&&!isFer3&&<div style={{fontSize:10,marginTop:1}}>{sazon[ds3].emoji}</div>}
                  </div>
                );
                cells.push(cell);
                if(cells.length===7||(di2===diasNoMes)){
                  while(cells.length<7) cells.push(<div key={"p"+cells.length}/>);
                  rows.push(<div key={"r"+di2} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:3}}>{cells}</div>);
                  cells=[];
                }
              }
              return rows;
            })()}
          </div>

          {/* legenda */}
          <div style={{display:"flex",gap:12,padding:"10px 20px",flexWrap:"wrap"}}>
            {[[G.green,"Com venda"],[G.red,"Falta"],[G.muted2,"Fim de semana"],["#a78bfa","Feriado"]].map(function(item,i){
              return <div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:G.muted}}>
                <div style={{width:8,height:8,borderRadius:2,background:item[0]}}/>
                {item[1]}
              </div>;
            })}
          </div>

          {/* sazonalidades do mes */}
          {(function(){
            var evs={};
            for(var di3=1;di3<=diasNoMes;di3++){
              var ds4=dsk(ano,mes,di3);
              if(sazon[ds4]&&!evs[sazon[ds4].label]) evs[sazon[ds4].label]=sazon[ds4];
            }
            var evList=Object.keys(evs);
            if(!evList.length) return null;
            return <div style={{margin:"4px 20px 8px",background:G.card,border:"1px solid "+G.border,borderRadius:14,padding:"10px 14px"}}>
              <div style={{fontSize:9,color:G.muted,fontWeight:700,marginBottom:6,letterSpacing:1}}>SAZONALIDADES</div>
              {evList.map(function(lbl,i){
                return <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:11,marginBottom:4}}>
                  <span style={{fontSize:16}}>{evs[lbl].emoji}</span>
                  <span style={{color:G.white,fontWeight:700}}>{lbl}</span>
                </div>;
              })}
            </div>;
          })()}
        </div>
      )}

      {/* ══ MEDIAS ══ */}
      {page==="medias"&&(
        <div className="fu" style={{position:"relative",zIndex:1,padding:"52px 20px 0"}}>
          <div style={{fontSize:22,fontWeight:900,marginBottom:2}}>📊 Planilha de Medias</div>
          <div style={{fontSize:11,color:G.muted,marginBottom:12}}>{ano} · Toque para editar</div>
          <div style={{background:"linear-gradient(135deg,#052012,#081810)",border:"1px solid rgba(34,197,94,.4)",borderRadius:18,padding:"14px",marginBottom:12}}>
            <div style={{fontSize:10,color:G.green,fontWeight:700,letterSpacing:2,marginBottom:10}}>RESUMO ANUAL {ano}</div>
            <div style={{textAlign:"center",marginBottom:10}}>
              <div style={{fontSize:9,color:G.muted,marginBottom:4}}>% ANUAL ({comV.length} meses)</div>
              <div style={{fontSize:40,fontWeight:900,color:pctAnual>=100?G.green:pctAnual>=65?G.amber:G.red,lineHeight:1,letterSpacing:-1}}>{pctAnual.toFixed(1)}%</div>
            </div>
            <div style={{height:6,background:"rgba(255,255,255,.08)",borderRadius:3,overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",width:Math.min(100,pctAnual)+"%",background:pctAnual>=100?G.green:G.amber,borderRadius:3}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
              {[["TOTAL META",fRk(metaAnualT),G.muted],["FATURADO",fRk(fatAnual),G.green],["MEDIA/MES",comV.length>0?fRk(fatAnual/comV.length):"—",G.green]].map(function(item,i){
                return <div key={i} style={{background:"rgba(0,0,0,.3)",borderRadius:10,padding:"8px"}}>
                  <div style={{fontSize:7,color:G.muted,fontWeight:600,marginBottom:2}}>{item[0]}</div>
                  <div style={{fontSize:12,fontWeight:900,color:item[2]}}>{item[1]}</div>
                </div>;
              })}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"38px 1fr 1fr 44px 50px",gap:3,padding:"6px 10px",background:G.card2,borderRadius:"10px 10px 0 0",border:"1px solid "+G.border,borderBottom:"none"}}>
            {["MES","META","VENDIDO","%MES","RES."].map(function(h,hi){
              return <div key={hi} style={{fontSize:7,color:G.muted,fontWeight:700,textAlign:hi>0?"center":"left"}}>{h}</div>;
            })}
          </div>
          <div style={{background:G.card,border:"1px solid "+G.border,borderRadius:"0 0 18px 18px",overflow:"hidden",marginBottom:8}}>
            {mediaAnual.map(function(m,i){
              var isAtual=i===mes&&ano===anoG;
              var pc=m.pctM!=null?(m.pctM>=100?"#4ade80":m.pctM>=65?G.amber:G.red):G.muted2;
              var rc=m.resultado!=null?(m.resultado>=0?"#4ade80":G.red):G.muted2;
              var eM=mediaEdit&&mediaEdit.key===m.key&&mediaEdit.field==="meta";
              var eV=mediaEdit&&mediaEdit.key===m.key&&mediaEdit.field==="vendeu";
              var autoPct=m.vendeuM!=null&&(m.metaM!=null?m.metaM:metaLoja)>0?(m.vendeuM/(m.metaM!=null?m.metaM:metaLoja)*100):null;
              return (
                <div key={i} style={{borderBottom:i<11?"1px solid "+G.border+"55":"none",background:isAtual?"rgba(34,197,94,.05)":"transparent"}}>
                  <div style={{display:"grid",gridTemplateColumns:"38px 1fr 1fr 44px 50px",gap:3,padding:"8px 10px",alignItems:"center"}}>
                    <div style={{fontSize:11,fontWeight:700,color:isAtual?"#4ade80":i>mes&&ano===anoG?G.muted2:G.white}}>{MS[i]}</div>
                    <div style={{textAlign:"center"}}>
                      {eM
                        ? <input autoFocus type="text" inputMode="decimal" value={mediaVal} onChange={function(e){setMediaVal(e.target.value);}} onBlur={commitMedia} onKeyDown={function(e){if(e.key==="Enter")commitMedia();}} style={{width:"100%",background:G.card2,border:"1px solid #3b82f6",borderRadius:6,padding:"3px 4px",fontSize:10,fontWeight:700,color:"#3b82f6",textAlign:"center"}}/>
                        : <button onClick={function(){setMediaEdit({key:m.key,field:"meta"});setMediaVal(m.metaM!=null?String(m.metaM):"");}} style={{background:"transparent",border:"1px solid "+(m.metaM!=null?"rgba(255,255,255,.15)":G.border),borderRadius:6,padding:"4px",color:m.metaM!=null?"rgba(255,255,255,.6)":G.muted2,fontSize:9,fontWeight:700,width:"100%"}}>
                            {m.metaM!=null?fRk(m.metaM):"—"}
                          </button>}
                    </div>
                    <div style={{textAlign:"center"}}>
                      {m.isAuto
                        ? <div style={{background:pc+"15",border:"1px solid "+pc+"44",borderRadius:6,padding:"4px",color:pc,fontSize:9,fontWeight:900}}>
                            {fRk(m.vendeuM)}<div style={{fontSize:5,color:pc+"88",marginTop:1}}>auto</div>
                          </div>
                        : eV
                          ? <input autoFocus type="text" inputMode="decimal" value={mediaVal} onChange={function(e){setMediaVal(e.target.value);}} onBlur={commitMedia} onKeyDown={function(e){if(e.key==="Enter")commitMedia();}} style={{width:"100%",background:G.card2,border:"1px solid rgba(34,197,94,.5)",borderRadius:6,padding:"3px 4px",fontSize:10,fontWeight:700,color:G.green,textAlign:"center"}}/>
                          : <button onClick={function(){setMediaEdit({key:m.key,field:"vendeu"});setMediaVal(m.vendeuM!=null?String(m.vendeuM):"");}} style={{background:m.vendeuM!=null?pc+"15":"transparent",border:"1px solid "+(m.vendeuM!=null?pc+"44":G.border),borderRadius:6,padding:"4px",color:m.vendeuM!=null?pc:G.muted2,fontSize:9,fontWeight:700,width:"100%"}}>
                              {m.vendeuM!=null?fRk(m.vendeuM):"—"}
                            </button>}
                    </div>
                    <div style={{textAlign:"center"}}>
                      {autoPct!=null
                        ? <div style={{fontSize:10,fontWeight:900,color:autoPct>=100?"#4ade80":autoPct>=65?G.amber:G.red,lineHeight:1}}>{autoPct.toFixed(0)}%</div>
                        : <div style={{fontSize:9,color:G.muted2}}>—</div>}
                    </div>
                    <div style={{textAlign:"center"}}>
                      {m.resultado!=null
                        ? <div style={{fontSize:9,fontWeight:900,color:rc}}>{m.resultado>=0?"+":""}{fRk(m.resultado)}</div>
                        : <div style={{fontSize:9,color:G.muted2}}>—</div>}
                    </div>
                  </div>
                  {autoPct!=null&&(
                    <div style={{padding:"0 10px 5px"}}>
                      <div style={{height:2,background:G.muted2,borderRadius:1,overflow:"hidden"}}>
                        <div style={{height:"100%",width:Math.min(100,autoPct)+"%",background:pc,borderRadius:1}}/>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ CONFIG ══ */}
      {page==="config"&&(
        <div className="fu" style={{position:"relative",zIndex:1,padding:"52px 20px 0"}}>
          <div style={{fontSize:22,fontWeight:900,marginBottom:16}}>⚙️ Configuracoes</div>
          <div onClick={function(){setShowAtu(true);setAtuDia("");setAtuQtd("");setPage("home");}}
            style={{background:"linear-gradient(135deg,#0a1a0a,#0f1f0f)",border:"1px solid rgba(34,197,94,.35)",borderRadius:16,padding:"14px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
            <div style={{width:42,height:42,borderRadius:12,background:"rgba(34,197,94,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🔄</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:800,color:G.green}}>Atualizar Faturamento</div>
              <div style={{fontSize:10,color:G.muted,marginTop:2}}>Lancar ou corrigir vendas por dia</div>
            </div>
            <div style={{fontSize:20,color:G.muted}}>›</div>
          </div>
          <div style={{background:G.card,border:"1px solid rgba(255,255,255,.1)",borderRadius:18,padding:"16px",marginBottom:10}}>
            <div style={{fontSize:9,color:G.muted,fontWeight:600,marginBottom:10}}>PERFIL</div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:9,color:G.muted,fontWeight:600,marginBottom:5}}>NOME</div>
              <input value={cfg.nome||""} onChange={function(e){setCfg({nome:e.target.value});}} style={{width:"100%",background:G.card2,border:"1px solid "+G.border,borderRadius:10,padding:"10px 12px",fontSize:14,color:G.white,fontWeight:700}}/>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:9,color:G.muted,fontWeight:600,marginBottom:5}}>META DA LOJA (R$)</div>
              {(function(){
                var metaStr=cfg.metaStr!=null?cfg.metaStr:String(cfg.metaLoja||350000);
                return <div style={{position:"relative"}}>
                  <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,fontWeight:800,color:G.white,pointerEvents:"none"}}>R$</div>
                  <input type="text" inputMode="decimal" value={metaStr}
                    onChange={function(e){
                      var raw=e.target.value.replace(/[^0-9]/g,"");
                      setCfg({metaStr:raw});
                      if(raw.length>0){ var v=parseInt(raw,10); if(v>0) setCfg({metaLoja:v,metaStr:raw}); }
                    }}
                    onBlur={function(){
                      var v=pRS(cfg.metaStr||"");
                      if(v>0){ setCfg({metaLoja:v,metaStr:String(v)}); }
                      else{ setCfg({metaLoja:350000,metaStr:"350000"}); }
                    }}
                    placeholder="350000" style={{width:"100%",background:G.card2,border:"1px solid rgba(255,255,255,.12)",borderRadius:12,padding:"12px 12px 12px 38px",fontSize:20,fontWeight:900,color:G.white}}/>
                </div>;
              })()}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:12,fontWeight:700}}>Dias Uteis</div><div style={{fontSize:9,color:G.muted}}>no periodo</div></div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <button onClick={function(){setCfg({diasTrab:Math.max(1,diasEf-1)});}} style={{width:32,height:32,borderRadius:8,border:"1px solid "+G.border,background:G.card2,color:G.muted,fontSize:16,fontWeight:700}}>−</button>
                <span style={{fontSize:20,fontWeight:900,color:G.white,minWidth:32,textAlign:"center"}}>{diasEf}</span>
                <button onClick={function(){setCfg({diasTrab:diasEf+1});}} style={{width:32,height:32,borderRadius:8,border:"1px solid "+G.border,background:G.card2,color:G.muted,fontSize:16,fontWeight:700}}>+</button>
              </div>
            </div>
          </div>
          <div style={{background:G.card,border:"1px solid rgba(255,255,255,.1)",borderRadius:18,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+G.border,display:"flex",justifyContent:"space-between"}}>
              <div style={{fontSize:11,fontWeight:800}}>Metas em Cascata</div>
              <div style={{fontSize:9,color:G.muted}}>+10% cada nivel</div>
            </div>
            {cascata.map(function(metaN,i){
              var b=BONIF[i]; var atingiu=vendido>=metaN;
              var pctN=metaN>0?Math.min(100,(vendido/metaN)*100):0;
              var com=metaN*0.01+b.bonif;
              return (
                <div key={i} style={{borderBottom:i<3?"1px solid "+G.border:"none",background:atingiu?b.color+"08":"transparent"}}>
                  <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:38,height:38,borderRadius:10,background:atingiu?b.color+"20":G.card2,border:"1px solid "+(atingiu?b.color+"55":G.border),display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{b.medal}</div>
                      <div>
                        <div style={{fontSize:12,fontWeight:800,color:atingiu?b.color:G.muted}}>{b.label} {atingiu?"✅":""}</div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,.7)"}}>{fR(metaN)}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:8,color:G.muted,marginBottom:2}}>comissao + bonus</div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,.5)"}}>{fR(metaN*0.01)} + {fR(b.bonif)}</div>
                      <div style={{fontSize:20,fontWeight:900,color:atingiu?"#4ade80":"#22c55e",lineHeight:1,marginTop:3}}>{fR(com)}</div>
                    </div>
                  </div>
                  <div style={{padding:"0 16px 8px"}}>
                    <div style={{height:3,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden",marginBottom:3}}>
                      <div style={{height:"100%",width:pctN+"%",background:atingiu?b.color:"rgba(255,255,255,.2)",borderRadius:2}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:G.muted}}>
                      <span>{pctN.toFixed(1)}%</span>
                      {!atingiu&&<span>Falta {fR(Math.max(0,metaN-vendido))}</span>}
                      {atingiu&&<span style={{color:"#4ade80",fontWeight:700}}>💰 {fR(com)}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ MODAL FERIADO ══ */}
      {ferModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:"0 24px"}} onClick={function(){setFerModal(null);}}>
          <div style={{background:G.card,borderRadius:22,padding:"22px",width:"100%",maxWidth:360,border:"1px solid rgba(139,92,246,.3)"}} onClick={function(e){e.stopPropagation();}}>
            <div style={{fontSize:28,marginBottom:8,textAlign:"center"}}>🏛️</div>
            <div style={{fontSize:18,fontWeight:900,color:"#a78bfa",textAlign:"center",marginBottom:4}}>Dia {ferModal.dia} — Feriado</div>
            <div style={{fontSize:13,color:G.white,textAlign:"center",marginBottom:16}}>{ferModal.nome}</div>
            <button onClick={function(){
              setAtuDia(ferModal.ds); setAtuQtd(vendasG[ferModal.ds]>0?String(vendasG[ferModal.ds]):"");
              setFerModal(null); setShowAtu(true);
            }} style={{width:"100%",padding:"13px",borderRadius:14,border:"1px solid rgba(34,197,94,.4)",background:"rgba(34,197,94,.1)",color:G.green,fontWeight:700,fontSize:13,marginBottom:8}}>
              📋 Lancar venda neste dia
            </button>
            <button onClick={function(){setFerModal(null);}} style={{width:"100%",padding:"11px",borderRadius:14,border:"1px solid "+G.border,background:"transparent",color:G.muted,fontWeight:600,fontSize:12}}>Fechar</button>
          </div>
        </div>
      )}

      {/* ══ MODAL ATUALIZAR ══ */}
      {showAtu&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:250,backdropFilter:"blur(14px)"}} onClick={function(){setShowAtu(false);setAtuDia("");setAtuQtd("");}}>
          <div className="fu" style={{background:G.card,borderRadius:"24px 24px 0 0",padding:"16px 20px 44px",width:"100%",maxWidth:420,border:"1px solid rgba(255,255,255,.12)",borderBottom:"none"}} onClick={function(e){e.stopPropagation();}}>
            <div style={{width:34,height:4,background:G.muted2,borderRadius:2,margin:"0 auto 14px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div>
                <div style={{fontSize:9,color:G.muted,fontWeight:600,letterSpacing:1}}>FATURAMENTO POR DIA</div>
                <div style={{fontSize:20,fontWeight:900}}>{atuDia?"Dia "+parseInt(atuDia.split("-")[2])+" — "+MESES[mes]:"Selecione um dia"}</div>
              </div>
              {atuDia&&vendasG[atuDia]>0&&(
                <div style={{background:"rgba(34,197,94,.15)",border:"1px solid rgba(34,197,94,.3)",borderRadius:8,padding:"4px 10px",fontSize:10,color:G.green,fontWeight:700}}>
                  Atual: {fR(vendasG[atuDia])}
                </div>
              )}
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:9,color:G.muted,fontWeight:600,marginBottom:6}}>DIA DO MES — {MESES[mes]} {ano}</div>
              <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:4}}>
                {(function(){
                  var days=[];
                  for(var di=1;di<=diasNoMes;di++){
                    var ds=dsk(ano,mes,di);
                    var sel=atuDia===ds;
                    var isHoje2=di===diaG&&mes===mesG&&ano===anoG;
                    var temV=vendasG[ds]>0;
                    var dw4=dow(ano,mes,di);
                    var isWknd2=dw4===0||dw4===6;
                    var isFer4=feriados[ds]!==undefined;
                    var semV=!temV&&!isWknd2&&!isFer4&&(ano<anoG||(ano===anoG&&mes<mesG)||(ano===anoG&&mes===mesG&&di<diaG));
                    days.push(
                      <button key={di}
                        onClick={(function(k){ return function(){ setAtuDia(k); setAtuQtd(vendasG[k]>0?String(vendasG[k]):""); }; })(ds)}
                        style={{flexShrink:0,width:46,height:54,borderRadius:10,
                          border:"2px solid "+(sel?"#fff":isHoje2?"rgba(255,255,255,.5)":temV?"rgba(34,197,94,.4)":semV?"rgba(239,68,68,.4)":isFer4?"rgba(139,92,246,.4)":"rgba(255,255,255,.1)"),
                          background:sel?"rgba(255,255,255,.2)":isHoje2?"rgba(255,255,255,.08)":temV?"rgba(34,197,94,.08)":semV?"rgba(239,68,68,.08)":isFer4?"rgba(139,92,246,.08)":"transparent",
                          color:sel?"#fff":isHoje2?"rgba(255,255,255,.9)":temV?"#4ade80":semV?"#ef4444":isFer4?"#a78bfa":"rgba(255,255,255,.3)",
                          fontSize:13,fontWeight:700,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,cursor:"pointer"}}>
                        <span style={{lineHeight:1}}>{di}</span>
                        {temV&&<span style={{fontSize:6,fontWeight:600}}>{fRk(vendasG[ds]).replace("R$","")}</span>}
                        {semV&&!temV&&<span style={{fontSize:7,color:"#ef4444",fontWeight:800}}>!</span>}
                        {isFer4&&!temV&&<span style={{fontSize:8}}>🏛️</span>}
                        {isHoje2&&!sel&&<span style={{fontSize:5,color:"rgba(255,255,255,.4)"}}>hoje</span>}
                      </button>
                    );
                  }
                  return days;
                })()}
              </div>
            </div>
            {atuDia?(
              <div>
                <div style={{fontSize:9,color:G.muted,fontWeight:600,marginBottom:6}}>VALOR — DIA {parseInt(atuDia.split("-")[2])}</div>
                <div style={{position:"relative",marginBottom:8}}>
                  <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:20,fontWeight:900,color:G.white,pointerEvents:"none",zIndex:1}}>R$</div>
                  <input type="text" inputMode="decimal" value={atuQtd} autoFocus
                    onChange={function(e){setAtuQtd(e.target.value.replace(/[^0-9,.]/g,""));}}
                    placeholder="0,00"
                    style={{width:"100%",background:G.card2,border:"2px solid rgba(255,255,255,.25)",borderRadius:14,padding:"16px 14px 16px 50px",fontSize:36,fontWeight:900,color:G.white,letterSpacing:-1}}/>
                </div>
                {(function(){
                  var v=pRS(atuQtd); if(!v||v<=0) return null;
                  var novoTotal=totalVendasG-(vendasG[atuDia]||0)+v;
                  var p=metaLoja>0?(novoTotal/metaLoja)*100:0;
                  return <div style={{textAlign:"center",marginBottom:8,fontSize:11,fontWeight:700,color:p>=100?"#4ade80":G.amber}}>
                    {p>=100?"✅ Meta batida!":"📌 Total: "+fR(novoTotal)+" ("+p.toFixed(1)+"%)"}
                  </div>;
                })()}
                <div style={{display:"flex",gap:8}}>
                  <button onClick={function(){setShowAtu(false);setAtuDia("");setAtuQtd("");}} style={{flex:1,padding:"13px",borderRadius:14,border:"1px solid "+G.border,background:G.card2,color:G.muted,fontWeight:700,fontSize:12}}>Cancelar</button>
                  <button onClick={function(){
                    var v=pRS(atuQtd);
                    setVendasG(function(p){
                      var n=Object.assign({},p);
                      if(atuQtd===""){ delete n[atuDia]; } else { n[atuDia]=v; }
                      return n;
                    });
                    setShowAtu(false); setAtuDia(""); setAtuQtd("");
                  }} style={{flex:2,padding:"13px",borderRadius:14,border:"none",background:"#fff",color:"#000",fontWeight:900,fontSize:14,boxShadow:"0 6px 20px rgba(255,255,255,.15)"}}>Confirmar ✓</button>
                </div>
              </div>
            ):(
              <div style={{textAlign:"center",padding:"16px 0",color:G.muted,fontSize:12}}>
                <div style={{fontSize:28,marginBottom:6}}>👆</div>Toque em um dia para lancar
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ NAV ══ */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:420,zIndex:50}}>
        <div style={{background:G.card,borderTop:"1px solid "+G.border,display:"grid",gridTemplateColumns:"1fr 1fr 56px 1fr 1fr",alignItems:"center",padding:"6px 4px 20px",gap:0}}>
          <button onClick={function(){setPage("home");}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"5px",border:"none",background:page==="home"?"rgba(255,255,255,.08)":"transparent",borderRadius:8,color:page==="home"?G.white:G.muted}}>
            <span style={{fontSize:18,lineHeight:1}}>📊</span><span style={{fontSize:7,fontWeight:600}}>Home</span>
          </button>
          <button onClick={function(){setShowAtu(true);setAtuDia("");setAtuQtd("");}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"5px",border:"none",background:showAtu?"rgba(255,255,255,.08)":"transparent",borderRadius:8,color:showAtu?G.white:G.muted}}>
            <span style={{fontSize:18,lineHeight:1}}>🔄</span><span style={{fontSize:7,fontWeight:600}}>Atualizar</span>
          </button>
          <div style={{display:"flex",justifyContent:"center"}}>
            <button onClick={function(){setPage("calendario");}} style={{width:46,height:46,borderRadius:"50%",background:"#fff",border:"none",fontSize:20,fontWeight:900,color:"#000",boxShadow:"0 4px 16px rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}>📅</button>
          </div>
          <button onClick={function(){setPage("medias");}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"5px",border:"none",background:page==="medias"?"rgba(255,255,255,.08)":"transparent",borderRadius:8,color:page==="medias"?G.white:G.muted}}>
            <span style={{fontSize:18,lineHeight:1}}>📈</span><span style={{fontSize:7,fontWeight:600}}>Medias</span>
          </button>
          <button onClick={function(){setPage("config");}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"5px",border:"none",background:page==="config"?"rgba(255,255,255,.08)":"transparent",borderRadius:8,color:page==="config"?G.white:G.muted}}>
            <span style={{fontSize:18,lineHeight:1}}>⚙️</span><span style={{fontSize:7,fontWeight:600}}>Config</span>
          </button>
        </div>
      </div>
    </div>
  );
}

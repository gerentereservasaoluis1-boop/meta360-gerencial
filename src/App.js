/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";

/* meta360 GERENCIAL - Preto, layout similar ao vendedor */

function fR(v){ return "R$ "+Number(v||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}); }
function fRk(v){ v=v||0; if(v>=1000) return "R$"+(v/1000).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})+"k"; return "R$"+Math.round(v); }
function pRS(s){ return parseFloat(((s||"")+"").replace(/\./g,"").replace(",","."))||0; }
function loadLS(k,d){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } }
function saveLS(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

var G={bg:"#030304",card:"#0a0a0c",card2:"#111115",border:"#1c1c22",white:"#f4f4f6",muted:"#52525b",muted2:"#27272a",green:"#22c55e",amber:"#f59e0b",red:"#ef4444"};

/* cascata: 100% base, depois +10% sobre anterior */
function getCascata(base){
  var m0=Math.round(base*100)/100;
  var m1=Math.round(m0*1.10*100)/100;
  var m2=Math.round(m1*1.10*100)/100;
  var m3=Math.round(m2*1.10*100)/100;
  return [m0,m1,m2,m3];
}

var BONIF=[
  {id:"meta", label:"100%",color:"#22c55e",bonif:1000,medal:"🥇"},
  {id:"extra",label:"110%",color:"#cd7f32",bonif:1500,medal:"🥉"},
  {id:"super",label:"120%",color:"#94a3b8",bonif:2000,medal:"🥈"},
  {id:"ouro", label:"130%",color:"#fbbf24",bonif:2500,medal:"🏅"},
];

function calcCom(vendido,metas){
  var com=vendido*0.01;
  var bonif=0;
  if(vendido>=metas[3]) bonif=2500;
  else if(vendido>=metas[2]) bonif=2000;
  else if(vendido>=metas[1]) bonif=1500;
  else if(vendido>=metas[0]) bonif=1000;
  return {com:com,bonif:bonif,total:com+bonif};
}

var DEMO=[
  {nome:"Ana Lima",cargo:"Vendedora",vendido:385000,meta:350000},
  {nome:"Marcos Oliveira",cargo:"Vendedor",vendido:320000,meta:350000},
  {nome:"Juliana Costa",cargo:"Vendedora",vendido:420000,meta:350000},
  {nome:"Carlos Santos",cargo:"Vendedor",vendido:210000,meta:350000},
];

/* GoalAnim fora do App */
function GoalAnimG(props){
  var level=props.level,onClose=props.onClose,nome=props.nome,allDone=props.allDone;
  var st=useState(0); var stage=st[0]; var setStage=st[1];
  var ct=useState(0); var count=ct[0]; var setCount=ct[1];
  var COLORS={meta:"#22c55e",extra:"#cd7f32",super:"#94a3b8",ouro:"#fbbf24"};
  var MEDALS={meta:"🥇",extra:"🥉",super:"🥈",ouro:"🏅"};
  var PCTS={meta:"100%",extra:"110%",super:"120%",ouro:"130%"};
  var lc=COLORS[level.id]||"#22c55e";
  var med=MEDALS[level.id]||"🏆";
  var nextBonif=BONIF.filter(function(b){return b.bonif>level.bonif;})[0]||null;

  useEffect(function(){
    var t1=setTimeout(function(){setStage(1);},500);
    var t2=setTimeout(function(){setStage(2);},1400);
    var t3=setTimeout(function(){setStage(3);},3500);
    return function(){clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[]);

  useEffect(function(){
    if(stage!==2) return;
    var target=level.total||0;
    var steps=60; var cur=0; var ti;
    ti=setInterval(function(){ cur+=target/steps; if(cur>=target){setCount(target);clearInterval(ti);}else setCount(Math.round(cur)); },30);
    return function(){clearInterval(ti);};
  },[stage]);

  if(allDone) return (
    <div style={{position:"fixed",inset:0,zIndex:500,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <style>{"@keyframes rn{0%{transform:translateY(-60px) rotate(0);opacity:1}100%{transform:translateY(105vh) rotate(540deg);opacity:0}} @keyframes gg{0%{transform:scale(0);opacity:0}60%{transform:scale(1.1);}100%{transform:scale(1);opacity:1}} @keyframes glg{0%,100%{text-shadow:0 0 30px #fbbf24}50%{text-shadow:0 0 80px #fbbf24}} @keyframes fg{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}"}</style>
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(function(i){
        return <div key={i} style={{position:"absolute",top:0,left:(i*13%101)+"%",fontSize:i%3===0?28:18,animation:"rn "+(1.2+i%5*.3)+"s "+(i*.12%1.8)+"s linear infinite",opacity:.9,zIndex:1}}>
          {["💵","💰","💸","💎","🤑"][i%5]}
        </div>;
      })}
      <div style={{position:"relative",zIndex:10,textAlign:"center",padding:"0 28px",width:"100%",maxWidth:360}}>
        <div style={{animation:"gg .9s ease both",marginBottom:10}}>
          <div style={{fontSize:11,color:"rgba(255,215,0,.6)",fontWeight:700,letterSpacing:4,marginBottom:8}}>💰 COMISSÃO TOTAL</div>
          <div style={{fontSize:52,fontWeight:900,color:"#fbbf24",lineHeight:1,animation:"glg 1.5s infinite",letterSpacing:-2}}>{fR(count)}</div>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:14}}>
          {["💵","💰","💸","💵","💰"].map(function(s,i){return <span key={i} style={{fontSize:32}}>{s}</span>;})}
        </div>
        <div style={{animation:"fg .7s 1.2s both"}}>
          <div style={{fontSize:13,color:"rgba(255,255,255,.5)",letterSpacing:2,marginBottom:4}}>VOCÊ É</div>
          <div style={{fontSize:50,fontWeight:900,color:"#fbbf24",animation:"glg 1s infinite",letterSpacing:-1}}>PIKAAA</div>
          <div style={{fontSize:18,fontWeight:700,color:"#fff",marginTop:6}}>{nome?nome.toUpperCase():"GERENTE"}! 🎉</div>
        </div>
        <button onClick={onClose} style={{marginTop:20,padding:"14px 48px",borderRadius:20,background:"linear-gradient(135deg,#fbbf24,#d97706)",border:"none",color:"#000",fontWeight:900,fontSize:16,cursor:"pointer"}}>FECHAR</button>
      </div>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,zIndex:500,background:"radial-gradient(ellipse at 50% 0%,#101010,#000)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <style>{"@keyframes bI{0%{transform:scale(0) rotate(-15deg);opacity:0}65%{transform:scale(1.15);}100%{transform:scale(1);opacity:1}} @keyframes cU{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes sU{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}} @keyframes gL{0%,100%{box-shadow:0 0 20px rgba(255,255,255,.1)}50%{box-shadow:0 0 50px rgba(255,255,255,.25)}} @keyframes rL{0%{transform:translateY(-60px);opacity:1}100%{transform:translateY(105vh);opacity:0}}"}</style>
      {stage>=1&&[0,1,2,3,4,5].map(function(i){
        return <div key={i} style={{position:"absolute",top:0,left:(i*17%100)+"%",fontSize:16,animation:"rL "+(1.4+i*.3)+"s "+(i*.2)+"s linear infinite",opacity:.5,zIndex:0}}>
          {["💰","💵","✨","⭐"][i%4]}
        </div>;
      })}
      <div style={{textAlign:"center",padding:"0 26px",width:"100%",maxWidth:360,position:"relative",zIndex:2}}>
        {stage>=0&&<div style={{fontSize:108,animation:"bI .7s ease both",marginBottom:8,filter:"drop-shadow(0 0 32px "+lc+")"}}>{med}</div>}
        {stage>=1&&<div style={{animation:"cU .5s ease both",marginBottom:8}}>
          <div style={{fontSize:12,color:lc,fontWeight:800,letterSpacing:3,marginBottom:5}}>{PCTS[level.id]||""} BATIDA! 🎉</div>
          <div style={{fontSize:40,fontWeight:900,color:"#fff",letterSpacing:-1,lineHeight:1}}>{fRk(level.metaVal||0)}</div>
        </div>}
        {stage>=2&&<div style={{background:lc+"20",border:"2px solid "+lc,borderRadius:20,padding:"18px 24px",marginBottom:10}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,.6)",fontWeight:600,letterSpacing:1,marginBottom:6}}>💰 1% + BONIFICAÇÃO</div>
          <div style={{fontSize:44,fontWeight:900,color:lc,lineHeight:1,letterSpacing:-1}}>{fR(count)}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginTop:5}}>1% + {fRk(level.bonif||0)} bônus</div>
        </div>}
        {stage>=3&&<div style={{animation:"sU .5s ease both",width:"100%"}}>
          <div style={{fontSize:22,fontWeight:900,color:"#fff",marginBottom:10}}>✅ CONCLUÍDO!</div>
          {nextBonif&&<div style={{background:nextBonif.color+"20",border:"2px solid "+nextBonif.color+"55",borderRadius:18,padding:"14px",marginBottom:12,textAlign:"left"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,.5)",marginBottom:5,letterSpacing:1}}>PRÓXIMO NÍVEL</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:26}}>{nextBonif.medal}</span>
              <div>
                <div style={{fontSize:16,fontWeight:900,color:nextBonif.color}}>{nextBonif.label}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginTop:2}}>Bônus: {fR(nextBonif.bonif)}</div>
              </div>
            </div>
          </div>}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {nextBonif&&<button onClick={function(){onClose(); if(props.onGoHome) props.onGoHome();}} style={{padding:"14px",borderRadius:14,background:"linear-gradient(135deg,"+nextBonif.color+","+nextBonif.color+"bb)",border:"none",color:"#000",fontWeight:900,fontSize:15,cursor:"pointer"}}>🚀 RUMO A {nextBonif.label}!</button>}
            <button onClick={onClose} style={{padding:"11px",borderRadius:14,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.4)",fontWeight:600,fontSize:12,cursor:"pointer"}}>Fechar</button>
          </div>
        </div>}
      </div>
    </div>
  );
}

export default function App(){
  var hoje=new Date();
  var anoAtual=hoje.getFullYear();

  /* auth */
  var authSt=useState(function(){ var s=loadLS("m360ger_auth",null); return s&&s.logado?s:null; });
  var auth=authSt[0]; var setAuth=authSt[1];
  var splashSt=useState(false); var showSplash=splashSt[0]; var setShowSplash=splashSt[1];
  var lnSt=useState(""); var loginNome=lnSt[0]; var setLoginNome=lnSt[1];
  var lsSt=useState(""); var loginSenha=lsSt[0]; var setLoginSenha=lsSt[1];
  var rnSt=useState(""); var regNome=rnSt[0]; var setRegNome=rnSt[1];
  var rsSt=useState(""); var regSenha=rsSt[0]; var setRegSenha=rsSt[1];
  var rs2St=useState(""); var regSenha2=rs2St[0]; var setRegSenha2=rs2St[1];
  var rtSt=useState(""); var regTel=rtSt[0]; var setRegTel=rtSt[1];
  var asSt=useState("login"); var authScreen=asSt[0]; var setAuthScreen=asSt[1];
  var aeSt=useState(""); var authErr=aeSt[0]; var setAuthErr=aeSt[1];
  var spSt=useState(false); var showPass=spSt[0]; var setShowPass=spSt[1];
  var recTelSt=useState(""); var recTel=recTelSt[0]; var setRecTel=recTelSt[1];
  var recCodeSt=useState(""); var recCode=recCodeSt[0]; var setRecCode=recCodeSt[1];
  var recCodeGenSt=useState(""); var recCodeGen=recCodeGenSt[0]; var setRecCodeGen=recCodeGenSt[1];
  var recSenhaSt=useState(""); var recSenha=recSenhaSt[0]; var setRecSenha=recSenhaSt[1];
  var recStepSt=useState(1); var recStep=recStepSt[0]; var setRecStep=recStepSt[1];

  /* config */
  var cfgSt=useState(function(){ return loadLS("m360ger_cfg",{nome:"Gerente",foto:null,metaLoja:350000,diasTrab:22,vendidoStr:""}); });
  var cfg=cfgSt[0]; var setCfgRaw=cfgSt[1];
  function setCfg(p){ setCfgRaw(function(prev){ var n=Object.assign({},prev,p); saveLS("m360ger_cfg",n); return n; }); }

  var metaLoja=cfg.metaLoja||350000;
  var vendido=pRS(cfg.vendidoStr)||0;
  var diasEf=cfg.diasTrab||22;
  var cascata=getCascata(metaLoja);
  var resultado=calcCom(vendido,cascata);
  var pct=metaLoja>0?(vendido/metaLoja)*100:0;

  /* foto */
  var fotoRef=useRef(null);
  function handleFoto(e){
    var f=e.target.files[0]; if(!f) return;
    var r=new FileReader();
    r.onload=function(ev){
      var img=new Image();
      img.onload=function(){
        var c2=document.createElement("canvas"); var MAX=300;
        var w=img.width,h=img.height;
        if(w>h){if(w>MAX){h=Math.round(h*MAX/w);w=MAX;}}else{if(h>MAX){w=Math.round(w*MAX/h);h=MAX;}}
        c2.width=w;c2.height=h;c2.getContext("2d").drawImage(img,0,0,w,h);
        setCfg({foto:c2.toDataURL("image/jpeg",.72)});
      };
      img.src=ev.target.result;
    };
    r.readAsDataURL(f);
  }

  /* page */
  var pageSt=useState("home"); var page=pageSt[0]; var setPage=pageSt[1];
  var editandoSt=useState(false); var editando=editandoSt[0]; var setEditando=editandoSt[1];
  var inputValSt=useState(""); var inputVal=inputValSt[0]; var setInputVal=inputValSt[1];
  var inputRef=useRef(null);
  useEffect(function(){ if(editando&&inputRef.current)inputRef.current.focus(); },[editando]);

  /* goal anim */
  var goalSt=useState(null); var goalAnim=goalSt[0]; var setGoalAnim=goalSt[1];
  var prevLev=useRef(-1);

  /* plano */
  var planoSt=useState(function(){
    return loadLS("m360ger_plano",{topicos:[
      {texto:"Prospectar novos clientes",meta:"",realizado:"",bateu:null},
      {texto:"Acompanhar fechamentos",meta:"",realizado:"",bateu:null},
      {texto:"Revisar pipeline da equipe",meta:"",realizado:"",bateu:null},
      {texto:"Treinamento da equipe",meta:"",realizado:"",bateu:null},
      {texto:"Feedback individual",meta:"",realizado:"",bateu:null},
    ]});
  });
  var plano=planoSt[0]; var setPlanoRaw=planoSt[1];
  function setPlano(fn){ setPlanoRaw(function(p){ var n=typeof fn==="function"?fn(p):fn; saveLS("m360ger_plano",n); return n; }); }

  /* projeção */
  var projecao=(function(){
    var d=new Date(); var diasMes=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
    var trabalhados=Math.min(d.getDate(),diasMes);
    if(trabalhados===0) return 0;
    return (vendido/trabalhados)*diasEf;
  })();

  /* nivel atual */
  var nivelAtual=null;
  for(var ni=cascata.length-1;ni>=0;ni--){ if(vendido>=cascata[ni]){nivelAtual=BONIF[ni];break;} }
  var proxNivelMeta=null;
  for(var pi=0;pi<cascata.length;pi++){ if(vendido<cascata[pi]){proxNivelMeta=cascata[pi];break;} }
  var proxNivelBonif=null;
  for(var bi=0;bi<BONIF.length;bi++){ if(vendido<cascata[bi]){proxNivelBonif=BONIF[bi];break;} }

  /* check goal */
  useEffect(function(){
    var cur=0; for(var i=0;i<cascata.length;i++){if(vendido>=cascata[i])cur=i+1;}
    if(prevLev.current>=0&&cur>prevLev.current&&cur>0){
      var lv=BONIF[cur-1];
      var r=calcCom(vendido,cascata);
      setGoalAnim({id:lv.id,bonif:lv.bonif,total:r.total,metaVal:cascata[cur-1]});
    }
    prevLev.current=cur;
  },[vendido]);

  function salvar(){
    var v=pRS(inputVal);
    if(inputVal!==""&&v>=0) setCfg({vendidoStr:String(v)});
    setEditando(false);
  }

  /* ranking */
  var ranking=DEMO.slice().sort(function(a,b){return(b.vendido/b.meta)-(a.vendido/a.meta);});

  /* medias gerencial */
  var mediasGSt=useState(function(){ return loadLS("m360ger_medias",{}); });
  var mediasG=mediasGSt[0]; var setMediasGRaw=mediasGSt[1];
  function setMediasG(fn){ setMediasGRaw(function(p){ var n=typeof fn==="function"?fn(p):fn; saveLS("m360ger_medias",n); return n; }); }
  var mediaEditGSt=useState(null); var mediaEditG=mediaEditGSt[0]; var setMediaEditG=mediaEditGSt[1];
  var mediaValGSt=useState(""); var mediaValG=mediaValGSt[0]; var setMediaValG=mediaValGSt[1];

  var MESES_GER=["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  var MS_GER=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  var anoAtualG=hoje.getFullYear();
  var mediaAnualG=MESES_GER.map(function(_m,i){
    var key=anoAtualG+"-"+i;
    var entry=mediasG[key]||null;
    var metaM=entry&&entry.meta!=null?entry.meta:null;
    var vendeuM=entry&&entry.vendeu!=null?entry.vendeu:null;
    var resultado=metaM!=null&&vendeuM!=null?vendeuM-metaM:null;
    var pctM=metaM!=null&&metaM>0&&vendeuM!=null?(vendeuM/metaM)*100:null;
    return {mes:i,metaM:metaM,vendeuM:vendeuM,resultado:resultado,pctM:pctM,key:key};
  });
  var mediasGComV=mediaAnualG.filter(function(m){return m.vendeuM!=null;});
  var fatAnualG=mediasGComV.reduce(function(a,m){return a+(m.vendeuM||0);},0);
  var metaAnualGTotal=mediasGComV.reduce(function(a,m){return a+(m.metaM!=null?m.metaM:metaLoja);},0)||metaLoja*12;
  var pctAnualG=metaAnualGTotal>0?(fatAnualG/metaAnualGTotal)*100:0;
  var mediaGeralG=mediasGComV.length>0?fatAnualG/mediasGComV.length:0;

  function commitMediaG(){
    if(!mediaEditG) return;
    var v=pRS(mediaValG);
    setMediasG(function(p){
      var prev=p[mediaEditG.key]||{};
      if(mediaValG===""){
        var upd=Object.assign({},prev); delete upd[mediaEditG.field];
        return Object.assign({},p,{}); 
      }
      var upd2=Object.assign({},prev); upd2[mediaEditG.field]=isNaN(v)?0:v;
      var r=Object.assign({},p); r[mediaEditG.key]=upd2; return r;
    });
    setMediaEditG(null);
  }

  function doLogin(){
    var s=loadLS("m360ger_auth",null);
    if(!s||!s.nome){setAuthErr("Nenhuma conta cadastrada.");return;}
    if(loginNome.trim().toLowerCase()!==s.nome.toLowerCase()){setAuthErr("Nome incorreto.");return;}
    if(loginSenha!==s.senha){setAuthErr("Senha incorreta.");return;}
    saveLS("m360ger_auth",Object.assign({},s,{logado:true}));
    setShowSplash(true);
    setTimeout(function(){setShowSplash(false);setAuth({logado:true,nome:s.nome});},2500);
  }
  function doRegister(){
    if(!regNome.trim()){setAuthErr("Digite seu nome.");return;}
    if(!regSenha||regSenha.length<4){setAuthErr("Minimo 4 caracteres.");return;}
    if(regSenha!==regSenha2){setAuthErr("Senhas nao coincidem.");return;}
    var data={nome:regNome.trim(),senha:regSenha,tel:regTel.trim(),logado:true};
    saveLS("m360ger_auth",data);
    saveLS("m360ger_cfg",Object.assign(loadLS("m360ger_cfg",{}),{nome:data.nome}));
    setShowSplash(true);
    setTimeout(function(){setShowSplash(false);setAuth({logado:true,nome:data.nome});},2500);
  }
  function doLogout(){
    var s=loadLS("m360ger_auth",null);
    if(s)saveLS("m360ger_auth",Object.assign({},s,{logado:false}));
    setAuth(null);
  }

  /* ── SPLASH ── */
  if(showSplash) return (
    <div style={{minHeight:"100vh",background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif"}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800;900&display=swap'); *{box-sizing:border-box;margin:0;padding:0} @keyframes zI{0%{transform:scale(0);opacity:0}70%{transform:scale(1.08);}100%{opacity:1;transform:scale(1)}} @keyframes fU{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes sl{from{width:0}to{width:100%}}"}</style>
      <div style={{width:80,height:80,borderRadius:"50%",background:"#111",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,marginBottom:16,animation:"zI .7s ease both"}}>📊</div>
      <div style={{fontSize:30,fontWeight:900,color:"#fff",animation:"fU .5s .3s both",letterSpacing:-1}}>meta<span style={{color:"#aaa"}}>360</span></div>
      <div style={{fontSize:11,color:"#444",marginTop:4,animation:"fU .5s .5s both",letterSpacing:2}}>GERENCIAL</div>
      <div style={{marginTop:24,width:180,height:3,background:"#1c1c1c",borderRadius:2,overflow:"hidden",animation:"fU .5s .7s both"}}>
        <div style={{height:"100%",background:"#fff",borderRadius:2,animation:"sl 2.2s .9s ease both"}}/>
      </div>
    </div>
  );

  /* ── LOGIN ── */
  if(!auth||!auth.logado) return (
    <div style={{minHeight:"100vh",background:"#000",display:"flex",flexDirection:"column",fontFamily:"'Sora',sans-serif",position:"relative",overflow:"hidden"}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap'); *{box-sizing:border-box;margin:0;padding:0} button{cursor:pointer;font-family:inherit} input{font-family:inherit} input:focus{outline:none} @keyframes fI{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} .fade{animation:fI .5s ease forwards}"}</style>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.04),transparent 55%)",pointerEvents:"none"}}/>
      <div style={{padding:"60px 24px 24px",textAlign:"center",position:"relative",zIndex:1}}>
        <div style={{width:68,height:68,borderRadius:"50%",background:"#111",border:"2px solid #333",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:30}}>📊</div>
        <div style={{fontSize:26,fontWeight:900,color:"#fff",letterSpacing:-1}}>meta<span style={{color:"#aaa"}}>360</span></div>
        <div style={{fontSize:11,color:"#444",marginTop:3,letterSpacing:2}}>ACESSO GERENCIAL</div>
      </div>
      <div style={{flex:1,padding:"0 20px 40px",position:"relative",zIndex:1}}>
        <div style={{display:"flex",background:"#0a0a0c",borderRadius:14,padding:4,marginBottom:16,border:"1px solid #1c1c22"}}>
          {["login","register","recover"].filter(function(s){return s!=="recover";}).concat([]).map(function(s,i){
            var labels=["Entrar","Cadastrar"];
            var screens=["login","register"];
            return <button key={i} onClick={function(){setAuthScreen(screens[i]);setAuthErr("");}}
              style={{flex:1,padding:"11px",borderRadius:11,border:"none",background:authScreen===screens[i]?"#fff":"transparent",color:authScreen===screens[i]?"#000":"#52525b",fontWeight:800,fontSize:13}}>
              {labels[i]}
            </button>;
          })}
        </div>
        <div style={{background:"#0a0a0c",borderRadius:22,padding:"22px 20px",border:"1px solid #1c1c22",boxShadow:"0 20px 60px rgba(0,0,0,.8)"}}>

          {authScreen==="login"&&(
            <div>
              <div style={{fontSize:16,fontWeight:800,color:"#f4f4f6",marginBottom:16}}>Bem-vindo, Gerente 👋</div>
              {[{label:"NOME",val:loginNome,set:setLoginNome,ph:"Seu nome"},{label:"SENHA",val:loginSenha,set:setLoginSenha,ph:"Senha",pass:true}].map(function(f,i){
                return <div key={i} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:"#52525b",fontWeight:700,marginBottom:5}}>{f.label}</div>
                  <div style={{position:"relative"}}>
                    <input type={f.pass?(showPass?"text":"password"):"text"} value={f.val}
                      onChange={function(e){f.set(e.target.value);setAuthErr("");}}
                      onKeyDown={function(e){if(e.key==="Enter")doLogin();}} placeholder={f.ph}
                      style={{width:"100%",background:"#111115",border:"1px solid #1c1c22",borderRadius:12,padding:"13px "+(f.pass?"44px 13px":"14px"),fontSize:14,color:"#f4f4f6",fontWeight:600}}/>
                    {f.pass&&<button onClick={function(){setShowPass(!showPass);}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",fontSize:16,color:"#52525b"}}>{showPass?"🙈":"👁"}</button>}
                  </div>
                </div>;
              })}
              {authErr&&<div style={{background:"#ef444422",border:"1px solid #ef444455",borderRadius:10,padding:"8px 12px",fontSize:11,color:"#ef4444",marginBottom:12}}>{authErr}</div>}
              <button onClick={doLogin} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:"#fff",color:"#000",fontWeight:900,fontSize:15}}>Entrar →</button>
              <button onClick={function(){setAuthScreen("recover");setAuthErr("");setRecStep(1);setRecCode("");}}
                style={{width:"100%",marginTop:8,padding:"9px",borderRadius:10,border:"none",background:"transparent",color:"#52525b",fontSize:11}}>
                🔑 Esqueci minha senha
              </button>
            </div>
          )}

          {authScreen==="register"&&(
            <div>
              <div style={{fontSize:16,fontWeight:800,color:"#f4f4f6",marginBottom:16}}>Criar conta gerencial 🚀</div>
              {[{label:"NOME *",val:regNome,set:setRegNome,ph:"Ex: Joao Silva"},{label:"TELEFONE WHATSAPP",val:regTel,set:setRegTel,ph:"98 99999-9999",type:"tel"},{label:"SENHA *",val:regSenha,set:setRegSenha,ph:"Min. 4 caracteres",pass:true},{label:"CONFIRMAR SENHA *",val:regSenha2,set:setRegSenha2,ph:"Repita",pass:true}].map(function(f,i){
                return <div key={i} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:"#52525b",fontWeight:700,marginBottom:5}}>{f.label}</div>
                  <input type={f.pass?(showPass?"text":"password"):f.type||"text"} value={f.val}
                    onChange={function(e){f.set(e.target.value);setAuthErr("");}} placeholder={f.ph}
                    style={{width:"100%",background:"#111115",border:"1px solid #1c1c22",borderRadius:12,padding:"12px 14px",fontSize:14,color:"#f4f4f6",fontWeight:600}}/>
                </div>;
              })}
              {authErr&&<div style={{background:"#ef444422",border:"1px solid #ef444455",borderRadius:10,padding:"8px 12px",fontSize:11,color:"#ef4444",marginBottom:12}}>{authErr}</div>}
              <button onClick={doRegister} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:"#fff",color:"#000",fontWeight:900,fontSize:15}}>Criar conta ✓</button>
              <button onClick={function(){setAuthScreen("login");setAuthErr("");}} style={{width:"100%",marginTop:8,padding:"9px",borderRadius:10,border:"none",background:"transparent",color:"#52525b",fontSize:11}}>
                Ja tem conta? <span style={{color:"#fff",fontWeight:700}}>Entrar</span>
              </button>
            </div>
          )}

          {authScreen==="recover"&&(
            <div>
              <div style={{fontSize:16,fontWeight:800,color:"#f4f4f6",marginBottom:4}}>Recuperar Senha 🔑</div>
              {recStep===1&&(
                <div>
                  <div style={{fontSize:11,color:"#52525b",marginBottom:14}}>Digite seu WhatsApp cadastrado</div>
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:10,color:"#52525b",fontWeight:700,marginBottom:5}}>SEU WHATSAPP</div>
                    <input type="tel" value={recTel} onChange={function(e){setRecTel(e.target.value);setAuthErr("");}}
                      placeholder="98 99999-9999"
                      style={{width:"100%",background:"#111115",border:"1px solid #1c1c22",borderRadius:12,padding:"13px 14px",fontSize:15,color:"#f4f4f6",fontWeight:600}}/>
                  </div>
                  {authErr&&<div style={{background:"#ef444422",border:"1px solid #ef444455",borderRadius:10,padding:"8px 12px",fontSize:11,color:"#ef4444",marginBottom:12}}>{authErr}</div>}
                  <button onClick={function(){
                    var saved=loadLS("m360ger_auth",null);
                    if(!saved||!saved.tel){setAuthErr("Telefone nao encontrado.");return;}
                    var t1=recTel.replace(/[^0-9]/g,"");
                    var t2=(saved.tel||"").replace(/[^0-9]/g,"");
                    if(t1!==t2){setAuthErr("Telefone nao confere.");return;}
                    var code=String(Math.floor(1000+Math.random()*9000));
                    setRecCodeGen(code);
                    var waMsg=encodeURIComponent("meta360 Gerencial - Codigo de recuperacao: "+code);
                    window.open("https://wa.me/55"+t1+"?text="+waMsg,"_blank");
                    setRecStep(2);
                  }} style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:"#fff",color:"#000",fontWeight:900,fontSize:14}}>
                    Enviar codigo no WhatsApp 💬
                  </button>
                  <button onClick={function(){setAuthScreen("login");setAuthErr("");setRecStep(1);}}
                    style={{width:"100%",marginTop:8,padding:"9px",borderRadius:10,border:"none",background:"transparent",color:"#52525b",fontSize:11}}>
                    Voltar
                  </button>
                </div>
              )}
              {recStep===2&&(
                <div>
                  <div style={{fontSize:11,color:"#52525b",marginBottom:14}}>Digite o codigo recebido no WhatsApp</div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:10,color:"#52525b",fontWeight:700,marginBottom:5}}>CODIGO</div>
                    <input type="text" inputMode="numeric" value={recCode}
                      onChange={function(e){setRecCode(e.target.value.replace(/[^0-9]/g,"").slice(0,4));setAuthErr("");}}
                      placeholder="1234"
                      style={{width:"100%",background:"#111115",border:"1px solid #1c1c22",borderRadius:12,padding:"13px 14px",fontSize:28,color:"#fff",fontWeight:900,textAlign:"center",letterSpacing:8}}/>
                  </div>
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:10,color:"#52525b",fontWeight:700,marginBottom:5}}>NOVA SENHA</div>
                    <input type="password" value={recSenha} onChange={function(e){setRecSenha(e.target.value);setAuthErr("");}}
                      placeholder="Minimo 4 caracteres"
                      style={{width:"100%",background:"#111115",border:"1px solid #1c1c22",borderRadius:12,padding:"13px 14px",fontSize:14,color:"#f4f4f6",fontWeight:600}}/>
                  </div>
                  {authErr&&<div style={{background:"#ef444422",border:"1px solid #ef444455",borderRadius:10,padding:"8px 12px",fontSize:11,color:"#ef4444",marginBottom:12}}>{authErr}</div>}
                  <button onClick={function(){
                    if(recCode!==recCodeGen){setAuthErr("Codigo incorreto.");return;}
                    if(!recSenha||recSenha.length<4){setAuthErr("Senha muito curta.");return;}
                    var saved=loadLS("m360ger_auth",null);
                    if(saved){saveLS("m360ger_auth",Object.assign({},saved,{senha:recSenha}));}
                    setAuthErr("");setAuthScreen("login");setRecStep(1);setRecCode("");setRecSenha("");
                  }} style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:"#fff",color:"#000",fontWeight:900,fontSize:14}}>
                    Salvar nova senha ✓
                  </button>
                  <button onClick={function(){setRecStep(1);setRecCode("");}}
                    style={{width:"100%",marginTop:8,padding:"9px",borderRadius:10,border:"none",background:"transparent",color:"#52525b",fontSize:11}}>
                    Reenviar codigo
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
        <div style={{textAlign:"center",marginTop:16,fontSize:10,color:"#222"}}>meta360 gerencial · performance 360°</div>
      </div>
    </div>
  );

  /* ══ APP GERENCIAL ══ */
  return (
    <div style={{minHeight:"100vh",background:G.bg,color:G.white,fontFamily:"'Sora',sans-serif",paddingBottom:90,maxWidth:420,margin:"0 auto",position:"relative",overflow:"hidden"}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap'); *{box-sizing:border-box;margin:0;padding:0} button{cursor:pointer;font-family:inherit} input{font-family:inherit} input:focus{outline:none} .fu{animation:fUp .3s ease forwards} @keyframes fUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .tap{transition:transform .1s} .tap:active{transform:scale(.96)}"}</style>
      <div style={{position:"fixed",inset:0,maxWidth:420,left:"50%",transform:"translateX(-50%)",pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
      </div>

      {goalAnim&&<GoalAnimG level={goalAnim} onClose={function(){setGoalAnim(null);}} onGoHome={function(){setPage("home");}} nome={cfg.nome} allDone={pct>=130}/>}

      {/* ══ HOME ══ */}
      {page==="home"&&(
        <div className="fu" style={{position:"relative",zIndex:1}}>
          <div style={{padding:"48px 20px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={function(){setPage("config");}}>
              {cfg.foto
                ? <img src={cfg.foto} alt="f" style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(255,255,255,.2)"}}/>
                : <div style={{width:44,height:44,borderRadius:"50%",background:"#111",border:"2px solid rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"rgba(255,255,255,.4)"}}>{(cfg.nome||"G").charAt(0).toUpperCase()}</div>
              }
              <div>
                <div style={{fontSize:10,color:G.muted}}>Gerencial 👋</div>
                <div style={{fontSize:16,fontWeight:900,lineHeight:1.2}}>{cfg.nome||"Gerente"}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.35)",marginTop:1}}>Gerente de Vendas</div>
              </div>
            </div>
            <div style={{background:G.card2,border:"1px solid "+(nivelAtual?nivelAtual.color+"44":G.border),borderRadius:10,padding:"5px 10px",fontSize:10,fontWeight:700,color:nivelAtual?nivelAtual.color:G.muted}}>
              {nivelAtual?nivelAtual.medal+" "+nivelAtual.label+" ✅":"Sem nivel"}
            </div>
          </div>

          {/* HERO CARD PRETO */}
          <div style={{margin:"0 20px",borderRadius:22,padding:"20px",background:"linear-gradient(135deg,#111115 0%,#0a0a0c 100%)",border:"1.5px solid rgba(255,255,255,.1)",position:"relative",overflow:"hidden",boxShadow:"0 16px 48px rgba(0,0,0,.8)"}}>
            <div style={{position:"absolute",right:-30,top:-30,width:130,height:130,borderRadius:"50%",background:"rgba(255,255,255,.02)"}}/>
            <div style={{position:"relative"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:9,color:"rgba(255,255,255,.35)",fontWeight:700,letterSpacing:1}}>FATURAMENTO DA LOJA</div>
                <div style={{position:"relative",width:52,height:52,flexShrink:0}}>
                  <svg width="52" height="52" viewBox="0 0 52 52" style={{transform:"rotate(-90deg)"}}>
                    <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="5"/>
                    <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="5"
                      strokeDasharray={String(2*Math.PI*20*Math.min(100,pct)/100)+" "+String(2*Math.PI*20)}
                      strokeLinecap="round" style={{transition:"stroke-dasharray 1s ease"}}/>
                  </svg>
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,.8)"}}>{Math.round(pct)}%</div>
                  </div>
                </div>
              </div>
              <div style={{marginBottom:6}}>
                <div style={{fontSize:9,color:"rgba(255,255,255,.3)",fontWeight:600,letterSpacing:1,marginBottom:2}}>META DA LOJA</div>
                <div style={{fontSize:32,fontWeight:900,color:"#ffffff",letterSpacing:-1,lineHeight:1,textShadow:"0 0 20px rgba(255,255,255,.3)"}}>{fR(metaLoja)}</div>
              </div>
              <div style={{height:1,background:"rgba(255,255,255,.08)",marginBottom:8}}/>
              <div style={{marginBottom:8}}>
                <div style={{fontSize:9,color:"rgba(255,255,255,.3)",fontWeight:600,letterSpacing:1,marginBottom:2}}>VENDIDO</div>
                <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                  <div style={{fontSize:21,fontWeight:900,color:"#ffffff",letterSpacing:-0.5,lineHeight:1,textShadow:"0 0 16px rgba(255,255,255,.25)"}}>
                    {vendido>0?fR(vendido):<span style={{color:"rgba(255,255,255,.25)",fontSize:16}}>Toque + para lancar</span>}
                  </div>
                  {vendido>0&&<div style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>de {fRk(metaLoja)}</div>}
                </div>
              </div>
              <div style={{height:5,background:"rgba(255,255,255,.07)",borderRadius:3,overflow:"hidden",marginBottom:5}}>
                <div style={{height:"100%",width:Math.min(100,pct)+"%",background:"rgba(255,255,255,.65)",borderRadius:3,transition:"width .8s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:10}}>
                <span style={{color:"rgba(255,255,255,.4)",fontWeight:700}}>{pct.toFixed(1)}%{proxNivelBonif?" → "+proxNivelBonif.label:" 🏆"}</span>
                <span style={{color:projecao>=metaLoja?"rgba(255,255,255,.6)":"rgba(255,100,100,.6)"}}>{projecao>=metaLoja?"✅ Vai bater":"⚠️ Abaixo"}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                <div style={{background:"rgba(255,255,255,.05)",borderRadius:10,padding:"8px 9px"}}>
                  <div style={{fontSize:7,color:"rgba(255,255,255,.3)",fontWeight:700,marginBottom:2}}>FALTA META</div>
                  <div style={{fontSize:12,fontWeight:900,color:"#fff",lineHeight:1,fontWeight:900}}>{vendido>=metaLoja?"✅":fRk(metaLoja-vendido)}</div>
                </div>
                <div style={{background:"rgba(255,255,255,.05)",borderRadius:10,padding:"8px 9px"}}>
                  <div style={{fontSize:7,color:"rgba(255,255,255,.3)",fontWeight:700,marginBottom:2}}>DIARIA</div>
                  <div style={{fontSize:12,fontWeight:900,color:"#fff",lineHeight:1}}>{fRk(metaLoja/diasEf)}</div>
                </div>
                <div style={{background:"rgba(255,255,255,.07)",borderRadius:10,padding:"8px 9px",border:"1px solid rgba(255,255,255,.08)"}}>
                  <div style={{fontSize:7,color:"rgba(255,255,255,.3)",fontWeight:700,marginBottom:2}}>PROJECAO</div>
                  <div style={{fontSize:11,fontWeight:900,color:"#fff",lineHeight:1}}>{fRk(projecao)}</div>
                  <div style={{fontSize:7,color:projecao>=metaLoja?"rgba(255,255,255,.5)":"rgba(255,100,100,.6)",marginTop:1}}>{projecao>=metaLoja?"✅":"⚠️"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* COMISSÃO + GANHOS — destaque verde */}
          <div style={{margin:"10px 20px 0",background:"linear-gradient(135deg,#052012,#081810)",border:"1px solid rgba(34,197,94,.35)",borderRadius:18,padding:"16px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-20,top:-20,width:100,height:100,borderRadius:"50%",background:"rgba(34,197,94,.06)",pointerEvents:"none"}}/>
            <div style={{fontSize:9,color:G.green,fontWeight:700,letterSpacing:2,marginBottom:12}}>💰 SEUS GANHOS</div>
            {/* comissão mega destaque */}
            <div style={{background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.3)",borderRadius:16,padding:"14px",marginBottom:10,textAlign:"center"}}>
              <div style={{fontSize:9,color:"rgba(34,197,94,.7)",fontWeight:700,marginBottom:6,letterSpacing:1}}>TOTAL ACUMULADO (1% + BONUS)</div>
              <div style={{fontSize:48,fontWeight:900,color:"#4ade80",lineHeight:1,letterSpacing:-2,textShadow:"0 0 40px rgba(74,222,128,.9), 0 0 80px rgba(34,197,94,.5)"}}>{fR(resultado.total)}</div>
              <div style={{fontSize:11,color:"rgba(34,197,94,.6)",marginTop:6,fontWeight:600}}>
                {resultado.bonif>0?"✅ Meta batida — bonus ativo!":"Bata a meta para desbloquear o bonus"}
              </div>
            </div>
            {/* breakdown */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <div style={{background:"rgba(34,197,94,.12)",border:"1px solid rgba(34,197,94,.35)",borderRadius:12,padding:"12px"}}>
                <div style={{fontSize:8,color:"rgba(34,197,94,.8)",fontWeight:700,marginBottom:5}}>1% COMISSAO</div>
                <div style={{fontSize:26,fontWeight:900,color:"#4ade80",lineHeight:1,textShadow:"0 0 20px rgba(74,222,128,.6)"}}>{fR(resultado.com)}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.4)",marginTop:3}}>sobre {fRk(vendido)}</div>
              </div>
              <div style={{background:resultado.bonif>0?"rgba(251,191,36,.18)":"rgba(255,255,255,.04)",border:"1px solid "+(resultado.bonif>0?"rgba(251,191,36,.5)":"rgba(255,255,255,.1)"),borderRadius:12,padding:"12px"}}>
                <div style={{fontSize:8,color:resultado.bonif>0?"#fbbf24":"rgba(255,255,255,.3)",fontWeight:700,marginBottom:5}}>BONIFICACAO</div>
                <div style={{fontSize:26,fontWeight:900,color:resultado.bonif>0?"#fde68a":"rgba(255,255,255,.25)",lineHeight:1,textShadow:resultado.bonif>0?"0 0 20px rgba(253,230,138,.6)":"none"}}>{fR(resultado.bonif)}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.4)",marginTop:3}}>{nivelAtual?nivelAtual.medal+" "+nivelAtual.label:"Nenhum nivel"}</div>
              </div>
            </div>
            {/* barra */}
            <div style={{height:5,background:"rgba(34,197,94,.1)",borderRadius:3,overflow:"hidden",marginBottom:5}}>
              <div style={{height:"100%",width:Math.min(100,pct)+"%",background:"linear-gradient(90deg,#22c55e,#16a34a)",borderRadius:3,transition:"width .8s",boxShadow:"0 0 10px rgba(34,197,94,.4)"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"rgba(255,255,255,.35)"}}>
              <span>{pct.toFixed(1)}% da meta</span>
              <span style={{color:proxNivelBonif?"rgba(251,191,36,.7)":"rgba(34,197,94,.7)",fontWeight:700}}>
                {proxNivelBonif?"Proximo bonus: +"+fR(proxNivelBonif.bonif)+" ("+proxNivelBonif.label+")":"Maximo atingido! 🏆"}
              </span>
            </div>
          </div>

          {/* RANKING */}
          <div style={{margin:"12px 20px 0"}}>
            <div style={{fontSize:12,fontWeight:800,marginBottom:10}}>🏆 Ranking Vendedores</div>
            {ranking.map(function(v,i){
              var p2=v.meta>0?(v.vendido/v.meta)*100:0;
              var cor=p2>=100?G.green:p2>=65?G.amber:G.red;
              var emojis=["🥇","🥈","🥉","4️⃣"];
              return (
                <div key={i} style={{background:G.card,border:"1px solid "+(i===0?"rgba(255,255,255,.12)":G.border),borderRadius:14,padding:"12px 14px",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{fontSize:20,minWidth:28}}>{emojis[i]||String(i+1)}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <div style={{fontSize:13,fontWeight:800}}>{v.nome}</div>
                        <div style={{fontSize:14,fontWeight:900,color:cor}}>{p2.toFixed(0)}%</div>
                      </div>
                      <div style={{height:4,background:G.muted2,borderRadius:2,overflow:"hidden",marginBottom:4}}>
                        <div style={{height:"100%",width:Math.min(100,p2)+"%",background:cor,borderRadius:2}}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:G.muted}}>
                        <span>{fRk(v.vendido)} vendido</span>
                        <span style={{color:p2<65?G.red:p2<100?G.amber:G.green,fontWeight:700}}>
                          {p2<65?"⬇️ Atencao":p2<85?"📌 Abaixo":p2<100?"⚡ Perto!":"✅ Meta batida"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ PLANO ══ */}
      {page==="plano"&&(
        <div className="fu" style={{position:"relative",zIndex:1,padding:"52px 20px 0"}}>
          <div style={{fontSize:22,fontWeight:900,marginBottom:14}}>📋 Plano de Acao</div>
          {plano.topicos.map(function(t,ti){
            return (
              <div key={ti} style={{background:G.card,border:"1px solid "+(t.bateu===true?"rgba(34,197,94,.4)":t.bateu===false?"rgba(239,68,68,.4)":G.border),borderRadius:16,padding:"14px",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <div style={{width:26,height:26,borderRadius:"50%",background:t.bateu===true?"rgba(34,197,94,.2)":t.bateu===false?"rgba(239,68,68,.2)":G.card2,border:"2px solid "+(t.bateu===true?G.green:t.bateu===false?G.red:G.muted2),display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,marginTop:2}}>
                    {t.bateu===true?"✅":t.bateu===false?"❌":"○"}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>{ti+1}. {t.texto}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
                      {[{label:"META",key:"meta"},{label:"REALIZADO",key:"realizado"}].map(function(f){
                        return <div key={f.key} style={{background:G.card2,borderRadius:8,padding:"6px 8px"}}>
                          <div style={{fontSize:7,color:G.muted,fontWeight:600,marginBottom:2}}>{f.label}</div>
                          <input type="text" value={t[f.key]||""} placeholder="—"
                            onChange={function(e){ var v=e.target.value; setPlano(function(p){ var ts=p.topicos.map(function(x,j){ if(j!==ti) return x; var nx=Object.assign({},x); nx[f.key]=v; return nx; }); return Object.assign({},p,{topicos:ts}); }); }}
                            style={{width:"100%",background:"transparent",border:"none",fontSize:11,color:G.white,fontWeight:600}}/>
                        </div>;
                      })}
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={function(){setPlano(function(p){ var ts=p.topicos.map(function(x,j){return j===ti?Object.assign({},x,{bateu:true}):x;}); return Object.assign({},p,{topicos:ts}); });}}
                        style={{flex:1,padding:"7px",borderRadius:9,border:"1px solid rgba(34,197,94,.4)",background:t.bateu===true?"rgba(34,197,94,.2)":"transparent",color:t.bateu===true?G.green:G.muted,fontWeight:700,fontSize:11}}>✅ Bateu</button>
                      <button onClick={function(){setPlano(function(p){ var ts=p.topicos.map(function(x,j){return j===ti?Object.assign({},x,{bateu:false}):x;}); return Object.assign({},p,{topicos:ts}); });}}
                        style={{flex:1,padding:"7px",borderRadius:9,border:"1px solid rgba(239,68,68,.4)",background:t.bateu===false?"rgba(239,68,68,.2)":"transparent",color:t.bateu===false?G.red:G.muted,fontWeight:700,fontSize:11}}>❌ Nao</button>
                      <button onClick={function(){setPlano(function(p){ var ts=p.topicos.map(function(x,j){return j===ti?Object.assign({},x,{bateu:null}):x;}); return Object.assign({},p,{topicos:ts}); });}}
                        style={{padding:"7px 10px",borderRadius:9,border:"1px solid "+G.muted2,background:"transparent",color:G.muted,fontSize:10}}>↩</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {(function(){
            var bat=plano.topicos.filter(function(t){return t.bateu===true;}).length;
            var nao=plano.topicos.filter(function(t){return t.bateu===false;}).length;
            var tot=plano.topicos.length;
            return <div style={{background:G.card,border:"1px solid "+G.border,borderRadius:14,padding:"14px",marginTop:4,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <div style={{textAlign:"center",background:"rgba(34,197,94,.1)",borderRadius:10,padding:"10px"}}><div style={{fontSize:24,fontWeight:900,color:G.green}}>{bat}</div><div style={{fontSize:9,color:G.muted}}>Bateu</div></div>
              <div style={{textAlign:"center",background:"rgba(239,68,68,.1)",borderRadius:10,padding:"10px"}}><div style={{fontSize:24,fontWeight:900,color:G.red}}>{nao}</div><div style={{fontSize:9,color:G.muted}}>Nao bateu</div></div>
              <div style={{textAlign:"center",background:G.card2,borderRadius:10,padding:"10px"}}><div style={{fontSize:24,fontWeight:900,color:G.muted}}>{tot-bat-nao}</div><div style={{fontSize:9,color:G.muted}}>Pendente</div></div>
            </div>;
          })()}
        </div>
      )}

      {/* ══ MEDIAS ══ */}
      {page==="medias"&&(
        <div className="fu" style={{position:"relative",zIndex:1,padding:"52px 20px 0"}}>
          <div style={{fontSize:22,fontWeight:900,marginBottom:2}}>📊 Planilha de Medias</div>
          <div style={{fontSize:11,color:G.muted,marginBottom:14}}>{anoAtualG} · Meta · Vendido · Resultado</div>
          {/* resumo anual */}
          <div style={{background:"linear-gradient(135deg,#052012,#081810)",border:"1px solid rgba(34,197,94,.4)",borderRadius:18,padding:"16px",marginBottom:14}}>
            <div style={{fontSize:10,color:G.green,fontWeight:700,letterSpacing:2,marginBottom:12}}>RESUMO ANUAL {anoAtualG}</div>
            <div style={{textAlign:"center",marginBottom:12}}>
              <div style={{fontSize:9,color:G.muted,fontWeight:600,marginBottom:4,letterSpacing:1}}>% ANUAL ({mediasGComV.length} meses registrados)</div>
              <div style={{fontSize:44,fontWeight:900,color:pctAnualG>=100?G.green:pctAnualG>=85?"#f59e0b":"#ef4444",lineHeight:1,letterSpacing:-1}}>{pctAnualG.toFixed(1)}%</div>
              <div style={{fontSize:11,color:fatAnualG>=metaAnualGTotal?G.green:"#ef4444",fontWeight:700,marginTop:6}}>{fatAnualG>=metaAnualGTotal?"acima da meta":"abaixo da meta"}</div>
            </div>
            <div style={{height:7,background:"rgba(255,255,255,.08)",borderRadius:3,overflow:"hidden",marginBottom:10}}>
              <div style={{height:"100%",width:Math.min(100,pctAnualG)+"%",background:pctAnualG>=100?G.green:pctAnualG>=65?"#f59e0b":"#ef4444",borderRadius:3,transition:"width .8s"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <div style={{background:"rgba(0,0,0,.3)",borderRadius:10,padding:"9px 8px"}}>
                <div style={{fontSize:7,color:G.muted,fontWeight:600,marginBottom:2}}>TOTAL META</div>
                <div style={{fontSize:13,fontWeight:900,color:G.muted,lineHeight:1}}>{fRk(metaAnualGTotal)}</div>
              </div>
              <div style={{background:"rgba(0,0,0,.3)",borderRadius:10,padding:"9px 8px"}}>
                <div style={{fontSize:7,color:G.muted,fontWeight:600,marginBottom:2}}>TOTAL VENDIDO</div>
                <div style={{fontSize:13,fontWeight:900,color:G.green,lineHeight:1}}>{fRk(fatAnualG)}</div>
              </div>
              <div style={{background:"rgba(0,0,0,.3)",borderRadius:10,padding:"9px 8px"}}>
                <div style={{fontSize:7,color:G.muted,fontWeight:600,marginBottom:2}}>MEDIA/MES</div>
                <div style={{fontSize:13,fontWeight:900,color:G.green,lineHeight:1}}>{fRk(mediaGeralG)}</div>
              </div>
            </div>
          </div>
          {/* cabeçalho tabela */}
          <div style={{display:"grid",gridTemplateColumns:"46px 1fr 1fr 60px",gap:4,padding:"7px 12px",background:G.card2,borderRadius:"10px 10px 0 0",border:"1px solid "+G.border,borderBottom:"none"}}>
            {["MES","META","VENDIDO","RESULT."].map(function(h,hi){ return <div key={hi} style={{fontSize:8,color:G.muted,fontWeight:700,textAlign:hi>0?"center":"left"}}>{h}</div>; })}
          </div>
          {/* linhas */}
          <div style={{background:G.card,border:"1px solid "+G.border,borderRadius:"0 0 18px 18px",overflow:"hidden",marginBottom:10}}>
            {mediaAnualG.map(function(m,i){
              var isAtual=i===hoje.getMonth()&&anoAtualG===hoje.getFullYear();
              var futuro=i>hoje.getMonth()&&anoAtualG===hoje.getFullYear();
              var pc=m.pctM!=null?(m.pctM>=100?G.green:m.pctM>=65?"#f59e0b":"#ef4444"):G.muted2;
              var rc=m.resultado!=null?(m.resultado>=0?G.green:"#ef4444"):G.muted2;
              var eM=mediaEditG&&mediaEditG.key===m.key&&mediaEditG.field==="meta";
              var eV=mediaEditG&&mediaEditG.key===m.key&&mediaEditG.field==="vendeu";
              return (
                <div key={i} style={{borderBottom:i<11?"1px solid "+G.border+"66":"none",background:isAtual?"rgba(34,197,94,.06)":"transparent"}}>
                  <div style={{display:"grid",gridTemplateColumns:"46px 1fr 1fr 60px",gap:4,padding:"9px 12px",alignItems:"center"}}>
                    <div style={{fontSize:11,fontWeight:700,color:isAtual?G.green:futuro?G.muted2:G.white}}>{MS_GER[i]}</div>
                    {/* meta */}
                    <div style={{textAlign:"center"}}>
                      {eM
                        ? <input autoFocus type="text" inputMode="decimal" value={mediaValG}
                            onChange={function(e){setMediaValG(e.target.value);}}
                            onBlur={commitMediaG}
                            onKeyDown={function(e){if(e.key==="Enter")commitMediaG();if(e.key==="Escape")setMediaEditG(null);}}
                            style={{width:"100%",background:G.card2,border:"1px solid #3b82f655",borderRadius:6,padding:"4px 5px",fontSize:11,fontWeight:700,color:"#3b82f6",textAlign:"center"}}/>
                        : <button onClick={function(){setMediaEditG({key:m.key,field:"meta"});setMediaValG(m.metaM!=null?String(m.metaM):"");}}
                            style={{background:"transparent",border:"1px solid "+(m.metaM!=null?"rgba(255,255,255,.15)":G.border),borderRadius:6,padding:"5px 6px",color:m.metaM!=null?"rgba(255,255,255,.6)":G.muted2,fontSize:10,fontWeight:700,width:"100%"}}>
                            {m.metaM!=null?fRk(m.metaM):"—"}
                          </button>
                      }
                    </div>
                    {/* vendido */}
                    <div style={{textAlign:"center"}}>
                      {eV
                        ? <input autoFocus type="text" inputMode="decimal" value={mediaValG}
                            onChange={function(e){setMediaValG(e.target.value);}}
                            onBlur={commitMediaG}
                            onKeyDown={function(e){if(e.key==="Enter")commitMediaG();if(e.key==="Escape")setMediaEditG(null);}}
                            style={{width:"100%",background:G.card2,border:"1px solid rgba(34,197,94,.5)",borderRadius:6,padding:"4px 5px",fontSize:11,fontWeight:700,color:G.green,textAlign:"center"}}/>
                        : <button onClick={function(){setMediaEditG({key:m.key,field:"vendeu"});setMediaValG(m.vendeuM!=null?String(m.vendeuM):"");}}
                            style={{background:m.vendeuM!=null?pc+"18":"transparent",border:"1px solid "+(m.vendeuM!=null?pc+"44":G.border),borderRadius:6,padding:"5px 6px",color:m.vendeuM!=null?pc:G.muted2,fontSize:10,fontWeight:700,width:"100%"}}>
                            {m.vendeuM!=null?fRk(m.vendeuM):"—"}
                          </button>
                      }
                    </div>
                    {/* resultado */}
                    <div style={{textAlign:"center"}}>
                      {m.resultado!=null
                        ? <div style={{fontSize:10,fontWeight:900,color:rc,lineHeight:1}}>{m.resultado>=0?"+":""}{fRk(m.resultado)}</div>
                        : <div style={{fontSize:10,color:G.muted2}}>—</div>
                      }
                    </div>
                  </div>
                  {m.pctM!=null&&(
                    <div style={{padding:"0 12px 7px"}}>
                      <div style={{height:3,background:G.muted2,borderRadius:2,overflow:"hidden"}}>
                        <div style={{height:"100%",width:Math.min(100,m.pctM)+"%",background:pc,borderRadius:2}}/>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{fontSize:9,color:G.muted,textAlign:"center",marginBottom:6}}>Toque em META ou VENDIDO para editar</div>
        </div>
      )}

      {/* ══ CONFIG ══ */}
      {page==="config"&&(
        <div className="fu" style={{position:"relative",zIndex:1,padding:"52px 20px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:22,fontWeight:900}}>Configuracoes</div>
            <button onClick={doLogout} style={{padding:"6px 12px",borderRadius:10,border:"1px solid rgba(239,68,68,.4)",background:"rgba(239,68,68,.1)",color:G.red,fontSize:10,fontWeight:700}}>Sair</button>
          </div>
          {/* PERFIL */}
          <div style={{background:G.card,border:"1px solid rgba(255,255,255,.1)",borderRadius:18,padding:"16px",marginBottom:10}}>
            <div style={{fontSize:9,color:G.muted,fontWeight:600,marginBottom:12}}>PERFIL DO GERENTE</div>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
              <div style={{position:"relative",flexShrink:0}}>
                {cfg.foto
                  ? <img src={cfg.foto} alt="f" style={{width:66,height:66,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(255,255,255,.2)"}}/>
                  : <div style={{width:66,height:66,borderRadius:"50%",background:"#1c1c22",border:"2px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:900,color:"rgba(255,255,255,.3)"}}>{(cfg.nome||"G").charAt(0).toUpperCase()}</div>
                }
                <button onClick={function(){fotoRef.current&&fotoRef.current.click();}}
                  style={{position:"absolute",bottom:0,right:0,width:22,height:22,borderRadius:"50%",background:"#fff",border:"2px solid "+G.card,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#000",fontWeight:700}}>📷</button>
                <input ref={fotoRef} type="file" accept="image/*" onChange={handleFoto} style={{display:"none"}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:17,fontWeight:900,color:G.white}}>{cfg.nome||"Gerente"}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:2}}>Gerente de Vendas</div>
              </div>
            </div>
            <div style={{fontSize:9,color:G.muted,fontWeight:600,marginBottom:5}}>NOME</div>
            <input value={cfg.nome||""} onChange={function(e){setCfg({nome:e.target.value});}}
              style={{width:"100%",background:G.card2,border:"1px solid "+G.border,borderRadius:10,padding:"10px 12px",fontSize:14,color:G.white,fontWeight:700}}/>
          </div>
          {/* META + DIAS */}
          <div style={{background:G.card,border:"1px solid rgba(255,255,255,.1)",borderRadius:18,padding:"14px 16px",marginBottom:10}}>
            <div style={{fontSize:9,color:G.muted,fontWeight:600,marginBottom:6}}>META DA LOJA (R$)</div>
            <div style={{position:"relative",marginBottom:14}}>
              <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,fontWeight:800,color:G.white,pointerEvents:"none"}}>R$</div>
              <input type="text" inputMode="decimal" value={cfg.metaLoja?String(cfg.metaLoja):""}
                onChange={function(e){var v=pRS(e.target.value)||350000;setCfg({metaLoja:v});}}
                placeholder="350000" style={{width:"100%",background:G.card2,border:"1px solid rgba(255,255,255,.12)",borderRadius:12,padding:"12px 12px 12px 38px",fontSize:20,fontWeight:900,color:G.white}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:12,fontWeight:700}}>Dias Uteis</div><div style={{fontSize:9,color:G.muted}}>no periodo</div></div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <button onClick={function(){setCfg({diasTrab:Math.max(1,diasEf-1)});}} style={{width:32,height:32,borderRadius:8,border:"1px solid "+G.border,background:G.card2,color:G.muted,fontSize:16,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <span style={{fontSize:20,fontWeight:900,color:G.white,minWidth:32,textAlign:"center"}}>{diasEf}</span>
                <button onClick={function(){setCfg({diasTrab:diasEf+1});}} style={{width:32,height:32,borderRadius:8,border:"1px solid "+G.border,background:G.card2,color:G.muted,fontSize:16,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
            </div>
          </div>
          {/* METAS CASCATA */}
          <div style={{background:G.card,border:"1px solid rgba(255,255,255,.1)",borderRadius:18,overflow:"hidden",marginBottom:10}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+G.border,display:"flex",justifyContent:"space-between"}}>
              <div style={{fontSize:11,fontWeight:800}}>Metas em Cascata</div>
              <div style={{fontSize:9,color:G.muted}}>+10% cada nivel</div>
            </div>
            {cascata.map(function(metaNivel,i){
              var b=BONIF[i];
              var comNivel=metaNivel*0.01;
              var totalNivel=comNivel+b.bonif;
              var atingiu=vendido>=metaNivel;
              var pctN=metaNivel>0?Math.min(100,(vendido/metaNivel)*100):0;
              return (
                <div key={i} style={{borderBottom:i<3?"1px solid "+G.border:"none",background:atingiu?b.color+"08":"transparent"}}>
                  <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
                      <div style={{width:40,height:40,borderRadius:12,background:atingiu?b.color+"20":G.card2,border:"1px solid "+(atingiu?b.color+"55":G.border),display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{b.medal}</div>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                          <div style={{fontSize:13,fontWeight:800,color:atingiu?b.color:G.muted}}>{b.label}</div>
                          {atingiu&&<div style={{fontSize:8,color:G.green,fontWeight:800,background:"rgba(34,197,94,.15)",padding:"1px 6px",borderRadius:4}}>✅</div>}
                        </div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>Meta: {fR(metaNivel)}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0,marginLeft:8}}>
                      <div style={{fontSize:8,color:G.muted,marginBottom:2}}>1% + bonus</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,.7)",fontWeight:600}}>{fRk(comNivel)} + {fRk(b.bonif)}</div>
                      <div style={{fontSize:18,fontWeight:900,color:atingiu?G.green:"rgba(255,255,255,.45)",lineHeight:1,marginTop:2}}>{fR(totalNivel)}</div>
                    </div>
                  </div>
                  <div style={{padding:"0 16px 10px"}}>
                    <div style={{height:4,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden",marginBottom:4}}>
                      <div style={{height:"100%",width:pctN+"%",background:atingiu?G.green:"rgba(255,255,255,.2)",borderRadius:2,transition:"width .6s"}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:G.muted}}>
                      <span style={{color:atingiu?G.green:"rgba(255,255,255,.3)",fontWeight:700}}>{pctN.toFixed(1)}%</span>
                      {!atingiu&&<span>Falta {fRk(Math.max(0,metaNivel-vendido))}</span>}
                      {atingiu&&<span style={{color:G.green,fontWeight:700}}>💰 {fR(totalNivel)}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ MODAL LANCAR ══ */}
      {editando&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(12px)",padding:"0 24px"}} onClick={function(){setEditando(false);}}>
          <div className="fu" style={{background:G.card,borderRadius:24,padding:"24px 22px 22px",width:"100%",maxWidth:380,border:"1px solid rgba(255,255,255,.1)",boxShadow:"0 24px 64px rgba(0,0,0,.8)"}} onClick={function(e){e.stopPropagation();}}>
            <div style={{width:34,height:4,background:G.muted2,borderRadius:2,margin:"0 auto 16px"}}/>
            <div style={{fontSize:9,color:G.muted,fontWeight:600,letterSpacing:1,marginBottom:4}}>LANCAR FATURAMENTO</div>
            <div style={{fontSize:20,fontWeight:900,marginBottom:12}}>Total do periodo</div>
            <div style={{position:"relative",marginBottom:8}}>
              <div style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:22,fontWeight:900,color:G.white,pointerEvents:"none",zIndex:1}}>R$</div>
              <input ref={inputRef} type="text" inputMode="decimal" value={inputVal}
                onChange={function(e){setInputVal(e.target.value.replace(/[^0-9,.]/g,""));}}
                onKeyDown={function(e){if(e.key==="Enter")salvar();}} placeholder="0,00"
                style={{width:"100%",background:G.card2,border:"2px solid rgba(255,255,255,.2)",borderRadius:16,padding:"18px 16px 18px 56px",fontSize:38,fontWeight:900,color:G.white,letterSpacing:-1}}/>
            </div>
            {(function(){
              var v=pRS(inputVal); if(!v||v<=0) return null;
              var p2=metaLoja>0?(v/metaLoja)*100:0;
              return <div style={{textAlign:"center",marginBottom:10,fontSize:11,fontWeight:700,color:p2>=100?G.green:G.amber}}>
                {p2>=100?"✅ Meta batida!":"📌 "+p2.toFixed(1)+"% da meta"}
              </div>;
            })()}
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button onClick={function(){setEditando(false);setInputVal("");}} style={{flex:1,padding:"13px",borderRadius:14,border:"1px solid "+G.border,background:G.card2,color:G.muted,fontWeight:700,fontSize:12}}>Cancelar</button>
              <button className="tap" onClick={salvar} style={{flex:2,padding:"13px",borderRadius:14,border:"none",background:"#fff",color:"#000",fontWeight:900,fontSize:14,boxShadow:"0 6px 20px rgba(255,255,255,.15)"}}>Confirmar ✓</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ NAV ══ */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:420,zIndex:50}}>
        <div style={{background:G.card,borderTop:"1px solid "+G.border,display:"grid",gridTemplateColumns:"1fr 56px 1fr 1fr 1fr",alignItems:"center",padding:"6px 8px 20px",gap:4}}>
          <button onClick={function(){setPage("home");}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"5px",border:"none",background:page==="home"?"rgba(255,255,255,.08)":"transparent",borderRadius:8,color:page==="home"?G.white:G.muted}}>
            <span style={{fontSize:18,lineHeight:1}}>📊</span><span style={{fontSize:7,fontWeight:600}}>Dashboard</span>
          </button>
          <div style={{display:"flex",justifyContent:"center"}}>
            <button className="tap" onClick={function(){setEditando(true);setInputVal(cfg.vendidoStr||"");}}
              style={{width:46,height:46,borderRadius:"50%",background:"#fff",border:"none",fontSize:22,fontWeight:900,color:"#000",boxShadow:"0 4px 16px rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}>+</button>
          </div>
          <button onClick={function(){setPage("plano");}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"5px",border:"none",background:page==="plano"?"rgba(255,255,255,.08)":"transparent",borderRadius:8,color:page==="plano"?G.white:G.muted}}>
            <span style={{fontSize:18,lineHeight:1}}>📋</span><span style={{fontSize:7,fontWeight:600}}>Plano</span>
          </button>
          <button onClick={function(){setPage("medias");}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"5px",border:"none",background:page==="medias"?"rgba(255,255,255,.08)":"transparent",borderRadius:8,color:page==="medias"?G.white:G.muted}}>
            <span style={{fontSize:18,lineHeight:1}}>📊</span><span style={{fontSize:7,fontWeight:600}}>Medias</span>
          </button>
          <button onClick={function(){setPage("config");}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"5px",border:"none",background:page==="config"?"rgba(255,255,255,.08)":"transparent",borderRadius:8,color:page==="config"?G.white:G.muted}}>
            <span style={{fontSize:18,lineHeight:1}}>⚙️</span><span style={{fontSize:7,fontWeight:600}}>Config</span>
          </button>
        </div>
      </div>
    </div>
  );
}

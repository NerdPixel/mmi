(this.webpackJsonpmmi=this.webpackJsonpmmi||[]).push([[0],{67:function(e,n,t){},68:function(e,n,t){},84:function(e,n,t){"use strict";t.r(n);var c,i,r=t(0),o=t.n(r),a=t(17),s=t.n(a),j=(t(67),t(4)),u=t(33),p=t(34),l=t(90),b=t(88),f=t(91),d=(t(68),t(47)),O=t.n(d),h=t(29),m=t.n(h),g=t(6),x=p.a.div(c||(c=Object(u.a)(["\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    margin-top: 30px;\n"]))),v=p.a.div(i||(i=Object(u.a)(["\n    display: flex;\n    flex-direction: column;\n"]))),P=t(79),S=function(){var e=Object(r.useState)(new P("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")),n=Object(j.a)(e,1)[0],t=Object(r.useState)(!1),c=Object(j.a)(t,2),i=c[0],o=c[1],a=Object(h.useSpeechRecognition)(),s=a.transcript,u=a.resetTranscript,p=Object(r.useState)(n.fen()),d=Object(j.a)(p,2),S=d[0],k=d[1];return Object(g.jsx)(x,{children:Object(g.jsxs)(l.b,{children:[Object(g.jsx)("div",{className:"flex-center",children:Object(g.jsx)(O.a,{width:800,position:S,onDrop:function(e){return function(e){n.move(e)&&(setTimeout((function(){var e=n.moves();if(e.length>0){var t=e[Math.floor(Math.random()*e.length)];n.move(t),k(n.fen())}}),300),k(n.fen()))}({from:e.sourceSquare,to:e.targetSquare,promotion:"q"})}})}),Object(g.jsxs)(v,{children:[Object(g.jsx)(b.a,{type:"primary",icon:Object(g.jsx)(f.a,{}),onClick:function(){i?(o(!1),m.a.stopListening()):(u(),o(!0),m.a.startListening({continuous:!0,language:"en-US"}))},children:i?"Listening...":"Click to talk"}),Object(g.jsxs)("span",{children:["Transcript: ",s]})]})]})})},k=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,92)).then((function(n){var t=n.getCLS,c=n.getFID,i=n.getFCP,r=n.getLCP,o=n.getTTFB;t(e),c(e),i(e),r(e),o(e)}))};s.a.render(Object(g.jsx)(o.a.StrictMode,{children:Object(g.jsx)(S,{})}),document.getElementById("root")),k()}},[[84,1,2]]]);
//# sourceMappingURL=main.02858530.chunk.js.map
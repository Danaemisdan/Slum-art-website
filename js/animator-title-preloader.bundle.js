"use client";(()=>{var Ra=Object.create;var _e=Object.defineProperty;var Fa=Object.getOwnPropertyDescriptor;var Sa=Object.getOwnPropertyNames;var Na=Object.getPrototypeOf,La=Object.prototype.hasOwnProperty;var Ie=(t,a)=>()=>{try{return a||t((a={exports:{}}).exports,a),a.exports}catch(n){throw a=0,n}};var Ta=(t,a,n,r)=>{if(a&&typeof a=="object"||typeof a=="function")for(let o of Sa(a))!La.call(t,o)&&o!==n&&_e(t,o,{get:()=>a[o],enumerable:!(r=Fa(a,o))||r.enumerable});return t};var Oa=(t,a,n)=>(n=t!=null?Ra(Na(t)):{},Ta(a||!t||!t.__esModule?_e(n,"default",{value:t,enumerable:!0}):n,t));var Ve=Ie(c=>{"use strict";var re=Symbol.for("react.transitional.element"),_a=Symbol.for("react.portal"),Ia=Symbol.for("react.fragment"),Pa=Symbol.for("react.strict_mode"),za=Symbol.for("react.profiler"),ja=Symbol.for("react.consumer"),Wa=Symbol.for("react.context"),$a=Symbol.for("react.forward_ref"),Ja=Symbol.for("react.suspense"),Ka=Symbol.for("react.memo"),$e=Symbol.for("react.lazy"),Ya=Symbol.for("react.activity"),Qa=Symbol.for("react.view_transition"),Pe=Symbol.iterator;function Za(t){return t===null||typeof t!="object"?null:(t=Pe&&t[Pe]||t["@@iterator"],typeof t=="function"?t:null)}var Je={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Ke=Object.assign,Ye={};function Mt(t,a,n){this.props=t,this.context=a,this.refs=Ye,this.updater=n||Je}Mt.prototype.isReactComponent={};Mt.prototype.setState=function(t,a){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,a,"setState")};Mt.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Qe(){}Qe.prototype=Mt.prototype;function oe(t,a,n){this.props=t,this.context=a,this.refs=Ye,this.updater=n||Je}var se=oe.prototype=new Qe;se.constructor=oe;Ke(se,Mt.prototype);se.isPureReactComponent=!0;var ze=Array.isArray;function ne(){}var y={H:null,A:null,T:null,S:null},Ze=Object.prototype.hasOwnProperty;function ie(t,a,n){var r=n.ref;return{$$typeof:re,type:t,key:a,ref:r!==void 0?r:null,props:n}}function Ua(t,a){return ie(t.type,a,t.props)}function pe(t){return typeof t=="object"&&t!==null&&t.$$typeof===re}function qa(t){var a={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return a[n]})}var je=/\/+/g;function ae(t,a){return typeof t=="object"&&t!==null&&t.key!=null?qa(""+t.key):a.toString(36)}function Va(t){switch(t.status){case"fulfilled":return t.value;case"rejected":throw t.reason;default:switch(typeof t.status=="string"?t.then(ne,ne):(t.status="pending",t.then(function(a){t.status==="pending"&&(t.status="fulfilled",t.value=a)},function(a){t.status==="pending"&&(t.status="rejected",t.reason=a)})),t.status){case"fulfilled":return t.value;case"rejected":throw t.reason}}throw t}function Dt(t,a,n,r,o){var i=typeof t;(i==="undefined"||i==="boolean")&&(t=null);var l=!1;if(t===null)l=!0;else switch(i){case"bigint":case"string":case"number":l=!0;break;case"object":switch(t.$$typeof){case re:case _a:l=!0;break;case $e:return l=t._init,Dt(l(t._payload),a,n,r,o)}}if(l)return o=o(t),l=r===""?"."+ae(t,0):r,ze(o)?(n="",l!=null&&(n=l.replace(je,"$&/")+"/"),Dt(o,a,n,"",function(E){return E})):o!=null&&(pe(o)&&(o=Ua(o,n+(o.key==null||t&&t.key===o.key?"":(""+o.key).replace(je,"$&/")+"/")+l)),a.push(o)),1;l=0;var C=r===""?".":r+":";if(ze(t))for(var h=0;h<t.length;h++)r=t[h],i=C+ae(r,h),l+=Dt(r,a,n,i,o);else if(h=Za(t),typeof h=="function")for(t=h.call(t),h=0;!(r=t.next()).done;)r=r.value,i=C+ae(r,h++),l+=Dt(r,a,n,i,o);else if(i==="object"){if(typeof t.then=="function")return Dt(Va(t),a,n,r,o);throw a=String(t),Error("Objects are not valid as a React child (found: "+(a==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":a)+"). If you meant to render a collection of children, use an array instead.")}return l}function _t(t,a,n){if(t==null)return t;var r=[],o=0;return Dt(t,r,"","",function(i){return a.call(n,i,o++)}),r}function Xa(t){if(t._status===-1){var a=t._result,n=a();n.then(function(r){(t._status===0||t._status===-1)&&(t._status=1,t._result=r,n.status===void 0&&(n.status="fulfilled",n.value=r))},function(r){(t._status===0||t._status===-1)&&(t._status=2,t._result=r,n.status===void 0&&(n.status="rejected",n.reason=r))}),t._status===-1&&(t._status=0,t._result=n)}if(t._status===1)return t._result.default;throw t._result}var We=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var a=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(a))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)};function Ue(t){var a=y.T,n={};n.types=a!==null?a.types:null,y.T=n;try{var r=t(),o=y.S;o!==null&&o(n,r),typeof r=="object"&&r!==null&&typeof r.then=="function"&&r.then(ne,We)}catch(i){We(i)}finally{a!==null&&n.types!==null&&(a.types=n.types),y.T=a}}function qe(t){var a=y.T;if(a!==null){var n=a.types;n===null?a.types=[t]:n.indexOf(t)===-1&&n.push(t)}else Ue(qe.bind(null,t))}var tn={map:_t,forEach:function(t,a,n){_t(t,function(){a.apply(this,arguments)},n)},count:function(t){var a=0;return _t(t,function(){a++}),a},toArray:function(t){return _t(t,function(a){return a})||[]},only:function(t){if(!pe(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};c.Activity=Ya;c.Children=tn;c.Component=Mt;c.Fragment=Ia;c.Profiler=za;c.PureComponent=oe;c.StrictMode=Pa;c.Suspense=Ja;c.ViewTransition=Qa;c.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=y;c.__COMPILER_RUNTIME={__proto__:null,c:function(t){return y.H.useMemoCache(t)}};c.addTransitionType=qe;c.cache=function(t){return function(){return t.apply(null,arguments)}};c.cacheSignal=function(){return null};c.cloneElement=function(t,a,n){if(t==null)throw Error("The argument must be a React element, but you passed "+t+".");var r=Ke({},t.props),o=t.key;if(a!=null)for(i in a.key!==void 0&&(o=""+a.key),a)!Ze.call(a,i)||i==="key"||i==="__self"||i==="__source"||i==="ref"&&a.ref===void 0||(r[i]=a[i]);var i=arguments.length-2;if(i===1)r.children=n;else if(1<i){for(var l=Array(i),C=0;C<i;C++)l[C]=arguments[C+2];r.children=l}return ie(t.type,o,r)};c.createContext=function(t){return t={$$typeof:Wa,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null},t.Provider=t,t.Consumer={$$typeof:ja,_context:t},t};c.createElement=function(t,a,n){var r,o={},i=null;if(a!=null)for(r in a.key!==void 0&&(i=""+a.key),a)Ze.call(a,r)&&r!=="key"&&r!=="__self"&&r!=="__source"&&(o[r]=a[r]);var l=arguments.length-2;if(l===1)o.children=n;else if(1<l){for(var C=Array(l),h=0;h<l;h++)C[h]=arguments[h+2];o.children=C}if(t&&t.defaultProps)for(r in l=t.defaultProps,l)o[r]===void 0&&(o[r]=l[r]);return ie(t,i,o)};c.createRef=function(){return{current:null}};c.forwardRef=function(t){return{$$typeof:$a,render:t}};c.isValidElement=pe;c.lazy=function(t){return{$$typeof:$e,_payload:{_status:-1,_result:t},_init:Xa}};c.memo=function(t,a){return{$$typeof:Ka,type:t,compare:a===void 0?null:a}};c.startTransition=Ue;c.unstable_useCacheRefresh=function(){return y.H.useCacheRefresh()};c.use=function(t){return y.H.use(t)};c.useActionState=function(t,a,n){return y.H.useActionState(t,a,n)};c.useCallback=function(t,a){return y.H.useCallback(t,a)};c.useContext=function(t){return y.H.useContext(t)};c.useDebugValue=function(){};c.useDeferredValue=function(t,a){return y.H.useDeferredValue(t,a)};c.useEffect=function(t,a){return y.H.useEffect(t,a)};c.useEffectEvent=function(t){return y.H.useEffectEvent(t)};c.useId=function(){return y.H.useId()};c.useImperativeHandle=function(t,a,n){return y.H.useImperativeHandle(t,a,n)};c.useInsertionEffect=function(t,a){return y.H.useInsertionEffect(t,a)};c.useLayoutEffect=function(t,a){return y.H.useLayoutEffect(t,a)};c.useMemo=function(t,a){return y.H.useMemo(t,a)};c.useOptimistic=function(t,a){return y.H.useOptimistic(t,a)};c.useReducer=function(t,a,n){return y.H.useReducer(t,a,n)};c.useRef=function(t){return y.H.useRef(t)};c.useState=function(t){return y.H.useState(t)};c.useSyncExternalStore=function(t,a,n){return y.H.useSyncExternalStore(t,a,n)};c.useTransition=function(){return y.H.useTransition()};c.version="19.3.1"});var ta=Ie((vn,Xe)=>{"use strict";Xe.exports=Ve()});var e=Oa(ta()),ea={ember:{stage:"#151413",ink:"#f6efe4",muted:"#9a8b77",rough:"#27e1f2",ghost:"#ff2e88",word0:"#f8bd8a",word1:"#fde3c4",word2:"#ffffff",sleeve0:"#f3672f",sleeve1:"#e4432b",sleeve2:"#a51b2e",pattern:"#ffa15a",speck:"#3d0a12",skin0:"#ff4a83",skin1:"#e01a5c",skin2:"#9c0e43",nail:"#ff9dbd",cuff:"#c0143e"},dusk:{stage:"#0f1424",ink:"#f3ecdf",muted:"#8791a8",rough:"#ffd23f",ghost:"#ff5d73",word0:"#ffd8a8",word1:"#fff0dc",word2:"#ffffff",sleeve0:"#2aa198",sleeve1:"#16786f",sleeve2:"#0b4a4a",pattern:"#f2c14e",speck:"#06222a",skin0:"#d98a5e",skin1:"#b4673f",skin2:"#7a3f22",nail:"#efb391",cuff:"#e2a12c"},paper:{stage:"#efe7da",ink:"#1f1a16",muted:"#8a7d6c",rough:"#1aa6d9",ghost:"#ef4f7e",word0:"#2a1f1a",word1:"#3b2c24",word2:"#151110",sleeve0:"#4a6cf0",sleeve1:"#2f4fd0",sleeve2:"#1b2c86",pattern:"#a9c2ff",speck:"#0b1340",skin0:"#f6b08c",skin1:"#e08e66",skin2:"#a85a3c",nail:"#ffd3bd",cuff:"#ec4b2f"}},en='"Syne", "Outfit", "Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',an='"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace',nn='"Segoe Script", "Bradley Hand", "Snell Roundhand", "Brush Script MT", cursive',aa=["Rough","Ink","Paint","Final"],na=520,rn=1150,ra=760,oa=900,on=760,sa=300,le=1e3,sn=600,ia=24,pn=52,ln="8:3947@ :47@ :3;47@ 5F4G5H6G5F|;937: :37: B3@: C3@:|==/6O C/<O 6<D< 5BCB|=>/6L C/;L D7C8D9E8E7D5C4@3<39476788:9;@?BA 789:@>A?BABDAF@G=H9H6G5F4D4C5B6C5D|>G35H :3<5<7;99:7:58566483:3<4?5B5E4G3 CAAB@D@FBHDHFGGEGCEACA|?I;H<I=J<J;I:H:F;D=?E=G;H8H5G4E4C5A6@8?==?<A:B8B6A4?3=4<6<9=?>B@EBGDHFHGFGE 8H6G5E5C6A7@== <9=>>A@DBFDGFGGF|8:594:3;4;5:789|:A/=2:5886<5A5E6J7M8O =2:68:7=6B6G7L8O|9;/<1=4>9>==B;F9I6L2O ;/<2=7=<<A;D9H6L|;<3<? 76A< A67<|??6?H 6?H?|85H4G5F6G6H5J3L|?6?H?|77F6G7H8G7F|=J/0O|=>3;496796<5@5C6F7G9H;H>G@EBBC?D;D8C5B4@3>3 >3<4:6897<6@6C7F9H ;H=G?EABB?C;C8B5@3|=>79H @3:H @3=6:889 ?6;889|=97:899888795:4=3@3C4D6D8C:A<>>:@7B5D3H @3B4C6C8B:@<:@ 4F5E7E<G?GAFBD 7E<H?HAGBD|=97:899888795:4=3@3C4D6D8C:@<== @3B4C6C8B:@< ;===@>A?BABDAF@G=H9H6G5F4D4C5B6C5D ==?>@?AAAD@F?G=H|=B4<H C3=H C34BDB|=;36= ;3E3 ;4@4E3 6=7<:;=;@<A=B?BBAE?G<H9H6G5F4D4C5B6C5D =;?<@=A?AB@E>G<H|=C6B7C8D7D6C4A3>3;496796<5@5D6F7G9H<H?GAEBCB@A>@=><;<9=7?6A >3<4:6897<6@6E7G <H>G@EACA?@=|=8369 E3D6B9=?;B:D9H B9<?:B9D8H 76:3<3A6 85:4<4A6C6D5E3|==3:495878:9<;=>=B<C;D9D6C4@3=3 =3;4:5979::<;= >=A<B;C9C6B4@3 ;=7>5@4B4E5G8H<H@GAFBDBAA?@>>= ;=8>6@5B5E6G8H <H?G@FADA@@>|=C:B<@>>?;?9>8=7;7886:4=3@3B4C5D7D;C?BB@E>G;H8H6G5E5D6C7D6E 9>8<8896;4=3 B4C6C;B?AB?E=G;H|88:7;8<9;8: 5F4G5H6G|88:7;8<9;8: 5H4G5F6G6H5J3L|>F66?FH|?6<H< 6BHB|>66F?6H|=97:899888795:4=3A3D4E6E8D:C;==;>;@<A>A A3C4D6D8C:B;@< :F9G:H;G:F|@D;C9A8>8<9;::=:@;B=C@CBBC@ >8<:;=;@<B=C D8C@CBECGCIAJ>J<I9H7F5D4A3>3;49577695<5?6B7D9F;G>HAHDGFFGE E8D@DBEC|;2H4G7D:@>9A3AH@E>B<@9>7>6?6A7C9E<G?HDH|=?5@6@9?=>@=B;E9G7H6H5G5D6?7<8::7<5>4A3D3F4G6G8F:E;C<@= ?=@=C>D?EAEDDFCGAH>H<G;E|<>9>:?;A;C:D8D6C4A3>3;496796;5?5C6F7G9H;H>G@EAC|>?3=4<6;::@9C8E6G4H2H1G1E2D4D6E8G;H>HAGCEEAF<F8E5D4B3?3=5=7>:@=B?EAGB|<@7@8A9C9D8D6C4@3<39486899;:<==:=7>6?5A5D6F7G:H=H@GBECC|<<9:9887684;3>3B4E4G3 B4@;>A<E:G8H6H4G3E3C4B6B8C ;=D=|>2H4G8C;><;=7=4<3;3:49699:;<<@<C;D:E8E>DCCEAG>H:H7G5E4C4A|>9:7967667493:3<4=6=8<<:B8F6H4H3G3E 9?B<D;G9I7J5J4I3H3F5D9B?ADAGBHCHEGFFHC|:@C>A<>;<:9:6;4<3>3?4@6@9?>=C<E:G8H6H4G3E3C4B6B8C|9<K:H8C7=7784:3<3=4>7>:=?:H8N7Q6S4T3S3Q4N6K8I;G?E|>9:7967667493:3<4=6=8<<:B8F6H4H3G3E J6J4I3H3F4D6B9@;><<< ><?>?E@GAHBHDGEFGC|<6?8?<>?<A:B8B5A3?3>4=6<;;@:C9E7G5H3H2G2E3D5D7E:G=H?HBGDE|A7:594746547383:4;6;8:=9A7H 9A<9>5?4A3B3D4E6E8D=CAAH CAF9H5I4K3L3N4O6O8N=LDLGMHNHPGQFSC|=7:594746547383:4;6;8:=9A7H 9A<9>5?4A3C3E4F6F8E=CDCGDHEHGGHFJC|=>3;496796;5?5C6F7G9H;H>G@EBBC@D<D8C5B4@3>3<5<8=;?>A@DBFC|??5@6@9?=>@=B;E9G7H6H5G5D6?7<8::7<5>4A3F3H4I5J7J:I<H=F>C>A=@<|>?9>;=<;=9=8;8996;4>3A3C4D6D:C=A@=D:F8G5H3H2G2E3D5D7E:G=H@HCGEE|??5@6@9?=>@=B;E9G7H6H5G5D6?7<8::7<5>4A3E3G4H5I7I:H<G=E>B>?=@>A@AEBGDHFGGFIC|<2H4G6E9A;>=:>7>4=3<3;4:6:8;:=<@>B@CBCDBFAG>H:H7G5E4C4A|;<9:9887684;3>3B4E4G3 B4@;>A<E:G8H6H4G3E3C4B6B8C|=7:594746547383:4;6;8:<9?8C8E9G;H=H?G@FBBE:G3 E:D>CDCGDHEHGGHFJC|=7:594746547383:4;6;8:<9?8C8F9H;H=G@DBAD=E:F6F4E3D3C4B6B8C;E=G>|?7:594746547383:4;6;9:H D3:H D3BH P3N4K7H;EABH|>:989787684:3<3>4?6?9=B=E>G@HBHDGEEECDBBB I6I4H3F3D4B6@9<B:E8G6H4H3G3E|=7:594746547383:4;6;8:<9?8C8E9G:H<H>G@EBBC@E: G3E:BD@J>O<S:T9S9Q:N<K?HBFGC|=?9>;=<;=9=8;8996;4>3A3C4D6D:C=AA>D:G8H5H4G4E5D8D:E;F<H<K;N:P8S6T5S5Q6N8K;H>FDC|96/6O 7/7O 6/=/ 6O=O|923@K|9;/;O </<O 5/</ 5O<O|:89:6<9 5<:7?< :7:H|:2JBJ|8;395878899:897|<;B:@8?6?4@3A2C2E3G5H7H9G:E<?;D;G<H=H?G@FBC|;2C4@7;8996948364564:3A3G4H5H7G9E:B:?;C<D>D@C|89A9@8?6?4@3A2C2E3G5H8H;F=C|<;B:@8?6?4@3A2C2E3G5H7H9G:E@3 <?;D;G<H=H?G@FBC|83F5E6D7B7@6?5?3@2B2E3G5H7H9G:F<C|72C6>8;99:6:49374664>1G.N-Q-S.T0S1P2G3H5H7G8F:C|;;B:@8?6?4@3A2C2E3G5H7H9G:F <?:F6Q5S3T2S2Q3N6K9I;H>FAC|<2C4@7;8996948364564:3@2H 2H3E4C6@8?:?;@;B:E:G;H<H>G?FAC|75:5;6;6:5: 2C4?2E2G3H4H6G7F9C|75:5;6;6:5: 2C4?.Q-S+T*S*Q+N.K1I3H6F9C|;2C4@7;8996948364564:3@2H 2H3E4C6@8?:?;@;B9C6C 6C8D9G:H;H=G>F@C|72C4@7;8996948364564:3A3G4H5H7G8F:C|>2C4@6?7@7A6E5H 6E7C9@;?=?>@>A=E<H =E>C@@B?D?E@EBDEDGEHFHHGIFKC|<2C4@6?7@7A6E5H 6E7C9@;?=?>@>B=E=G>H?HAGBFDC|:8?6?4@3A2C2E3G5H7H9G:F;D;B:@8?7@7B8D:E=E?D@C|:2C4@5>4B.T 4B5@7?9?;@<B<D;F:G8H 4G6H9H<G>FAC|;;B:@8?6?4@3A2C2E3G5H7H9G <?;B9G6N5Q5S6T8S9P9I;H>FAC|:2C4@5>5@8@9A9C8F8G9H:H<G=F?C|92C4@5>5@7C8E8G6H 2G4H8H:G;F=C|82C4@6< 933E3G4H6H8G9F;C 3;:;|;2C4?2E2G3H5H7G9E;B <?:E:G;H<H>G?FAC|;2C4?3D3G4H5H8G:E;B;? ;?<C=D?DAC|>5?3A2D2F3H5H7G9E ;?9E9G:H<H>G@EABA? A?BCCDEDGC|:2C4@6?8?9@9G:H=H@FBC ?@>?<?;@7G6H4H3G|;2C4?2E2G3H5H7G9E;B <?6Q5S3T2S2Q3N6K9I;H>FAC|:2C4@6?8?:A:C9E7G4H6I7K7N6Q5S3T2S2Q3N6K9I=F@C|9;/908173758798:::<8> 90828496:7;9;;:=6?:A;C;E:G9H8J8L9N 8@:B:D9F8G7I7K8M9N;O|66/6O|97/90:1;3;5:7988:8<:> 90:2:49687797;8=<?8A7C7E8G9H:J:L9N :@8B8D9F:G;I;K:M9N7O|>5B5@6=8<:<<=@@BADAF@G> 5@6>8=:=<>@ABBDBFAG>G<",cn="7737A 7F6G7H8G7F|:636: >3>:|==/6O C/<O 6<D< 5BCB|<:/:L >/>L C6A4>3:37456586:7;9<?>A?B@CBCEAG>H:H7G5E|>G35H :3<5<7;99:7:58566483:3<4?5B5E4G3 CAAB@D@FBHDHFGGEGCEACA|?I<I;H:G:F;E=CBAE?G=H9H7G6F5D5B6@7?>;?:@8@6?4=3;4:6:8;;=>BEDGFHHHIGIF|775647384867869|9=/;194786=6A7F9J;M=O|95/7194;8<=<A;F9J7M5O|::9:E 5<?B ?<5B|??6?H 6?H?|67D6E5D6C7D7F5H|?6?H?|66C5D6E7D6C|=F/4O|<;384675<5?6D8G;H=H@GBDC?C<B7@4=3;3|<87:6=3=H|<68677584:3>3@4A5B7B9A;?>5HCH|<73B3<;?;A<B=C@CBBE@G=H:H7G6F5D|<?35ADA ?3?H|<A3736<7;::=:@;B=C@CBBE@G=H:H7G6F5D|<B6A4>3<394776<6A7E9G<H=H@GBECBCAB>@<=;<;9<7>6A|<C39H 53C3|<:37466687:9;=<@=B?CACDBFAG>H:H7G6F5D5A6?8=;<?;A:B8B6A4>3:3|<B:A=??<@;@8?6=5:596684;3<3?4A6B:B?AD?G<H:H7G6E|66<5=6>7=6< 6C5D6E7D6C|66<5=6>7=6< 7D6E5D6C7D7F5H|>F66?FH|?6<H< 6BHB|>66F?6H|;5857657493=3?4@5A7A9@;?<;>;A ;F:G;H<G;F|@D;C9A8>8<9;::=:@;B=C@CBBC@ >8<:;=;@<B=C D8C@CBECGCIAJ>J<I9H7F5D4A3>3;49577695<5?6B7D9F;G>HAHDGFFGE E8D@DBEC|;;33H ;3CH 6A@A|<636H 63?3B4C5D7D9C;B<?= 6=?=B>C?DADDCFBG?H6H|=D8C6A4?3;39476685;5@6C7E9G;H?HAGCEDC|<636H 63=3@4B6C8D;D@CCBE@G=H6H|;636H 63C3 6=>= 6HCH|:636H 63C3 6=>=|=D8C6A4?3;39476685;5@6C7E9G;H?HAGCEDCD@ ?@D@|=636H D3DH 6=D=|6636H|:>3>C=F<G:H8H6G5F4C4A|<636H D36A ;<DH|9636H 6HBH|>636H 63>H F3>H F3FH|=636H 63DH D3DH|=;39476685;5@6C7E9G;H?HAGCEDCE@E;D8C6A4?3;3|<636H 63?3B4C5D7D:C<B=?>6>|=;39476685;5@6C7E9G;H?HAGCEDCE@E;D8C6A4?3;3 >DDJ|<636H 63?3B4C5D7D9C;B<?=6= ==DH|<C6A4>3:37456586:7;9<?>A?B@CBCEAG>H:H7G5E|::3:H 33A3|=636B7E9G<H>HAGCEDBD3|;33;H C3;H|>439H >39H >3CH H3CH|<53CH C35H|;33;=;H C3;=|<C35H 53C3 5HCH|96/6O 7/7O 6/=/ 6O=O|923@K|9;/;O </<O 5/</ 5O<O|::12? :1B?|;2ODO|6785:5<6=7<6;5<|<A:AH A=?;=:::8;6=5@5B6E8G:H=H?GAE|;636H 6=8;::=:?;A=B@BBAE?G=H:H8G6E|;A=?;=:::8;6=5@5B6E8G:H=H?GAE|<A3AH A=?;=:::8;6=5@5B6E8G:H=H?GAE|;5@A@A>@<?;=:::8;6=5@5B6E8G:H=H?GAE|9<3:384777H 4:;:|<A:AJ@M?N=O:O8N A=?;=:::8;6=5@5B6E8G:H=H?GAE|<636H 6>9;;:>:@;A>AH|65364736253 6:6H|77384938273 8:8K7N5O3O|:636H @:6D :@AH|6636H|A6:6H 6>9;;:>:@;A>AH A>D;F:I:K;L>LH|<6:6H 6>9;;:>:@;A>AH|<::8;6=5@5B6E8G:H=H?GAEBBB@A=?;=:::|;6:6O 6=8;::=:?;A=B@BBAE?G=H:H8G6E|<A:AO A=?;=:::8;6=5@5B6E8G:H=H?GAE|86:6H 6@7=9;;:>:|;@=?;<:9:6;5=6?8@=A?B@D@E?G<H9H6G5E|9737D8G:H<H 4:;:|<6:6D7G9H<H>GAD A:AH|:4::H @::H|=5:9H =:9H =:AH E:AH|;5:@H @:5H|:4::H @::H8L6N4O3O|;@:5H 5:@: 5H@H|9;/908173758798:::<8> 90828496:7;9;;:=6?:A;C;E:G9H8J8L9N 8@:B:D9F8G7I7K8M9N;O|66/6O|97/90:1;3;5:7988:8<:> 90:2:49687797;8=<?8A7C7E8G9H:J:L9N :@8B8D9F:G;I;K:M9N7O|>5B5@6=8<:<<=@@BADAF@G> 5@6>8=:=<>@ABBDBFAG>G<",pa={lower:"M 0,4.5 C 3,7.5 8,10.5 18,12.2 C 30,12.5 42,11.8 51,12.6 C 53.5,13.0 54.5,13.5 55.5,13.5 C 53.0,11.2 48.0,9.2 43.0,7.5 C 35.0,6.0 18.0,6.0 6.0,6.6 C 2.5,6.2 0.8,5.2 0,4.5 Z",upper:"M 30.0,1.5 C 35.0,0.4 40.0,0.0 46.0,0.0 C 56.0,1.8 68.0,6.2 83.5,8.2 C 77.0,10.4 67.0,10.4 55.0,6.2 C 44.0,3.2 36.0,2.2 30.0,1.5 Z"};function ga(t){let a=t>>>0||1;return function(){a=a+1831565813>>>0;let n=a;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}var Gt=[0,0,.1,16,.26,33,.38,38,.56,63,.68,68,.86,92,1,100];function un(t){let a=t<0?0:t>1?1:t;for(let n=2;n<Gt.length;n+=2)if(a<=Gt[n]){let r=Gt[n-2],o=(a-r)/(Gt[n]-r);return Gt[n-1]+(Gt[n+1]-Gt[n-1])*o*o*(3-2*o)}return 100}function Ca(t){return t.split("|").map(a=>{let n=a.slice(1).split(" ").filter(r=>r.length>1).map(r=>{let o=[];for(let i=0;i+1<r.length;i+=2)o.push(r.charCodeAt(i)-50,r.charCodeAt(i+1)-50);return o});return{half:a.charCodeAt(0)-50,strokes:n}})}function fn(t){return/^[\x20-\x7e]*$/.test(t)}function ce(t,a,n){let r=ga(n.seed),o=[],i=0,l=1/0,C=1/0,h=-1/0,E=-1/0;for(let H of t){let I=H===" "?null:a[H.charCodeAt(0)-33];if(!I||!I.strokes.length){i+=n.space;continue}let F=1/0,V=-1/0;for(let D of I.strokes)for(let U=0;U<D.length;U+=2)F=Math.min(F,D[U]),V=Math.max(V,D[U]);let ft=(F+V)/2,bt=(r()-.5)*.07,at=1+(r()-.5)*.07,At=(r()-.5)*n.jitter*2.2,dt=Math.cos(bt),nt=Math.sin(bt);for(let D of I.strokes){let U=[];for(let rt=0;rt<D.length;rt+=2){let P=(D[rt]-ft)*at,$=(D[rt+1]-14)*at,J=(i+(ft-F)+P*dt-$*nt)*n.condense+(r()-.5)*n.jitter,q=14+P*nt+$*dt+At+(r()-.5)*n.jitter;U.push(J,q),l=Math.min(l,J),h=Math.max(h,J),C=Math.min(C,q),E=Math.max(E,q)}o.push(U)}i+=V-F+n.tracking+(H>="A"&&H<="Z"?n.capGap:0)}if(!o.length)return{strokes:o,x0:0,y0:0,x1:1,y1:22,lengths:[]};let Z=o.map(H=>{let I=0;for(let F=2;F<H.length;F+=2)I+=Math.hypot(H[F]-H[F-2],H[F+1]-H[F-1]);return I});return{strokes:o,x0:l,y0:C,x1:h,y1:E,lengths:Z}}function dn(t,a,n){let r=i=>Math.round(i*100)/100,o="";for(let i=2;i<t.length;i+=2){let l=t[i-2],C=t[i-1],h=t[i],E=t[i+1],H=(h-l)*n-(E-C)*a>=0?1:-1;o+="M"+r(l+a*H)+" "+r(C+n*H)+"L"+r(h+a*H)+" "+r(E+n*H)+"L"+r(h-a*H)+" "+r(E-n*H)+"L"+r(l-a*H)+" "+r(C-n*H)+"Z"}return o}function Pt(t){let a=r=>Math.round(r*100)/100,n="";for(let r=0;r<t.length;r+=2)n+=(r?"L":"M")+a(t[r])+" "+a(t[r+1]);return t.length===2?n+"l0.01 0":n}function hn(t,a){let n=a<=1?0:t/(a-1);return{ink:34+n*38,paint:50+n*40}}function mn(t){return t>=100?3:t>=50?2:t>=34?1:0}function gn(t,a){let n=Math.max(1,Math.round(a)),r=Math.round(Math.max(0,Math.min(100,t))/100*n),o=Math.max(4,String(n).length);return{frame:String(r).padStart(o,"0"),total:String(n).padStart(o,"0")}}function Cn(t,a){let n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((t||"").trim());if(!n)return a;let r=n[1].length===3?n[1].split("").map(o=>o+o).join(""):n[1];return[parseInt(r.slice(0,2),16),parseInt(r.slice(2,4),16),parseInt(r.slice(4,6),16)]}var et=t=>Math.round(t*10)/10;function la(t,a,n,r){let o="",i=Math.round(40*n);for(let l=0;l<=i;l++){let C=l/i,h=C*n*Math.PI*2,E=2+r*C;o+=(l?" L":"M")+et(t+Math.cos(h)*E)+" "+et(a+Math.sin(h)*E)}return o}function It(t,a,n,r,o){let i=l=>et(t+Math.cos(l)*n)+" "+et(a+Math.sin(l)*n);return"M"+i(r)+" A"+n+" "+n+" 0 "+(o-r>Math.PI?1:0)+" 1 "+i(o)}var bn=[la(30,34,2.2,20),la(92,92,1.6,15),It(96,26,14,.4,3.6),It(96,26,7,.6,3.2),It(26,96,12,3.6,6.6),It(62,62,9,1,4)].join(" ");function ca({id:t,side:a}){return e.createElement("g",{filter:"url(#"+t+"-paint)",transform:a==="r"?"scale(-1 1)":void 0},e.createElement("path",{d:"M -2400 -130 L -210 -75 Q -185 -72 -185 -58 L -180 68 Q -180 80 -205 82 L -2400 140 Z",fill:"url(#"+t+"-sleeve)"}),e.createElement("path",{d:"M -2400 -130 L -210 -75 Q -185 -72 -185 -58 L -180 68 Q -180 80 -205 82 L -2400 140 Z",fill:"url(#"+t+"-swirl)",opacity:"0.25"}),e.createElement("path",{d:"M -2400 -130 L -210 -75 Q -195 -74 -190 -66 L -2400 -105 Z",fill:"#ffffff",opacity:"0.10"}),e.createElement("path",{d:"M -226 -80 C -204 -80 -184 -75 -184 -60 L -179 66 C -179 78 -199 82 -226 82 C -236 82 -242 76 -242 66 L -247 -60 C -247 -74 -240 -80 -226 -80 Z",fill:"var(--atp-cuff)"}),e.createElement("path",{d:"M -220 -74 L -216 76 M -206 -72 L -202 74 M -194 -68 L -190 70",stroke:"#ffffff",strokeWidth:"2",strokeLinecap:"round",opacity:"0.15"}),e.createElement("path",{d:"M -186 -58 C -144 -68 -105 -70 -52 -58 C -36 -24 -32 28 -46 56 C -86 74 -138 74 -186 64 Z",fill:"url(#"+t+"-palm-radial)"}),e.createElement("g",{filter:"url(#"+t+"-finger-shadow)"},e.createElement("path",{d:"M -96 46 C -62 43 -22 47 4 51 C 13 54 16 61 12 67 C 8 73 -1 75 -9 71 C -36 68 -68 66 -104 63 Z",fill:"url(#"+t+"-skin)"}),e.createElement("path",{d:"M -80 47 C -48 46 -15 48 4 52",stroke:"url(#"+t+"-dorsal-hi)",strokeWidth:"3",strokeLinecap:"round"}),e.createElement("path",{d:"M -1 53 C 4 53 7 56 6 61 C 5 65 1 67 -3 66 C -6 66 -7 63 -6 59 C -5 55 -3 53 -1 53 Z",fill:"url(#"+t+"-real-nail)"}),e.createElement("path",{d:"M -3 55 C 0 54 3 55 2 59",stroke:"#ecc7b2",strokeWidth:"0.75",fill:"none",opacity:"0.4"}),e.createElement("path",{d:"M -36 49 C -33 55 -33 59 -36 65",stroke:"var(--atp-skin2)",strokeWidth:"1.1",strokeLinecap:"round",opacity:"0.32"})),e.createElement("g",{filter:"url(#"+t+"-finger-shadow)"},e.createElement("path",{d:"M -106 14 C -66 12 -18 16 18 21 C 29 25 33 33 29 40 C 25 46 15 47 5 43 C -24 38 -64 36 -108 34 Z",fill:"url(#"+t+"-skin)"}),e.createElement("path",{d:"M -90 16 C -50 15 -8 17 18 22",stroke:"url(#"+t+"-dorsal-hi)",strokeWidth:"4",strokeLinecap:"round"}),e.createElement("path",{d:"M 12 24 C 18 24 22 28 21 34 C 20 39 15 42 10 41 C 6 41 5 37 6 32 C 7 27 9 24 12 24 Z",fill:"url(#"+t+"-real-nail)"}),e.createElement("path",{d:"M 9 26 C 13 25 16 27 15 32",stroke:"#ecc7b2",strokeWidth:"0.85",fill:"none",opacity:"0.4"}),e.createElement("path",{d:"M -24 18 C -21 24 -21 30 -24 37",stroke:"var(--atp-skin2)",strokeWidth:"1.2",strokeLinecap:"round",opacity:"0.35"})),e.createElement("g",{filter:"url(#"+t+"-finger-shadow)"},e.createElement("path",{d:"M -112 -20 C -62 -22 -6 -18 32 -13 C 44 -9 50 0 46 8 C 42 15 32 17 20 14 C -12 10 -60 9 -112 5 Z",fill:"url(#"+t+"-skin)"}),e.createElement("path",{d:"M -96 -18 C -40 -19 10 -17 32 -12",stroke:"url(#"+t+"-dorsal-hi)",strokeWidth:"4.5",strokeLinecap:"round"}),e.createElement("path",{d:"M 26 -8 C 33 -8 37 -3 36 3 C 34 9 29 13 23 12 C 18 12 17 7 18 1 C 19 -5 21 -8 26 -8 Z",fill:"url(#"+t+"-real-nail)"}),e.createElement("path",{d:"M 22 -6 C 27 -7 30 -4 29 2",stroke:"#ecc7b2",strokeWidth:"0.95",fill:"none",opacity:"0.4"}),e.createElement("path",{d:"M -16 -16 C -13 -9 -13 -3 -16 6",stroke:"var(--atp-skin2)",strokeWidth:"1.2",strokeLinecap:"round",opacity:"0.35"})),e.createElement("g",{filter:"url(#"+t+"-finger-shadow)"},e.createElement("path",{d:"M -116 -54 C -66 -56 -10 -52 22 -47 C 34 -43 40 -35 36 -27 C 32 -19 22 -17 10 -19 C -16 -22 -64 -23 -116 -22 Z",fill:"url(#"+t+"-skin)"}),e.createElement("path",{d:"M -100 -52 C -45 -54 10 -51 22 -46",stroke:"url(#"+t+"-dorsal-hi)",strokeWidth:"4.5",strokeLinecap:"round"}),e.createElement("path",{d:"M 16 -42 C 23 -42 27 -37 26 -30 C 24 -24 19 -21 14 -21 C 9 -21 8 -25 9 -32 C 10 -38 12 -42 16 -42 Z",fill:"url(#"+t+"-real-nail)"}),e.createElement("path",{d:"M 12 -40 C 17 -41 20 -38 19 -32",stroke:"#ecc7b2",strokeWidth:"0.95",fill:"none",opacity:"0.4"}),e.createElement("path",{d:"M -20 -50 C -17 -42 -17 -35 -20 -27",stroke:"var(--atp-skin2)",strokeWidth:"1.2",strokeLinecap:"round",opacity:"0.35"})),e.createElement("g",{className:"atp-thumb",filter:"url(#"+t+"-finger-shadow)"},e.createElement("path",{d:"M -148 -66 C -118 -94 -78 -102 -28 -96 C -1 -92 9 -81 3 -71 C -3 -61 -18 -59 -32 -63 C -74 -74 -108 -66 -138 -44 Z",fill:"url(#"+t+"-skin)"}),e.createElement("path",{d:"M -115 -84 C -75 -96 -35 -90 -2 -84",stroke:"url(#"+t+"-dorsal-hi)",strokeWidth:"4",strokeLinecap:"round"}),e.createElement("path",{d:"M -4 -88 C 2 -88 5 -84 3 -77 C 1 -71 -3 -67 -9 -68 C -12 -68 -14 -72 -13 -78 C -11 -84 -8 -88 -4 -88 Z",fill:"url(#"+t+"-real-nail)"}),e.createElement("path",{d:"M -9 -84 C -5 -86 -2 -84 -3 -79",stroke:"#ecc7b2",strokeWidth:"0.85",fill:"none",opacity:"0.4"}),e.createElement("path",{d:"M -54 -76 C -46 -82 -36 -84 -26 -82",stroke:"var(--atp-skin2)",strokeWidth:"1.3",strokeLinecap:"round",opacity:"0.35",fill:"none"})))}function ua({laid:t,text:a,maskId:n,filterId:r,on:o,duration:i,className:l,flourish:C}){if(!fn(a))return e.createElement("span",{className:"atp-line atp-fallback "+l,"data-on":o?"1":"0",style:{fontFamily:nn},"aria-hidden":"true"},a);let h=t.strokes.slice(),E=t.lengths.slice(),Z=t.y1;if(C&&h.length){let P=t.x0-2,J=t.x1+6-P,q=t.y1+3,Ft=[];for(let d=0;d<=48;d++){let ot=d/48,Ht=P+J*ot-Math.sin(ot*Math.PI*2)*J*.03,b=q+Math.sin(ot*Math.PI)*2.4-Math.max(0,Math.sin((ot-.78)*Math.PI*4.5))*5*(ot>.78?1:0);Ft.push(Ht,b)}h.push(Ft),E.push(J*1.1),Z=q+3.5}let H=4,I=t.x0-H,F=Math.min(t.y0,-2)-H,V=t.x1-t.x0+H*2+(C?8:0),ft=Math.max(Z,30)-F+H,bt=E.reduce((P,$)=>P+$,0)||1,at=.03,At=1+at*h.length,dt=0,nt=1.3,D=-38*Math.PI/180,U=Math.cos(D)*nt,rt=Math.sin(D)*nt;return e.createElement("svg",{className:"atp-line "+l,"data-on":o?"1":"0",viewBox:et(I)+" "+et(F)+" "+et(V)+" "+et(ft),style:{width:et(V/21)+"em",height:et(ft/21)+"em"},"aria-hidden":"true"},e.createElement("defs",null,e.createElement("mask",{id:n,maskUnits:"userSpaceOnUse",x:I,y:F,width:V,height:ft},e.createElement("g",{fill:"none",stroke:"#fff",strokeWidth:nt*3.4,strokeLinecap:"round",strokeLinejoin:"round"},h.map((P,$)=>{let J=(dt/bt+at*$)/At;dt+=E[$];let q=E[$]/bt/At;return e.createElement("path",{key:$,className:"atp-w",d:Pt(P),pathLength:1,style:{transitionDelay:Math.round(J*i)+"ms",transitionDuration:Math.max(40,Math.round(q*i))+"ms"}})})))),e.createElement("g",{mask:"url(#"+n+")",filter:"url(#"+r+")"},e.createElement("path",{d:h.map(P=>dn(P,U,rt)).join(""),fill:"currentColor"}),e.createElement("path",{d:h.map(Pt).join(""),fill:"none",stroke:"currentColor",strokeWidth:nt*.55,strokeLinecap:"round",strokeLinejoin:"round"})))}var Hn=`
.atp-root { position: relative; width: 100%; overflow: hidden; isolation: isolate; }
.atp-gate {
  position: absolute; inset: 0; z-index: 2; overflow: hidden; outline: none;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  transition: opacity 600ms cubic-bezier(.65,0,.35,1);
}
.atp-gate[data-phase="fade"] { opacity: 0; }
.atp-gate:focus-visible .atp-stage { box-shadow: inset 0 0 0 2px var(--atp-rough); }
.atp-backdrop { position: absolute; inset: 0; background: #0a0a0a; }
.atp-stage {
  position: absolute; inset: 0; overflow: hidden; background: var(--atp-stage); color: var(--atp-ink);
  container-type: size; cursor: pointer;
}
.atp-stage svg { max-width: none; }
.atp-vignette {
  position: absolute; inset: 0; pointer-events: none; z-index: 5;
  background: radial-gradient(120% 90% at 50% 46%, transparent 52%, rgba(0,0,0,var(--atp-vig)) 100%);
}
.atp-grain {
  position: absolute; left: -60px; top: -60px; width: calc(100% + 120px); height: calc(100% + 120px);
  pointer-events: none; z-index: 6; opacity: var(--atp-grain); mix-blend-mode: var(--atp-grain-blend);
  animation: atp-grain 0.5s steps(1) infinite;
}
@keyframes atp-grain {
  0% { transform: translate(0, 0); } 25% { transform: translate(-31px, 17px); }
  50% { transform: translate(23px, -27px); } 75% { transform: translate(-13px, -41px); }
}
.atp-card {
  position: absolute; left: 50%; top: 50%; z-index: 3; display: flex; flex-direction: column; align-items: center;
  transform: translate(-50%, -50%); width: max-content; max-width: 100%;
}
.atp-kickrow {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.65em;
  z-index: 5;
}
.atp-kicker-luxury {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 18px;
  max-width: min(92vw, 560px);
  border-radius: 9999px;
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid rgba(245, 158, 11, 0.45);
  box-shadow: 
    0 4px 25px rgba(0, 0, 0, 0.7),
    0 0 20px rgba(245, 158, 11, 0.2);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  white-space: nowrap;
  clip-path: inset(0 100% 0 0);
  transition: clip-path 1200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease;
  opacity: 0;
}
.atp-kicker-luxury[data-on="1"] {
  clip-path: inset(0 -20% 0 -20%);
  opacity: 1;
}
.atp-kicker-star {
  color: #fbbf24;
  font-size: 0.95em;
  filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.9));
  flex: none;
}
.atp-kicker-text {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  font-size: clamp(0.72rem, 2.2vw, 0.92rem);
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #ffffff;
}
.atp-kicker-highlight {
  color: #fbbf24;
  font-weight: 800;
}
.atp-subrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 0.38em;
  gap: 4px;
  clip-path: inset(0 100% 0 0);
  transition: clip-path 1200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease;
  opacity: 0;
  z-index: 5;
}
.atp-subrow[data-on="1"] {
  clip-path: inset(0 -30% 0 -30%);
  opacity: 1;
}
.atp-sub-volume {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  font-weight: 800;
  font-size: clamp(1.15rem, 2.5vw, 2.05rem);
  letter-spacing: -0.015em;
  text-transform: none;
  color: #ffffff;
  max-width: min(960px, 92vw);
  text-align: center;
  line-height: 1.15;
  margin: 0;
  padding: 0;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.atp-sub-line1 {
  display: block;
  line-height: 1.15;
  margin: 0;
}
.atp-sub-line2 {
  display: block;
  line-height: 1.15;
  margin: 0;
}
.atp-sub-volume strong,
.atp-sub-volume .atp-accent {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
}
.atp-sub-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: clamp(0.82rem, 1.15vw, 0.96rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #e2e8f0;
  text-align: center;
  max-width: min(880px, 92vw);
  background: rgba(15, 23, 42, 0.7);
  padding: 6px 18px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
.atp-sub-author {
  color: #f8fafc;
  font-weight: 700;
}
.atp-sub-sep {
  color: #f59e0b;
  opacity: 0.75;
}
.atp-sub-cred {
  color: #fbbf24;
  font-weight: 700;
  letter-spacing: 0.12em;
}
.atp-logo-swipes-wrap {
  position: absolute; pointer-events: none; z-index: 4; overflow: visible;
  clip-path: inset(0 100% 0 0); opacity: 0;
  transition: clip-path 750ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease;
  will-change: clip-path, opacity;
}
.atp-logo-swipes-wrap[data-on="1"] { clip-path: inset(0 -15% 0 0); opacity: 1; }
.atp-line { display: block; overflow: visible; flex: none; }
.atp-line .atp-w { stroke-dasharray: 1 2; stroke-dashoffset: 1.001; transition-property: stroke-dashoffset; transition-timing-function: linear; }
.atp-line[data-on="1"] .atp-w { stroke-dashoffset: 0; }
.atp-fallback {
  font-size: 1.5em; line-height: 1.2; white-space: nowrap; clip-path: inset(0 100% 0 0);
  transition: clip-path 1400ms cubic-bezier(.4,0,.2,1);
}
.atp-fallback[data-on="1"] { clip-path: inset(0 -10% 0 0); }
.atp-trinket { width: 1.05em; height: 2.4em; color: var(--atp-muted); transform-origin: 50% 0; opacity: 0; transform: translateY(-0.6em) rotate(0deg); transition: opacity 500ms ease, transform 900ms cubic-bezier(.3,1.6,.5,1); }
.atp-stage[data-trinkets="1"] .atp-trinket { opacity: 1; transform: none; animation: atp-swing 2.6s ease-in-out 900ms infinite; }
.atp-trinket.atp-t2 { animation-delay: 1.3s !important; }
@keyframes atp-swing { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
.atp-titlewrap { position: relative; margin: 0.56em 0 0.05em; }
.atp-word {
  position: relative; z-index: 2; display: block; white-space: nowrap; margin: 0;
  font-family: var(--atp-display); line-height: 0.92; letter-spacing: -0.015em;
  font-size: var(--atp-word-size); color: transparent; transform-origin: 50% 60%;
}
.atp-gate[data-phase="grip"] .atp-word { animation: atp-squeeze 520ms cubic-bezier(.3,0,.3,1) both; }
.atp-gate[data-phase="fling"] .atp-word { animation: atp-stretch 760ms cubic-bezier(.2,.8,.3,1) both; }
@keyframes atp-squeeze { 0% { transform: none; } 45% { transform: scale(.955, 1.05); } 100% { transform: scale(.985, 1.015); } }
@keyframes atp-stretch { 0% { transform: scale(.985, 1.015); } 22% { transform: scale(.94, 1.07); } 55% { transform: scale(1.05, .95); } 100% { transform: none; } }
.atp-ch { position: relative; display: inline-block; opacity: 0; transform-origin: 50% 85%; }
.atp-ch[data-ink="1"] { opacity: 1; animation: atp-pop 640ms cubic-bezier(.2,.9,.3,1) both; }
.atp-ch.atp-ch-bold,
.atp-ch.atp-ch-bold .atp-ink,
.atp-ch.atp-ch-bold .atp-paint {
  font-weight: 900 !important;
}
.atp-ch.atp-ch-light,
.atp-ch.atp-ch-light .atp-ink,
.atp-ch.atp-ch-light .atp-paint {
  font-weight: 400 !important;
  letter-spacing: -0.01em;
}
@keyframes atp-pop {
  0% { opacity: 0; transform: translateY(-0.18em) scale(.55, 1.45); }
  38% { opacity: 1; transform: translateY(0.02em) scale(1.22, .78); }
  62% { transform: translateY(-0.03em) scale(.93, 1.08); }
  82% { transform: scale(1.03, .97); }
  100% { opacity: 1; transform: none; }
}

/* Multi-Layer Exact Outline Pencil Sketches surrounding each letter */
.atp-ch .atp-sketch-ghost,
.atp-ch .atp-sketch-rough,
.atp-ch .atp-sketch-line {
  display: none !important;
}

.atp-ink {
  position: relative; z-index: 4;
  color: #000000;
  -webkit-text-stroke: 0;
  transition: opacity 300ms ease;
}
.atp-paint {
  position: absolute; left: 0; top: 0; pointer-events: none; z-index: 5;
  color: #000000;
  -webkit-text-fill-color: #000000;
  background: none;
  clip-path: inset(100% -10% -10% -10%); transition: clip-path 760ms cubic-bezier(.6,0,.2,1);
}
.atp-ch[data-paint="1"] .atp-paint { clip-path: inset(-10% -10% -10% -10%); }
.atp-ch[data-paint="1"] .atp-ink { opacity: 1; }
.atp-rough { display: none; }
.atp-handslot { position: absolute; z-index: 1; width: 0; height: 0; }
.atp-hand { position: absolute; left: 0; top: 0; will-change: transform; }
.atp-hand svg { position: absolute; left: 0; top: 0; width: 1px; height: 1px; overflow: visible; }
.atp-thumb { transform-box: fill-box; transform-origin: 0% 100%; transition: transform 420ms cubic-bezier(.3,1.5,.5,1); }
.atp-gate[data-phase="grip"] .atp-thumb, .atp-gate[data-phase="hold"] .atp-thumb { transform: rotate(5deg) translateY(4px); }
.atp-ofrow { font-size: calc(var(--atp-word-size) * 0.14); margin-top: 0.4em; }
.atp-namerow { font-size: calc(var(--atp-word-size) * 0.28); margin-top: 0.25em; }
.atp-mascot { width: calc(var(--atp-word-size) * 0.62); margin-top: calc(var(--atp-word-size) * 0.17); color: var(--atp-muted); overflow: visible; }
.atp-mascot .atp-mdraw { stroke-dasharray: 1 2; stroke-dashoffset: 1.001; transition: stroke-dashoffset 700ms cubic-bezier(.5,0,.3,1); }
.atp-mascot .atp-mdot { opacity: 0; transform-box: fill-box; transform-origin: 50% 50%; transform: scale(0); transition: opacity 300ms ease, transform 500ms cubic-bezier(.3,1.8,.5,1); }
.atp-stage[data-mascot="1"] .atp-mdraw { stroke-dashoffset: 0; }
.atp-stage[data-mascot="1"] .atp-mdot { opacity: 1; transform: none; }
.atp-stage[data-mascot="1"] .atp-mdot.atp-d2 { transition-delay: 120ms; }
.atp-stage[data-mascot="1"] .atp-mdot.atp-d3 { transition-delay: 240ms; }
.atp-eye { transform-box: fill-box; transform-origin: 50% 50%; opacity: 0; transition: opacity 300ms ease 500ms; animation: atp-blink 4.8s ease-in-out 2s infinite; }
.atp-stage[data-mascot="1"] .atp-eye { opacity: 1; }
@keyframes atp-blink { 0%, 93%, 100% { transform: scaleY(1); } 96% { transform: scaleY(.1); } }
.atp-lid { opacity: 0; }
.atp-gate[data-phase="wink"] .atp-eye.atp-e2, .atp-gate[data-phase="shut"] .atp-eye.atp-e2 { opacity: 0; }
.atp-gate[data-phase="wink"] .atp-lid, .atp-gate[data-phase="shut"] .atp-lid { opacity: 1; }
.atp-gate[data-phase="wink"] .atp-mascot { animation: atp-nod 760ms cubic-bezier(.3,1.4,.5,1) both; }
@keyframes atp-nod { 0% { transform: none; } 30% { transform: translateY(-6%) rotate(-6deg); } 100% { transform: rotate(-3deg); } }
.atp-hud {
  position: absolute; z-index: 7; font-family: var(--atp-mono); font-size: 10px; letter-spacing: .2em;
  text-transform: uppercase; color: var(--atp-muted); white-space: nowrap; pointer-events: none;
  transition: opacity 500ms ease;
}
.atp-tl { left: clamp(16px, 3vw, 36px); top: clamp(16px, 3vw, 30px); }
.atp-tr { right: clamp(16px, 3vw, 36px); top: clamp(16px, 3vw, 30px); }
.atp-bl { left: clamp(16px, 3vw, 36px); bottom: clamp(16px, 3vw, 28px); display: flex; gap: 14px; }
.atp-br { right: clamp(16px, 3vw, 36px); bottom: clamp(16px, 3vw, 28px); font-variant-numeric: tabular-nums; }
.atp-br b { color: var(--atp-ink); font-weight: 500; }
.atp-step { position: relative; padding-left: 11px; opacity: .55; transition: opacity 400ms ease, color 400ms ease; }
.atp-step::before {
  content: ""; position: absolute; left: 0; top: 50%; width: 5px; height: 5px; margin-top: -3px; border-radius: 50%;
  border: 1px solid currentColor; transition: background-color 400ms ease;
}
.atp-step[data-on="1"] { opacity: 1; color: var(--atp-ink); }
.atp-step[data-on="1"]::before { background: var(--atp-rough); border-color: var(--atp-rough); }
.atp-step[data-done="1"] { opacity: .8; }
.atp-step[data-done="1"]::before { background: currentColor; }
.atp-pegs { position: absolute; left: 50%; top: 0; z-index: 4; transform: translateX(-50%); display: flex; align-items: center; gap: 64px; padding-top: 14px; pointer-events: none; }
.atp-peg { background: rgba(0,0,0,var(--atp-peg)); box-shadow: inset 0 1px 2px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.05); border-radius: 99px; }
.atp-gate[data-phase="fling"] .atp-hud, .atp-gate[data-phase="iris"] .atp-hud, .atp-gate[data-phase="wink"] .atp-hud,
.atp-gate[data-phase="shut"] .atp-hud, .atp-gate[data-phase="reveal"] .atp-hud { opacity: 0; }
.atp-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 560px) {
  .atp-bl { gap: 9px; letter-spacing: .14em; }
  .atp-tl { display: none; }
  .atp-pegs { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .atp-grain, .atp-eye, .atp-trinket, .atp-stage[data-trinkets="1"] .atp-trinket { animation: none !important; }
  .atp-ch[data-ink="1"] { animation: none; }
  .atp-gate[data-phase] .atp-word, .atp-gate[data-phase] .atp-mascot { animation: none; }
  .atp-line .atp-w, .atp-paint, .atp-thumb, .atp-mascot .atp-mdraw { transition-duration: 1ms !important; transition-delay: 0ms !important; }
  .atp-fallback { transition: none; }
  .atp-mandala-tl, .atp-mandala-br, .atp-mandala-center, .atp-bg-adire-grid, .atp-lagos-stream, .atp-spark { animation: none !important; }
}

/* ---- Luxury Cinematic Gallery Backdrop ---- */
.atp-nsibidi-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  user-select: none;
  background: radial-gradient(circle at 50% 48%, #0d1322 0%, #060911 55%, #020306 100%);
}
.atp-spotlight-core {
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
  width: min(1100px, 90vw);
  height: min(650px, 70vh);
  background: 
    radial-gradient(ellipse 60% 45% at 50% 50%, rgba(245, 158, 11, 0.28) 0%, rgba(234, 88, 12, 0.14) 40%, rgba(180, 83, 9, 0.03) 72%, transparent 100%),
    radial-gradient(circle 35% at 50% 50%, rgba(251, 191, 36, 0.18) 0%, transparent 60%);
  filter: blur(30px);
  animation: atp-ns-glow 7s ease-in-out infinite alternate;
}
@keyframes atp-ns-glow {
  0% { opacity: 0.85; transform: translate(-50%, -50%) scale(0.96); }
  100% { opacity: 1.15; transform: translate(-50%, -50%) scale(1.04); }
}
.atp-cultural-waves {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.85;
  pointer-events: none;
}
.atp-film-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 90% 80% at 50% 50%, transparent 45%, rgba(2, 3, 6, 0.85) 100%);
  pointer-events: none;
}
.atp-nsibidi-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.atp-gold-dust {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.atp-spark {
  position: absolute;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 6px rgba(251, 191, 36, 0.9), 0 0 12px rgba(245, 158, 11, 0.5);
  animation-name: atp-spark-drift;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
.atp-spark-0 { width: 2.5px; height: 2.5px; opacity: 0.6; }
.atp-spark-1 { width: 3.5px; height: 3.5px; opacity: 0.85; }
.atp-spark-2 { width: 2px; height: 2px; opacity: 0.45; }
.atp-spark-3 { width: 4px; height: 4px; opacity: 0.9; }
.atp-spark-4 { width: 3px; height: 3px; opacity: 0.75; }
@keyframes atp-spark-drift {
  0% { transform: translate3d(0, 0, 0) scale(0.7); opacity: 0.1; }
  50% { transform: translate3d(12px, -45px, 0) scale(1.2); opacity: 0.9; }
  100% { transform: translate3d(-10px, -90px, 0) scale(0.6); opacity: 0; }
}

/* ---- LIGHT THEME HERO OVERRIDES ---- */
.atp-stage[data-light="1"] .atp-nsibidi-bg {
  background: radial-gradient(circle at 50% 45%, #ffffff 0%, #faf8f5 48%, #f4efe6 100%) !important;
}
.atp-stage[data-light="1"] .atp-film-vignette {
  background: radial-gradient(ellipse 90% 80% at 50% 50%, transparent 60%, rgba(224, 105, 39, 0.05) 100%) !important;
}
.atp-stage[data-light="1"] .atp-spotlight-core {
  background: 
    radial-gradient(ellipse 60% 45% at 50% 50%, rgba(254, 215, 170, 0.4) 0%, rgba(253, 230, 138, 0.25) 40%, transparent 72%),
    radial-gradient(circle 35% at 50% 50%, rgba(251, 191, 36, 0.18) 0%, transparent 60%) !important;
  filter: blur(45px) !important;
}
.atp-stage[data-light="1"] .atp-kicker-luxury {
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1.5px solid rgba(224, 105, 39, 0.35) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 0 15px rgba(245, 158, 11, 0.12) !important;
}
.atp-stage[data-light="1"] .atp-kicker-text {
  color: #0f172a !important;
}
.atp-stage[data-light="1"] .atp-kicker-star {
  color: #ea580c !important;
  filter: drop-shadow(0 0 4px rgba(234, 88, 12, 0.4)) !important;
}
.atp-stage[data-light="1"] .atp-sub-volume {
  color: #0f172a !important;
  text-shadow: none !important;
}
.atp-stage[data-light="1"] .atp-sub-volume strong,
.atp-stage[data-light="1"] .atp-sub-volume .atp-accent {
  background: linear-gradient(135deg, #d97706 0%, #ea580c 100%) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
.atp-stage[data-light="1"] .atp-word,
.atp-stage[data-light="1"] .atp-ink,
.atp-stage[data-light="1"] .atp-paint {
  color: #000000 !important;
  -webkit-text-fill-color: #000000 !important;
  -webkit-text-stroke-color: transparent !important;
}
.atp-stage[data-light="1"] .atp-ch.atp-ch-bold,
.atp-stage[data-light="1"] .atp-ch.atp-ch-bold .atp-ink,
.atp-stage[data-light="1"] .atp-ch.atp-ch-bold .atp-paint {
  font-weight: 900 !important;
}
.atp-stage[data-light="1"] .atp-ch.atp-ch-light,
.atp-stage[data-light="1"] .atp-ch.atp-ch-light .atp-ink,
.atp-stage[data-light="1"] .atp-ch.atp-ch-light .atp-paint {
  font-weight: 400 !important;
}
.atp-stage[data-light="1"] .atp-backdrop {
  background: #faf8f5 !important;
}
.atp-stage[data-light="1"] .atp-cultural-waves {
  opacity: 0.55 !important;
}
`,fa={cache:null},da={cache:null},ha=()=>fa.cache||(fa.cache=Ca(ln)),ue=()=>da.cache||(da.cache=Ca(cn)),ma={jitter:.3,condense:.86,tracking:.3,space:9,capGap:2};function yn({uid:t}){return e.createElement("div",{className:"atp-nsibidi-bg","aria-hidden":"true"},e.createElement("div",{className:"atp-spotlight-core"}),e.createElement("div",{className:"atp-nsibidi-canvas"},e.createElement("svg",{className:"atp-cultural-waves",viewBox:"0 0 1440 900",preserveAspectRatio:"none",fill:"none"},e.createElement("defs",null,e.createElement("linearGradient",{id:`${t}-gradGold1`,x1:"0%",y1:"0%",x2:"100%",y2:"0%"},e.createElement("stop",{offset:"0%",stopColor:"#f59e0b",stopOpacity:"0"}),e.createElement("stop",{offset:"30%",stopColor:"#fbbf24",stopOpacity:"0.22"}),e.createElement("stop",{offset:"60%",stopColor:"#f97316",stopOpacity:"0.25"}),e.createElement("stop",{offset:"100%",stopColor:"#ef4444",stopOpacity:"0"})),e.createElement("linearGradient",{id:`${t}-gradCyan1`,x1:"0%",y1:"0%",x2:"100%",y2:"0%"},e.createElement("stop",{offset:"0%",stopColor:"#38bdf8",stopOpacity:"0"}),e.createElement("stop",{offset:"40%",stopColor:"#38bdf8",stopOpacity:"0.14"}),e.createElement("stop",{offset:"70%",stopColor:"#0284c7",stopOpacity:"0.11"}),e.createElement("stop",{offset:"100%",stopColor:"#0369a1",stopOpacity:"0"})),e.createElement("radialGradient",{id:`${t}-cornerL`,cx:"15%",cy:"30%",r:"50%"},e.createElement("stop",{offset:"0%",stopColor:"#d97706",stopOpacity:"0.09"}),e.createElement("stop",{offset:"100%",stopColor:"#05070c",stopOpacity:"0"})),e.createElement("radialGradient",{id:`${t}-cornerR`,cx:"85%",cy:"60%",r:"55%"},e.createElement("stop",{offset:"0%",stopColor:"#0284c7",stopOpacity:"0.08"}),e.createElement("stop",{offset:"100%",stopColor:"#05070c",stopOpacity:"0"}))),e.createElement("rect",{width:"100%",height:"100%",fill:`url(#${t}-cornerL)`}),e.createElement("rect",{width:"100%",height:"100%",fill:`url(#${t}-cornerR)`}),e.createElement("path",{d:"M -100 460 C 280 340, 620 540, 980 430 C 1260 350, 1450 480, 1600 410",stroke:`url(#${t}-gradGold1)`,strokeWidth:"3.2",opacity:"0.88"}),e.createElement("path",{d:"M -100 485 C 260 375, 650 565, 1010 460 C 1290 380, 1470 500, 1600 435",stroke:`url(#${t}-gradGold1)`,strokeWidth:"1.6",strokeDasharray:"6 8",opacity:"0.65"}),e.createElement("path",{d:"M -50 240 C 350 140, 720 300, 1100 180 C 1320 110, 1490 210, 1600 160",stroke:`url(#${t}-gradCyan1)`,strokeWidth:"2.2",opacity:"0.75"}),e.createElement("path",{d:"M -100 700 C 320 600, 680 760, 1020 640 C 1280 550, 1460 700, 1600 620",stroke:`url(#${t}-gradGold1)`,strokeWidth:"2.6",opacity:"0.8"}))),e.createElement("div",{className:"atp-gold-dust"},Array.from({length:18}).map((a,n)=>e.createElement("span",{key:n,className:`atp-spark atp-spark-${n%5}`,style:{left:`${((n*5.4+4)%94).toFixed(1)}%`,top:`${((n*7.8+6)%88).toFixed(1)}%`,animationDelay:`${(n*.35).toFixed(1)}s`,animationDuration:`${(6+n%5*1.5).toFixed(1)}s`}}))),e.createElement("div",{className:"atp-film-vignette"}))}function xn({children:t,loop:a=!1,progress:n,durationMs:r=7e3,kicker:o="",kickerStyle:i="editorial",showLogoSwipe:l=!0,title:C="slum art",subtitle:h="",connector:E="",name:Z="",meta:H="Showreel \xB7 2026",scene:I="Sc. 01 \u2014 Title card",frames:F=120,preset:V="ember",palette:ft,hands:bt=!0,rough:at=!0,mascot:At=!1,hud:dt=!1,nigerianPatterns:nt=!0,seed:D=11,label:U="Loading portfolio",displayFamily:rt=en,monoFamily:P=an,height:$="100svh",stayOnHold:J=!1,onComplete:q,className:Ft=""}){let d={...ea[V]||ea.ember,...ft||{}},ot=Cn(d.stage,[21,20,19]),Ht=ot[0]*.3+ot[1]*.59+ot[2]*.11>150,b="atp"+e.useId().replace(/[^a-zA-Z0-9]/g,""),ba=e.useRef(null),fe=e.useRef(null),zt=e.useRef(null),de=e.useRef(null),he=e.useRef(null),jt=e.useRef(null),me=e.useRef(null),ge=e.useRef(null),Ce=e.useRef(null),be=e.useRef(null),st=e.useRef(null),Wt=e.useRef([]),[yt,$t]=e.useState("draw"),[z,He]=e.useState(0),[Jt,Ha]=e.useState(0),[St,ya]=e.useState(!1),[u,xa]=e.useState(null),[ye,ka]=e.useState(1),Kt=e.useRef(1),xe=e.useRef(yt);xe.current=yt;let ke=e.useRef(n);ke.current=n;let Ee=e.useRef(q);Ee.current=q;let Yt=e.useRef({durationMs:r,loop:a,stayOnHold:J});Yt.current={durationMs:r,loop:a,stayOnHold:J};let Nt=e.useRef(!1),Qt=e.useRef(null),Rt=e.useRef({x:0,y:0,tx:0,ty:0});e.useEffect(()=>{let s=window.matchMedia("(prefers-reduced-motion: reduce)"),f=()=>ya(s.matches);return f(),s.addEventListener("change",f),()=>s.removeEventListener("change",f)},[]);let xt=e.useMemo(()=>Array.from(C),[C]),kn=e.useMemo(()=>ce(o,i==="script"?ha():ue(),{seed:D+1,...i==="script"?ma:{jitter:.05,condense:.94,tracking:.4,space:14,capGap:2}}),[o,i,D]),Ea=e.useMemo(()=>ce(E,ue(),{seed:D+2,jitter:.05,condense:.94,tracking:.36,space:12,capGap:2}),[E,D]),Ga=e.useMemo(()=>ce(Z,ha(),{seed:D+3,...ma}),[Z,D]),Lt=e.useMemo(()=>{if(!u||!u.boxes||!u.boxes.length)return{left:0,top:0,width:0,height:0};let s=u.boxes,f=s[3]||s[Math.min(s.length-1,Math.floor(s.length*.36))],w=s[6]||s[s.length-1],G=f?f.x:u.ww*.35,x=w?w.x+w.w*.75:u.ww*.9,M=Math.max(20,x-G),K=M/6,L=-(K*.88);return{left:G,top:L,width:M,height:K}},[u]);e.useLayoutEffect(()=>{let s=jt.current,f=me.current,w=zt.current;if(!s||!f||!w)return;let G=()=>{let K=s.offsetWidth,L=w.clientWidth;if(!K||!L)return;let X=w.clientHeight>L*1.15,kt=L*(X?.74:L>720?.6:.7),ht=K/Kt.current,T=Math.min(X?1.5:1,kt/ht);if(Math.abs(T-Kt.current)>.005){Kt.current=T,ka(T);return}let S=[];s.querySelectorAll(".atp-ch").forEach(N=>{let m=N;S.push({x:m.offsetLeft,w:m.offsetWidth})});let tt=parseFloat(getComputedStyle(s).fontSize)||100,j={boxes:S,base:f.offsetTop,size:tt,ww:K,wh:s.offsetHeight,tall:X};xa(N=>N&&N.tall===X&&N.ww===j.ww&&N.wh===j.wh&&N.base===j.base&&N.boxes.length===S.length&&N.boxes.every((m,k)=>m.x===S[k].x)?N:j)};G();let x=new ResizeObserver(G);x.observe(s),x.observe(w);let M=!0;return document.fonts&&document.fonts.ready&&document.fonts.ready.then(()=>M&&G()),()=>{M=!1,x.disconnect()}},[C,rt,Jt,ye]);let Tt=e.useMemo(()=>{if(!u||!at)return[];let s=ue(),f=ga(D+9),{boxes:w,base:G,size:x}=u,M=x*.72,K=M/21,L=[],X=m=>xt.length<4||m===0||m>=xt.length-3&&!/[\sIJLTiljtf1!|.,'-]/.test(xt[m]),kt=(w[0]?w[0].x:0)-x*.12,ht=w[w.length-1],T=(ht?ht.x+ht.w:u.ww)+x*.16,S=(m,k)=>{let A=[];for(let it=0;it<=8;it++){let mt=it/8;A.push(kt+(T-kt)*mt+(f()-.5)*2,m+(f()-.5)*x*.012+k*mt*x*.02)}L.push({d:Pt(A),w:Math.max(1,x*.005),pts:A,guide:!0})};S(G,.4),S(G-M,-.3),xt.forEach((m,k)=>{let A=w[k],it=m===" "?null:s[m.charCodeAt(0)-33];if(!A||!it)return;let mt=1/0,Et=-1/0;for(let B of it.strokes)for(let pt=0;pt<B.length;pt+=2)mt=Math.min(mt,B[pt]),Et=Math.max(Et,B[pt]);let Ot=(mt+Et)/2,Xt=A.x+A.w/2;for(let B=0;B<2;B++){let pt=K*(B?1.04:.98)*(1.12+(f()-.5)*.08),p=K*(B?1.03:1),Y=(f()-.5)*.08,Q=(f()-.5)*x*.03+(B?x*.012:0),g=(f()-.5)*x*.02,R=Math.cos(Y),O=Math.sin(Y);for(let vt of it.strokes){let wt=[];for(let lt=0;lt<vt.length;lt+=2){let Bt=(vt[lt]-Ot)*pt,v=(vt[lt+1]-22)*p;wt.push(Xt+Q+Bt*R-v*O+(f()-.5)*x*.008,G+g+Bt*O+v*R+(f()-.5)*x*.008)}L.push({d:Pt(wt),w:x*(B?.009:.018),pts:wt,keep:X(k)})}}});let tt=L.map(m=>{let k=0;for(let A=2;A<m.pts.length;A+=2)k+=Math.hypot(m.pts[A]-m.pts[A-2],m.pts[A+1]-m.pts[A-1]);return Math.max(k,x*.02)}),j=tt.reduce((m,k)=>m+k,0)||1,N=0;return L.map((m,k)=>{let A=N/j;return N+=tt[k],{d:m.d,w:m.w,a:A,b:N/j,guide:m.guide,keep:m.keep}})},[u,xt,at,D]),Ge=e.useRef(ia),Zt=e.useRef(Tt);Zt.current=Tt,e.useEffect(()=>{let s=zt.current,f=fe.current,w=de.current;if(!s||!f||!w)return;let G=window.matchMedia("(prefers-reduced-motion: reduce)").matches,x=0,M=0,K=-1,L=performance.now(),X=L,kt=L,ht="draw",T=0,S=0,tt=1,j=null,N=null,m=Qt.current;Qt.current=null;let k=(p,Y)=>{ht=p,kt=Y,$t(p)},A=(p,Y,Q)=>{let g=Math.max(0,Y),R=Q?"radial-gradient(circle at "+T+"px "+S+"px, #000 "+g+"px, transparent "+(g+1.5)+"px)":"radial-gradient(circle at "+T+"px "+S+"px, transparent "+g+"px, #000 "+(g+1.5)+"px)";p.style.webkitMaskImage=R,p.style.maskImage=R},it=p=>{p.style.webkitMaskImage="",p.style.maskImage=""},mt=()=>{let p=f.getBoundingClientRect(),Y=st.current||jt.current;if(Y){let Q=Y.getBoundingClientRect();T=Q.left+Q.width/2-p.left,S=Q.top+Q.height*(st.current?.56:.5)-p.top}else T=p.width/2,S=p.height/2;tt=Math.hypot(Math.max(T,p.width-T),Math.max(S,p.height-S))+4};if(m){T=m.x,S=m.y;let p=f.getBoundingClientRect();tt=Math.hypot(Math.max(T,p.width-T),Math.max(S,p.height-S))+4,A(s,0,!0)}let Et=p=>1-Math.pow(1-p,3),Ot=p=>p*p*p,Xt=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2,B=p=>p<0?0:p>1?1:p,pt=p=>{x=requestAnimationFrame(pt);let Y=Math.min(64,p-L);L=p;let Q=Yt.current,g=ht,R=p-kt;if(g==="draw"){let v=ke.current,ct=(p-X)/Math.max(1200,Q.durationMs),W=v===void 0?un(ct):Math.max(0,Math.min(100,Number(v)||0));Nt.current&&(W=100);let gt=Y/(Nt.current?1100:2600)*100,Ct=1-Math.exp(-Y/160);M=G?W:Math.min(W,M+Math.min(gt,Math.max(.02,(W-M)*Ct))),W>=100&&M>99.6&&(M=100);let ut=Math.floor(M);ut!==K&&(K=ut,He(ut)),M>=100&&k(G?"hold":"grip",p)}else if(g==="grip"&&R>na)k("hold",p);else if(g==="hold"&&R>(G?900:rn))Yt.current.stayOnHold||(G?Q.loop?Ae(null):k("fade",p):k("fling",p));else if(g==="fling"&&R>ra)mt(),k("iris",p);else if(g==="iris"&&R>oa)k("wink",p);else if(g==="wink"&&R>on)k("shut",p);else if(g==="shut"&&R>sa){if(Q.loop){Ae({x:T,y:S});return}k("reveal",p)}else(g==="reveal"&&R>le||g==="fade"&&R>sn)&&k("open",p);if(m){let v=B((p-X)/le);v<1?A(s,tt*Et(v),!0):it(s)}if(g==="iris"){let v=(st.current?st.current.getBoundingClientRect().width:80)*.64;A(s,v+(tt-v)*(1-Xt(B(R/oa))),!0)}else if(g==="wink"){let v=(st.current?st.current.getBoundingClientRect().width:80)*.64;A(s,v,!0)}else if(g==="shut"){let v=(st.current?st.current.getBoundingClientRect().width:80)*.64;A(s,v*(1-Ot(B(R/sa))),!0)}else(g==="reveal"||g==="open")&&(s.style.visibility="hidden",A(w,tt*Et(B(R/le))*(g==="open"?2:1),!1));let O=Rt.current;O.x+=(O.tx-O.x)*.08,O.y+=(O.ty-O.y)*.08;let vt=he.current;vt&&!G&&(vt.style.transform="translate(calc(-50% + "+(O.x*7).toFixed(2)+"px), calc(-50% + "+(O.y*5).toFixed(2)+"px))"),Wt.current.forEach(v=>{v&&v.setAttribute("transform","translate("+(O.x*3.2).toFixed(2)+" "+(O.y*2.4).toFixed(2)+")")});let wt=ge.current;if(wt){(N!==Zt.current||!j||!j[0]||!j[0].isConnected)&&(N=Zt.current,j=Array.from(wt.querySelectorAll("path")));let v=g==="draw"?B((M-4)/48):1;for(let ct of j){let W=Number(ct.dataset.a),gt=Number(ct.dataset.b),Ct=B((v-W)/Math.max(1e-6,gt-W)),ut=Ct>=1?"0":Ct<=0?"1.001":(1-Ct).toFixed(4);ct.style.strokeDashoffset!==ut&&(ct.style.strokeDashoffset=ut)}}let lt=Ce.current,Bt=be.current;if(lt&&Bt){let v=s.clientWidth,ct=Math.max(v,700)*.85,W=G?M>=10?1:0:Et(B((M-10)/62)),gt=0;if(g==="grip"&&(gt=Math.sin(B(R/na)*Math.PI)*10),g==="hold"&&(gt=3),g==="fling"){let ee=B(R/ra);gt=ee<.24?Math.sin(ee/.24*(Math.PI/2))*16:16-Ot((ee-.24)/.76)*(ct*1.3),W=1}(g==="iris"||g==="wink"||g==="shut"||g==="reveal"||g==="open")&&(W=-.6);let Ct=Math.floor((p-X)/83.3)*83.3,ut=G?0:Math.sin(Ct/620)*3.2,Fe=G?0:Math.sin(Ct/910)*.8,Se=-(1-W)*ct+gt,Ne=Ge.current*Math.PI/180,Le=Se*Math.cos(Ne),Te=-Se*Math.sin(Ne),Oe=G?0:O.y*9;lt.style.transform="translate("+Le.toFixed(1)+"px,"+(Te+ut+Oe).toFixed(1)+"px) rotate("+(Fe+O.y*1.5).toFixed(2)+"deg)",Bt.style.transform="translate("+(-Le).toFixed(1)+"px,"+(Te-ut*.8+Oe).toFixed(1)+"px) rotate("+(-Fe-O.y*1.5).toFixed(2)+"deg)";let te=W>-.55?"visible":"hidden";lt.style.visibility!==te&&(lt.style.visibility=te,Bt.style.visibility=te)}};return x=requestAnimationFrame(pt),()=>cancelAnimationFrame(x)},[Jt]),e.useEffect(()=>{yt!=="open"||a||($t("done"),Ee.current?.())},[yt,a]);function Ae(s){Nt.current=!1,Qt.current=s,He(0),$t("draw"),Ha(f=>f+1)}let ve=()=>{xe.current==="draw"&&(Nt.current=!0)},Aa=s=>{let f=s.currentTarget.getBoundingClientRect();Rt.current.tx=((s.clientX-f.left)/f.width-.5)*2,Rt.current.ty=((s.clientY-f.top)/f.height-.5)*2},va=()=>{Rt.current.tx=0,Rt.current.ty=0},wa=a||!(yt==="done"),_=yt!=="draw",Ut=_?3:mn(z),we=gn(_?100:z,F),Be=xt.length,Ba=[o,C,E,Z].filter(Boolean).join(" "),qt=u&&u.tall?pn:ia;Ge.current=qt;let De=u?u.size*(u.tall?.0046:.0036):0,Me=u?u.base-u.size*.3:0,Re=u&&u.boxes[0],Vt=u&&u.boxes[u.boxes.length-1],Da=Re&&u?Re.x+u.size*.05:0,Ma=Vt&&u?Vt.x+Vt.w-u.size*.04:0;return e.createElement("div",{ref:ba,className:"atp-root "+Ft,style:{height:$,"--atp-stage":d.stage,"--atp-ink":d.ink,"--atp-muted":d.muted,"--atp-rough":d.rough,"--atp-ghost":d.ghost,"--atp-boil-filter":"url(#"+b+"-boilpx)","--atp-word0":d.word0,"--atp-word1":d.word1,"--atp-word2":d.word2,"--atp-skin0":d.skin0,"--atp-skin2":d.skin2,"--atp-nail":d.nail,"--atp-cuff":d.cuff,"--atp-display":rt,"--atp-mono":P,"--atp-vig":Ht?.16:.55,"--atp-grain":Ht?.5:.09,"--atp-grain-blend":Ht?"multiply":"screen","--atp-peg":Ht?.1:.42,"--atp-word-size":"calc(min("+Math.round(1400/Math.max(Be,6))/10+"cqw, 21cqh) * "+ye.toFixed(3)+")"}},e.createElement("style",null,Hn),a?null:t,wa?e.createElement("div",{ref:fe,className:"atp-gate","data-phase":yt,role:"progressbar","aria-label":U,"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":_?100:z,"aria-valuetext":aa[Ut]+", "+(_?100:z)+"%",tabIndex:0,onClick:ve,onPointerMove:Aa,onPointerLeave:va,onKeyDown:s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),ve())}},e.createElement("div",{ref:de,className:"atp-backdrop"}),e.createElement("div",{key:Jt,ref:zt,className:"atp-stage","data-light":Ht?"1":"0","data-trinkets":z>=3||_?"1":"0","data-mascot":z>=88||_?"1":"0","data-final":_?"1":"0"},nt?e.createElement(yn,{uid:b}):null,e.createElement("svg",{width:"0",height:"0",style:{position:"absolute"},"aria-hidden":"true",focusable:"false"},e.createElement("defs",null,e.createElement("filter",{id:b+"-boil",x:"-10%",y:"-30%",width:"120%",height:"160%"},e.createElement("feTurbulence",{type:"fractalNoise",baseFrequency:"0.045",numOctaves:"2",seed:"2",result:"n"},St?null:e.createElement("animate",{attributeName:"seed",values:"2;5;8",dur:"0.375s",calcMode:"discrete",repeatCount:"indefinite"})),e.createElement("feDisplacementMap",{in:"SourceGraphic",in2:"n",scale:"1.6",xChannelSelector:"R",yChannelSelector:"G"})),e.createElement("filter",{id:b+"-boilpx",x:"-20%",y:"-30%",width:"140%",height:"160%",filterUnits:"objectBoundingBox"},e.createElement("feTurbulence",{type:"fractalNoise",baseFrequency:"0.02",numOctaves:"2",seed:"3",result:"n"},St?null:e.createElement("animate",{attributeName:"seed",values:"3;7;11;5",dur:"0.38s",calcMode:"discrete",repeatCount:"indefinite"})),e.createElement("feDisplacementMap",{in:"SourceGraphic",in2:"n",scale:u?Math.max(3,u.size*.03):3.5,xChannelSelector:"R",yChannelSelector:"G"})),e.createElement("filter",{id:b+"-paint",x:"-25%",y:"-25%",width:"150%",height:"150%"},e.createElement("feDropShadow",{dx:"-2",dy:"5",stdDeviation:"6",floodColor:"#0a0301",floodOpacity:"0.25"})),e.createElement("filter",{id:b+"-finger-shadow",x:"-20%",y:"-20%",width:"140%",height:"150%"},e.createElement("feDropShadow",{dx:"-1",dy:"3",stdDeviation:"2.5",floodColor:"#140602",floodOpacity:"0.45"})),e.createElement("filter",{id:b+"-grain",x:"0",y:"0",width:"100%",height:"100%"},e.createElement("feTurbulence",{type:"fractalNoise",baseFrequency:"0.8",numOctaves:"3",stitchTiles:"stitch",result:"n"}),e.createElement("feColorMatrix",{in:"n",type:"saturate",values:"0"})),e.createElement("radialGradient",{id:b+"-palm-radial",cx:"45%",cy:"40%",r:"55%"},e.createElement("stop",{offset:"0%",stopColor:d.skin0}),e.createElement("stop",{offset:"45%",stopColor:d.skin1}),e.createElement("stop",{offset:"80%",stopColor:d.skin2}),e.createElement("stop",{offset:"100%",stopColor:"#250d04"})),e.createElement("linearGradient",{id:b+"-palm-grad",x1:"0",y1:"0",x2:"1",y2:"0"},e.createElement("stop",{offset:"0",stopColor:d.skin2}),e.createElement("stop",{offset:"1",stopColor:d.skin1})),e.createElement("linearGradient",{id:b+"-dorsal-hi",x1:"0%",y1:"0%",x2:"100%",y2:"50%"},e.createElement("stop",{offset:"0%",stopColor:"#ffffff",stopOpacity:.22}),e.createElement("stop",{offset:"45%",stopColor:"#f5b88c",stopOpacity:.18}),e.createElement("stop",{offset:"100%",stopColor:"#ffffff",stopOpacity:0})),e.createElement("linearGradient",{id:b+"-real-nail",x1:"0%",y1:"0%",x2:"100%",y2:"100%"},e.createElement("stop",{offset:"0%",stopColor:d.skin1,stopOpacity:.7}),e.createElement("stop",{offset:"40%",stopColor:d.nail,stopOpacity:.8}),e.createElement("stop",{offset:"75%",stopColor:"#a86e56",stopOpacity:.75}),e.createElement("stop",{offset:"100%",stopColor:d.skin2,stopOpacity:.8})),e.createElement("linearGradient",{id:b+"-sleeve",x1:"0",y1:"0",x2:"0",y2:"1"},e.createElement("stop",{offset:"0",stopColor:d.sleeve0}),e.createElement("stop",{offset:".5",stopColor:d.sleeve1}),e.createElement("stop",{offset:"1",stopColor:d.sleeve2})),e.createElement("linearGradient",{id:b+"-skin",x1:"0",y1:"0",x2:"0",y2:"1"},e.createElement("stop",{offset:"0%",stopColor:d.skin0}),e.createElement("stop",{offset:"30%",stopColor:d.skin1}),e.createElement("stop",{offset:"70%",stopColor:d.skin2}),e.createElement("stop",{offset:"100%",stopColor:"#250d04"})),e.createElement("pattern",{id:b+"-swirl",width:"124",height:"124",patternUnits:"userSpaceOnUse",patternTransform:"rotate(-6)"},e.createElement("path",{d:bn,fill:"none",stroke:d.pattern,strokeWidth:"4.5",strokeLinecap:"round",opacity:".55"}),e.createElement("circle",{cx:"70",cy:"18",r:"3",fill:d.speck,opacity:".6"}),e.createElement("circle",{cx:"8",cy:"64",r:"2.4",fill:d.speck,opacity:".5"}),e.createElement("circle",{cx:"60",cy:"108",r:"1.8",fill:d.speck,opacity:".55"}),e.createElement("circle",{cx:"112",cy:"58",r:"2.6",fill:d.speck,opacity:".5"}),e.createElement("circle",{cx:"48",cy:"80",r:"1.4",fill:d.speck,opacity:".5"})))),e.createElement("svg",{className:"atp-grain","aria-hidden":"true"},e.createElement("rect",{width:"100%",height:"100%",filter:"url(#"+b+"-grain)"})),e.createElement("div",{className:"atp-vignette","aria-hidden":"true"}),dt?e.createElement("div",{className:"atp-pegs","aria-hidden":"true"},e.createElement("span",{className:"atp-peg",style:{width:30,height:10}}),e.createElement("span",{className:"atp-peg",style:{width:13,height:13}}),e.createElement("span",{className:"atp-peg",style:{width:30,height:10}})):null,dt?e.createElement(e.Fragment,null,I?e.createElement("div",{className:"atp-hud atp-tl","aria-hidden":"true"},I):null,H?e.createElement("div",{className:"atp-hud atp-tr","aria-hidden":"true"},H):null,e.createElement("div",{className:"atp-hud atp-bl","aria-hidden":"true"},aa.map((s,f)=>e.createElement("span",{key:s,className:"atp-step","data-on":f===Ut?"1":"0","data-done":f<Ut?"1":"0"},s))),e.createElement("div",{className:"atp-hud atp-br","aria-hidden":"true"},"Fr ",e.createElement("b",null,we.frame)," / ",we.total)):null,e.createElement("div",{ref:he,className:"atp-card"},o?e.createElement("div",{className:"atp-kickrow"},e.createElement("div",{className:"atp-kicker-luxury","data-on":z>=1||_?"1":"0"},e.createElement("span",{className:"atp-kicker-star"},"\u2726"),e.createElement("span",{className:"atp-kicker-text"},o),e.createElement("span",{className:"atp-kicker-star"},"\u2726"))):null,e.createElement("div",{className:"atp-titlewrap"},bt&&u?e.createElement(e.Fragment,null,e.createElement("div",{className:"atp-handslot",style:{left:Da,top:Me},"aria-hidden":"true"},e.createElement("div",{ref:Ce,className:"atp-hand",style:{visibility:"hidden"}},e.createElement("svg",null,e.createElement("g",{transform:"scale("+De+") rotate("+-qt+")"},e.createElement(ca,{id:b,side:"l"}))))),e.createElement("div",{className:"atp-handslot",style:{left:Ma,top:Me},"aria-hidden":"true"},e.createElement("div",{ref:be,className:"atp-hand",style:{visibility:"hidden"}},e.createElement("svg",null,e.createElement("g",{transform:"scale("+De+") rotate("+qt+")"},e.createElement(ca,{id:b,side:"r"})))))):null,e.createElement("p",{ref:jt,className:"atp-word","aria-hidden":"true",style:u?{"--atp-ww":u.ww+"px"}:void 0},xt.map((s,f)=>{let w=hn(f,Be),G=u&&u.boxes[f],x=C.toLowerCase().includes("slum")&&f>=4;return e.createElement("span",{key:f,className:"atp-ch "+(x?"atp-ch-light":"atp-ch-bold"),"data-ink":z>=w.ink||_?"1":"0","data-paint":z>=w.paint||_?"1":"0",style:G?{"--atp-gx":-G.x+"px"}:void 0},e.createElement("span",{className:"atp-ink"},s===" "?"\xA0":s),e.createElement("span",{className:"atp-paint"},s===" "?"\xA0":s))}),e.createElement("span",{ref:me,style:{display:"inline-block",width:0,height:0}})),l&&u?e.createElement("div",{className:"atp-logo-swipes-wrap","data-on":z>=40||_?"1":"0",style:{left:Lt.left,top:Lt.top,width:Lt.width,height:Lt.height},"aria-hidden":"true"},e.createElement("svg",{viewBox:"0 0 84 14",preserveAspectRatio:"none",style:{width:"100%",height:"100%",overflow:"visible"}},e.createElement("defs",null,e.createElement("linearGradient",{id:b+"-swipe-grad",x1:"0%",y1:"0%",x2:"100%",y2:"0%"},e.createElement("stop",{offset:"0%",stopColor:"#f59e0b"}),e.createElement("stop",{offset:"35%",stopColor:"#fbbf24"}),e.createElement("stop",{offset:"70%",stopColor:"#f59e0b"}),e.createElement("stop",{offset:"100%",stopColor:"#d97706"}))),e.createElement("g",null,e.createElement("path",{d:pa.lower,fill:"url(#"+b+"-swipe-grad)"}),e.createElement("path",{d:pa.upper,fill:"url(#"+b+"-swipe-grad)"})))):null,at&&u?e.createElement("svg",{className:"atp-rough",width:u.ww,height:u.wh,"aria-hidden":"true"},e.createElement("g",{ref:ge,filter:"url(#"+b+"-boilpx)",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},e.createElement("g",{stroke:d.ghost,opacity:".7",transform:"translate("+(u.size*.014).toFixed(1)+" "+(u.size*.01).toFixed(1)+")"},Tt.map((s,f)=>e.createElement("path",{key:f,d:s.d,strokeWidth:s.w,strokeOpacity:s.guide?.5:1,pathLength:1,"data-a":s.a,"data-b":s.b,"data-keep":s.keep?"1":"0"}))),e.createElement("g",{stroke:d.rough},Tt.map((s,f)=>e.createElement("path",{key:f,d:s.d,strokeWidth:s.w,strokeOpacity:s.guide?.5:1,pathLength:1,"data-a":s.a,"data-b":s.b,"data-keep":s.keep?"1":"0"}))))):null),h?e.createElement("div",{className:"atp-subrow","data-on":z>=35||_?"1":"0"},e.createElement("h2",{className:"atp-sub-volume"},e.createElement("span",{className:"atp-sub-line1"},"Transforming Underserved Communities"),e.createElement("span",{className:"atp-sub-line2 atp-accent"},"Through sustainable Creative Art & Education"))):e.createElement(e.Fragment,null,E?e.createElement("div",{className:"atp-ofrow"},e.createElement(ua,{laid:Ea,text:E,maskId:b+"-mo",filterId:b+"-boil",on:z>=72||_,duration:St?0:500,className:"atp-of"})):null,Z?e.createElement("div",{className:"atp-namerow"},e.createElement(ua,{laid:Ga,text:Z,maskId:b+"-mn",filterId:b+"-boil",on:z>=78||_,duration:St?0:1900,className:"atp-name",flourish:!0})):null),At?e.createElement("svg",{ref:st,className:"atp-mascot",viewBox:"0 0 120 84","aria-hidden":"true"},e.createElement("g",{filter:"url(#"+b+"-boil)",fill:"none",stroke:"currentColor",strokeWidth:"3.4",strokeLinecap:"round",strokeLinejoin:"round"},e.createElement("circle",{className:"atp-mdot",cx:"44",cy:"12",r:"2.4",fill:"currentColor",stroke:"none"}),e.createElement("circle",{className:"atp-mdot atp-d2",cx:"60",cy:"10",r:"5",fill:"currentColor",stroke:"none"}),e.createElement("circle",{className:"atp-mdot atp-d3",cx:"76",cy:"12",r:"2.4",fill:"currentColor",stroke:"none"}),e.createElement("path",{className:"atp-mdraw",pathLength:1,d:"M58 52 C58 40 44 36 34 40 C22 45 22 62 34 65 C46 68 56 62 58 52 C60 62 70 68 82 65 C94 62 98 45 86 40 C76 36 62 40 62 52"}),e.createElement("path",{className:"atp-mdraw",pathLength:1,d:"M22 46 C14 44 9 47 6 52 M98 46 C106 44 111 47 114 52"}),e.createElement("g",{className:"atp-eye atp-e1"},e.createElement("circle",{ref:s=>{Wt.current[0]=s},cx:"40",cy:"53",r:"4.6",fill:"currentColor",stroke:"none"})),e.createElement("g",{className:"atp-eye atp-e2"},e.createElement("circle",{ref:s=>{Wt.current[1]=s},cx:"80",cy:"53",r:"4.6",fill:"currentColor",stroke:"none"})),e.createElement("path",{className:"atp-lid",d:"M71 54 Q80 59 89 54"}))):null)),e.createElement("span",{className:"atp-sr","aria-live":"polite"},Ba+(_?". Loaded.":""))):null)}})();
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/

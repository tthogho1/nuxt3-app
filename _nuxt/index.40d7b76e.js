import{c as N,a as B,r as Z,b as U,w as xe,v as Me,F as _e,m as ae,e as _,f as g,p as O,h as w,i as D,j as b,k as G,o as R,l as k,q as T,s as x,t as ue,x as V,y as H,C as de}from"./entry.3c8805ca.js";let I=Symbol("map"),E=Symbol("api"),pe=Symbol("marker"),he=Symbol("markerCluster"),q=Symbol("CustomMarker"),ce=Symbol("mapTilesLoaded"),me="click dblclick drag dragend dragstart mousedown mousemove mouseout mouseover mouseup rightclick".split(" ");var Se=function o(e,t){if(e===t)return!0;if(e&&t&&typeof e=="object"&&typeof t=="object"){if(e.constructor!==t.constructor)return!1;var r;if(Array.isArray(e)){var i=e.length;if(i!=t.length)return!1;for(r=i;r--!==0;)if(!o(e[r],t[r]))return!1;return!0}if(e.constructor===RegExp)return e.source===t.source&&e.flags===t.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===t.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===t.toString();var s=Object.keys(e);if(i=s.length,i!==Object.keys(t).length)return!1;for(r=i;r--!==0;)if(!Object.prototype.hasOwnProperty.call(t,s[r]))return!1;for(r=i;r--!==0;)if(i=s[r],!o(e[i],t[i]))return!1;return!0}return e!==e&&t!==t};class C{constructor({apiKey:e,channel:t,client:r,id:i="__googleMapsScriptId",libraries:s=[],language:a,region:n,version:p,mapIds:u,nonce:l,retries:d=3,url:h="https://maps.googleapis.com/maps/api/js"}){if(this.CALLBACK="__googleMapsCallback",this.callbacks=[],this.loading=this.done=!1,this.errors=[],this.version=p,this.apiKey=e,this.channel=t,this.client=r,this.id=i||"__googleMapsScriptId",this.libraries=s,this.language=a,this.region=n,this.mapIds=u,this.nonce=l,this.retries=d,this.url=h,C.instance){if(!Se(this.options,C.instance.options))throw Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(C.instance.options)}`);return C.instance}C.instance=this}get options(){return{version:this.version,apiKey:this.apiKey,channel:this.channel,client:this.client,id:this.id,libraries:this.libraries,language:this.language,region:this.region,mapIds:this.mapIds,nonce:this.nonce,url:this.url}}get failed(){return this.done&&!this.loading&&this.errors.length>=this.retries+1}createUrl(){let e=this.url;return e+=`?callback=${this.CALLBACK}`,this.apiKey&&(e+=`&key=${this.apiKey}`),this.channel&&(e+=`&channel=${this.channel}`),this.client&&(e+=`&client=${this.client}`),0<this.libraries.length&&(e+=`&libraries=${this.libraries.join(",")}`),this.language&&(e+=`&language=${this.language}`),this.region&&(e+=`&region=${this.region}`),this.version&&(e+=`&v=${this.version}`),this.mapIds&&(e+=`&map_ids=${this.mapIds.join(",")}`),e}deleteScript(){let e=document.getElementById(this.id);e&&e.remove()}load(){return this.loadPromise()}loadPromise(){return new Promise((e,t)=>{this.loadCallback(r=>{r?t(r.error):e(window.google)})})}loadCallback(e){this.callbacks.push(e),this.execute()}setScript(){if(document.getElementById(this.id))this.callback();else{var e=this.createUrl(),t=document.createElement("script");t.id=this.id,t.type="text/javascript",t.src=e,t.onerror=this.loadErrorCallback.bind(this),t.defer=!0,t.async=!0,this.nonce&&(t.nonce=this.nonce),document.head.appendChild(t)}}reset(){this.deleteScript(),this.loading=this.done=!1,this.errors=[],this.onerrorEvent=null}resetIfRetryingFailed(){this.failed&&this.reset()}loadErrorCallback(e){this.errors.push(e),this.errors.length<=this.retries?(e=this.errors.length*Math.pow(2,this.errors.length),console.log(`Failed to load Google Maps script, retrying in ${e} ms.`),setTimeout(()=>{this.deleteScript(),this.setScript()},e)):(this.onerrorEvent=e,this.callback())}setCallback(){window.__googleMapsCallback=this.callback.bind(this)}callback(){this.done=!0,this.loading=!1,this.callbacks.forEach(e=>{e(this.onerrorEvent)}),this.callbacks=[]}execute(){this.resetIfRetryingFailed(),this.done?this.callback():window.google&&window.google.maps&&window.google.maps.version?(console.warn("Google Maps already loaded outside @googlemaps/js-api-loader.This may result in undesirable behavior as options and script parameters may not match."),this.callback()):this.loading||(this.loading=!0,this.setCallback(),this.setScript())}}function Oe(o){return class extends o.OverlayView{constructor(e){super();let{element:t,...r}=e;this.element=t,this.opts=r,this.opts.map&&this.setMap(this.opts.map)}getPosition(){return this.opts.position?this.opts.position instanceof o.LatLng?this.opts.position:new o.LatLng(this.opts.position):null}getVisible(){if(!this.element)return!1;let e=this.element;return e.style.display!=="none"&&e.style.visibility!=="hidden"&&(e.style.opacity===""||.01<Number(e.style.opacity))}onAdd(){if(this.element){var e=this.getPanes();e&&e.overlayMouseTarget.appendChild(this.element)}}draw(){if(this.element){var e=this.getProjection().fromLatLngToDivPixel(this.getPosition());if(e){this.element.style.position="absolute";let r=this.element.offsetHeight;var t=this.element.offsetWidth;switch(this.opts.anchorPoint){case"TOP_CENTER":t=e.x-t/2,e=e.y;break;case"BOTTOM_CENTER":t=e.x-t/2,e=e.y-r;break;case"LEFT_CENTER":t=e.x,e=e.y-r/2;break;case"RIGHT_CENTER":t=e.x-t,e=e.y-r/2;break;case"TOP_LEFT":t=e.x,e=e.y;break;case"TOP_RIGHT":t=e.x-t,e=e.y;break;case"BOTTOM_LEFT":t=e.x,e=e.y-r;break;case"BOTTOM_RIGHT":t=e.x-t,e=e.y-r;break;default:t=e.x-t/2,e=e.y-r/2}this.element.style.left=t+"px",this.element.style.top=e+"px",this.element.style.transform=`translateX(${this.opts.offsetX||0}px) translateY(${this.opts.offsetY||0}px)`,this.opts.zIndex&&(this.element.style.zIndex=this.opts.zIndex.toString())}}}onRemove(){this.element&&this.element.remove()}setOptions(e){this.opts=e,this.draw()}}}let Q,ee="bounds_changed center_changed click dblclick drag dragend dragstart heading_changed idle maptypeid_changed mousemove mouseout mouseover projection_changed resize rightclick tilesloaded tilt_changed zoom_changed".split(" ");var ve=_({props:{apiPromise:{type:Promise},apiKey:{type:String,default:""},version:{type:String,default:"weekly"},libraries:{type:Array,default:()=>["places"]},region:{type:String,required:!1},language:{type:String,required:!1},backgroundColor:{type:String,required:!1},center:{type:Object,default:()=>({lat:0,lng:0})},clickableIcons:{type:Boolean,required:!1,default:void 0},controlSize:{type:Number,required:!1},disableDefaultUi:{type:Boolean,required:!1,default:void 0},disableDoubleClickZoom:{type:Boolean,required:!1,default:void 0},draggable:{type:Boolean,required:!1,default:void 0},draggableCursor:{type:String,required:!1},draggingCursor:{type:String,required:!1},fullscreenControl:{type:Boolean,required:!1,default:void 0},fullscreenControlPosition:{type:String,required:!1},gestureHandling:{type:String,required:!1},heading:{type:Number,required:!1},keyboardShortcuts:{type:Boolean,required:!1,default:void 0},mapTypeControl:{type:Boolean,required:!1,default:void 0},mapTypeControlOptions:{type:Object,required:!1},mapTypeId:{type:[Number,String],required:!1},mapId:{type:String,required:!1},maxZoom:{type:Number,required:!1},minZoom:{type:Number,required:!1},noClear:{type:Boolean,required:!1,default:void 0},panControl:{type:Boolean,required:!1,default:void 0},panControlPosition:{type:String,required:!1},restriction:{type:Object,required:!1},rotateControl:{type:Boolean,required:!1,default:void 0},rotateControlPosition:{type:String,required:!1},scaleControl:{type:Boolean,required:!1,default:void 0},scaleControlStyle:{type:Number,required:!1},scrollwheel:{type:Boolean,required:!1,default:void 0},streetView:{type:Object,required:!1},streetViewControl:{type:Boolean,required:!1,default:void 0},streetViewControlPosition:{type:String,required:!1},styles:{type:Array,required:!1},tilt:{type:Number,required:!1},zoom:{type:Number,required:!1},zoomControl:{type:Boolean,required:!1,default:void 0},zoomControlPosition:{type:String,required:!1}},emits:ee,setup(o,{emit:e}){let t=g(),r=g(!1),i=g(),s=g(),a=g(!1);O(I,i),O(E,s),O(ce,a);let n=()=>{const l={...o};Object.keys(l).forEach(h=>{l[h]===void 0&&delete l[h]});var d=h=>{var c;return h?{position:(c=s.value)===null||c===void 0?void 0:c.ControlPosition[h]}:{}};return d={scaleControlOptions:o.scaleControlStyle?{style:o.scaleControlStyle}:{},panControlOptions:d(o.panControlPosition),zoomControlOptions:d(o.zoomControlPosition),rotateControlOptions:d(o.rotateControlPosition),streetViewControlOptions:d(o.streetViewControlPosition),fullscreenControlOptions:d(o.fullscreenControlPosition),disableDefaultUI:o.disableDefaultUi},{...l,...d}},p=w([s,i],([l,d])=>{l&&d&&(l.event.addListenerOnce(d,"tilesloaded",()=>{a.value=!0}),setTimeout(p,0))},{immediate:!0}),u=l=>{s.value=x(l.maps),i.value=x(new l.maps.Map(t.value,n())),l=Oe(s.value),s.value[q]=l,ee.forEach(d=>{var h;(h=i.value)===null||h===void 0||h.addListener(d,c=>e(d,c))}),r.value=!0,l=Object.keys(o).filter(d=>!"apiPromise apiKey version libraries region language center zoom".split(" ").includes(d)).map(d=>ue(o,d)),w([()=>o.center,()=>o.zoom,...l],([d,h],[c,m])=>{var v,f,y;const{center:Y,zoom:$,...Ce}=n();(v=i.value)===null||v===void 0||v.setOptions(Ce),h!==void 0&&h!==m&&((f=i.value)===null||f===void 0||f.setZoom(h)),h=!c||d.lng!==c.lng||d.lat!==c.lat,d&&h&&((y=i.value)===null||y===void 0||y.panTo(d))})};return D(()=>{if(o.apiPromise&&o.apiPromise instanceof Promise)o.apiPromise.then(u);else{try{const{apiKey:l,region:d,version:h,language:c,libraries:m}=o;Q=new C({apiKey:l,region:d,version:h,language:c,libraries:m})}catch(l){console.error(l)}Q.load().then(u)}}),b(()=>{var l;a.value=!1,i.value&&((l=s.value)===null||l===void 0||l.event.clearInstanceListeners(i.value))}),{mapRef:t,ready:r,map:i,api:s,mapTilesLoaded:a}}});function W(o,e){if(e===void 0&&(e={}),e=e.insertAt,o&&typeof document<"u"){var t=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css",e==="top"&&t.firstChild?t.insertBefore(r,t.firstChild):t.appendChild(r),r.styleSheet?r.styleSheet.cssText=o:r.appendChild(document.createTextNode(o))}}W(`
.mapdiv[data-v-177d06e3] {
  width: 100%;
  height: 100%;
}
`);let Pe=G();V("data-v-177d06e3");let be={ref:"mapRef",class:"mapdiv"};H();let Ie=Pe(o=>(R(),N("div",null,[B("div",be,null,512),Z(o.$slots,"default",{ready:o.ready,map:o.map,api:o.api,mapTilesLoaded:o.mapTilesLoaded},void 0,!0)])));ve.render=Ie;ve.__scopeId="data-v-177d06e3";var j=function o(e,t){if(e===t)return!0;if(e&&t&&typeof e=="object"&&typeof t=="object"){if(e.constructor!==t.constructor)return!1;var r;if(Array.isArray(e)){var i=e.length;if(i!=t.length)return!1;for(r=i;r--!==0;)if(!o(e[r],t[r]))return!1;return!0}if(e.constructor===RegExp)return e.source===t.source&&e.flags===t.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===t.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===t.toString();var s=Object.keys(e);if(i=s.length,i!==Object.keys(t).length)return!1;for(r=i;r--!==0;)if(!Object.prototype.hasOwnProperty.call(t,s[r]))return!1;for(r=i;r--!==0;)if(i=s[r],!o(e[i],t[i]))return!1;return!0}return e!==e&&t!==t};let ge=(o,e,t,r)=>{const i=g(),s=k(I,g()),a=k(E,g()),n=k(he,g()),p=T(()=>!!(n.value&&a.value&&(i.value instanceof a.value.Marker||i.value instanceof a.value[q])));return w([s,t],(u,[l,d])=>{var h,c,m;u=!j(t.value,d)||s.value!==l,s.value&&a.value&&u&&(i.value?(i.value.setOptions(t.value),p.value&&((h=n.value)===null||h===void 0||h.removeMarker(i.value),(c=n.value)===null||c===void 0||c.addMarker(i.value))):(i.value=o==="Marker"?x(new a.value[o](t.value)):o===q?x(new a.value[o](t.value)):x(new a.value[o]({...t.value,map:s.value})),p.value?(m=n.value)===null||m===void 0||m.addMarker(i.value):i.value.setMap(s.value),e.forEach(v=>{var f;(f=i.value)===null||f===void 0||f.addListener(v,y=>r(v,y))})))},{immediate:!0}),b(()=>{var u,l;i.value&&((u=a.value)===null||u===void 0||u.event.clearInstanceListeners(i.value),p.value?(l=n.value)===null||l===void 0||l.removeMarker(i.value):i.value.setMap(null))}),i},te="animation_changed click dblclick rightclick dragstart dragend drag mouseover mousedown mouseout mouseup draggable_changed clickable_changed contextmenu cursor_changed flat_changed rightclick zindex_changed icon_changed position_changed shape_changed title_changed visible_changed".split(" ");var Ye=_({name:"Marker",props:{options:{type:Object,required:!0}},emits:te,setup(o,{emit:e,expose:t,slots:r}){return o=ue(o,"options"),e=ge("Marker",te,o,e),O(pe,e),t({marker:e}),()=>{var i;return(i=r.default)===null||i===void 0?void 0:i.call(r)}}});me.concat(["bounds_changed"]);me.concat(["center_changed","radius_changed"]);var Ee=_({props:{position:{type:String,required:!0},index:{type:Number,default:1}},emits:["content:loaded"],setup(o,{emit:e}){let t=g(null),r=k(I,g()),i=k(E,g()),s=k(ce,g(!1)),a=g(!1),n=w([s,i,t],([l,d,h])=>{d&&l&&h&&(p(o.position),a.value=!0,e("content:loaded"),setTimeout(n,0))},{immediate:!0}),p=l=>{r.value&&i.value&&t.value&&r.value.controls[i.value.ControlPosition[l]].push(t.value)},u=l=>{if(r.value&&i.value){let d=null;l=i.value.ControlPosition[l],r.value.controls[l].forEach((h,c)=>{h===t.value&&(d=c)}),d!==null&&r.value.controls[l].removeAt(d)}};return b(()=>u(o.position)),w(()=>o.position,(l,d)=>{u(d),p(l)}),w(()=>o.index,l=>{l&&t.value&&(t.value.index=o.index)}),{controlRef:t,showContent:a}}});let Le={ref:"controlRef"};Ee.render=function(o){return R(),N(_e,null,[U(`
    v-show must be used instead of v-if otherwise there
    would be no rendered content pushed to the map controls
  `),xe(B("div",Le,[Z(o.$slots,"default")],512),[[Me,o.showContent]])],2112)};let re="closeclick content_changed domready position_changed visible zindex_changed".split(" ");var fe=_({inheritAttrs:!1,props:{options:{type:Object,default:()=>({})}},emits:re,setup(o,{slots:e,emit:t}){let r=g(),i=g(),s=k(I,g()),a=k(E,g()),n=k(pe,g()),p,u=T(()=>{var l;return(l=e.default)===null||l===void 0?void 0:l.call(e).some(d=>d.type!==de)});return D(()=>{w([s,()=>o.options],([,l],[d,h])=>{d=!j(l,h)||s.value!==d,s.value&&a.value&&d&&(r.value?(r.value.setOptions({...l,content:u.value?i.value:l.content}),n.value||r.value.open({map:s.value})):(r.value=x(new a.value.InfoWindow({...l,content:u.value?i.value:l.content})),n.value?p=n.value.addListener("click",()=>{r.value&&r.value.open({map:s.value,anchor:n.value})}):r.value.open({map:s.value}),re.forEach(c=>{var m;(m=r.value)===null||m===void 0||m.addListener(c,v=>t(c,v))})))},{immediate:!0})}),b(()=>{var l;p&&p.remove(),r.value&&((l=a.value)===null||l===void 0||l.event.clearInstanceListeners(r.value),r.value.close())}),{infoWindow:r,infoWindowRef:i,hasSlotContent:u}}});W(`
.info-window-wrapper[data-v-5b373d6e] {
  display: none;
}
.mapdiv .info-window-wrapper[data-v-5b373d6e] {
  display: inline-block;
}
`);let Te=G();V("data-v-5b373d6e");let qe={key:0,class:"info-window-wrapper"};H();let je=Te(o=>o.hasSlotContent?(R(),N("div",qe,[B("div",ae({ref:"infoWindowRef"},o.$attrs),[Z(o.$slots,"default",{},void 0,!0)],16)])):U("v-if",!0));fe.render=je;fe.__scopeId="data-v-5b373d6e";function F(o,e,t,r,i,s){if(!(i-r<=t)){var a=r+i>>1;ye(o,e,a,r,i,s%2),F(o,e,t,r,a-1,s+1),F(o,e,t,a+1,i,s+1)}}function ye(o,e,t,r,i,s){for(;i>r;){if(600<i-r){var a=i-r+1,n=t-r+1,p=Math.log(a),u=.5*Math.exp(2*p/3);p=.5*Math.sqrt(p*u*(a-u)/a)*(0>n-a/2?-1:1),ye(o,e,t,Math.max(r,Math.floor(t-n*u/a+p)),Math.min(i,Math.floor(t+(a-n)*u/a+p)),s)}for(a=e[2*t+s],n=r,u=i,S(o,e,r,t),e[2*i+s]>a&&S(o,e,r,i);n<u;){for(S(o,e,n,u),n++,u--;e[2*n+s]<a;)n++;for(;e[2*u+s]>a;)u--}e[2*r+s]===a?S(o,e,r,u):(u++,S(o,e,u,i)),u<=t&&(r=u+1),t<=u&&(i=u-1)}}function S(o,e,t,r){A(o,t,r),A(e,2*t,2*r),A(e,2*t+1,2*r+1)}function A(o,e,t){let r=o[e];o[e]=o[t],o[t]=r}let ze=o=>o[0],Ne=o=>o[1];class ie{constructor(e,t=ze,r=Ne,i=64,s=Float64Array){this.nodeSize=i,this.points=e;let a=this.ids=new(65536>e.length?Uint16Array:Uint32Array)(e.length);s=this.coords=new s(2*e.length);for(let n=0;n<e.length;n++)a[n]=n,s[2*n]=t(e[n]),s[2*n+1]=r(e[n]);F(a,s,i,0,a.length-1,0)}range(e,t,r,i){{var s=this.ids,a=this.coords,n=this.nodeSize;let u=[0,s.length-1,0],l=[],d,h;for(;u.length;){var p=u.pop();let c=u.pop(),m=u.pop();if(c-m<=n){for(p=m;p<=c;p++)d=a[2*p],h=a[2*p+1],d>=e&&d<=r&&h>=t&&h<=i&&l.push(s[p]);continue}let v=Math.floor((m+c)/2);d=a[2*v],h=a[2*v+1],d>=e&&d<=r&&h>=t&&h<=i&&l.push(s[v]);let f=(p+1)%2;(p===0?e<=d:t<=h)&&(u.push(m),u.push(v-1),u.push(f)),(p===0?r>=d:i>=h)&&(u.push(v+1),u.push(c),u.push(f))}e=l}return e}within(e,t,r){{var i=this.ids,s=this.coords,a=this.nodeSize;let d=[0,i.length-1,0],h=[],c=r*r;for(;d.length;){var n=d.pop();let m=d.pop();var p=d.pop();if(m-p<=a){for(n=p;n<=m;n++){p=s[2*n]-e;var u=s[2*n+1]-t;p=p*p+u*u,p<=c&&h.push(i[n])}continue}u=Math.floor((p+m)/2);let v=s[2*u],f=s[2*u+1];{var l=v-e;let y=f-t;l=l*l+y*y}l<=c&&h.push(i[u]),l=(n+1)%2,(n===0?e-r<=v:t-r<=f)&&(d.push(p),d.push(u-1),d.push(l)),(n===0?e+r>=v:t+r>=f)&&(d.push(u+1),d.push(m),d.push(l))}e=h}return e}}let Be={minZoom:0,maxZoom:16,minPoints:2,radius:40,extent:512,nodeSize:64,log:!1,generateId:!1,reduce:null,map:o=>o},z=Math.fround||(o=>e=>(o[0]=+e,o[0]))(new Float32Array(1));class Ze{constructor(e){this.options=P(Object.create(Be),e),this.trees=Array(this.options.maxZoom+1)}load(e){let{log:t,minZoom:r,maxZoom:i,nodeSize:s}=this.options;t&&console.time("total time");var a=`prepare ${e.length} points`;t&&console.time(a),this.points=e;let n=[];for(let p=0;p<e.length;p++)e[p].geometry&&n.push($e(e[p],p));for(this.trees[i+1]=new ie(n,se,ne,s,Float32Array),t&&console.timeEnd(a),e=i;e>=r;e--)a=+Date.now(),n=this._cluster(n,e),this.trees[e]=new ie(n,se,ne,s,Float32Array),t&&console.log("z%d: %d clusters in %dms",e,n.length,+Date.now()-a);return t&&console.timeEnd("total time"),this}getClusters(e,t){let r=((e[0]+180)%360+360)%360-180;var i=Math.max(-90,Math.min(90,e[1])),s=e[2]===180?180:((e[2]+180)%360+360)%360-180;let a=Math.max(-90,Math.min(90,e[3]));if(360<=e[2]-e[0])r=-180,s=180;else if(r>s){var n=this.getClusters([r,i,180,a],t);return i=this.getClusters([-180,i,s,a],t),n.concat(i)}t=this.trees[this._limitZoom(t)],s=t.range(r/360+.5,L(a),s/360+.5,L(i)),i=[];for(n of s)s=t.points[n],i.push(s.numPoints?oe(s):this.points[s.index]);return i}getChildren(e){var t=this._getOriginId(e),r=this._getOriginZoom(e);let i=this.trees[r];if(!i||(t=i.points[t],!t))throw Error("No cluster with the specified id.");t=i.within(t.x,t.y,this.options.radius/(this.options.extent*Math.pow(2,r-1))),r=[];for(let s of t)t=i.points[s],t.parentId===e&&r.push(t.numPoints?oe(t):this.points[t.index]);if(r.length===0)throw Error("No cluster with the specified id.");return r}getLeaves(e,t,r){let i=[];return this._appendLeaves(i,e,t||10,r||0,0),i}getTile(e,t,r){let i=this.trees[this._limitZoom(e)];e=Math.pow(2,e);let{extent:s,radius:a}=this.options,n=a/s,p=(r-n)/e,u=(r+1+n)/e,l={features:[]};return this._addTileFeatures(i.range((t-n)/e,p,(t+1+n)/e,u),i.points,t,r,e,l),t===0&&this._addTileFeatures(i.range(1-n/e,p,1,u),i.points,e,r,e,l),t===e-1&&this._addTileFeatures(i.range(0,p,n/e,u),i.points,-1,r,e,l),l.features.length?l:null}getClusterExpansionZoom(e){let t=this._getOriginZoom(e)-1;for(;t<=this.options.maxZoom&&(e=this.getChildren(e),t++,e.length===1);)e=e[0].properties.cluster_id;return t}_appendLeaves(e,t,r,i,s){t=this.getChildren(t);for(let a of t)if((t=a.properties)&&t.cluster?s=s+t.point_count<=i?s+t.point_count:this._appendLeaves(e,t.cluster_id,r,i,s):s<i?s++:e.push(a),e.length===r)break;return s}_addTileFeatures(e,t,r,i,s,a){for(let u of e){e=t[u];let l=e.numPoints;var n=void 0;let d;var p=void 0;l?(n=ke(e),d=e.x,p=e.y):(p=this.points[e.index],n=p.properties,d=p.geometry.coordinates[0]/360+.5,p=L(p.geometry.coordinates[1])),n={type:1,geometry:[[Math.round(this.options.extent*(d*s-r)),Math.round(this.options.extent*(p*s-i))]],tags:n};let h;l?h=e.id:this.options.generateId?h=e.index:this.points[e.index].id&&(h=this.points[e.index].id),h!==void 0&&(n.id=h),a.features.push(n)}}_limitZoom(e){return Math.max(this.options.minZoom,Math.min(Math.floor(+e),this.options.maxZoom+1))}_cluster(e,t){let r=[],{radius:i,extent:s,reduce:a,minPoints:n}=this.options,p=i/(s*Math.pow(2,t));for(let c=0;c<e.length;c++){var u=e[c];if(u.zoom<=t)continue;u.zoom=t;let m=this.trees[t+1];var l=m.within(u.x,u.y,p),d=u.numPoints||1;let v=d;for(let f of l){var h=m.points[f];h.zoom>t&&(v+=h.numPoints||1)}if(v>d&&v>=n){h=u.x*d;let f=u.y*d;d=a&&1<d?this._map(u,!0):null;let y=(c<<5)+(t+1)+this.points.length;for(let Y of l){if(l=m.points[Y],l.zoom<=t)continue;l.zoom=t;let $=l.numPoints||1;h+=l.x*$,f+=l.y*$,l.parentId=y,a&&(d||(d=this._map(u,!0)),a(d,this._map(l)))}u.parentId=y,r.push(Re(h/v,f/v,y,v,d))}else if(r.push(u),1<v)for(let f of l)u=m.points[f],u.zoom<=t||(u.zoom=t,r.push(u))}return r}_getOriginId(e){return e-this.points.length>>5}_getOriginZoom(e){return(e-this.points.length)%32}_map(e,t){if(e.numPoints)return t?P({},e.properties):e.properties;e=this.points[e.index].properties;let r=this.options.map(e);return t&&r===e?P({},r):r}}function Re(o,e,t,r,i){return{x:z(o),y:z(e),zoom:1/0,id:t,parentId:-1,numPoints:r,properties:i}}function $e(o,e){let[t,r]=o.geometry.coordinates;return{x:z(t/360+.5),y:z(L(r)),zoom:1/0,index:e,parentId:-1}}function oe(o){var e=o.id,t=ke(o);return{type:"Feature",id:e,properties:t,geometry:{type:"Point",coordinates:[360*(o.x-.5),360*Math.atan(Math.exp((180-360*o.y)*Math.PI/180))/Math.PI-90]}}}function ke(o){let e=o.numPoints,t=1e4<=e?`${Math.round(e/1e3)}k`:1e3<=e?`${Math.round(e/100)/10}k`:e;return P(P({},o.properties),{cluster:!0,cluster_id:o.id,point_count:e,point_count_abbreviated:t})}function L(o){return o=Math.sin(o*Math.PI/180),o=.5-.25*Math.log((1+o)/(1-o))/Math.PI,0>o?0:1<o?1:o}function P(o,e){for(let t in e)o[t]=e[t];return o}function se(o){return o.x}function ne(o){return o.y}class K{constructor({markers:e,position:t}){this.markers=e,t&&(this._position=t instanceof google.maps.LatLng?t:new google.maps.LatLng(t))}get bounds(){if(this.markers.length!==0||this._position)return this.markers.reduce((e,t)=>e.extend(t.getPosition()),new google.maps.LatLngBounds(this._position,this._position))}get position(){return this._position||this.bounds.getCenter()}get count(){return this.markers.filter(e=>e.getVisible()).length}push(e){this.markers.push(e)}delete(){this.marker&&(this.marker.setMap(null),delete this.marker),this.markers.length=0}}class Ae{constructor({maxZoom:e=16}){this.maxZoom=e}noop({markers:e}){return Fe(e)}}let Fe=o=>o.map(e=>new K({position:e.getPosition(),markers:[e]}));class Ke extends Ae{constructor(e){var{maxZoom:t,radius:r=60}=e,i=["maxZoom","radius"],s={},a;for(a in e)Object.prototype.hasOwnProperty.call(e,a)&&0>i.indexOf(a)&&(s[a]=e[a]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function"){var n=0;for(a=Object.getOwnPropertySymbols(e);n<a.length;n++)0>i.indexOf(a[n])&&Object.prototype.propertyIsEnumerable.call(e,a[n])&&(s[a[n]]=e[a[n]])}super({maxZoom:t}),this.superCluster=new Ze(Object.assign({maxZoom:this.maxZoom,radius:r},s)),this.state={zoom:null}}calculate(e){let t=!1;if(!j(e.markers,this.markers)){t=!0,this.markers=[...e.markers];var r=this.markers.map(i=>({type:"Feature",geometry:{type:"Point",coordinates:[i.getPosition().lng(),i.getPosition().lat()]},properties:{marker:i}}));this.superCluster.load(r)}return r={zoom:e.map.getZoom()},t||this.state.zoom>this.maxZoom&&r.zoom>this.maxZoom||(t=t||!j(this.state,r)),this.state=r,t&&(this.clusters=this.cluster(e)),{clusters:this.clusters,changed:t}}cluster({map:e}){return this.superCluster.getClusters([-180,-90,180,90],Math.round(e.getZoom())).map(this.transformCluster.bind(this))}transformCluster({geometry:{coordinates:[e,t]},properties:r}){return r.cluster?new K({markers:this.superCluster.getLeaves(r.cluster_id,1/0).map(i=>i.properties.marker),position:new google.maps.LatLng({lat:t,lng:e})}):(e=r.marker,new K({markers:[e],position:e.getPosition()}))}}class Ue{constructor(e,t){this.markers={sum:e.length},e=t.map(i=>i.count);let r=e.reduce((i,s)=>i+s,0);this.clusters={count:t.length,markers:{mean:r/t.length,sum:r,min:Math.min(...e),max:Math.max(...e)}}}}class De{render({count:e,position:t},r){return r=window.btoa(`
  <svg fill="${e>Math.max(10,r.clusters.markers.mean)?"#ff0000":"#0000ff"}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
    <circle cx="120" cy="120" opacity=".6" r="70" />
    <circle cx="120" cy="120" opacity=".3" r="90" />
    <circle cx="120" cy="120" opacity=".2" r="110" />
  </svg>`),new google.maps.Marker({position:t,icon:{url:`data:image/svg+xml;base64,${r}`,scaledSize:new google.maps.Size(45,45)},label:{text:String(e),color:"rgba(255,255,255,0.9)",fontSize:"12px"},title:`Cluster of ${e} markers`,zIndex:Number(google.maps.Marker.MAX_ZINDEX)+e})}}class X{constructor(){var e=X,t=google.maps.OverlayView;for(let r in t.prototype)e.prototype[r]=t.prototype[r]}}var M,J=M||(M={});J.CLUSTERING_BEGIN="clusteringbegin";J.CLUSTERING_END="clusteringend";J.CLUSTER_CLICK="click";let Ge=(o,e,t)=>{t.fitBounds(e.bounds)};class Ve extends X{constructor({map:e,markers:t=[],algorithm:r=new Ke({}),renderer:i=new De,onClusterClick:s=Ge}){super(),this.markers=[...t],this.clusters=[],this.algorithm=r,this.renderer=i,this.onClusterClick=s,e&&this.setMap(e)}addMarker(e,t){this.markers.includes(e)||(this.markers.push(e),t||this.render())}addMarkers(e,t){e.forEach(r=>{this.addMarker(r,!0)}),t||this.render()}removeMarker(e,t){let r=this.markers.indexOf(e);return r===-1?!1:(e.setMap(null),this.markers.splice(r,1),t||this.render(),!0)}removeMarkers(e,t){let r=!1;return e.forEach(i=>{r=this.removeMarker(i,!0)||r}),r&&!t&&this.render(),r}clearMarkers(e){this.markers.length=0,e||this.render()}render(){let e=this.getMap();if(e instanceof google.maps.Map&&this.getProjection()){google.maps.event.trigger(this,M.CLUSTERING_BEGIN,this);let{clusters:t,changed:r}=this.algorithm.calculate({markers:this.markers,map:e,mapCanvasProjection:this.getProjection()});(r||r==null)&&(this.reset(),this.clusters=t,this.renderClusters()),google.maps.event.trigger(this,M.CLUSTERING_END,this)}}onAdd(){this.idleListener=this.getMap().addListener("idle",this.render.bind(this)),this.render()}onRemove(){google.maps.event.removeListener(this.idleListener),this.reset()}reset(){this.markers.forEach(e=>e.setMap(null)),this.clusters.forEach(e=>e.delete()),this.clusters=[]}renderClusters(){let e=new Ue(this.markers,this.clusters),t=this.getMap();this.clusters.forEach(r=>{r.markers.length===1?r.marker=r.markers[0]:(r.marker=this.renderer.render(r,e),this.onClusterClick&&r.marker.addListener("click",i=>{google.maps.event.trigger(this,M.CLUSTER_CLICK,r),this.onClusterClick(i,r,t)})),r.marker.setMap(t)})}}let le=Object.values(M);var Qe=_({name:"MarkerCluster",props:{options:{type:Object,default:()=>({})}},emits:le,setup(o,{emit:e,expose:t,slots:r}){let i=g(),s=k(I,g()),a=k(E,g());return O(he,i),w(s,()=>{s.value&&(i.value=x(new Ve({map:s.value,...o.options})),le.forEach(n=>{var p;(p=i.value)===null||p===void 0||p.addListener(n,u=>e(n,u))}))},{immediate:!0}),b(()=>{var n;i.value&&((n=a.value)===null||n===void 0||n.event.clearInstanceListeners(i.value),i.value.clearMarkers(),i.value.setMap(null))}),t({markerCluster:i}),()=>{var n;return(n=r.default)===null||n===void 0?void 0:n.call(r)}}}),we=_({inheritAttrs:!1,props:{options:{type:Object,required:!0}},setup(o,{slots:e,emit:t}){let r=g(),i=g(),s=T(()=>{var n;return(n=e.default)===null||n===void 0?void 0:n.call(e).some(p=>p.type!==de)}),a=T(()=>({...o.options,element:r.value}));return D(()=>{i=ge(q,[],a,t)}),{customMarkerRef:r,customMarker:i,hasSlotContent:s}}});W(`
.custom-marker-wrapper[data-v-b9d5ec8a] {
  display: none;
}
.mapdiv .custom-marker-wrapper[data-v-b9d5ec8a] {
  display: inline-block;
}
`);let He=G();V("data-v-b9d5ec8a");let We={key:0,class:"custom-marker-wrapper"};H();let Xe=He(o=>o.hasSlotContent?(R(),N("div",We,[B("div",ae({ref:"customMarkerRef",style:{cursor:o.$attrs.onClick?"pointer":void 0}},o.$attrs),[Z(o.$slots,"default",{},void 0,!0)],16)])):U("v-if",!0));we.render=Xe;we.__scopeId="data-v-b9d5ec8a";export{ve as F,Qe as K,fe as P,Ye as f};

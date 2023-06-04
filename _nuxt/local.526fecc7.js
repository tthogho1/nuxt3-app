import{f as S,K as x,F as z,P as D}from"./index.01af5782.js";import{e as I,f as i,i as L,h as N,o as _,c as q,G as d,u as s,a as f,B as P,H as W,F as w,D as g,E as F}from"./entry.e9c3e84d.js";const H=["href"],O=["src"],K=I({__name:"local",setup($){const r=i(null),p=i({lat:0,lng:0}),y=i({position:p});L(()=>{b()});const v=i([]),k=i(""),b=function(){fetch("https://realm.mongodb.com/api/client/v2.0/app/webcamql-qrkjj/auth/providers/api-key/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:"zltDLjGDHqJHzQ0tSHA3XSZJUTnV5TxBmjW2PopKInszFsDxqSAEubmtq5tRRLgm"})}).then(t=>t.json()).then(t=>{k.value=t.access_token}).catch(t=>console.error(t))},B=function(t){const n=t.getBounds(),e=n.getNorthEast(),o=n.getSouthWest(),a=o.lat(),c=e.lat(),u=o.lng(),E=e.lng(),A="Bearer "+k.value,T=`query {
  		webcams(query:{status:"active",location:{
                        longitude_lt:${E},
                        longitude_gte:${u},
                        latitude_lt:${c},
                        latitude_gte:${a}}}
    	,limit:200
    	,sortBy:ID_ASC) {
			id
			title
    		location{
     		 	latitude
      			longitude
    		}
            player{
               day{
                 available
                 link
              }
           }
           image{
                current{
                    thumbnail
                }    
           }
  		}
	}`,m=document.getElementById("gmap");m!=null&&m!=null&&(m.style.pointerEvents="none"),fetch("https://realm.mongodb.com/api/client/v2.0/app/webcamql-qrkjj/graphql",{method:"POST",headers:{Authorization:A,"Content-Type":"application/json"},body:JSON.stringify({query:T})}).then(l=>l.json()).then(l=>{v.value=Array.from(l.data.webcams);const h=document.getElementById("gmap");h!=null&&h!=null&&(h.style.pointerEvents="auto")}).catch(l=>console.error(l))},j=function(t,n,e){const o={url:"./images/man.png",scaledSize:new r.value.api.Size(30,30)};navigator.geolocation.getCurrentPosition(function(a){const c=a.coords.latitude,u=a.coords.longitude;t.panTo({lat:c,lng:u}),n.value={lat:c,lng:u},e.value={position:n,icon:o}},function(a){console.error(`Error getting location: ${a.message}`)})};return N(()=>{var t;return(t=r.value)==null?void 0:t.ready},t=>{if(!t)return;const n=r.value.map;j(n,p,y),n.addListener("idle",e=>{B(n)})}),(t,n)=>(_(),q(s(z),{id:"gmap",ref_key:"mapRef",ref:r,"api-key":"AIzaSyAYemHqW9xU48b7KhMXauA6P0fDFTWyly0",style:{width:"100%",height:"500px"},center:p.value,zoom:15},{default:d(()=>[f(s(S),{options:y.value},null,8,["options"]),f(s(x),null,{default:d(()=>[(_(!0),P(w,null,W(v.value,(e,o)=>(_(),q(s(S),{options:{position:{lat:e.location.latitude,lng:e.location.longitude}},key:o},{default:d(()=>[f(s(D),null,{default:d(()=>[g("div",null,[g("a",{href:e.player.day.link,target:"_blank"},F(e.title),9,H)]),g("div",null,[g("img",{src:e.image.current.thumbnail},null,8,O)])]),_:2},1024)]),_:2},1032,["options"]))),128))]),_:1})]),_:1},8,["center"]))}});export{K as default};

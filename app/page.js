"use client";

import { useEffect, useState } from "react";

export default function Home(){

const [data,setData]=useState([]);
const [tab,setTab]=useState("헤드라인");
const [search,setSearch]=useState("");
const [selected,setSelected]=useState({});

async function loadNews(){

const res=await fetch("/api/news");
const json=await res.json();

setData(json);

const init={};
json.forEach(p=>init[p.source]=true);
setSelected(init);

checkBreaking(json);

}

function checkBreaking(news){

news.forEach(p=>{
p.headlines.forEach(a=>{

const title=a.title||"";

if(
title.includes("속보")||
title.includes("단독")||
title.includes("1보")
){

if(Notification.permission==="granted"){

new Notification("🚨 속보 알림",{
body:title,
icon:"/next.svg"
});

}

}

});
});

}

useEffect(()=>{

if("Notification" in window){
Notification.requestPermission();
}

loadNews();

const interval=setInterval(loadNews,30000);

return()=>clearInterval(interval);

},[]);

function filtered(headlines){

return headlines.filter(a=>{

const title=(a.title||"").toLowerCase();

if(search && !title.includes(search.toLowerCase())) return false;

if(tab==="속보&단독"){

return(
title.includes("속보")||
title.includes("단독")||
title.includes("1보")
);

}

if(tab==="칼럼"){

return(
title.includes("칼럼")||
title.includes("사설")||
title.includes("오피니언")
);

}

return true;

});

}

return(

<div style={{maxWidth:900,margin:"40px auto",fontFamily:"sans-serif"}}>

<h1>📰 News Brief</h1>

<div style={{display:"flex",gap:10,marginBottom:20}}>

<button onClick={()=>setTab("헤드라인")}>헤드라인</button>
<button onClick={()=>setTab("칼럼")}>칼럼</button>
<button onClick={()=>setTab("속보&단독")}>속보&단독</button>

</div>

<input
placeholder="기사 검색"
value={search}
onChange={e=>setSearch(e.target.value)}
style={{width:"100%",padding:10,marginBottom:20}}
/>

{data.map(p=>{

if(!selected[p.source]) return null;

const articles=filtered(p.headlines);

return(

<div key={p.source} style={{marginBottom:30,border:"1px solid #eee",padding:15,borderRadius:10}}>

<div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>

<h3>{p.source}</h3>

<label>

<input
type="checkbox"
checked={selected[p.source]||false}
onChange={e=>setSelected({...selected,[p.source]:e.target.checked})}
/>

</label>

</div>

{articles.length===0 && <p>기사 없음</p>}

{articles.map((a,i)=>{

const isBreaking=
(
a.title.includes("속보")||
a.title.includes("단독")||
a.title.includes("1보")
)
&& a.pubDate
&& (Date.now() - new Date(a.pubDate).getTime()) < 600000;

return(

<div key={i} style={{display:"flex",gap:10,marginBottom:12}}>

{a.image && (

<img
src={a.image}
style={{
width:80,
height:80,
objectFit:"cover",
borderRadius:6
}}
/>

)}

<div>

<a href={a.link} target="_blank" style={{fontWeight:600}}>

{a.title}

</a>

{isBreaking && (

<span
style={{
marginLeft:6,
background:"red",
color:"white",
padding:"2px 6px",
borderRadius:4,
fontSize:12
}}
>

속보

</span>

)}

</div>

</div>

);

})}

</div>

);

})}

</div>

);

}
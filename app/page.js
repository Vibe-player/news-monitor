"use client";

import { useEffect,useState } from "react";

export default function Home(){

const [data,setData]=useState([]);
const [tab,setTab]=useState("헤드라인");
const [search,setSearch]=useState("");
const [breaking,setBreaking]=useState(null);

async function loadNews(){

const res=await fetch("/api/news",{cache:"no-store"});
const json=await res.json();

setData(json);

const breakingNews=[];

json.forEach(p=>{
p.headlines.forEach(a=>{

if(
a.title.includes("속보") ||
a.title.includes("단독") ||
a.title.includes("1보")
){

if(a.pubDate){

const age = Date.now() - new Date(a.pubDate).getTime();

if(age < 600000){
breakingNews.push(a);
}

}

}

});
});

if(breakingNews.length>0){

breakingNews.sort(
(a,b)=>new Date(b.pubDate)-new Date(a.pubDate)
);

setBreaking(breakingNews[0]);

}else{

setBreaking(null);

}

}

useEffect(()=>{

loadNews();

const interval=setInterval(loadNews,30000);

return()=>clearInterval(interval);

},[]);

function filtered(list){

return list.filter(a=>{

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

<h1 style={{fontSize:28,fontWeight:700}}>📰 News Brief</h1>

{breaking && (

<div
style={{
background:"#d32f2f",
color:"white",
padding:"10px 14px",
borderRadius:8,
marginBottom:20,
fontWeight:600
}}
>

🚨 속보 | 

<a
href={breaking.link}
target="_blank"
rel="noopener noreferrer"
style={{color:"white",marginLeft:6}}
>

{breaking.title}

</a>

</div>

)}

<div style={{display:"flex",gap:8,marginBottom:20}}>

{["헤드라인","칼럼","속보&단독"].map(t=>(

<button
key={t}
onClick={()=>setTab(t)}
style={{
padding:"8px 16px",
borderRadius:20,
border:"none",
background:tab===t?"black":"#eee",
color:tab===t?"white":"black",
cursor:"pointer"
}}
>

{t}

</button>

))}

</div>

<input
placeholder="기사 검색"
value={search}
onChange={e=>setSearch(e.target.value)}
style={{
width:"100%",
padding:10,
marginBottom:20,
border:"1px solid #ddd",
borderRadius:8
}}
/>

{data.map(p=>{

const articles=filtered(p.headlines);

return(

<div key={p.source} style={{marginBottom:30}}>

<h3 style={{marginBottom:10}}>{p.source}</h3>

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

<div
key={i}
style={{
padding:"10px 0",
borderBottom:"1px solid #eee"
}}
>

<a
href={a.link}
target="_blank"
rel="noopener noreferrer"
style={{fontWeight:600}}
>

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

);

})}

</div>

);

})}

</div>

);

}

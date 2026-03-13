"use client";

import { useEffect,useState } from "react";

export default function Home(){

const [data,setData]=useState([]);
const [tab,setTab]=useState("헤드라인");
const [search,setSearch]=useState("");
const [selected,setSelected]=useState({});

async function loadNews(){

const res=await fetch("/api/news",{cache:"no-store"});
const json=await res.json();

setData(json);

setSelected(prev=>{
const updated={...prev};
json.forEach(p=>{
if(updated[p.source]===undefined){
updated[p.source]=true;
}
});
return updated;
});

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

<div style={{display:"flex",gap:8,margin:"20px 0"}}>

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

const enabled=selected[p.source]!==false;

const articles=enabled ? filtered(p.headlines) : [];

return(

<div key={p.source} style={{marginBottom:30}}>

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}>

<h3>{p.source}</h3>

<div
onClick={()=>setSelected({...selected,[p.source]:!enabled})}
style={{
width:40,
height:20,
background:enabled?"#4caf50":"#ccc",
borderRadius:20,
cursor:"pointer",
position:"relative"
}}
>

<div style={{
width:16,
height:16,
background:"white",
borderRadius:"50%",
position:"absolute",
top:2,
left:enabled?22:2,
transition:"0.2s"
}}/>

</div>

</div>

{articles.map((a,i)=>(

<div key={i}
style={{
display:"flex",
gap:12,
padding:"10px 0",
borderBottom:"1px solid #eee"
}}
>

{a.image && (

<img
src={a.image}
style={{
width:90,
height:70,
objectFit:"cover",
borderRadius:6
}}
/>

)}

<div style={{flex:1}}>

<a
href={a.link}
target="_blank"
rel="noopener noreferrer"
style={{fontWeight:600}}
>

{a.title}

</a>

</div>

</div>

))}

</div>

);

})}

</div>

);

}
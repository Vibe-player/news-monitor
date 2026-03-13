"use client";

import { useEffect,useState } from "react";

export default function Home(){

  const [data,setData] = useState([]);
  const [tab,setTab] = useState("헤드라인");
  const [search,setSearch] = useState("");
  const [alert,setAlert] = useState(null);

  const [selected,setSelected] = useState({});

  async function loadNews(){

    const res = await fetch("/api/news");
    const json = await res.json();

    setData(json);

    const init={};
    json.forEach(p=>init[p.source]=true);
    setSelected(init);

    json.forEach(p=>{

      p.headlines.forEach(h=>{

        if(
          h.title.includes("속보") ||
          h.title.includes("단독") ||
          h.title.includes("1보")
        ){

          setAlert(h.title);

        }

      });

    });

  }

  useEffect(()=>{

    loadNews();

    const timer=setInterval(()=>{

      loadNews();

    },30000);

    return ()=>clearInterval(timer);

  },[]);



  function togglePaper(paper){

    setSelected({
      ...selected,
      [paper]:!selected[paper]
    });

  }


  function filterArticles(headlines){

    if(tab==="속보&단독"){

      return headlines.filter(h =>
        h.title.includes("속보") ||
        h.title.includes("단독") ||
        h.title.includes("1보")
      );

    }

    if(tab==="칼럼"){

      return headlines.filter(h =>
        h.title.includes("칼럼") ||
        h.title.includes("사설") ||
        h.title.includes("오피니언")
      );

    }

    return headlines;

  }


  return(

    <main className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        📰 News Brief
      </h1>


      {alert && (

        <div className="bg-red-500 text-white p-3 rounded mb-6">

          🚨 속보 감지  
          <div className="text-sm mt-1">{alert}</div>

        </div>

      )}


      <div className="flex gap-3 mb-6">

        {["헤드라인","칼럼","속보&단독"].map(t=>(

          <button
            key={t}
            onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded ${
              tab===t
              ? "bg-black text-white"
              : "bg-gray-200"
            }`}
          >
            {t}
          </button>

        ))}

      </div>


      <input
        type="text"
        placeholder="기사 검색"
        value={search}
        onChange={e=>setSearch(e.target.value)}
        className="w-full border p-2 rounded mb-6"
      />


      {data
        .filter(p=>selected[p.source])
        .map(paper=>{

        const articles = filterArticles(paper.headlines)
          .filter(h =>
            h.title.toLowerCase()
            .includes(search.toLowerCase())
          );

        return(

        <div
          key={paper.source}
          className="bg-white p-4 rounded-xl shadow mb-6"
        >

          <div className="flex justify-between items-center mb-3">

            <h2 className="font-bold text-lg">
              {paper.source}
            </h2>

            <button
              onClick={()=>togglePaper(paper.source)}
              className={`relative w-12 h-6 rounded-full ${
                selected[paper.source]
                ? "bg-green-500"
                : "bg-gray-300"
              }`}
            >

              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
                  selected[paper.source]
                    ? "translate-x-6"
                    : ""
                }`}
              />

            </button>

          </div>


          <ul className="space-y-2">

          {articles.length===0
            ? <li className="text-gray-400 text-sm">기사 없음</li>
            : articles.map((h,i)=>{

              const isBreaking =
                h.title.includes("속보") ||
                h.title.includes("단독") ||
                h.title.includes("1보");

              return(

              <li key={i} className="flex gap-2 items-start">

                {isBreaking && (

                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                    속보
                  </span>

                )}

                <a
                  href={h.link}
                  target="_blank"
                  className="hover:underline"
                >
                  {h.title}
                </a>

              </li>

              );

            })
          }

          </ul>

        </div>

        );

      })}

    </main>

  );

}
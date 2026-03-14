import Parser from "rss-parser";

const parser = new Parser();

const feeds = [

{ source:"연합뉴스", rss:"https://www.yna.co.kr/rss/news.xml" },

{ source:"KBS", rss:"https://news.kbs.co.kr/rss/rss.xml" },

{ source:"MBC", rss:"https://imnews.imbc.com/rss/news.xml" },

{ source:"SBS", rss:"https://news.sbs.co.kr/news/SectionRssFeed.do?sectionId=01" },

{ source:"JTBC", rss:"https://fs.jtbc.co.kr/RSS/newsflash.xml" },

{ source:"TV조선", rss:"https://www.tvchosun.com/rss/news.xml" },

{ source:"채널A", rss:"https://rss.ichannela.com/news/main.xml" },

{ source:"YTN", rss:"https://www.ytn.co.kr/_rss/news.xml" },

{ source:"조선일보", rss:"https://www.chosun.com/arc/outboundfeeds/rss/?outputType=xml" },

{ source:"중앙일보", rss:"https://rss.joins.com/joins_total_list.xml" },

{ source:"동아일보", rss:"https://rss.donga.com/total.xml" },

{ source:"한겨레", rss:"https://www.hani.co.kr/rss/" },

{ source:"경향신문", rss:"https://www.khan.co.kr/rss/rssdata/total_news.xml" },

{ source:"매일경제", rss:"https://www.mk.co.kr/rss/30000001/" },

{ source:"한국경제", rss:"https://rss.hankyung.com/feed/news" }

];

export async function GET(){

const result=[];

for(const f of feeds){

try{

const rss = await parser.parseURL(f.rss);

const headlines = rss.items.slice(0,6).map(i=>({

title:i.title,
link:i.link,
pubDate:i.pubDate

}));

result.push({
source:f.source,
headlines
});

}catch{

result.push({
source:f.source,
headlines:[]
});

}

}

return Response.json(result);

}

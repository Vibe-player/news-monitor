import Parser from "rss-parser";
import * as cheerio from "cheerio";

const parser = new Parser();

const feeds = [

{ source:"연합뉴스", rss:"https://www.yna.co.kr/rss/news.xml", fallback:"https://www.yna.co.kr" },

{ source:"KBS", rss:"https://news.kbs.co.kr/rss/rss.xml", fallback:"https://news.kbs.co.kr" },
{ source:"MBC", rss:"https://imnews.imbc.com/rss/news.xml", fallback:"https://imnews.imbc.com" },
{ source:"SBS", rss:"https://news.sbs.co.kr/news/SectionRssFeed.do?sectionId=01", fallback:"https://news.sbs.co.kr" },
{ source:"JTBC", rss:"https://fs.jtbc.co.kr/RSS/newsflash.xml", fallback:"https://news.jtbc.co.kr" },
{ source:"TV조선", rss:"https://www.tvchosun.com/rss/news.xml", fallback:"https://www.tvchosun.com" },
{ source:"채널A", rss:"https://rss.ichannela.com/news/main.xml", fallback:"https://www.ichannela.com" },
{ source:"YTN", rss:"https://www.ytn.co.kr/_rss/news.xml", fallback:"https://www.ytn.co.kr" },

{ source:"조선일보", rss:"https://www.chosun.com/arc/outboundfeeds/rss/?outputType=xml", fallback:"https://www.chosun.com" },
{ source:"중앙일보", rss:"https://rss.joins.com/joins_total_list.xml", fallback:"https://www.joongang.co.kr" },
{ source:"동아일보", rss:"https://rss.donga.com/total.xml", fallback:"https://www.donga.com" },
{ source:"한겨레", rss:"https://www.hani.co.kr/rss/", fallback:"https://www.hani.co.kr" },
{ source:"경향신문", rss:"https://www.khan.co.kr/rss/rssdata/total_news.xml", fallback:"https://www.khan.co.kr" },

{ source:"매일경제", rss:"https://www.mk.co.kr/rss/30000001/", fallback:"https://www.mk.co.kr" },
{ source:"한국경제", rss:"https://rss.hankyung.com/feed/news", fallback:"https://www.hankyung.com" }

];

async function fallbackScrape(url){

try{

const res = await fetch(url);
const html = await res.text();
const $ = cheerio.load(html);

const headlines=[];

$("a").each((i,el)=>{

const title=$(el).text().trim();
const link=$(el).attr("href");

if(title.length>20 && link && headlines.length<6){

headlines.push({
title,
link: link.startsWith("http") ? link : url+link
});

}

});

return headlines;

}catch(err){

return [];

}

}

export async function GET(){

const result=[];

for(const f of feeds){

try{

const rss = await parser.parseURL(f.rss);

const headlines = rss.items.slice(0,6).map(i=>({

title:i.title,
link:i.link,
pubDate:i.pubDate,

image:
i.enclosure?.url ||
i["media:content"]?.url ||
i["media:thumbnail"]?.url ||
null

}));

result.push({
source:f.source,
headlines
});

}catch(err){

const fallback = await fallbackScrape(f.fallback);

result.push({
source:f.source,
headlines:fallback
});

}

}

return Response.json(result);

}
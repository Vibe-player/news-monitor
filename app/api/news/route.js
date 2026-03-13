import Parser from "rss-parser";
import * as cheerio from "cheerio";

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

async function extractImage(item){

let image =
item.enclosure?.url ||
item["media:content"]?.url ||
item["media:thumbnail"]?.url;

if(image) return image;

try{

const res = await fetch(item.link,{
headers:{'User-Agent':'Mozilla/5.0'}
});

const html = await res.text();

const $ = cheerio.load(html);

const og=$('meta[property="og:image"]').attr("content");

if(og) return og;

}catch{}

return null;

}

export async function GET(){

const result=[];

for(const f of feeds){

try{

const rss = await parser.parseURL(f.rss);

const headlines = await Promise.all(

rss.items.slice(0,6).map(async (i)=>({

title:i.title,
link:i.link,
pubDate:i.pubDate,
image:await extractImage(i)

}))

);

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
import Parser from "rss-parser";
import * as cheerio from "cheerio";

const parser = new Parser();

const feeds = [

{ source:"연합뉴스", rss:"https://www.yna.co.kr/rss/news.xml", url:"https://www.yna.co.kr" },

{ source:"KBS", rss:"https://news.kbs.co.kr/rss/news.xml", url:"https://news.kbs.co.kr/news/list.do?ncd=1821" },

{ source:"MBC", rss:"https://imnews.imbc.com/rss/news.xml", url:"https://imnews.imbc.com/news/2024/" },

{ source:"SBS", rss:"https://news.sbs.co.kr/news/SectionRssFeed.do?sectionId=01", url:"https://news.sbs.co.kr/news/newsMain.do" },

{ source:"JTBC", rss:"https://fs.jtbc.co.kr/RSS/newsflash.xml", url:"https://news.jtbc.co.kr" },

{ source:"TV조선", rss:"https://www.tvchosun.com/rss/news.xml", url:"https://www.tvchosun.com/news/" },

{ source:"채널A", rss:"https://rss.ichannela.com/news/main.xml", url:"https://www.ichannela.com/news/main/news_main_renew.do" },

{ source:"YTN", rss:"https://www.ytn.co.kr/_rss/news.xml", url:"https://www.ytn.co.kr/news/news_list.php" },

{ source:"조선일보", rss:"https://www.chosun.com/arc/outboundfeeds/rss/?outputType=xml", url:"https://www.chosun.com" },

{ source:"중앙일보", rss:"https://rss.joins.com/joins_news_list.xml", url:"https://www.joongang.co.kr" },

{ source:"동아일보", rss:"https://rss.donga.com/total.xml", url:"https://www.donga.com" },

{ source:"한겨레", rss:"https://www.hani.co.kr/rss/", url:"https://www.hani.co.kr" },

{ source:"경향신문", rss:"https://www.khan.co.kr/rss/rssdata/total_news.xml", url:"https://www.khan.co.kr" },

{ source:"매일경제", rss:"https://www.mk.co.kr/rss/30000001/", url:"https://www.mk.co.kr" },

{ source:"한국경제", rss:"https://rss.hankyung.com/feed/all-news", url:"https://www.hankyung.com" }

];

async function scrapeHeadlines(url){

try{

const res = await fetch(url,{headers:{'User-Agent':'Mozilla/5.0'}});
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

}catch{

return [];

}

}

export async function GET(){

const result=[];

for(const f of feeds){

let headlines=[];

try{

const rss = await parser.parseURL(f.rss);

headlines = rss.items.slice(0,6).map(i=>({

title:i.title,
link:i.link,
pubDate:i.pubDate

}));

}catch{}

if(headlines.length===0){

headlines = await scrapeHeadlines(f.url);

}

result.push({
source:f.source,
headlines
});

}

return Response.json(result);

}

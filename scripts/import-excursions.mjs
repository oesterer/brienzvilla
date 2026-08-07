import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const sourceRoot = process.argv[2];
if (!sourceRoot) throw new Error("Usage: node scripts/import-excursions.mjs /path/to/excursions");
const projectRoot = path.resolve(import.meta.dirname,"..");

const definitions = [
  {
    folder:"AareGorge",slug:"aare-gorge-reichenbach-falls",title:"Aare Gorge & Reichenbach Falls",
    kicker:"Water, waterfalls & Sherlock Holmes",badge:"Best dramatic outing",season:"Apr–Nov",tags:["excursion","family","water"],
    resources:[
      ["Aare Gorge","https://www.aareschlucht.ch/"],
      ["Reichenbach Falls funicular","https://www.reichenbachfall.ch/en/"],
      ["Sherlock Holmes Museum","https://sherlockholmes.ch/en/Info/Museum"]
    ]
  },
  {
    folder:"Ballenberg",slug:"ballenberg-open-air-museum",title:"Ballenberg Open-Air Museum",
    kicker:"Swiss history, crafts & farm life",badge:"Best rainy-day plan",season:"Apr–Nov",tags:["excursion","family","local"],
    resources:[
      ["Ballenberg Swiss Open-Air Museum","https://ballenberg.ch/en/"],
      ["Trauffer World of Experience","https://en.trauffer.ch/"]
    ]
  },
  {
    folder:"Bern",slug:"bern-day-trip",title:"Bern",
    kicker:"UNESCO Old Town & the Aare",badge:"Best city day",season:"Year-round",tags:["excursion","family"],
    resources:[
      ["Bern tourism","https://www.bern.com/en/home"],
      ["Suggested Bear Park parking","https://maps.app.goo.gl/ivafG7yvheDY9iedA"]
    ]
  },
  {
    folder:"Gruyeres",slug:"gruyeres-day-trip",title:"Gruyères",
    kicker:"Chocolate, cheese, castle & medieval town",badge:"Best four-in-one day",season:"Year-round",tags:["excursion","family"],
    heroPhoto:"IMG_1201.heic",
    description:[
      "If you have time, we highly recommend including Gruyères in your tour of Switzerland. It combines four memorable experiences in one day: Maison Cailler’s chocolate experience, La Maison du Gruyère, the medieval town and Gruyères Castle.",
      "Fans of the film Alien can also visit the HR Giger Museum, dedicated to the Swiss artist who designed the film’s iconic creature and visual world."
    ],
    resources:[
      ["Maison Cailler chocolate experience","https://www.cailler.ch/en/cailler-experiences"],
      ["La Maison du Gruyère","https://www.lamaisondugruyere.ch/homepage-en/"],
      ["Gruyères Castle","https://www.chateau-gruyeres.ch/en"],
      ["HR Giger Museum","https://www.hrgigermuseum.com/visiting"]
    ]
  },
  {
    folder:"Interlaken",slug:"interlaken-day-trip",title:"Interlaken",
    kicker:"Mountain views, activities & shopping",badge:"Best flexible day",season:"Year-round",tags:["excursion","family"],
    resources:[
      ["Interlaken tourism","https://www.interlaken.swiss/en"],
      ["Harder Kulm","https://www.interlaken.swiss/en/experiences/mountains-panoramas/mountain-excursions/harder-kulm/All"],
      ["Funky Chocolate Club","https://www.interlaken.swiss/en/experiences/poi/funky-chocolate-club"],
      ["Tourismuseum","https://www.tourismuseum.ch/en/"]
    ]
  },
  {
    folder:"Jungfrau",slug:"jungfraujoch-top-of-europe",title:"Jungfraujoch – Top of Europe",
    kicker:"Glaciers, snow & Europe’s highest railway station",badge:"Most iconic Alpine day",season:"Year-round",tags:["excursion","family"],
    resources:[
      ["Jungfraujoch – Top of Europe","https://www.jungfrau.ch/en-gb/jungfraujoch-top-of-europe/"],
      ["Tickets and reservations","https://www.jungfrau.ch/en-gb/jungfraujoch-top-of-europe/buy-jungfraujoch-ticket/"]
    ]
  },
  {
    folder:"LakeBrienz",slug:"lake-brienz-by-boat",title:"Lake Brienz by Boat",
    kicker:"Turquoise water, waterfalls & villages",badge:"Best slow day",season:"Apr–Oct",tags:["excursion","family","water","local"],
    resources:[
      ["Lake Brienz boat timetable","https://www.bls-schiff.ch/en/lake-cruise/timetable"],
      ["Boat schedule","https://www.bls-schiff.ch/en/lake-cruise/timetable/boat-schedule"]
    ]
  },
  {
    folder:"Luzern",slug:"lucerne-day-trip",title:"Lucerne",
    kicker:"Medieval Old Town & Lake Lucerne",badge:"Best scenic city trip",season:"Year-round",tags:["excursion","family"],
    resources:[
      ["Lucerne tourism and top sights","https://www.luzern.com/en/the-city/sights/top-sights"],
      ["Swiss Museum of Transport","https://www.verkehrshaus.ch/en"]
    ]
  },
  {
    folder:"RothhornBahn",slug:"brienz-rothorn-railway",title:"Brienz Rothorn Railway",
    kicker:"Historic steam railway · From Brienz",badge:"Best local railway",season:"May–Oct",tags:["excursion","family","local"],
    containPhotos:["IMG_2602.heic"],
    directions:[
      "Walk from Brienz Villa to the Brienz Rothorn Railway valley station.",
      "Ride the historic cogwheel steam train to Planalp or continue to Rothorn Kulm when the full route is operating.",
      "Return on the train, or hike from Planalp back down to Brienz.",
      "Reserve seats online; ask at the counter whether your guest card offers a reduced fare."
    ],
    resources:[
      ["Brienz Rothorn Railway","https://brienz-rothorn-bahn.ch/en/"],
      ["Tickets and seat reservations","https://shop.brienz-rothorn-bahn.ch/de/"]
    ]
  }
].map(item=>({...item,resources:item.resources.map(([label,url])=>({label,url}))}));

const clean = text => text
  .replaceAll("rainly","rainy").replaceAll("Briens","Brienz")
  .replaceAll("its a","it’s a").replaceAll("Interlake Ost","Interlaken Ost")
  .replaceAll("part at Interlaken","park at Interlaken")
  .replaceAll("include Gruyeres is your","include Gruyères in your")
  .replaceAll("of you are","if you are").replaceAll("Lauterbunnen","Lauterbrunnen")
  .replaceAll("mount Rothorn","Mount Rothorn").replaceAll("Gruyeres","Gruyères");

function parseSource(file, def) {
  const text = clean(fs.readFileSync(file,"utf8").replace(/\r/g,"")).trim();
  const body = text.split("\n").slice(1).join("\n").trim();
  const parts = body.split(/How to (?:get there and back|visit):/i);
  const descriptionText = parts[0]
    .replace(/^\s*https?:\/\/\S+\s*$/gm,"")
    .replace(/\(add links to resources above\)/gi,"")
    .trim();
  const description = def.description || descriptionText.split(/\n\s*\n/).map(p=>p.replace(/\s+/g," ").trim()).filter(Boolean);
  let directions = def.directions;
  if (!directions) {
    directions = (parts[1] || "").split(/\n\s*\n|\n/).map(line=>line.replace(/\s+/g," ").trim()).filter(Boolean);
  }
  if (!directions?.length) directions=["Follow the current visitor information in the official resources below when planning this excursion."];
  return {description,directions};
}
function write(file,contents){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,contents)}
function escapeHtml(value){return value.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}

const catalog=[];
for(const def of definitions){
  const sourceDir=path.join(sourceRoot,def.folder);
  for(const required of ["descr.txt","pics"])if(!fs.existsSync(path.join(sourceDir,required)))throw new Error(`${def.folder}: missing ${required}`);
  const {description,directions}=parseSource(path.join(sourceDir,"descr.txt"),def);
  const assetDir=path.join(projectRoot,"assets/images/outings",def.slug);
  fs.mkdirSync(assetDir,{recursive:true});
  const sourcePhotos=fs.readdirSync(path.join(sourceDir,"pics")).filter(name=>/\.(heic|jpe?g|png)$/i.test(name)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
  if(def.heroPhoto){
    const heroIndex=sourcePhotos.indexOf(def.heroPhoto);
    if(heroIndex<0)throw new Error(`${def.folder}: missing hero photo ${def.heroPhoto}`);
    sourcePhotos.unshift(sourcePhotos.splice(heroIndex,1)[0]);
  }
  if(!sourcePhotos.length)throw new Error(`${def.folder}: no slideshow pictures`);
  const photos=sourcePhotos.map((name,index)=>{
    const output=`photo-${String(index+1).padStart(2,"0")}.jpg`;
    const result=spawnSync("sips",["-s","format","jpeg","-s","formatOptions","70","-Z","1800",path.join(sourceDir,"pics",name),"--out",path.join(assetDir,output)],{stdio:"ignore"});
    if(result.status!==0)throw new Error(`${def.folder}: failed to convert ${name}`);
    return {file:output,alt:`${def.title} excursion, photo ${index+1}`,...(def.containPhotos?.includes(name)?{fit:"contain"}:{})};
  });
  const data={slug:def.slug,title:def.title,kicker:def.kicker,description,photos,directions,resources:def.resources};
  if (def.folder === "RothhornBahn") data.video={
    id:"nKLoD3FrS0Y",url:"https://www.youtube.com/watch?v=nKLoD3FrS0Y",
    title:"Wild ibex grazing on top of Brienzer Rothorn",
    caption:"If you are lucky, you will be able to observe wild ibex grazing on top of Rothorn."
  };
  const pageDir=path.join(projectRoot,"outings",def.slug);
  write(path.join(pageDir,"data.js"),`window.EXCURSION_DATA = ${JSON.stringify(data,null,2)};\n`);
  const summary=description.find(paragraph=>paragraph.length>90) || description[0];
  const seoSummary=summary.length>157?`${summary.slice(0,154).replace(/\s+\S*$/,"")}…`:summary;
  write(path.join(pageDir,"index.html"),`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(def.title)} Excursion | Brienz Villa Local Guide</title>
  <meta name="description" content="${escapeHtml(seoSummary)}">
  <link rel="canonical" href="https://brienzvilla.com/outings/${def.slug}/"><meta name="theme-color" content="#123f66">
  <meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(def.title)} | Brienz Villa"><meta property="og:description" content="${escapeHtml(summary)}">
  <meta property="og:image" content="https://brienzvilla.com/assets/images/outings/${def.slug}/${photos[0].file}"><meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../../assets/favicon.svg?v=2" type="image/svg+xml"><link rel="stylesheet" href="../excursion-page.css"><link rel="stylesheet" href="../site-shell.css">
  <script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"TouristAttraction","name":def.title,"description":summary,"url":`https://brienzvilla.com/outings/${def.slug}/`,"image":`https://brienzvilla.com/assets/images/outings/${def.slug}/${photos[0].file}`})}</script>
</head>
<body><div id="excursion-page"></div><script src="data.js"></script><script src="../excursion-page.js"></script></body>
</html>\n`);
  catalog.push({id:def.slug,title:def.title,type:"excursion",tags:def.tags,badge:def.badge,season:def.season,image:`assets/images/outings/${def.slug}/${photos[0].file}`,description:summary,page:`outings/${def.slug}/`});
}
write(path.join(projectRoot,"outings/imported-excursions.js"),`// Generated by scripts/import-excursions.mjs from Downloads/excursions.\nwindow.OUTINGS.push(...${JSON.stringify(catalog,null,2)});\n`);
console.log(`Imported ${definitions.length} excursions and ${catalog.length} catalog entries.`);

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const sourceRoot = process.argv[2];
if (!sourceRoot) throw new Error("Usage: node scripts/import-hikes.mjs /path/to/hikes");

const projectRoot = path.resolve(import.meta.dirname, "..");
const definitions = [
  ["Bachalpsee","first-to-bachalpsee","First to Bachalpsee","High-altitude lake loop · Grindelwald First","Iconic Alpine reflections",2,"Jun–Oct",["hike","family"]],
  ["AxalpStatueLoop","axalp-wooden-statue-loop","Axalp Wooden Statue Loop","Easy mountain loop · Axalp","Our favorite local loop",2,"Jun–Oct",["hike","family","local"]],
  ["AxalpSwing","axalp-giant-swing","Axalp Giant Swing","Chairlift and downhill hike · Axalp","Best panoramic swing",2,"Jun–Oct",["hike","family","local"]],
  ["Bramisegg","bramisegg-to-axalp","Bramisegg to Axalp","Mountain ascent · Close to Brienz","Best quiet valley",3,"Jun–Oct",["hike","local"]],
  ["BrienzRothorn","brienz-rothorn","Brienz to Brienzer Rothorn","Strenuous summit ascent · From the villa","Best local challenge",4,"Jun–Oct",["hike","strenuous","local"]],
  ["Brunig","brienz-rothorn-to-brunig-pass","Brienzer Rothorn to Brünig Pass","High-alpine traverse · Strenuous","Best long descent",4,"Jun–Oct",["hike","strenuous"]],
  ["EigergletscherAlpiglen","eigergletscher-to-alpiglen","Eigergletscher to Alpiglen","Eiger Trail · Jungfrau region","Best Eiger close-up",3,"Jun–Oct",["hike","strenuous"]],
  ["GiessbachIseltwald","giessbach-falls-to-iseltwald","Giessbach Falls to Iseltwald","Lakeshore hike · Ferry access","Best lake-and-ferry day",2,"Apr–Oct",["hike","family","water","local"]],
  ["GrosseScheideggFirst","grosse-scheidegg-to-first","Grosse Scheidegg to First","Panoramic high trail · Grindelwald","Best Wetterhorn views",2,"Jun–Oct",["hike","family"]],
  ["Grutschalp","grutschalp-allmendhubel-murren","Grütschalp, Allmendhubel & Mürren","Mountain View Trail · Jungfrau region","Best panoramic family day",3,"Jun–Oct",["hike","family"]],
  ["HarderkulmLoop","harder-kulm-loop","Harder Kulm Loop","Steep forest loop · Interlaken","Best workout near Interlaken",4,"Apr–Nov",["hike","strenuous"]],
  ["Mannlichen","mannlichen-to-kleine-scheidegg","Männlichen to Kleine Scheidegg","Panoramaweg · Easy high-alpine trail","Best easy Alpine panorama",1,"Jun–Oct",["hike","family"]],
  ["Murren","murren-allmendhubel-loop","Mürren & Allmendhubel Loop","Alpine meadows · Family favorite","One of our favorites",2,"Jun–Oct",["hike","family"]],
  ["Planalp","brienz-to-planalp","Brienz to Planalp","Uphill workout · From the villa","Best half-day workout",4,"May–Oct",["hike","strenuous","local"]],
  ["Roselaui","rosenlaui-to-grosse-scheidegg","Rosenlaui to Grosse Scheidegg","Alpine valley ascent · Wetterhorn views","Best wild valley",3,"Jun–Oct",["hike"]]
  ,["Schrattenflue","schrattenflue-hangst","Schrattenflue / Hängst","Demanding karst ridge loop · UNESCO Biosphere Entlebuch","Most unique geology",4,"Jun–Oct",["hike","strenuous"]]
].map(([folder,slug,title,kicker,badge,difficulty,season,tags])=>({folder,slug,title,kicker,badge,difficulty,season,tags}));

const clean = text => text
  .replaceAll("oppotunity","opportunity").replaceAll("picknic","picnic")
  .replaceAll("recommened","recommended").replaceAll("climp","climb")
  .replaceAll("fantastc","fantastic").replaceAll("Northface","North Face")
  .replaceAll("trainstation","train station").replaceAll("busstop","bus stop")
  .replaceAll("Giessbachfalls","Giessbach Falls").replaceAll("Start you hike","Start your hike")
  .replaceAll("home home","home")
  .replaceAll("facorite","favorite").replaceAll("trough","through")
  .replaceAll("scenial","scenic").replaceAll("Scheiegg","Scheidegg")
  .replaceAll("Allmihubel","Allmendhubel").replaceAll("Roselaui","Rosenlaui")
  .replaceAll("Of you want","If you want")
  .replaceAll("longer voyage lake Brienz","longer voyage on Lake Brienz");

function field(text, label) {
  return text.match(new RegExp(`${label}:\\s*([^\\n]+)`, "i"))?.[1].trim();
}
function parseDuration(value) {
  const match = value.match(/(\d+)h\s*(\d+)min/i);
  let hours = Number(match?.[1] || 0), minutes = Number(match?.[2] || 0);
  hours += Math.floor(minutes / 60); minutes %= 60;
  return { display: `${hours}h ${String(minutes).padStart(2,"0")}m`, hours: +(hours + minutes / 60).toFixed(2) };
}
function parseDirections(text) {
  const raw = text.split(/How to visit:\s*/i)[1]?.split(/Alternative routes:|Link to Google Maps/i)[0] || "";
  const lines = clean(raw).split("\n").map(line=>line.trim()).filter(Boolean);
  const directions = [];
  let alternative = false;
  for (const line of lines) {
    if (line.toLowerCase() === "or") { alternative = true; continue; }
    if (line.toLowerCase().startsWith("or ")) {
      directions.push(`Alternatively, ${line.slice(3)}`);
      continue;
    }
    directions.push(`${alternative ? "Alternatively, " : ""}${line.replace(/^\d+\)\s*/, "")}`);
    alternative = false;
  }
  return directions;
}
function descriptionFrom(text) {
  const beforeMap = text.split(/(?:Link to Map:|https?:\/\/schweizmobil\.ch\/)/i)[0].trim();
  return clean(beforeMap.split("\n").slice(1).join(" ").replace(/\s+/g," ").trim());
}
function write(file, contents) {
  fs.mkdirSync(path.dirname(file), {recursive:true});
  fs.writeFileSync(file, contents);
}
function htmlEscape(value) {
  return value.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

const catalog = [];
for (const def of definitions) {
  const sourceDir = path.join(sourceRoot, def.folder);
  for (const required of ["desc.txt","data.gpx","map.png","profile.png","pics"]) {
    if (!fs.existsSync(path.join(sourceDir,required))) throw new Error(`${def.folder}: missing ${required}`);
  }
  const raw = fs.readFileSync(path.join(sourceDir,"desc.txt"),"utf8");
  const duration = parseDuration(field(raw,"Duration"));
  const stats = {
    distance: field(raw,"Distance"),
    duration: duration.display,
    ascend: field(raw,"Ascend"),
    descent: field(raw,"Descent"),
    maxAltitude: Number(field(raw,"Max altitude").replace(/[^\d]/g,"")).toLocaleString("en-US") + " m",
    minAltitude: Number(field(raw,"Min altitude").replace(/[^\d]/g,"")).toLocaleString("en-US") + " m"
  };
  const mapUrl = raw.match(/(?:Link to Map:\s*)?(https?:\/\/schweizmobil\.ch\/\S+)/i)?.[1];
  const description = descriptionFrom(raw);
  const directions = parseDirections(raw);
  const assetDir = path.join(projectRoot,"assets/images/outings",def.slug);
  fs.mkdirSync(assetDir,{recursive:true});
  fs.copyFileSync(path.join(sourceDir,"data.gpx"),path.join(assetDir,"route.gpx"));
  fs.copyFileSync(path.join(sourceDir,"map.png"),path.join(assetDir,"map.png"));
  fs.copyFileSync(path.join(sourceDir,"profile.png"),path.join(assetDir,"profile.png"));

  const sourcePhotos = fs.readdirSync(path.join(sourceDir,"pics"))
    .filter(name=>/\.(heic|jpe?g|png)$/i.test(name)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
  if (!sourcePhotos.length) throw new Error(`${def.folder}: no slideshow pictures`);
  const photos = sourcePhotos.map((name,index)=>{
    const output = `photo-${String(index+1).padStart(2,"0")}.jpg`;
    const result = spawnSync("sips",["-s","format","jpeg","-s","formatOptions","70","-Z","1800",path.join(sourceDir,"pics",name),"--out",path.join(assetDir,output)],{stdio:"ignore"});
    if (result.status !== 0) throw new Error(`${def.folder}: failed to convert ${name}`);
    return {file:output,alt:`${def.title} trail scenery, photo ${index+1}`};
  });

  const data = {
    slug:def.slug,title:def.title,kicker:def.kicker,description,stats,mapUrl,
    mapFile:"map.png",downloadName:`${def.folder}.gpx`,photos,directions
  };
  if (def.folder === "BrienzRothorn") data.video={
    id:"nKLoD3FrS0Y",url:"https://www.youtube.com/watch?v=nKLoD3FrS0Y",
    title:"Wild ibex grazing on top of Brienzer Rothorn",
    caption:"If you are lucky, you will be able to observe wild ibex grazing on top of Rothorn."
  };
  const driveMapSource = path.join(sourceDir,"drivemap.png");
  const driveMapUrl = raw.match(/Link to Google Maps[^\n]*\n(https?:\/\/\S+)/i)?.[1];
  if (fs.existsSync(driveMapSource) && driveMapUrl) {
    fs.copyFileSync(driveMapSource,path.join(assetDir,"drive-map.png"));
    data.driveMap="drive-map.png";
    data.driveMapUrl=driveMapUrl;
  }
  if (def.folder === "Grutschalp") {
    const altSource = path.join(sourceRoot,"GrutschalpMurren.gpx");
    if (fs.existsSync(altSource)) fs.copyFileSync(altSource,path.join(assetDir,"lower-route.gpx"));
    data.alternatives=[{
      title:"Easier: lower trail to Mürren",
      description:"For minimal elevation change, follow the lower trail from Grütschalp to Mürren, then take the funicular to Allmendhubel for the views.",
      distance:"5.3 km",descent:"193 m",map:"https://schweizmobil.ch/en/tour/180041739",gpx:"lower-route.gpx"
    }];
  }

  const pageDir = path.join(projectRoot,"outings",def.slug);
  write(path.join(pageDir,"data.js"),`window.HIKE_DATA = ${JSON.stringify(data,null,2)};\n`);
  const seoDescription = `Plan the ${stats.distance} ${def.title} hike with photos, route map, elevation profile, GPX download and directions from Brienz Villa.`;
  write(path.join(pageDir,"index.html"),`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${htmlEscape(def.title)} Hike | Brienz Villa Local Guide</title>
  <meta name="description" content="${htmlEscape(seoDescription)}">
  <link rel="canonical" href="https://brienzvilla.com/outings/${def.slug}/"><meta name="theme-color" content="#123f66">
  <meta property="og:type" content="article"><meta property="og:title" content="${htmlEscape(def.title)} | Brienz Villa">
  <meta property="og:description" content="${htmlEscape(description)}">
  <meta property="og:image" content="https://brienzvilla.com/assets/images/outings/${def.slug}/${photos[0].file}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../../assets/favicon.svg?v=2" type="image/svg+xml">
  <link rel="stylesheet" href="../hike-page.css"><link rel="stylesheet" href="../site-shell.css">
  <script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"TouristAttraction","name":def.title,"description":description,"url":`https://brienzvilla.com/outings/${def.slug}/`,"image":`https://brienzvilla.com/assets/images/outings/${def.slug}/${photos[0].file}`})}</script>
</head>
<body><div id="hike-page"></div><script src="data.js"></script><script src="../hike-page.js"></script></body>
</html>\n`);
  catalog.push({
    id:def.slug,title:def.title,type:"hike",tags:def.tags,badge:def.badge,difficulty:def.difficulty,
    duration:duration.hours,distance:stats.distance,ascent:stats.ascend,season:def.season,
    image:`assets/images/outings/${def.slug}/${photos[0].file}`,description,
    route:directions.join(" → "),map:mapUrl,page:`outings/${def.slug}/`
  });
}

write(path.join(projectRoot,"outings/imported-hikes.js"),
  `// Generated by scripts/import-hikes.mjs from the folders in Downloads/hikes.\nwindow.OUTINGS.push(...${JSON.stringify(catalog,null,2)});\n`);
console.log(`Imported ${definitions.length} hikes and ${catalog.reduce((sum,h)=>sum + 1,0)} catalog entries.`);

import fs from "node:fs";

const source=process.argv[2];
if(!source)throw new Error("Usage: node scripts/inspect-house-tour.mjs <airbnb.mhtml>");
const raw=fs.readFileSync(source,"latin1");
const boundary=raw.match(/boundary="([^"]+)"/)?.[1];
if(!boundary)throw new Error("MHTML boundary not found");

function quotedPrintable(value){
  const decoded=value.replace(/=\r?\n/g,"").replace(/=([0-9a-f]{2})/gi,(_,hex)=>String.fromCharCode(parseInt(hex,16)));
  return Buffer.from(decoded,"latin1").toString("utf8");
}

const parts=raw.split(`--${boundary}`).slice(1,-1).map(part=>{
  const divider=part.search(/\r?\n\r?\n/);
  const headerText=part.slice(0,divider).replace(/\r?\n[ \t]+/g," ");
  const body=part.slice(divider).replace(/^\r?\n\r?\n/,"").replace(/\r?\n$/,"");
  return {
    type:headerText.match(/Content-Type:\s*([^;\r\n]+)/i)?.[1],
    encoding:headerText.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i)?.[1]?.trim(),
    location:headerText.match(/Content-Location:\s*([^\r\n]+)/i)?.[1]?.trim(),
    body
  };
});

const htmlPart=parts.find(part=>part.type==="text/html"&&part.location?.includes("airbnb.com/rooms/"));
if(!htmlPart)throw new Error("Listing HTML not found");
const html=htmlPart.encoding==="quoted-printable"?quotedPrintable(htmlPart.body):htmlPart.body;
const overview=html.slice(html.indexOf('data-testid="photo-viewer-overview"'));
const matches=[...overview.matchAll(/<button aria-label="Scroll to ([^"]+)"[\s\S]*?<img[\s\S]*?alt="([^"]*)"[\s\S]*?data-original-uri="([^"]+)"[\s\S]*?<\/button>/g)];
const seen=new Set();
const rooms=[];
for(const match of matches){
  if(seen.has(match[1]))continue;
  seen.add(match[1]);
  rooms.push({room:match[1],alt:match[2],url:match[3].replace(/&amp;/g,"&")});
}
const outputDir=process.argv[3];
if(outputDir){
  fs.mkdirSync(outputDir,{recursive:true});
  const slug=value=>value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  for(const room of rooms){
    const identifiers=[...room.url.matchAll(/[0-9a-f]{8}-[0-9a-f-]{27,}/gi)].map(match=>match[0]);
    const identifier=identifiers.at(-1);
    const imagePart=parts.filter(part=>part.type?.startsWith("image/")&&part.location?.includes(identifier)).sort((a,b)=>b.body.length-a.body.length)[0];
    if(!imagePart)throw new Error(`Embedded image not found for ${room.room}`);
    const extension=imagePart.type.split("/")[1].replace("jpeg","jpg");
    const bytes=imagePart.encoding==="base64"?Buffer.from(imagePart.body.replace(/\s/g,""),"base64"):Buffer.from(imagePart.body,"latin1");
    room.file=`${slug(room.room)}.${extension}`;
    fs.writeFileSync(`${outputDir}/${room.file}`,bytes);
  }
}
console.log(JSON.stringify({rooms,embeddedImages:parts.filter(part=>part.type?.startsWith("image/")).length},null,2));

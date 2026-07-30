import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname,"..");
const pngPath = path.join(projectRoot,"assets/favicon.png");
const svgPath = path.join(projectRoot,"assets/favicon.svg");
const png = fs.readFileSync(pngPath).toString("base64");
fs.writeFileSync(svgPath,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#123f66"/>
  <image href="data:image/png;base64,${png}" width="512" height="512"/>
</svg>
`);
console.log(`Built self-contained favicon: ${svgPath}`);

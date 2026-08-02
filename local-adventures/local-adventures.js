const recommendedOrder=["brienz-rothorn-railway","lake-brienz-by-boat","jungfraujoch-top-of-europe","interlaken-day-trip","murren-allmendhubel-loop","eigergletscher-to-wengen","lucerne-day-trip","bern-day-trip","rosenlaui-to-grosse-scheidegg","harder-kulm-loop","first-to-bachalpsee","schynige-platte","gruyeres-day-trip","mannlichen-to-kleine-scheidegg","aare-gorge-reichenbach-falls","grutschalp-allmendhubel-murren","axalp-wooden-statue-loop","ballenberg-open-air-museum","giessbach-falls-to-iseltwald","brienz-to-planalp","eigergletscher-to-alpiglen","grosse-scheidegg-to-first","brienz-rothorn","brienz-rothorn-to-brunig-pass","axalp-giant-swing","bramisegg-to-axalp"];
const recommendedRank=new Map(recommendedOrder.map((id,index)=>[id,index]));
const grid=document.querySelector("#adventures-grid"),empty=document.querySelector("#adventures-empty"),search=document.querySelector("#adventure-search"),sort=document.querySelector("#adventure-sort"),filters=document.querySelector("#adventure-filters");
let activeFilter="all";

function renderAdventures(){
  const query=search.value.toLowerCase().trim();
  const items=OUTINGS.filter(item=>(activeFilter==="all"||item.tags.includes(activeFilter))&&`${item.title} ${item.description} ${item.badge}`.toLowerCase().includes(query));
  if(sort.value==="recommended")items.sort((a,b)=>(recommendedRank.get(a.id)??recommendedOrder.length)-(recommendedRank.get(b.id)??recommendedOrder.length));
  if(sort.value==="easy")items.sort((a,b)=>(a.difficulty??99)-(b.difficulty??99));
  if(sort.value==="duration")items.sort((a,b)=>(a.duration??99)-(b.duration??99));
  grid.innerHTML=items.map(item=>{
    const meta=item.type==="excursion"?`<span>Day trip</span><span>${item.season}</span>`:`<span>${"●".repeat(item.difficulty)}${"○".repeat(4-item.difficulty)} · level ${item.difficulty}</span><span>${item.duration} hours</span>`;
    return `<a class="outing-card" href="../${item.page}"><div class="outing-image"><img src="../${item.image}" alt="${item.title}" loading="lazy"><span>${item.badge}</span></div><h3>${item.title}</h3><div class="outing-meta">${meta}</div></a>`;
  }).join("");
  empty.hidden=items.length>0;
}

filters.addEventListener("click",event=>{if(!event.target.matches("button"))return;filters.querySelectorAll("button").forEach(button=>button.classList.remove("active"));event.target.classList.add("active");activeFilter=event.target.dataset.filter;renderAdventures()});
search.addEventListener("input",renderAdventures);
sort.addEventListener("change",renderAdventures);

const hikes=OUTINGS.filter(item=>item.type==="hike").map(item=>({...item,distanceValue:parseFloat(item.distance),ascentValue:parseFloat(item.ascent)}));
const tbody=document.querySelector("#hike-comparison");
let tableKey="title",tableDirection=1;
function renderTable(){
  const collator=new Intl.Collator("en",{numeric:true});
  const rows=[...hikes].sort((a,b)=>typeof a[tableKey]==="number"?(a[tableKey]-b[tableKey])*tableDirection:collator.compare(a[tableKey]??"",b[tableKey]??"")*tableDirection);
  tbody.innerHTML=rows.map(hike=>`<tr><td><a href="../${hike.page}">${hike.title}</a></td><td>${hike.distance}</td><td>${hike.duration} hr</td><td>${hike.ascent}</td><td><span class="difficulty-dots" aria-label="Difficulty level ${hike.difficulty} of 4">${"●".repeat(hike.difficulty)}${"○".repeat(4-hike.difficulty)}</span></td><td>${hike.season}</td></tr>`).join("");
}
document.querySelectorAll("thead button").forEach(button=>button.addEventListener("click",()=>{const nextKey=button.dataset.key;tableDirection=tableKey===nextKey?-tableDirection:1;tableKey=nextKey;document.querySelectorAll("thead button").forEach(item=>item.setAttribute("aria-sort","none"));button.setAttribute("aria-sort",tableDirection===1?"ascending":"descending");renderTable()}));

document.querySelector(".nav-toggle").addEventListener("click",event=>{const header=document.querySelector(".site-header");header.classList.toggle("open");event.currentTarget.setAttribute("aria-expanded",header.classList.contains("open"))});
document.querySelector("#year").textContent=new Date().getFullYear();
renderAdventures();
renderTable();

const d = window.HIKE_DATA;
const root = "../../";
const asset = name => `${root}assets/images/outings/${d.slug}/${name}`;
const statLabels = [
  ["distance","Distance","Total trail distance"],
  ["duration","Duration","Estimated walking time"],
  ["ascend","Ascend","Total elevation gained"],
  ["descent","Descent","Total elevation lost"],
  ["maxAltitude","Max altitude","Highest point on the route"],
  ["minAltitude","Min altitude","Lowest point on the route"]
];

document.querySelector("#hike-page").innerHTML = `
  <header class="prototype-nav">
    <a href="../../index.html">Brienz Villa</a>
    <nav aria-label="Page navigation"><a href="../../index.html#explore">Local guide</a></nav>
  </header>
  <main>
    <header class="title-block">
      <p class="kicker">${d.kicker}</p>
      <h1>${d.title}</h1>
      <p class="description">${d.description}</p>
    </header>

    <section class="stats" aria-label="Hike statistics">
      ${statLabels.map(([key,label,tip])=>`<div title="${tip}"><small>${label}</small><strong>${d.stats[key]}</strong></div>`).join("")}
    </section>

    <section class="slideshow" aria-labelledby="photos-heading">
      <div class="section-label"><h2 id="photos-heading">Pictures</h2><span class="slide-count">1 / ${d.photos.length}</span></div>
      <div class="slides">${d.photos.map((photo,i)=>`<figure class="${i===0?'active':''}"><img src="${asset(photo.file)}" alt="${photo.alt}" ${i?'loading="lazy"':''}><figcaption>${photo.caption || photo.alt}</figcaption></figure>`).join("")}</div>
      <div class="slide-buttons"><button class="prev" aria-label="Previous picture">←</button><button class="next" aria-label="Next picture">→</button></div>
    </section>

    <section class="map-section" aria-labelledby="map-heading">
      <div class="section-label"><h2 id="map-heading">Map</h2></div>
      <a href="${d.mapUrl}" target="_blank" rel="noopener"><img src="${asset("map.jpg")}" alt="Route map for ${d.title}" loading="lazy"></a>
    </section>

    <section class="profile-section" aria-labelledby="profile-heading">
      <div class="section-label"><h2 id="profile-heading">Elevation profile</h2></div>
      <img src="${asset("profile.png")}" alt="Elevation profile for ${d.title}" loading="lazy">
    </section>

    <section class="downloads" aria-label="Route links">
      <a href="${d.mapUrl}" target="_blank" rel="noopener">Open interactive map <span>↗</span></a>
      <a href="${asset("route.gpx")}" download="${d.downloadName}">Download GPX <span>↓</span></a>
    </section>

    <section class="directions" aria-labelledby="directions-heading">
      <div><p class="kicker">From Brienz Villa</p><h2 id="directions-heading">How to get there and back</h2></div>
      <ol>${d.directions.map((step,i)=>`<li><span>${String(i+1).padStart(2,"0")}</span><p>${step}</p></li>`).join("")}</ol>
    </section>

    ${d.alternatives?.length ? `<section class="alternatives" aria-labelledby="alternatives-heading">
      <div><p class="kicker">Adjust the day</p><h2 id="alternatives-heading">Alternative routes</h2></div>
      <div class="alternative-list">${d.alternatives.map(route=>`<article><h3>${route.title}</h3><p>${route.description}</p><dl><div><dt>Distance</dt><dd>${route.distance}</dd></div><div><dt>Descent</dt><dd>${route.descent}</dd></div></dl><div class="alternative-links"><a href="${route.map}" target="_blank" rel="noopener">Interactive map ↗</a><a href="${asset(route.gpx)}" download>GPX ↓</a></div></article>`).join("")}</div>
    </section>` : ""}
  </main>
  <footer><a href="../../index.html#explore">← Explore outings</a><a href="mailto:info@brienzvilla.com">info@brienzvilla.com</a></footer>`;

let current = 0;
const slides = [...document.querySelectorAll(".slides figure")];
const count = document.querySelector(".slide-count");
function show(next) {
  slides[current].classList.remove("active");
  current = (next + slides.length) % slides.length;
  slides[current].classList.add("active");
  count.textContent = `${current + 1} / ${slides.length}`;
}
document.querySelector(".prev").onclick = () => show(current - 1);
document.querySelector(".next").onclick = () => show(current + 1);

const root = "../../";
const photos = [
  ["img_0973.jpg","Cogwheel trains at Schynige Platte"],
  ["img_0991.jpg","Rocky Alpine hiking trail"],
  ["img_0992.jpg","Hikers crossing high Alpine terrain"],
  ["img_0994.jpg","Hikers beneath the Bernese Alps"],
  ["img_1011.jpg","Open walking on the mountain ridge"],
  ["img_1016.jpg","Trail above Interlaken and Lake Thun"],
  ["img_1021.jpg","Mountain trail overlooking the lakes"],
  ["img_1022.jpg","Turquoise Lake Brienz from Schynige Platte"],
  ["img_1026.jpg","Lake Brienz from the trail"],
  ["img_1034.jpg","Stepped section of the route"],
  ["img_1228.jpg","Historic Schynige Platte railway poster"]
];
const asset = name => `${root}assets/images/outings/schynige-platte/${name}`;

document.querySelector("#prototype").innerHTML = `
  <header class="prototype-nav">
    <a href="../../index.html">Brienz Villa</a>
    <nav aria-label="Page navigation">
      <a href="../../index.html#explore">Local guide</a>
    </nav>
  </header>
  <main>
    <header class="title-block">
      <p class="kicker">Panorama loop · June–October</p>
      <h1>Schynige Platte</h1>
      <p class="description">A compact mountain loop reached by historic cogwheel railway, with panoramic views of the Eiger, Mönch, Jungfrau and the lakes far below.</p>
    </header>

    <section class="stats" aria-label="Hike statistics">
      <div title="Total trail distance"><small>Distance</small><strong>3.6 km</strong></div>
      <div title="Estimated walking time"><small>Duration</small><strong>1h 28m</strong></div>
      <div title="Total elevation gained"><small>Ascend</small><strong>283 m</strong></div>
      <div title="Total elevation lost"><small>Descent</small><strong>283 m</strong></div>
      <div title="Highest point on the route"><small>Max altitude</small><strong>2,076 m</strong></div>
      <div title="Lowest point on the route"><small>Min altitude</small><strong>1,940 m</strong></div>
    </section>

    <section class="slideshow" aria-labelledby="photos-heading">
      <div class="section-label"><h2 id="photos-heading">Pictures</h2><span class="slide-count">1 / ${photos.length}</span></div>
      <div class="slides">${photos.map(([src,alt],i)=>`<figure class="${i===0?'active':''}"><img src="${asset(src)}" alt="${alt}" ${i?'loading="lazy"':''}><figcaption>${alt}</figcaption></figure>`).join("")}</div>
      <div class="slide-buttons"><button class="prev" aria-label="Previous picture">←</button><button class="next" aria-label="Next picture">→</button></div>
    </section>

    <section class="map-section" aria-labelledby="map-heading">
      <div class="section-label"><h2 id="map-heading">Map</h2></div>
      <a href="https://schweizmobil.ch/en/tour/1955112913" target="_blank" rel="noopener"><img src="${asset("map.jpg")}" alt="Route map for the Schynige Platte loop" loading="lazy"></a>
    </section>

    <section class="profile-section" aria-labelledby="profile-heading">
      <div class="section-label"><h2 id="profile-heading">Elevation profile</h2></div>
      <img src="${asset("profile.png")}" alt="Elevation profile from 1,940 to 2,076 metres" loading="lazy">
    </section>

    <section class="downloads" aria-label="Route links">
      <a href="https://schweizmobil.ch/en/tour/1955112913" target="_blank" rel="noopener">Open interactive map <span>↗</span></a>
      <a href="${asset("route.gpx")}" download="SchynigePlatteLoop.gpx">Download GPX <span>↓</span></a>
    </section>

    <section class="directions" aria-labelledby="directions-heading">
      <div><p class="kicker">From Brienz Villa</p><h2 id="directions-heading">How to get there and back</h2></div>
      <ol>
        <li><span>01</span><p>Drive to Wilderswil and park at the railway station, or take the train via Interlaken Ost.</p></li>
        <li><span>02</span><p>Take the historic cogwheel railway from Wilderswil to Schynige Platte.</p></li>
        <li><span>03</span><p>Hike the marked 3.6 km loop from the mountain station.</p></li>
        <li><span>04</span><p>Take the train back to Wilderswil, then return to Brienz by train or car.</p></li>
      </ol>
    </section>
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

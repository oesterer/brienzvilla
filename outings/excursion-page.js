const d = window.EXCURSION_DATA;
const root = "../../";
const asset = name => `${root}assets/images/outings/${d.slug}/${name}`;

document.querySelector("#excursion-page").innerHTML = `
  <header class="site-header">
    <a class="brand" href="../../index.html" aria-label="Brienz Villa home"><img src="../../assets/images/brand/brienz-villa-logo.png" alt=""><span>Brienz Villa</span></a>
    <nav aria-label="Main navigation"><a href="../../index.html#gallery">The villa</a><a href="../../index.html#stays">Ways to stay</a><a href="../../local-adventures/">Local Adventures</a><a href="../../tips/">Tips</a><a class="nav-cta" href="../../index.html#inquire">Inquire</a></nav>
  </header>
  <main>
    <header class="title-block"><p class="kicker">${d.kicker}</p><h1>${d.title}</h1><div class="description">${d.description.map(p=>`<p>${p}</p>`).join("")}</div></header>
    <section class="slideshow" aria-labelledby="photos-heading">
      <div class="section-label"><h2 id="photos-heading">Pictures</h2><span class="slide-count">1 / ${d.photos.length}</span></div>
      <div class="slides">${d.photos.map((photo,i)=>`<figure class="${i===0?'active ':''}${photo.fit==='contain'?'contain':''}"><img src="${asset(photo.file)}" alt="${photo.alt}" ${i?'loading="lazy"':''}><figcaption>${photo.alt}</figcaption></figure>`).join("")}</div>
      <div class="slide-buttons"><button class="prev" aria-label="Previous picture">←</button><button class="next" aria-label="Next picture">→</button></div>
    </section>
    <section class="directions" aria-labelledby="directions-heading"><div><p class="kicker">From Brienz Villa</p><h2 id="directions-heading">How to get there and back</h2></div><ol>${d.directions.map((step,i)=>`<li><span>${String(i+1).padStart(2,"0")}</span><p>${step}</p></li>`).join("")}</ol></section>
    <section class="resources" aria-labelledby="resources-heading"><div><p class="kicker">Plan your visit</p><h2 id="resources-heading">Official resources</h2></div><div class="resource-list">${d.resources.map(resource=>`<a href="${resource.url}" target="_blank" rel="noopener"><span>${resource.label}</span><b>↗</b></a>`).join("")}</div></section>
  </main>
  <footer class="site-footer"><a class="brand footer-brand" href="../../index.html"><img src="../../assets/images/brand/brienz-villa-logo.png" alt=""><span>Brienz Villa</span></a><div><a href="mailto:info@brienzvilla.com">info@brienzvilla.com</a></div><div class="footer-links"><a href="../../local-adventures/">Local Adventures</a><a href="../../units/villa/">Entire villa</a><a href="../../units/house/">Upper house</a><a href="https://airbnb.com/h/brienzvilla" target="_blank" rel="noopener">Airbnb ↗</a></div><p class="copyright">© ${new Date().getFullYear()} Brienz Villa</p></footer>`;

let current = 0;
const slides = [...document.querySelectorAll(".slides figure")];
const count = document.querySelector(".slide-count");
function show(next){slides[current].classList.remove("active");current=(next+slides.length)%slides.length;slides[current].classList.add("active");count.textContent=`${current+1} / ${slides.length}`}
document.querySelector(".prev").onclick=()=>show(current-1);
document.querySelector(".next").onclick=()=>show(current+1);

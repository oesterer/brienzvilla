const villaPhotos = ["villa-30.jpg","villa-23.jpg","villa-12.jpg","villa-5.jpg","villa-18.jpg","villa-27.jpg"];
const option = Number(document.body.dataset.option);
const asset = file => `../assets/images/villa/${file}`;

document.querySelector("#home-option").innerHTML = `
  <header class="option-nav">
    <a class="wordmark" href="../index.html">Brienz Villa</a>
    <nav aria-label="Homepage options">${[1,2,3,4,5].map(n=>`<a href="${n}.html" ${n===option?'aria-current="page"':''}>0${n}</a>`).join("")}</nav>
  </header>
  <main>
    <section class="hero">
      <div class="hero-copy">
        <p class="label">Brienz · Bernese Oberland · Switzerland</p>
        <h1>Your home above the lake.</h1>
        <p>A spacious villa for families and friends, with panoramic Lake Brienz views and room for up to 12 guests.</p>
        <div class="actions"><a class="button primary" href="mailto:info@brienzvilla.com">Inquire about your stay</a><a class="button secondary" href="https://airbnb.com/h/brienzvilla">Check dates</a></div>
      </div>
      <figure><img src="${asset("villa-30.jpg")}" alt="Panoramic Lake Brienz view from the villa"></figure>
      <div class="facts"><span><strong>12</strong> guests</span><span><strong>5</strong> bedrooms</span><span><strong>2</strong> private apartments</span></div>
    </section>

    <section class="stays">
      <header class="section-head"><p class="label">Ways to stay</p><h2>Choose the space that fits.</h2><p>Pricing is provided directly. Check Airbnb for current calendar availability.</p></header>
      <div class="stay-list">
        <article class="featured"><img src="${asset("villa-30.jpg")}" alt="Whole Brienz Villa"><div><p class="label">Priority stay</p><h3>The whole villa</h3><p>Both private apartments together for the most space and flexibility.</p><ul><li>Up to 12 guests + infant</li><li>5 bedrooms</li><li>2 kitchens</li></ul><a href="https://airbnb.com/h/brienzvilla">Check dates ↗</a></div></article>
        <article><img src="${asset("villa-23.jpg")}" alt="Upper house interior"><div><h3>Upper house</h3><p>Up to 8 guests, private kitchen and lake-view terrace.</p><a href="https://airbnb.com/h/brienzhouse">Check dates ↗</a></div></article>
        <article><img src="${asset("villa-12.jpg")}" alt="Apartment interior"><div><h3>Lower apartment</h3><p>Up to 4 guests, private entrance and garden terrace.</p><a href="https://airbnb.com/h/brienz-apartment">Check dates ↗</a></div></article>
      </div>
    </section>

    <section class="gallery">
      <header class="section-head"><p class="label">Inside and out</p><h2>A closer look.</h2></header>
      <div class="photo-grid">${villaPhotos.map((photo,i)=>`<img src="${asset(photo)}" alt="Brienz Villa view ${i+1}" loading="lazy">`).join("")}</div>
      <a class="inline-link" href="../index.html#gallery">View all 38 photographs →</a>
    </section>

    <section class="explore">
      <header class="section-head"><p class="label">From our doorstep</p><h2>Days worth going out for.</h2><p>Our personal collection of hikes, scenic railways and family outings around Lake Brienz.</p></header>
      <div class="outing-list">
        <a href="../outings/schynige-platte/"><img src="../assets/images/outings/schynige-platte/img_0994.jpg" alt="Schynige Platte trail" loading="lazy"><div><span>3.6 km · 1h 28m</span><h3>Schynige Platte</h3><p>Historic railway and a compact panoramic loop.</p></div></a>
        <a href="../outings/eigergletscher-to-wengen/"><img src="../assets/images/outings/eigergletscher-to-wengen/img_1298.jpg" alt="Eigergletscher ridge trail" loading="lazy"><div><span>10.9 km · 3h 09m</span><h3>Eigergletscher to Wengen</h3><p>A spectacular descent through the Jungfrau region.</p></div></a>
      </div>
      <a class="inline-link" href="../index.html#explore">Explore the complete local guide →</a>
    </section>

    <section class="practical">
      <div><p class="label">The essentials</p><h2>Easy village living. Alpine access.</h2></div>
      <dl><div><dt>5 min walk</dt><dd>Migros, Brunngasse and the lakeshore</dd></div><div><dt>12 min walk</dt><dd>Train, ferry and Rothorn railway</dd></div><div><dt>Parking</dt><dd>Space for up to four cars</dd></div><div><dt>At home</dt><dd>Fast Wi-Fi, kitchens, terraces and laundry</dd></div></dl>
    </section>

    <section class="contact">
      <p class="label">Come stay awhile</p><h2>Make Brienz your base.</h2><p>Tell us your dates, group size and preferred configuration. We’ll reply personally with availability and pricing.</p><a class="button primary" href="mailto:info@brienzvilla.com">Email info@brienzvilla.com</a>
    </section>
  </main>
  <footer><a href="../index.html">Brienz Villa</a><span>Homepage option ${option} of 5</span></footer>`;

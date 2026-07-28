# Outing page structure

Every published outing should have its own page. This gives search engines a
stable URL and gives visitors enough room for practical route information.

```text
outings/
├── _template/
│   └── index.html
├── outing-page.css
└── giessbach-falls/
    └── index.html

assets/images/outings/
└── giessbach-falls/
    ├── hero.jpg
    ├── gallery-01.jpg
    ├── gallery-02.jpg
    ├── gallery-03.jpg
    ├── gallery-04.jpg
    ├── map.webp
    └── route.gpx       # optional
```

## Create an outing page

1. Choose a short lowercase slug, such as `giessbach-falls`.
2. Copy `outings/schynige-platte/` to `outings/{slug}/`. The finished
   Schynige Platte page is the current reference design for hikes with route
   statistics, arrival instructions, a map, GPX file, and photo gallery.
3. Copy the outing's images to `assets/images/outings/{slug}/`.
4. Replace every `{{PLACEHOLDER}}` in the copied `index.html`.
5. Remove the `<meta name="robots" content="noindex">` line.
6. Add the page URL to `sitemap.xml`.
7. Add or update its card in the root `outings.js` catalog.

The outing card and detailed page should use the same slug. Set its `page`
property in `outings.js` to `outings/{slug}/`.

Every hiking page uses the same six-item `.hike-stats` widget in this order:
distance, duration, ascend, descent, maximum altitude, and minimum altitude.
Copy the complete widget from `outings/schynige-platte/index.html`; labels remain
visible and each item includes a hover and keyboard-focus explanation.

## Image conventions

- `hero.jpg`: landscape, ideally 2000 × 1300 pixels or larger.
- `gallery-01.jpg`: wide editorial image, ideally 1800 pixels wide.
- `gallery-02.jpg` through `gallery-04.jpg`: supporting route images.
- `map.webp`: a static route overview, ideally 1400 × 1050 pixels.
- Use descriptive alternative text in the page; filenames stay predictable.
- Compress photographs before committing. Aim for 250–600 KB each.

## Maps and route files

Keep a static map image in the outing folder so the page remains fast and works
without third-party scripts. Link that image to Google Maps, Swisstopo, or the
official destination page. For hikes, an optional `route.gpx` file is useful.

Only publish maps and GPX tracks that you created or have permission to
redistribute. Always include current-condition and safety guidance.

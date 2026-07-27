# Brienz Villa

Static website for [brienzvilla.com](https://brienzvilla.com), designed for GitHub Pages.

## Local preview

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Add an outing

Add one object to `window.OUTINGS` in `outings.js`. Search, filtering, sorting and the detail modal are generated automatically in the visitor's browser.

For a full, SEO-indexable outing page, use the template and folder conventions
documented in [`outings/README.md`](outings/README.md).

## Deployment

GitHub Pages can publish directly from the repository root on the `main` branch. The `CNAME` file configures `brienzvilla.com`; DNS must point to the repository's GitHub Pages site.

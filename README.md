# Nool Khadi Try-On

A browser-based 3D fitting room for contemporary Kerala khadi. Visitors pick a male or female model, try six outfits each, change the main and second colour from a natural-dye palette, change skin tone, spin the model and save a snapshot. Built for the Khadi revitalisation assignment (Part II multimedia element).

## Features

- Male and female 3D models with four skin tones
- 12 outfits: kurta and pyjama, Nehru jacket set, short kurta-shirt, oversized tee co-ord, mundu and shirt, kasavu kurta; kurta and palazzo with dupatta, kasavu crop set, pre-draped saree, co-ord set, A-line dress, jacket over kurti
- 10 khadi colours (Kerala off-white, kasavu gold, indigo, turmeric, madder, jackfruit wood, charcoal, banana leaf, laterite rust, monsoon sky) on a procedurally generated handspun texture
- Gold kasavu borders on the Kerala pieces
- "Weaver card" showing the price and an illustrative split of what goes to the weaver and spinner
- Drag to rotate, scroll or pinch to zoom, auto-rotate, snapshot to PNG
- Works on phones; no build step, no model files (everything is generated in code with Three.js)

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page structure and the Three.js import map (loads from the jsDelivr CDN) |
| `style.css` | Layout, light and dark theme |
| `app.js` | Scene, procedural bodies, outfits, fabric texture, UI logic |

## Run it locally

ES modules do not load from `file://`, so serve the folder:

```bash
cd khadi-tryon
python3 -m http.server 8000
# open http://localhost:8000
```

(or `npx serve .`)

## Deploy on GitHub Pages

1. Create a new public repository on GitHub, for example `nool-khadi-tryon`.
2. Upload the three files (`index.html`, `style.css`, `app.js`) and this README to the root of the repository, or push them:
   ```bash
   git init
   git add .
   git commit -m "Nool khadi 3D try-on"
   git branch -M main
   git remote add origin https://github.com/<your-username>/nool-khadi-tryon.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**, set **Source** to "Deploy from a branch", branch `main`, folder `/ (root)`, and save.
4. After a minute the site is live at `https://<your-username>.github.io/nool-khadi-tryon/`.
5. Put that link in a QR code for campus pop-ups and your presentation.

## Customise

- **Colours:** edit the `PALETTE` array at the top of `app.js`.
- **Outfits, prices, default colours:** edit `OUTFITS` in `app.js`. The garment shapes are in `buildOutfit()`, one `case` per outfit.
- **Body proportions:** edit `BODY` (torso profile, shoulder, arm and leg sizes).
- **Weaver names:** `WEAVERS` holds illustrative names; swap in real units only with their consent.

## Credits

Three.js (MIT licence) loaded from jsDelivr. Fonts: Fraunces and Inter from Google Fonts.

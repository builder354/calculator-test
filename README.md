# Calculator

A four-function calculator (0–9, +, −, ×, ÷, Clear, =) that installs as an app and works offline.
It shows decimal results (7 ÷ 2 = 3.5), rounded to 12 significant digits.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page: display, keys, styles, keyboard support, install prompt |
| `calc.js` | The calculator logic, with no page code in it |
| `manifest.webmanifest` | Name, colors and icons used when it is installed |
| `sw.js` | Service worker that stores the files on the device for offline use |
| `icon.svg`, `icon-*.png`, `apple-touch-icon.png` | App icons |

## Put it online with GitHub Pages (free)

1. Create a new public repository on GitHub, for example `calculator`.
2. Upload every file in this folder to the top level of the repository (Add file → Upload files).
3. Open Settings → Pages. Under "Build and deployment", choose "Deploy from a branch", pick `main` and `/ (root)`, then Save.
4. After a minute or two the app is live at `https://<your-username>.github.io/calculator/`.

## Install it

- **Windows, Mac, Linux:** open the link in Chrome or Edge and click the install icon in the address bar (or the Install button under the keys).
- **Android:** open the link in Chrome and tap Install when offered (or menu → Add to Home screen).
- **iPhone / iPad:** open the link in Safari, tap Share, then Add to Home Screen.

## Try it on your own computer

Service workers need `https` or `localhost`, so run a local server from this folder instead of opening the file directly:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Keyboard

Digits `0`–`9`, `+`, `-`, `*` or `x`, `/`, `Enter` or `=`, and `Esc` or `C` to clear.

## How it calculates

It works like a desk calculator: each operator applies to the running total, so `2 + 3 × 4 =` gives 20.
Pressing `=` again repeats the last step (`2 + 3 = = =` gives 5, 8, 11). Dividing by zero shows a message until you press a digit or C.

## Updating

When you change any file, change `VERSION` at the top of `sw.js` (for example `calculator-v2`).
Installed copies pick up the new version the next time they open while online.

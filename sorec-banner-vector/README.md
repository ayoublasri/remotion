# SOREC roll-up banner, vectorised

The "Teambuilding Filière SOREC · Octobre 2026" roll-up visual, received as a
533 × 1280 px JPEG, rebuilt as vector artwork for print.

| file | what it is |
| --- | --- |
| `out/banner-outlined.svg` | print-ready SVG: every element is a path (no fonts needed), 850 × 2041 mm |
| `out/banner-editable.svg` | the same artwork with live text (headline, badge, wordmark) and the fonts embedded, for editing in Illustrator, Inkscape or Figma |
| `out/banner.pdf` | vector PDF at 850 × 2041 mm (a 2-metre roll-up at 85 cm wide), no raster, no fonts |
| `out/banner-preview.png` | a 1599 × 3840 raster preview |
| `src/banner.jpg` | the source image |

## What is vector, and how

- **Headline** (« OCTOBRE 2026 · TEAMBUILDING · FILIÈRE SOREC »): real type.
  Anton for the heavy lines, Oswald SemiBold for « SOREC », sized and tracked
  to the measured boxes of the source, rotated 90°, with the two gold rules.
- **Badge**: redrawn. Two circles, the ring text set in Montserrat Bold on
  arcs (« INNOVATION • ESPRIT SOREC • EXCELLENCE • ORIENTATION CLIENT » on
  top, « UN CHEVAL. PLUSIEURS UNIVERS. » below), gold dots, « TEAMBUILDING
  FILIÈRE » in Montserrat ExtraBold and Black, and the horse head and heart
  traced from the source at 6× into clean navy and gold paths.
- **SOREC logo**: the gold mark traced at 6×; the wordmark set in Montserrat
  Black, italicised and extended to the source's proportions.
- **Background**: the swooshes, the white panel and the racetrack photo are
  traced as smooth colour shapes (about 2 000 paths). This is a posterised
  interpretation: gradients become bands and the photo becomes flat colour
  areas. It scales without pixelation, but it is not the photo. For a final
  print, drop a high-resolution photo under the `fond` layer, or keep the
  vector interpretation as a stylised background.

Note: the source read « ESPRIT SORBA » in the badge ring; the rebuilt badge
says « ESPRIT SOREC ». Change it in `tools/build.py` if the original wording
was intended.

Colours: navy `#0a3153`, gold `#b28e50`, cream `#f7f2eb` (sampled from the
source). Fonts: Anton, Montserrat, Oswald (SIL Open Font License, in `fonts/`).

## Rebuilding

```bash
pip install vtracer fonttools uharfbuzz pillow numpy   # python 3.13
python3.13 tools/build.py out                         # writes the two SVGs
node tools/svg2pdf.mjs out/banner-outlined.svg out/banner.pdf 850 2041
node tools/svg2png.mjs 1599 out/banner-preview.png out/banner-outlined.svg
```

`tools/build.py` holds every measurement (badge centre and radii, text
boxes, colours) at the top of each layer function. The PDF and PNG scripts
use the Playwright Chromium already installed for this repository.

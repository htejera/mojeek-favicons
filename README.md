# Mojeek Favicons — Chrome/Chromium

> A port of the original [Mojeek Favicons Firefox extension](https://addons.mozilla.org/en-GB/firefox/addon/mojeek-favicons/) by **David Smith**, adapted for Chrome, Vivaldi, Edge, and any Chromium-based browser using Manifest V3.

---

## What it does

Adds a visual header to each [Mojeek](https://www.mojeek.com) search result, grouping the site's favicon, readable name, and existing URL into a scannable block above the result title.

- **Favicon** — fetched from DuckDuckGo's icon service, sized larger (26 px) for top-level results
- **Site name** — derived automatically from the domain (e.g. `en.wikipedia.org` → **Wikipedia**)
- **Display URL** —  moves Mojeek's existing URL element into the header block; falls back to the plain domain if not found
- **Sitelinks support** — nested/indented sitelinks get a smaller inline favicon (16 px) instead of the full header
- **Clickable headers** — favicon and site name act as links to the result URL
- **MutationObserver** — handles dynamically loaded results without re-processing already-decorated entries

![Mojeek Favicons](https://github.com/htejera/mojeek-favicons/blob/main/mojeek-favicons.png?raw=true)

## Installation

### From the Chrome Web Store

> Pending review...

### Manual / Developer mode (Vivaldi, Chromium, etc.)

1. Download or clone this repository
2. Open your browser's extensions page:
   - Vivaldi: `vivaldi://extensions`
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
3. Enable **Developer mode** (toggle, top-right corner)
4. Click **Load unpacked** and select the extension folder
5. Navigate to any Mojeek search — the headers appear automatically

---

## Original extension

| | |
|---|---|
| **Name** | Mojeek Favicons |
| **Author** | David Smith |
| **Firefox Add-ons page** | https://addons.mozilla.org/en-GB/firefox/addon/mojeek-favicons/ |
| **License** | [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/) |

This port is a derivative work of the original extension. All credit for the concept and implementation goes to the original author.

---

## License

[Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/)

In accordance with the MPL 2.0, the source files derived from the original extension (`content-script.js`) retain their original license. You may use, modify, and redistribute this code under the same terms. A copy of the license is available at the link above.

---

## Contributing

Issues and pull requests are welcome. If you find a Mojeek page layout change that breaks the extension, please open an issue with a screenshot and the relevant HTML structure.

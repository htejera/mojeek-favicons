# Privacy Policy for Mojeek Favicons

**Last updated:** May 21, 2026

## Overview

Mojeek Favicons is a Chrome extension that enhances Mojeek search results by adding favicons and site names. This privacy policy explains what data the extension accesses and how it handles that data.

## Data Collection

### What data does the extension access?

The extension accesses **website content** on Mojeek search result pages (mojeek.com), specifically:

- URLs of search result links
- Text content of those links
- The DOM structure of result listings

### Why is this data accessed?

This data is accessed **only** to perform the extension's single purpose:
- Extract domain names from result URLs (e.g., "en.wikipedia.org")
- Identify whether a result is a top-level result or a nested sitelink
- Locate Mojeek's built-in green URL element
- Insert favicon images and site name headers in the correct positions

## Data Storage and Transmission

### Does the extension store user data?

**NO.** The extension does **not** store any user data locally. It does not use:
- localStorage
- IndexedDB
- Cookies
- Chrome storage API

All data processing happens in real-time and is discarded immediately after the page is modified.

### Does the extension transmit user data externally?

**NO,** with one exception:

The extension requests **favicon images** from DuckDuckGo's public icon service:
- URL format: `https://icons.duckduckgo.com/ip3/{domain}.ico`
- Information sent: Only the **domain name** (e.g., "wikipedia.org")
- No personal user data is included in these requests
- These are standard image requests like any web page would make

**The extension does NOT send:**
- User browsing history
- Search queries
- Personal information (name, email, etc.)
- IP address (beyond what is automatically included in any HTTP request)
- Any other user data

## Third-Party Services

The extension uses **DuckDuckGo's icon service** (icons.duckduckgo.com) solely to fetch favicon images. DuckDuckGo's privacy policy applies to those requests:
- [DuckDuckGo Privacy Policy](https://duckduckgo.com/privacy)

No other third-party services are used.

## User Rights

Since the extension does not collect or store any personal data, there is no data to access, delete, or export. Users can simply uninstall the extension to stop all functionality.

## Changes to This Policy

Any changes to this privacy policy will be posted on this page. The "Last updated" date will be modified accordingly.

## Contact

For questions about this privacy policy, open an issue on the extension's GitHub repository:
https://github.com/htejera/mojeek-favicons

## Compliance

This extension complies with:
- Chrome Web Store User Data Policy
- GDPR (no personal data collected)
- CCPA (no personal data collected)
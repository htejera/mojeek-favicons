(function() {
    'use strict';

    // Configuration
    const FAVICON_SERVICE = 'https://icons.duckduckgo.com/ip3/';
    const FAVICON_SIZE = 16;          // for nested (sublink) entries (unchanged)
    const MAIN_ICON_SIZE = 26;        // +2px (was 24) for top-level header
    const PROCESSED_ATTRIBUTE = 'data-favicon-added';
    const HEADER_MARK = 'data-mj-header';

    // Cache for favicons to avoid repeated requests
    const faviconCache = new Map();

    // Extract domain from URL
    function getDomainFromUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.toLowerCase().replace(/^www\./, '');
        } catch (e) {
            return null;
        }
    }

    // Readable site name from host
    function siteNameFromHost(host) {
        if (!host) return '';
        const parts = host.split('.');
        let label;
        if (parts.length >= 3 && parts[parts.length - 1].length === 2 &&
            ['co','com','org','net','gov','edu','ac'].includes(parts[parts.length - 2])) {
            label = parts[parts.length - 3];
        } else {
            label = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
        }
        return label.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    // Try to find Mojeek's built-in green link (display URL) in the same LI
    function findMojeekDisplayUrlElement(li, host) {
        if (!li) return null;
        const byClass = li.querySelector(':scope > .url, :scope > .result-url, :scope > .result-site, :scope > cite');
        if (byClass && byClass.textContent.trim()) return byClass;
        const kids = Array.from(li.children).slice(0, 6);
        for (const el of kids) {
            const txt = (el.textContent || '').trim();
            if (txt && host && txt.includes(host)) return el;
        }
        return null;
    }

    // Create favicon image element
    function createFavicon(domain, sizePx) {
        const img = document.createElement('img');
        img.src = `${FAVICON_SERVICE}${domain}.ico`;
        img.alt = `${domain} favicon`;
        img.style.cssText = `
            width: ${sizePx}px;
            height: ${sizePx}px;
            margin-right: 8px;
            vertical-align: middle;
            border-radius: 2px;
            display: inline-block;
            flex-shrink: 0;
        `;
        img.onerror = function() {
            this.style.display = 'none';
        };
        return img;
    }

    // Is this a nested (indented) sitelink LI?
    function isSublinkLI(li) {
        return !!(li && li.closest('ul ul'));
    }

    // Make a non-anchor element behave like a link to href (click + keyboard)
    function makeClickable(el, href) {
        if (!el) return;
        el.style.cursor = 'pointer';
        el.setAttribute('role', 'link');
        el.tabIndex = 0;

        const go = (evt) => {
            if (evt.type === 'click') {
                if (evt.button === 0 && !evt.metaKey && !evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
                    window.location.assign(href);
                    evt.preventDefault();
                }
            } else if (evt.type === 'keydown') {
                if (evt.key === 'Enter' || evt.key === ' ') {
                    window.location.assign(href);
                    evt.preventDefault();
                }
            }
        };

        el.addEventListener('click', go);
        el.addEventListener('keydown', go);
    }

    // Build header: larger centered icon + site name + Mojeek green URL (if available)
    function buildHeader(domain, greenEl, mainHref) {
        const header = document.createElement('div');
        header.setAttribute(HEADER_MARK, '1');
        header.className = 'mj-header';
        header.style.cssText = `
            display: flex;
            align-items: center;
            gap: 4px;                  /* was 6px; push icon a bit more inward */
            margin: 2px 0 6px 0;
        `;

        const iconWrap = document.createElement('div');
        iconWrap.style.cssText = `
            width: ${MAIN_ICON_SIZE}px;
            height: ${MAIN_ICON_SIZE}px;
            display: flex;
            align-items: center;
            justify-content: center;   /* keep perfectly centered */
            flex-shrink: 0;
        `;
        const icon = createFavicon(domain, MAIN_ICON_SIZE);
        iconWrap.appendChild(icon);
        header.appendChild(iconWrap);

        const right = document.createElement('div');
        right.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-height: ${MAIN_ICON_SIZE}px;  /* centers icon between the two lines */
            justify-content: center;
            line-height: 1.25;
        `;

        const nameEl = document.createElement('div');
        nameEl.textContent = siteNameFromHost(domain);
        nameEl.style.cssText = 'font-weight: 600; font-size: 15px;';  // +2px (was 13px)
        right.appendChild(nameEl);

        if (greenEl) {
            greenEl.style.margin = '0';
            greenEl.style.padding = '0';
            greenEl.style.fontSize = '12px';
            right.appendChild(greenEl);
        } else {
            const urlRow = document.createElement('div');
            urlRow.textContent = domain;
            urlRow.style.cssText = 'font-size: 12px; opacity: 0.9;';
            right.appendChild(urlRow);
        }

        header.appendChild(right);

        // Make favicon and site name act as a sublink to the result URL
        makeClickable(iconWrap, mainHref);
        makeClickable(nameEl, mainHref);

        return header;
    }

    // Add favicon/header depending on result type
    function addFaviconToLink(link) {
        if (link.hasAttribute(PROCESSED_ATTRIBUTE)) return;

        const href = link.href;
        if (!href || href.includes('mojeek.com')) return;

        const domain = getDomainFromUrl(href);
        if (!domain) return;

        const li = link.closest('li');
        const nested = isSublinkLI(li);

        // Top-level result: insert header above link (bigger icon + name + green link)
        if (!nested && li) {
            if (!li.querySelector(`:scope > .mj-header`)) {
                const green = findMojeekDisplayUrlElement(li, domain);
                const header = buildHeader(domain, green || null, href);
                const firstEl = li.firstElementChild || li.firstChild;
                if (firstEl) li.insertBefore(header, firstEl);
                else li.appendChild(header);
            }
            link.setAttribute(PROCESSED_ATTRIBUTE, 'true');
            link.style.display = 'block';
            return;
        }

        // Nested sublink: keep small inline favicon behavior
        link.setAttribute(PROCESSED_ATTRIBUTE, 'true');

        if (faviconCache.has(domain)) {
            const cachedFavicon = faviconCache.get(domain);
            if (cachedFavicon) {
                const clonedFavicon = cachedFavicon.cloneNode(true);
                link.insertBefore(clonedFavicon, link.firstChild);
            }
            link.style.display = 'inline-flex';
            link.style.alignItems = 'center';
            return;
        }

        const favicon = createFavicon(domain, FAVICON_SIZE);
        link.insertBefore(favicon, link.firstChild);
        faviconCache.set(domain, favicon.cloneNode(true));

        link.style.display = 'inline-flex';
        link.style.alignItems = 'center';
    }

    // Process all search results on the page
    function processSearchResults() {
        const resultLinks = document.querySelectorAll('a[href^="https://"]');

        resultLinks.forEach(link => {
            const linkText = (link.textContent || '').trim();

            if (linkText.includes('See more results from') ||
                linkText.includes('»') ||
                linkText === '' ||
                link.href.includes('mojeek.com')) {
                return;
            }

            const parentElement = link.parentElement;
            if (parentElement && parentElement.tagName === 'LI') {
                addFaviconToLink(link);
            } else if (link.closest('li')) {
                const listItem = link.closest('li');
                const allLinksInItem = listItem.querySelectorAll('a[href^="https://"]');
                if (allLinksInItem.length > 0 && allLinksInItem[0] === link) {
                    addFaviconToLink(link);
                }
            }
        });
    }

    // Initialize the extension
    function init() {
        processSearchResults();

        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches('li') || node.querySelector?.('a[href^="https://"]')) {
                                shouldProcess = true;
                            }
                        }
                    });
                }
            });
            if (shouldProcess) setTimeout(processSearchResults, 100);
        });

        observer.observe(document.body, { childList: true, subtree: true });

        [150, 400, 900].forEach(d => setTimeout(processSearchResults, d));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


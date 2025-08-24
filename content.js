let blockedDomains = [];
let isFilterEnabled = true;

// Detect current site
const isGoogleSite = () => window.location.hostname.includes('google.com');
const isBingSite = () => window.location.hostname.includes('bing.com');
const isYahooSite = () => ['tw.search.yahoo.com', 'search.yahoo.co.jp', 'search.yahoo.com', 'hk.search.yahoo.com'].includes(window.location.hostname);
const isDuckDuckGoSite = () => window.location.hostname.includes('duckduckgo.com');

// Function to hide search results that match the blocked domains
const hideBlockedResults = () => {
  if (!isFilterEnabled || blockedDomains.length === 0) {
    return; // Stop if filtering is disabled or no domains are blocked
  }

  const isBlockedDomain = (url) => blockedDomains.some(domain => url.includes(domain));

  if (isGoogleSite()) {
    hideGoogleResults(isBlockedDomain);
  } else if (isBingSite()) {
    hideBingResults(isBlockedDomain);
  }
};

// Google-specific hiding logic
const hideGoogleResults = (isBlockedDomain) => {
  // Standard search results
  document.querySelectorAll('a').forEach(aLink => {
    // const link = h3.closest('a');
    if (aLink && isBlockedDomain(aLink.href)) {
      const searchResultContainer = aLink.closest('div[data-hveid]');
      if (searchResultContainer && searchResultContainer.style.display !== 'none') {
        searchResultContainer.style.display = 'none';
      }
    }
  });

  // Section (Top stories, Local news, ...)
  document.querySelectorAll('g-section-with-header').forEach(section => {
    section.querySelectorAll('a').forEach(link => {
      if (isBlockedDomain(link.href)) {
        const storyContainer = link.closest('div[data-hveid]');
        if (storyContainer && storyContainer.style.display !== 'none') {
          storyContainer.style.display = 'none';
        }
      }
    });
  });
};

// Bing-specific hiding logic
const hideBingResults = (isBlockedDomain) => {
  // search results
  const searchContainer = document.querySelector('ol#b_results');
  if (searchContainer) {
    searchContainer.querySelectorAll('li').forEach(listItem => {
      if (listItem.classList.contains('b_algo')) {
        // Standard search results - hide the entire li
        const links = listItem.querySelectorAll('cite');

        for (const link of links) {
          // if (link.href && isBlockedDomain(link.href)) {
          if (link.innerText && isBlockedDomain(link.innerText)) {
            listItem.style.display = 'none';
            break; // Once we find one blocked link, hide and stop checking
          }
        }
      } else if (listItem.classList.contains('b_ans')) {
        // Special sections - hide individual items within
        const childLinks = listItem.querySelectorAll('a[href]');

        childLinks.forEach(link => {
          if (link.href && isBlockedDomain(link.href)) {
            // Find the closest reasonable parent to hide (not the whole section)
            const itemToHide = link.closest('.b_algo, [class*="item"], .b_entityTP, div[data-priority]') ||
                            link.closest('div, article, section');
            if (itemToHide && itemToHide !== listItem && itemToHide.style.display !== 'none') {
              itemToHide.style.display = 'none';
            }
          }
        });
      }
    });
  }

  // Handle Bing News search results
  if (window.location.href.match(/^https:\/\/www\.bing\.com\/news\//)) {
    const newsContainer = document.querySelector('main.main');
    newsContainer.querySelectorAll('div.news-card').forEach(listItem => {
      console.log(listItem);
      console.log(listItem.getAttribute('url'));

      if (listItem.getAttribute('url') && isBlockedDomain(listItem.getAttribute('url'))) {
        listItem.style.display = 'none';
      }
    });
  }
};

// Function to extract domains from the current page for suggestions
const extractDomains = () => {
  const extractedDomains = new Set();

  if (isGoogleSite()) {
    // Google: Extract from <a> elements
    document.querySelectorAll('a').forEach(link => {
      try {
        const url = new URL(link.href);
        if ((url.protocol === 'http:' || url.protocol === 'https:') &&
            !url.hostname.includes('google.com')) {
          extractedDomains.add(url.hostname);
        }
      } catch (e) {
        // Ignore invalid URLs
      }
    });
  } else if (isBingSite()) {
    // Bing: Extract from both <a> and <cite> elements

    // Extract from <a> elements (news and some regular results)
    document.querySelectorAll('a').forEach(link => {
      try {
        const url = new URL(link.href);
        if ((url.protocol === 'http:' || url.protocol === 'https:') &&
            !url.hostname.includes('bing.com')) {
          extractedDomains.add(url.hostname);
        }
      } catch (e) {
        // Ignore invalid URLs
      }
    });

    // Extract from <cite> elements (regular search results)
    document.querySelectorAll('cite').forEach(cite => {
      try {
        let urlText = cite.innerText.trim();
        if (urlText && !urlText.includes('bing.com')) {
          // Remove everything after the first space (e.g., "› article › ...")
          urlText = urlText.split(' ')[0];

          let hostname;

          if (urlText.startsWith('http://') || urlText.startsWith('https://')) {
            // Remove http(s):// prefix and extract domain
            const withoutProtocol = urlText.replace(/^https?:\/\//, '');
            // Take only the domain part (before any path)
            hostname = withoutProtocol.split('/')[0];
          } else {
            // Already without protocol, take domain part
            hostname = urlText.split('/')[0];
          }

          // Clean up common prefixes if needed, but keep the full domain
          if (hostname && hostname.includes('.')) {
            extractedDomains.add(hostname);
          }
        }
      } catch (e) {
        // Ignore invalid URLs
      }
    });
  }

  return Array.from(extractedDomains);
};

// Listen for messages from the popup (e.g., to get suggestions)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSuggestions') {
    sendResponse({ suggestions: extractDomains() });
    return true; // Keep the message channel open for the asynchronous response
  }
});

// Listen for changes in storage to update the filters in real-time
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    let needsUpdate = false;
    if (changes.domains) {
      blockedDomains = changes.domains.newValue || [];
      needsUpdate = true;
    }

    // Check for site-specific settings
    if (isGoogleSite() && changes.googleComEnabled) {
      isFilterEnabled = changes.googleComEnabled.newValue !== false;
      needsUpdate = true;
    } else if (isBingSite() && changes.bingComEnabled) {
      isFilterEnabled = changes.bingComEnabled.newValue !== false;
      needsUpdate = true;
    }

    if (needsUpdate) {
      // Note: This version doesn't un-hide results if a domain is removed or
      // filtering is disabled. A page refresh would be needed.
      hideBlockedResults();
    }
  }
});

// Initial load of settings and first run of the filter
const initialize = () => {
  const settingsToGet = ['domains'];

  if (isGoogleSite()) {
    settingsToGet.push('googleComEnabled');
  } else if (isBingSite()) {
    settingsToGet.push('bingComEnabled');
  }

  chrome.storage.sync.get(settingsToGet, (data) => {
    blockedDomains = data.domains || [];

    // Set filter enabled status based on current site
    if (isGoogleSite()) {
      isFilterEnabled = data.googleComEnabled !== false;
    } else if (isBingSite()) {
      isFilterEnabled = data.bingComEnabled !== false;
    } else {
      isFilterEnabled = true; // Default to enabled for other sites
    }

    hideBlockedResults();

    // Set up a MutationObserver to handle dynamically loaded content
    const debouncedHideResults = debounce(hideBlockedResults, 1000);
    const observer = new MutationObserver(debouncedHideResults);
    observer.observe(document.body, { childList: true, subtree: true });

    // Simple debounce implementation
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  });
};

initialize();

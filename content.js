// Global state for filters
let blockedDomains = [];
let isFilterEnabled = true;

// Function to hide search results that match the blocked domains
const hideBlockedResults = () => {
  if (!isFilterEnabled || blockedDomains.length === 0) {
    return; // Stop if filtering is disabled or no domains are blocked
  }

  const isBlockedDomain = (url) => blockedDomains.some(domain => url.includes(domain));

  document.querySelectorAll('h3').forEach(h3 => {
    const link = h3.closest('a');
    if (link && isBlockedDomain(link.href)) {
      // Find a container for the search result to hide it.
      // This selector might need updates if Google changes its page structure.
      const searchResultContainer = h3.closest('div[data-hveid]');
      if (searchResultContainer && searchResultContainer.style.display !== 'none') {
        searchResultContainer.style.display = 'none';
      }
    }
  });
};

// Function to extract domains from the current page for suggestions
const extractDomains = () => {
  const extractedDomains = new Set();
  document.querySelectorAll('a').forEach(link => {
    try {
      const url = new URL(link.href);
      // Only consider http(s) links and exclude google.com itself
      if ((url.protocol === 'http:' || url.protocol === 'https:') && !url.hostname.includes('google.com')) {
        extractedDomains.add(url.hostname);
      }
    } catch (e) {
      // Ignore invalid URLs
    }
  });
  return Array.from(extractedDomains);
};

// Listen for messages from the popup (e.g., to get suggestions)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSuggestions") {
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
    if (changes.googleComEnabled) {
      isFilterEnabled = changes.googleComEnabled.newValue !== false;
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
  chrome.storage.sync.get(['domains', 'googleComEnabled'], (data) => {
    isFilterEnabled = data.googleComEnabled !== false;
    blockedDomains = data.domains || [];
    hideBlockedResults();

    // Set up a MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(hideBlockedResults);
    observer.observe(document.body, { childList: true, subtree: true });
  });
};

initialize();
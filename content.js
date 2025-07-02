// Function to extract domains from search results for suggestions
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

// Always listen for messages from the popup to provide suggestions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSuggestions") {
    sendResponse({ suggestions: extractDomains() });
  }
  return true; // Keep the message channel open for the asynchronous response
});

// Main filtering logic
chrome.storage.sync.get(['domains', 'googleComEnabled'], (data) => {
  // Filtering is enabled by default if the setting isn't explicitly false
  const isEnabled = data.googleComEnabled !== false;

  if (!isEnabled) {
    return; // Stop execution if filtering is disabled for this site
  }

  const domains = data.domains || [];
  if (domains.length === 0) {
    return; // No domains to filter
  }

  const isBlockedDomain = (url) => domains.some(domain => url.includes(domain));

  const hideBlockedResults = () => {
    document.querySelectorAll('h3').forEach(h3 => {
      const link = h3.closest('a');
      if (link && isBlockedDomain(link.href)) {
        // Find the most common container for Google search results to hide it.
        const searchResultContainer = h3.closest('div[data-hveid]');
        if (searchResultContainer) {
          searchResultContainer.style.display = 'none';
        }
      }
    });
  };

  // Initial run
  hideBlockedResults();

  // Set up a MutationObserver to handle dynamically loaded content
  const observer = new MutationObserver(hideBlockedResults);
  observer.observe(document.body, { childList: true, subtree: true });
});

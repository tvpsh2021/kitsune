chrome.storage.sync.get('domains', (data) => {
  const domains = data.domains || [];
  if (domains.length === 0) return;

  // Function to check if a URL matches any of the domains
  const isBlockedDomain = (url) => domains.some(domain => url.includes(domain));

  // Function to hide elements that contain blocked domains
  const hideBlockedResults = () => {
    // Find all h3 elements, which are typically the titles of search results.
    document.querySelectorAll('h3').forEach(h3 => {
      // Find the closest 'a' tag, which is the main link of the search result.
      const link = h3.closest('a');
      if (link && isBlockedDomain(link.href)) {
        // Find the container of the search result to hide it.
        // Google often uses a div with a 'data-hveid' attribute for each result.
        const searchResultContainer = h3.closest('div[data-hveid]');
        if (searchResultContainer) {
          searchResultContainer.style.display = 'none';
        }
      }
    });
  };

  // Run the filter initially and on any dynamically loaded content
  hideBlockedResults();

  // MutationObserver to handle dynamic content loading (e.g., infinite scroll)
  const observer = new MutationObserver(hideBlockedResults);
  observer.observe(document.body, { childList: true, subtree: true });
});

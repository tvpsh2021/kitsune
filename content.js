chrome.storage.sync.get('domains', (data) => {
  const domains = data.domains || [];
  if (domains.length === 0) return;

  // Function to check if a URL matches any of the domains
  const isBlockedDomain = (url) => domains.some(domain => url.includes(domain));

  // Function to hide elements that contain blocked domains
  const hideBlockedResults = () => {
    // General search results
    const searchResults = document.querySelectorAll('.g');
    searchResults.forEach(result => {
      const link = result.querySelector('a');
      if (link && isBlockedDomain(link.href)) {
        result.style.display = 'none';
      }
    });

    // Top News Section and News Tab
    const newsResults = document.querySelectorAll('div[data-news-doc-id]');
    newsResults.forEach(result => {
      const link = result.querySelector('a');
      if (link && isBlockedDomain(link.href)) {
        result.style.display = 'none'; // Hide the entire block
      }
    });
  };

  // Run the filter initially and on any dynamically loaded content
  hideBlockedResults();

  // MutationObserver to handle dynamic content loading (e.g., infinite scroll)
  const observer = new MutationObserver(hideBlockedResults);
  observer.observe(document.body, { childList: true, subtree: true });
});

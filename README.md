# Kitsune: Search Result Filter

A simple but powerful Chrome Extension that empowers you to take control of your Google and Bing search results. Kitsune helps you filter out unwanted websites and focus on the information that matters most to you.

## Why Kitsune?

Are you tired of sifting through irrelevant search results? Do you wish you could permanently block certain websites from appearing in your searches? Kitsune is the solution you've been looking for. While Google and Bing allow you to use the `-site:` operator for temporary filtering, Kitsune provides a permanent and effortless way to customize your search experience on both search engines.

## Features

- **Enhanced Filtering:** Filters not just search links, but also special sections like "Top stories" and "Local news".
- **Intelligent Suggestions:** Intelligently suggests domains to block based on your current search results.
- **Granular Control:** A settings page allows you to toggle filtering on and off for specific websites.
- **Effortless Filtering:** Easily add or remove websites from your blocklist.
- **Automatic Saving:** Your blocklist is saved automatically as you make changes.
- **Streamlined Workflow:** Use the "Enter" key to quickly add new domains to your blocklist.
- **Clean and Simple UI:** A user-friendly interface makes it easy to manage your blocklist.

## Release History

### Version 1.5.1

-   **Future Search Engines Preview:** Added Yahoo and DuckDuckGo options to settings page (currently disabled as implementation is in development).
-   **Language System Enhancement:** Fixed dynamic message translation to ensure all UI text updates correctly when switching languages.

### Version 1.5

-   **Bing Support:** Extended search result filtering to support Bing.com in addition to Google, providing a consistent filtering experience across multiple search engines.
-   **Enhanced Settings:** Added granular control for enabling/disabling filtering on each supported search engine independently.
-   **Improved Suggestions:** Updated domain suggestion feature to work seamlessly on both Google and Bing search results pages.
-   **Multi-language Support:** Added Japanese translation and dynamic language switching system allowing users to change interface language without browser restart.

## Previous Releases

### Version 1.4

-   **Enhanced Filtering:** Now capable of filtering content within specific sections of Google search results, such as "Top stories" or "Local news," providing a cleaner and more focused browsing experience.
-   **Code Quality:** Integrated ESLint to enforce consistent coding styles and improve code quality. Added new linting scripts to the development workflow.

### Version 1.3

-   **Smarter Filtering:** Adapted to recent changes in Google's search results page to ensure consistent and reliable domain blocking.
-   **Modern UI/UX:** Overhauled the user interface with a fresh, modern design for a more intuitive and visually appealing experience.
-   **Intelligent Suggestions:** The extension now intelligently suggests domains to block based on your current search results, making it easier to discover and filter unwanted sites.
-   **Granular Control:** Added a new settings page that allows you to toggle filtering on and off for specific websites, starting with google.com.

### Version 1.2

-   UI/UX updated.

### Version 1.1

-   Initial prototype release, establishing the core domain blocking functionality.

### Version 1.0

-   First proof-of-concept and foundational build.

## Development

We use ESLint to maintain code quality. You can check for linting errors with:

```bash
npm run lint
```

To automatically fix any issues, run:

```bash
npm run lint:fix
```

## Installation

1.  **Download the Extension:** Clone or download this repository to your local machine.
2.  **Open Chrome Extensions:** Open Google Chrome and navigate to `chrome://extensions`.
3.  **Enable Developer Mode:** Turn on the "Developer mode" toggle in the top-right corner.
4.  **Load the Extension:** Click the "Load unpacked" button and select the directory where you saved the extension files.

That's it! Kitsune is now installed and ready to use. You can click the Kitsune icon in your browser's toolbar to manage your blocklist.

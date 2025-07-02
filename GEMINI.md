# Gemini Project: ChatGPT Google Search Filter

This is a browser extension that filters Google search results.

## UI Design Rule

1.  **Make it pretty and fancy for everything, like magic.**

## Documentation and UI Text Rule

1.  **Every word and sentence should be polished.**

## Tech Stack

-   JavaScript
-   WebExtensions API

## Project Structure

-   `manifest.json`: Extension manifest.
-   `content.js`: Core content script for interacting with web pages.
-   `popup.js`: Logic for the extension's popup.
-   `popup.html`: UI for the extension's popup.
-   `popup.css`: Styles for the popup.

## Commands

-   **Linting:** `npx eslint .`
-   **Installation (Chrome):**
    1.  Go to `chrome://extensions`
    2.  Enable "Developer mode"
    3.  Click "Load unpacked" and select this directory.

## Development Notes

-   The `feedbackMessage` element is dynamically created and inserted into the DOM. Be mindful of its placement when modifying `popup.html`.
-   The settings page is initially hidden and becomes visible when the settings button is clicked.
-   The `google.com` filter is controlled by the `googleComEnabled` value in `chrome.storage.sync`.

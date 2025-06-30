# Gemini Project: ChatGPT Google Search Filter

This is a browser extension that filters Google search results.

## Tech Stack

-   JavaScript
-   WebExtensions API

## Project Structure

-   `manifest.json`: Extension manifest.
-   `content.js`: Core content script for interacting with web pages.
-   `popup.js`: Logic for the extension's popup.
-   `popup.html`: UI for the extension's popup.

## Commands

-   **Linting:** `npx eslint .`
-   **Installation (Chrome):**
    1.  Go to `chrome://extensions`
    2.  Enable "Developer mode"
    3.  Click "Load unpacked" and select this directory.

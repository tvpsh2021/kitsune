# Gemini Project: ChatGPT Google Search Filter

This is a browser extension that filters Google search results.

## UI Design Rule

1.  **Make it pretty and fancy for everything, like magic.**

## Documentation and UI Text Rule

1.  **Every word and sentence should be polished.**

## Workflow Rules

1.  **Always work with a plan.** When starting a task, break down the required steps and announce each step as you begin it, starting with "Step 1:", "Step 2:", and so on.
2.  **Completing a session.** When asked to "summary current session" or "complete current session", perform the following actions:
    1.  Commit all changes with a descriptive commit message.
    2.  Increment the version number in `package.json` and `manifest.json`.
    3.  Add a new entry to the "Release History" section of `README.md` detailing the changes for the new version.

## Tech Stack

-   JavaScript
-   WebExtensions API

## Project Structure

-   `manifest.json`: Extension manifest.
-   `content.js`: Core content script for interacting with web pages.
-   `popup.js`: Logic for the extension's popup.
-   `popup.html`: UI for the extension's popup.
-   `popup.css`: Styles for the popup.
-   `_locales/`: Directory for internationalization (i18n) files.

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
-   The extension uses the `chrome.i18n` API for internationalization. All user-facing strings should be stored in `_locales/en/messages.json` and accessed using `chrome.i18n.getMessage()`.
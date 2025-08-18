# Gemini Project Context

This file contains project-specific context and instructions for the Gemini CLI agent.

## UI Design Rule

- **Make it pretty and fancy for everything, like magic.**

## Documentation and UI Text Rule

- **Every word and sentence should be polished.**

## Workflow Rules

## Tech Stack

- JavaScript
- WebExtensions API

## Project Structure

- `manifest.json`: Extension manifest.
- `content.js`: Core content script for interacting with web pages.
- `popup.js`: Logic for the extension's popup.
- `popup.html`: UI for the extension's popup.
- `popup.css`: Styles for the popup.
- `_locales/`: Directory for internationalization (i18n) files.

## Commands

- **Linting:** `npx eslint .`

## Development Notes

-   The `feedbackMessage` element is dynamically created and inserted into the DOM. Be mindful of its placement when modifying `popup.html`.
-   The settings page is initially hidden and becomes visible when the settings button is clicked.
-   The `google.com` filter is controlled by the `googleComEnabled` value in `chrome.storage.sync`.
-   The extension uses the `chrome.i18n` API for internationalization. All user-facing strings should be stored in `_locales/en/messages.json` and accessed using `chrome.i18n.getMessage()`.

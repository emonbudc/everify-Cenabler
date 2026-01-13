# Enable Copy & Right-Click Extension

A powerful Chrome extension that enables text selection, copying, and right-click functionality on websites that typically block these features.

## Features

- **Enable Text Selection & Copy**: Removes restrictions on selecting and copying text from websites
- **Enable Right-Click**: Restores right-click context menu functionality
- **Per-Domain Settings**: Remembers your preferences for each website
- **Easy Toggle Controls**: Simple interface to enable/disable features individually or all at once
- **Non-Intrusive**: Only activates when you choose to enable it
- **Instant Effect**: Works immediately without page refresh in most cases
- **Enable Copy Pasting**: Enable Copying and pasting on form

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your browser toolbar to open the popup
2. Toggle individual features:
   - Use "Enable Copy" to allow text selection and copying
   - Use "Enable Right-Click" to allow context menus and inspection
3. Click "Enable All" to activate all features at once
4. Your settings are automatically saved per domain

## Technical Details

The extension works by:
- Removing event listeners that block copying and context menus
- Overriding CSS properties that prevent text selection
- Using a MutationObserver to maintain functionality when page content changes
- Storing per-domain settings in Chrome's local storage

## Files Structure

```
├── manifest.json        # Extension configuration
├── popup.html          # Extension popup interface
├── popup.js           # Popup functionality
├── content.js         # Content script for page modification
├── background.js      # Background service worker
└── icons/             # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Permissions

This extension requires:
- `activeTab`: To modify the current webpage
- `storage`: To save per-domain settings
- `<all_urls>`: To work on any website

## Development

To modify or enhance the extension:
1. Make your changes to the relevant files
2. Reload the extension in `chrome://extensions/`
3. Test the changes on various websites

## Troubleshooting

If the extension doesn't work on a particular site:
1. Try refreshing the page
2. Make sure both features are enabled
3. Check if the site uses advanced protection methods

## License


This project is open source and available for modification and distribution.

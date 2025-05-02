// Background script for Enable Copy & Right-Click extension

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "checkStatus") {
    // Check if the domain is in our enabled list
    if (message.url) {
      try {
        const domain = new URL(message.url).hostname;
        chrome.storage.local.get('domainSettings', function(data) {
          const settings = data.domainSettings || {};
          
          // Check for domain settings
          if (settings[domain]) {
            // Return feature settings object
            sendResponse({ shouldEnable: settings[domain] });
          } else {
            // By default, features are disabled
            sendResponse({ shouldEnable: { copy: false, inspect: false } });
          }
        });
        return true; // Keep the message channel open for the async response
      } catch (e) {
        console.error('Error checking domain status:', e);
        sendResponse({ shouldEnable: { copy: false, inspect: false } });
      }
    }
  }
});

// Initialize storage with empty settings if not already set
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get('domainSettings', function(data) {
    if (!data.domainSettings) {
      chrome.storage.local.set({ domainSettings: {} });
    } else {
      // Migrate existing boolean settings to feature object format
      const settings = data.domainSettings;
      let needsMigration = false;
      
      for (const domain in settings) {
        if (typeof settings[domain] === 'boolean') {
          const enabled = settings[domain];
          settings[domain] = { copy: enabled, inspect: enabled };
          needsMigration = true;
        }
      }
      
      if (needsMigration) {
        chrome.storage.local.set({ domainSettings: settings });
        console.log('Migrated domain settings to new format');
      }
    }
  });
}); 
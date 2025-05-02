// Variables to store UI elements
const statusElement = document.getElementById('status');
const statusTextElement = document.getElementById('statusText');
const copyToggle = document.getElementById('copyToggle');
const inspectToggle = document.getElementById('inspectToggle');
const toggleAllButton = document.getElementById('toggleAllButton');
const toggleAllText = document.getElementById('toggleAllText');
const statusIconContainer = document.getElementById('statusIconContainer');
const buttonIconContainer = document.getElementById('buttonIconContainer');

// SVG Icons
const svgIcons = {
  checkCircle: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
  check: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
  warning: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
  error: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>',
  play: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
  stop: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>'
};

// Track feature states
let features = {
  copy: false,
  inspect: false
};

// Function to update UI based on enabled status
function updateUI(state, available = true) {
  if (!available) {
    statusIconContainer.innerHTML = svgIcons.warning;
    statusTextElement.textContent = 'Not available on this page';
    statusElement.className = 'status not-available';
    copyToggle.disabled = true;
    inspectToggle.disabled = true;
    toggleAllButton.disabled = true;
    toggleAllButton.classList.add('disabled');
    return;
  }
  
  // Update checkboxes without triggering events
  copyToggle.checked = state.copy;
  inspectToggle.checked = state.inspect;
  
  const allEnabled = state.copy && state.inspect;
  const anyEnabled = state.copy || state.inspect;
  const noneEnabled = !state.copy && !state.inspect;
  
  // Update overall status display
  if (allEnabled) {
    statusIconContainer.innerHTML = svgIcons.checkCircle;
    statusTextElement.textContent = 'All features active';
    statusElement.className = 'status active';
    toggleAllText.textContent = 'Disable All';
    buttonIconContainer.innerHTML = svgIcons.stop;
  } else if (anyEnabled) {
    statusIconContainer.innerHTML = svgIcons.check;
    statusTextElement.textContent = 'Partially active';
    statusElement.className = 'status active';
    toggleAllText.textContent = 'Enable All';
    buttonIconContainer.innerHTML = svgIcons.play;
  } else {
    statusIconContainer.innerHTML = svgIcons.error;
    statusTextElement.textContent = 'Not active';
    statusElement.className = 'status inactive';
    toggleAllText.textContent = 'Enable All';
    buttonIconContainer.innerHTML = svgIcons.play;
  }
  
  // Store local copy of feature state
  features = {...state};
}

// Function to send feature state to content script
function sendFeatureState(newState) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    
    if (isValidTab(currentTab)) {
      chrome.tabs.sendMessage(
        currentTab.id, 
        { 
          action: 'setFeatures',
          features: newState
        }, 
        function(response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
          }
          
          if (response && response.features) {
            updateUI(response.features);
            // Save the state for this domain
            saveState(currentTab.url, response.features);
          }
        }
      );
    }
  });
}

// Toggle all features on/off
function toggleAllFeatures() {
  // If any feature is disabled, enable all. Otherwise, disable all.
  const enableAll = !(features.copy && features.inspect);
  
  const newState = {
    copy: enableAll,
    inspect: enableAll
  };
  
  sendFeatureState(newState);
}

// Toggle individual feature
function toggleFeature(feature) {
  const newState = {...features};
  newState[feature] = !features[feature];
  sendFeatureState(newState);
}

// Function to check if a tab is valid for the extension
function isValidTab(tab) {
  return tab && 
         !tab.url.startsWith('chrome://') && 
         !tab.url.startsWith('chrome-extension://') && 
         !tab.url.startsWith('edge://') && 
         !tab.url.startsWith('about:');
}

// Function to save the enabled state for a domain
function saveState(url, featureState) {
  try {
    const domain = new URL(url).hostname;
    chrome.storage.local.get('domainSettings', function(data) {
      const settings = data.domainSettings || {};
      settings[domain] = featureState;
      chrome.storage.local.set({domainSettings: settings});
    });
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

// Check the extension status when popup opens
function checkStatus() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    
    if (!isValidTab(currentTab)) {
      updateUI({ copy: false, inspect: false }, false);
      return;
    }
    
    chrome.tabs.sendMessage(currentTab.id, {action: 'getFeatures'}, function(response) {
      if (chrome.runtime.lastError) {
        // Content script might not be loaded yet
        console.error(chrome.runtime.lastError);
        updateUI({ copy: false, inspect: false });
        return;
      }
      
      if (response && response.features) {
        updateUI(response.features);
      } else {
        updateUI({ copy: false, inspect: false });
      }
    });
  });
}

// Add event listeners
toggleAllButton.addEventListener('click', toggleAllFeatures);
copyToggle.addEventListener('change', () => toggleFeature('copy'));
inspectToggle.addEventListener('change', () => toggleFeature('inspect'));

// Check status when popup is opened
document.addEventListener('DOMContentLoaded', checkStatus); 
// Enable Copy & Right-Click Extension
// This script removes event listeners and CSS properties that block copying and context menus

(function() {
    // Feature state
    let features = {
        copy: false,
        inspect: false
    };
    
    // UI elements
    let styleElement = null;
    let observer = null;
    
    // Function to enable text selection
    function enableTextSelection() {
        // Remove user-select CSS property restrictions
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.textContent = `
                * {
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    user-select: text !important;
                }
            `;
            document.head.appendChild(styleElement);
        }
        
        // Enable copy/cut
        document.oncopy = null;
        document.oncut = null;
    }
    
    // Function to disable text selection enhancement
    function disableTextSelection() {
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
            styleElement = null;
        }
    }
    
    // Function to enable right-click context menu
    function enableRightClick() {
        // Remove context menu blocking
        document.addEventListener('contextmenu', allowContextMenu, true);
        
        // Prevent other handlers from blocking context menu
        document.oncontextmenu = null;
    }
    
    // Function to disable right-click enhancement
    function disableRightClick() {
        document.removeEventListener('contextmenu', allowContextMenu, true);
    }
    
    function allowContextMenu(e) {
        e.stopPropagation();
        return true;
    }
    
    // Function to disable common copy prevention techniques
    function enableCopyEvents() {
        // Prevent common copy prevention events
        ['copy', 'cut', 'selectstart', 'mousedown', 'mouseup'].forEach(function(event) {
            document.documentElement.addEventListener(event, stopPropagation, true);
        });
        
        // Remove "unselectable" attribute from elements
        const els = document.querySelectorAll('[unselectable]');
        for (const el of els) {
            el.removeAttribute('unselectable');
        }
    }
    
    // Function to disable common right-click prevention
    function enableInspectEvents() {
        // Prevent common inspection prevention events
        document.documentElement.addEventListener('contextmenu', stopPropagation, true);
    }
    
    function stopPropagation(e) {
        e.stopPropagation();
    }
    
    // Function to remove copy prevention overrides
    function disableCopyEvents() {
        ['copy', 'cut', 'selectstart', 'mousedown', 'mouseup'].forEach(function(event) {
            document.documentElement.removeEventListener(event, stopPropagation, true);
        });
    }
    
    // Function to remove inspect prevention overrides
    function disableInspectEvents() {
        document.documentElement.removeEventListener('contextmenu', stopPropagation, true);
    }
    
    // Function to update features based on state
    function updateFeatures(newFeatures) {
        // Handle Copy feature
        if (newFeatures.copy && !features.copy) {
            enableTextSelection();
            enableCopyEvents();
        } else if (!newFeatures.copy && features.copy) {
            disableTextSelection();
            disableCopyEvents();
        }
        
        // Handle Inspect feature
        if (newFeatures.inspect && !features.inspect) {
            enableRightClick();
            enableInspectEvents();
        } else if (!newFeatures.inspect && features.inspect) {
            disableRightClick();
            disableInspectEvents();
        }
        
        // Update observer if either feature is enabled
        const shouldObserve = newFeatures.copy || newFeatures.inspect;
        const isObserving = observer !== null;
        
        if (shouldObserve && !isObserving) {
            setupObserver();
        } else if (!shouldObserve && isObserving) {
            observer.disconnect();
            observer = null;
        }
        
        // Update state
        features = {...newFeatures};
        
        console.log("Extension features updated:", features);
    }
    
    // Set up mutation observer
    function setupObserver() {
        observer = new MutationObserver(function() {
            if (features.copy) {
                enableTextSelection();
                enableCopyEvents();
            }
            if (features.inspect) {
                enableRightClick();
                enableInspectEvents();
            }
        });
        
        // Start observing the document with the configured parameters
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    
    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.action === "getFeatures") {
            sendResponse({ features: features });
        } else if (message.action === "setFeatures") {
            updateFeatures(message.features);
            sendResponse({ features: features });
        }
    });
    
    // Check if we should be enabled on page load (based on stored settings)
    chrome.runtime.sendMessage({ action: "checkStatus", url: window.location.href }, function(response) {
        if (response && response.shouldEnable) {
            // For backward compatibility
            if (typeof response.shouldEnable === 'boolean') {
                updateFeatures({ copy: true, inspect: true });
            } else if (typeof response.shouldEnable === 'object') {
                updateFeatures(response.shouldEnable);
            }
        }
    });
})(); 
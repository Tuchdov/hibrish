
// Listen for installation or update of the extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Hibrish extension installed or updated');
});

let isEnabled = true;
// Listen for clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  isEnabled = !isEnabled;
  updateIcon();
  // Toggle the extension on the current tab
  chrome.tabs.sendMessage(tab.id, { action: "toggle" });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getState") {
    // You could implement logic here to retrieve and send the extension's state
    sendResponse({ isEnabled: true });
  }
});

function updateIcon() {
  const path = isEnabled ? {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  } : {
    "16": "icons/icon16-disabled.png",
    "48": "icons/icon48-disabled.png",
    "128": "icons/icon128-disabled.png"
  };
  
  chrome.action.setIcon({ path: path });
}

// Set initial icon state
updateIcon();
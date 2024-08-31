// Listen for installation or update of the extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Hibrish extension installed or updated');
});

// Listen for clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
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

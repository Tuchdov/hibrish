let isEnabled = true;

// Function to convert between Hebrew and English
function convertText(text) {
  const engToHebMap = new Map([
    ['q', '/'], ['w', "'"], ['e', 'ק'], ['r', 'ר'], ['t', 'א'], ['y', 'ט'],
    ['u', 'ו'], ['i', 'ן'], ['o', 'ם'], ['p', 'פ'], ['a', 'ש'], ['s', 'ד'],
    ['d', 'ג'], ['f', 'כ'], ['g', 'ע'], ['h', 'י'], ['j', 'ח'], ['k', 'ל'],
    ['l', 'ך'], ['z', 'ז'], ['x', 'ס'], ['c', 'ב'], ['v', 'ה'], ['b', 'נ'],
    ['n', 'מ'], ['m', 'צ'], ['`', ';'], ["'", 'ף'], [',', 'ת'], ['.', 'ץ'],
    ['/', '.'], ['[', ']'], [']', '[']
  ]);

  const hebToEngMap = new Map(Array.from(engToHebMap, a => a.reverse()));

  return text.split('').map(char => {
    const lowerChar = char.toLowerCase();
    if (engToHebMap.has(lowerChar)) { // if the character exists in the map then return the corresponding hebrew character
      return char === lowerChar ? engToHebMap.get(lowerChar) : engToHebMap.get(lowerChar).toUpperCase();
    } else if (hebToEngMap.has(char)) {
      const engChar = hebToEngMap.get(char);
      return char === char.toUpperCase() ? engChar.toLowerCase() : engChar;
    } else {
      return char;
    }
  }).join('');
}

// Function to handle input events
// Function to handle selection conversion
function handleSelectionConversion(event) {
  if (!isEnabled) return;
  
  const activeElement = document.activeElement;
  if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'||activeElement.tagName === 'P' ) {
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    
    if (start !== end) {
      const selectedText = activeElement.value.substring(start, end);
      const convertedText = convertText(selectedText);
      
      const newValue = activeElement.value.substring(0, start) + convertedText + activeElement.value.substring(end);
      activeElement.value = newValue;
      
      // Maintain the selection
      activeElement.setSelectionRange(start, start + convertedText.length);
      
      // Prevent default behavior for certain key combinations
      // if (event.key === 'c' && (event.ctrlKey || event.metaKey)) {
      //   event.preventDefault();
      }
    }
  }


// Function to handle selection conversion for contenteditable elements
function handleContentEditableSelection(event) {
  if (!isEnabled) return;
  
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  
  if (!range.collapsed) {
    const selectedText = range.toString();
    const convertedText = convertText(selectedText);
    
    const newNode = document.createTextNode(convertedText);
    range.deleteContents();
    range.insertNode(newNode);
    
    // Adjust the selection to encompass the new text
    range.setStartBefore(newNode);
    range.setEndAfter(newNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Prevent default behavior for certain key combinations
    // if (event.key === 'c' && (event.ctrlKey || event.metaKey)) {
    //   event.preventDefault();
    // }
  }
}

// Add event listeners to all text inputs and textareas
function addListeners() {
  const inputs = document.querySelectorAll('input[type="text"], textarea, p');
  inputs.forEach(input => {
    input.addEventListener('keydown', handleSelectionConversion);
  });

  // For Gmail's compose area and other contenteditable elements
  const contentEditables = document.querySelectorAll('div[contenteditable="true"]');
  contentEditables.forEach(element => {
    element.addEventListener('keydown', handleContentEditableSelection);
  });
}

// Initial setup
addListeners();

// Listen for dynamically added elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      addListeners();
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Listen for toggle messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    isEnabled = !isEnabled;
    console.log(`Hibrish is now ${isEnabled ? 'enabled' : 'disabled'}`);
  }
});

// Request initial state when the content script loads
chrome.runtime.sendMessage({ action: "getState" }, (response) => {
  if (response) {
    isEnabled = response.isEnabled;
  }
});

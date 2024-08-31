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
    if (engToHebMap.has(lowerChar)) {
      return char === lowerChar ? engToHebMap.get(lowerChar) : engToHebMap.get(lowerChar).toUpperCase();
    } else if (hebToEngMap.has(char)) {
      const engChar = hebToEngMap.get(char);
      return char === char.toUpperCase() ? engChar.toUpperCase() : engChar;
    } else {
      return char;
    }
  }).join('');
}

// Function to handle input events
function handleInput(event) {
  if (!isEnabled) return;
  const input = event.target;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  input.value = convertText(input.value);
  input.setSelectionRange(start, end);
}

// Add event listeners to all text inputs and textareas
function addListeners() {
  const inputs = document.querySelectorAll('input[type="text"], textarea');
  inputs.forEach(input => {
    input.addEventListener('input', handleInput);
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

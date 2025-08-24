document.addEventListener('DOMContentLoaded', () => {
  const domainsContainer = document.getElementById('domains');
  const addDomainBtn = document.getElementById('add-domain-btn');
  const newDomainInput = document.getElementById('new-domain-input');
  const suggestionsContainer = document.getElementById('suggestions');
  const noDomainsMessage = document.createElement('p');
  noDomainsMessage.classList.add('no-domains-message');

  const noSuggestionsMessage = document.createElement('p');
  noSuggestionsMessage.classList.add('no-domains-message');

  // Function to update dynamic messages
  function updateDynamicMessages() {
    noDomainsMessage.textContent = getMessage('noDomainsAdded');
    noSuggestionsMessage.textContent = getMessage('noSuggestionsFound');
  }

  const feedbackMessage = document.createElement('div');
  feedbackMessage.classList.add('feedback-message');
  document.querySelector('.container').insertBefore(feedbackMessage, document.getElementById('main-view'));

  // Settings
  const settingsBtn = document.getElementById('settings-btn');
  const backBtn = document.getElementById('back-btn');
  const mainView = document.getElementById('main-view');
  const settingsView = document.getElementById('settings-view');
  const googleComCheckbox = document.getElementById('google-com-checkbox');
  const bingComCheckbox = document.getElementById('bing-com-checkbox');
  const yahooComCheckbox = document.getElementById('yahoo-com-checkbox');
  const duckduckgoComCheckbox = document.getElementById('duckduckgo-com-checkbox');
  const languageSelect = document.getElementById('language-select');

  // Language management
  let currentMessages = {};

  // Load messages from different language files
  async function loadMessages(locale) {
    try {
      if (locale === 'default') {
        // Use browser default (Chrome's i18n)
        return null;
      }

      const response = await fetch(chrome.runtime.getURL(`_locales/${locale}/messages.json`));
      const messages = await response.json();
      return messages;
    } catch (error) {
      console.error('Failed to load language file:', error);
      return null;
    }
  }

  // Unified function to get messages (supports both Chrome i18n and custom messages)
  function getMessage(key, ...args) {
    if (currentMessages && currentMessages[key]) {
      let message = currentMessages[key].message;
      // Handle placeholders like $domain$ and $1
      if (args.length > 0) {
        args.forEach((arg, index) => {
          message = message.replace(`$${index + 1}`, arg);
          // Handle named placeholders like $domain$
          if (key === 'domainAddedSuccess' || key === 'domainAlreadyBlocked') {
            message = message.replace('$domain$', arg);
          }
        });
      }
      return message;
    } else {
      return chrome.i18n.getMessage(key, ...args);
    }
  }

  // Function to set text from locale
  function setI18nText(messages = null) {
    document.querySelectorAll('[data-i18n]').forEach(elem => {
      const key = elem.getAttribute('data-i18n');
      if (messages && messages[key]) {
        elem.textContent = messages[key].message;
      } else {
        elem.textContent = chrome.i18n.getMessage(key);
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-placeholder');
      if (messages && messages[key]) {
        elem.placeholder = messages[key].message;
      } else {
        elem.placeholder = chrome.i18n.getMessage(key);
      }
    });
    document.querySelectorAll('[data-i18n-title]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-title');
      if (messages && messages[key]) {
        elem.title = messages[key].message;
      } else {
        elem.title = chrome.i18n.getMessage(key);
      }
    });

    // Update dynamic messages
    updateDynamicMessages();
  }

  // Initialize language
  async function initializeLanguage() {
    chrome.storage.sync.get('selectedLanguage', async (data) => {
      const selectedLanguage = data.selectedLanguage || 'default';
      languageSelect.value = selectedLanguage;

      if (selectedLanguage !== 'default') {
        currentMessages = await loadMessages(selectedLanguage);
      }

      setI18nText(currentMessages);
    });
  }

  initializeLanguage();

  settingsBtn.addEventListener('click', () => {
    mainView.classList.add('hidden');
    settingsView.classList.remove('hidden');
  });

  backBtn.addEventListener('click', () => {
    settingsView.classList.add('hidden');
    mainView.classList.remove('hidden');
  });

  chrome.storage.sync.get(['googleComEnabled', 'bingComEnabled', 'yahooComEnabled', 'duckduckgoComEnabled'], (data) => {
    googleComCheckbox.checked = data.googleComEnabled !== false;
    bingComCheckbox.checked = data.bingComEnabled !== false;
    // Yahoo and DuckDuckGo are disabled for now, but we set default values
    yahooComCheckbox.checked = data.yahooComEnabled !== false;
    duckduckgoComCheckbox.checked = data.duckduckgoComEnabled !== false;
  });

  googleComCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ googleComEnabled: googleComCheckbox.checked });
  });

  bingComCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ bingComEnabled: bingComCheckbox.checked });
  });

  // Yahoo and DuckDuckGo are disabled for now - no event listeners needed
  // Future implementation will add event listeners here

  // Language selection handler
  languageSelect.addEventListener('change', async () => {
    const selectedLanguage = languageSelect.value;
    chrome.storage.sync.set({ selectedLanguage });

    if (selectedLanguage !== 'default') {
      currentMessages = await loadMessages(selectedLanguage);
    } else {
      currentMessages = null;
    }

    setI18nText(currentMessages);
  });


  function showFeedback(message, isError = false) {
    feedbackMessage.textContent = message;
    feedbackMessage.style.display = 'block';
    feedbackMessage.style.backgroundColor = isError ? '#fa383e' : '#42b72a';
    feedbackMessage.style.color = '#fff';
    feedbackMessage.style.padding = '8px';
    feedbackMessage.style.borderRadius = '4px';
    feedbackMessage.style.marginTop = '10px';
    feedbackMessage.style.textAlign = 'center';
    setTimeout(() => {
      feedbackMessage.style.display = 'none';
    }, 3000);
  }

  function updateMessageVisibility() {
    if (domainsContainer.children.length === 0) {
      domainsContainer.appendChild(noDomainsMessage);
    } else if (domainsContainer.contains(noDomainsMessage)) {
      domainsContainer.removeChild(noDomainsMessage);
    }
  }

  function saveDomains() {
    const domainItems = document.querySelectorAll('.domain-item .domain-name');
    const domains = Array.from(domainItems).map(item => item.textContent).filter(value => value.trim() !== '');
    chrome.storage.sync.set({ domains }, updateMessageVisibility);
  }

  function createDomainElement(domain) {
    const div = document.createElement('div');
    div.classList.add('domain-item');
    div.innerHTML = `
      <span class="domain-name">${domain}</span>
      <button class="remove-btn" title="${getMessage('removeDomainBtnTitle')}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    div.querySelector('.remove-btn').addEventListener('click', () => {
      div.classList.add('fade-out');
      div.addEventListener('animationend', () => {
        div.remove();
        saveDomains();
      }, { once: true });
    });
    return div;
  }

  function addDomain(domainToAdd) {
    const domain = domainToAdd || newDomainInput.value.trim();
    if (domain) {
      const existingDomains = Array.from(document.querySelectorAll('.domain-item .domain-name')).map(item => item.textContent);
      if (!existingDomains.includes(domain)) {
        const domainElement = createDomainElement(domain);
        domainsContainer.appendChild(domainElement);
        domainElement.classList.add('fade-in');
        saveDomains();
        newDomainInput.value = '';
        newDomainInput.classList.remove('invalid');
        newDomainInput.focus();
        showFeedback(getMessage('domainAddedSuccess', domain));
      } else {
        newDomainInput.classList.add('invalid');
        newDomainInput.value = domain; // Keep the existing domain in the input field
        showFeedback(getMessage('domainAlreadyBlocked', domain), true);
      }
    } else {
      newDomainInput.classList.add('invalid');
      showFeedback(getMessage('pleaseEnterDomain'), true);
    }
  }

  function displaySuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    if (suggestions.length === 0) {
      suggestionsContainer.appendChild(noSuggestionsMessage);
      return;
    }

    suggestions.forEach(suggestion => {
      const div = document.createElement('div');
      div.classList.add('suggestion-item', 'fade-in'); // Add fade-in for initial display
      div.innerHTML = `
        <span class="suggestion-domain" title="${suggestion}">${suggestion}</span>
        <button class="add-suggestion-btn">${getMessage('addSuggestionBtn')}</button>
      `;
      div.querySelector('.add-suggestion-btn').addEventListener('click', (e) => {
        addDomain(suggestion);
        // Animate removal from suggestions
        const itemToRemove = e.target.closest('.suggestion-item');
        if (itemToRemove) {
          itemToRemove.classList.add('fade-out');
          itemToRemove.addEventListener('animationend', () => {
            itemToRemove.remove();
            if (suggestionsContainer.children.length === 0) {
              suggestionsContainer.appendChild(noSuggestionsMessage);
            }
          }, { once: true });
        }
      });
      suggestionsContainer.appendChild(div);
    });
  }

  // Load saved domains
  chrome.storage.sync.get('domains', (data) => {
    const domains = data.domains || [];
    domainsContainer.innerHTML = ''; // Clear existing
    if (domains.length > 0) {
      domains.forEach(domain => {
        domainsContainer.appendChild(createDomainElement(domain));
      });
    }
    updateMessageVisibility();
  });

  // Request suggestions from content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getSuggestions' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message: ', chrome.runtime.lastError.message);
          displaySuggestions([]); // No suggestions or error
          suggestionsContainer.innerHTML = `<p class="no-domains-message">${getMessage('suggestionsUnavailable')}</p>`;
          return;
        }
        if (response && response.suggestions) {
          displaySuggestions(response.suggestions);
        } else {
          displaySuggestions([]); // No suggestions or error
        }
      });
    }
  });

  addDomainBtn.addEventListener('click', () => addDomain());
  newDomainInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addDomain();
    }
  });

  newDomainInput.addEventListener('input', () => {
    if (newDomainInput.classList.contains('invalid') && newDomainInput.value.trim() !== '') {
      newDomainInput.classList.remove('invalid');
    }
  });
});

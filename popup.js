document.addEventListener('DOMContentLoaded', () => {
  const domainsContainer = document.getElementById('domains');
  const addDomainBtn = document.getElementById('add-domain');
  const noDomainsMessage = document.getElementById('no-domains-message');

  function updateMessageVisibility() {
    if (domainsContainer.children.length === 0) {
      noDomainsMessage.style.display = 'block';
    } else {
      noDomainsMessage.style.display = 'none';
    }
  }

  function saveDomains() {
    const domainInputs = document.querySelectorAll('.domain-input input');
    const domains = Array.from(domainInputs).map(input => input.value).filter(value => value.trim() !== '');
    chrome.storage.sync.set({ domains });
  }

  function createDomainInput(value = '') {
    const div = document.createElement('div');
    div.classList.add('domain-input');
    div.innerHTML = `
      <input type="text" placeholder="Enter domain" value="${value}">
      <button class="remove-btn">Remove</button>
    `;
    const input = div.querySelector('input');
    input.addEventListener('input', saveDomains);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        addDomainBtn.click();
      }
    });

    div.querySelector('.remove-btn').addEventListener('click', () => {
      div.remove();
      saveDomains();
      updateMessageVisibility();
    });
    return div;
  }

  // Load saved domains
  chrome.storage.sync.get('domains', (data) => {
    const domains = data.domains || [];
    domainsContainer.innerHTML = ''; // Clear existing
    if (domains.length > 0) {
      domains.forEach(domain => {
        domainsContainer.appendChild(createDomainInput(domain));
      });
    }
    updateMessageVisibility();
  });

  addDomainBtn.addEventListener('click', () => {
    const newField = createDomainInput();
    domainsContainer.appendChild(newField);
    newField.querySelector('input').focus();
    updateMessageVisibility();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.tagName !== 'INPUT') {
      addDomainBtn.click();
    }
  });
});

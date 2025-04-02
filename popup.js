document.addEventListener('DOMContentLoaded', () => {
  const domainsContainer = document.getElementById('domains');
  const addDomainBtn = document.getElementById('add-domain');
  const saveBtn = document.getElementById('save');

  function createDomainInput(value = '') {
    const div = document.createElement('div');
    div.classList.add('domain-input');
    div.innerHTML = `
      <input type="text" placeholder="Enter domain" value="${value}">
      <button class="remove-btn">Remove</button>
    `;
    div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
    return div;
  }

  // Load saved domains
  chrome.storage.sync.get('domains', (data) => {
    const domains = data.domains || [];
    domains.forEach(domain => {
      domainsContainer.appendChild(createDomainInput(domain));
    });
  });

  addDomainBtn.addEventListener('click', () => {
    domainsContainer.appendChild(createDomainInput());
  });

  saveBtn.addEventListener('click', () => {
    const domainInputs = document.querySelectorAll('.domain-input input');
    const domains = Array.from(domainInputs).map(input => input.value).filter(value => value.trim() !== '');
    chrome.storage.sync.set({ domains }, () => {
      alert('Domains saved.');
    });
  });
});

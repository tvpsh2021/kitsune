'use strict';

let userInputURL = document.getElementById('user-input-url');
let applyURL = document.getElementById('apply-url');

let clearMemory = document.getElementById('clear-memory');
let submitRequest = document.getElementById('submit-request');

let appendArea = document.getElementById('append-area');

console.log('popup triggered');

chrome.storage.sync.get('siteURLs', function(data) {
  if (data.siteURLs[0]) {
    userInputURL.value = data.siteURLs[0];
  }

  if (data.siteURLs) {
    for (let i = 0; i < data.siteURLs.length; i++) {
      let firstDiv = document.createElement('div');
      firstDiv.className = 'col- input-group mb-3';
      firstDiv.innerHTML = `
        <input id="user-input-url-${i}" type="text" class="form-control" value="${data.siteURLs[i]}">
        <div class="input-group-append">
          <button id="apply-url-${i}" class="btn btn-outline-secondary" type="button">Apply</button>
          <button id="remove-url-${i}" class="btn btn-outline-secondary" type="button">Remove</button>
        </div>
      `;
      appendArea.appendChild(firstDiv);
    }

  }
});

applyURL.onclick = function (e) {
  let url = userInputURL.value;
  chrome.storage.sync.set({ siteURLs: [url] });
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        code: `
          let googleSearchInput = document.getElementsByTagName('input')[3].value;
          document.getElementsByTagName('input')[3].value = googleSearchInput + ' -site:${url}';
        `
      }
    );
  });
  chrome.storage.sync.get('siteURLs', function(data) {
    console.log(data.siteURLs);
  });
};

clearMemory.onclick = function (e) {
  chrome.storage.sync.set({ siteURLs: [] });
  userInputURL.value = '';
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        code: `
          let googleSearchInput = document.getElementsByTagName('input')[3].value;
          let tempArr = googleSearchInput.split(' ');
          document.getElementsByTagName('input')[3].value = tempArr[0];
        `
      }
    );
  });
};

submitRequest.onclick = function (e) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        code: `
          document.getElementsByTagName('button')[0].click();
        `
      }
    );
  });
};

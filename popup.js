'use strict';

$(function () {
  let currentURLs = [];

  const plus = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
  <path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
</svg>`;
  const dash = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-dash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/>
</svg>`;
  const trash = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>`;

  chrome.storage.sync.get('siteURLs', function (data) {
    if (data.siteURLs) {
      for (let i = 0; i < data.siteURLs.length; i++) {
        const htmlString = `
          <div class="col- input-group mb-3">
            <input id="user-input-url-${i}" type="text" class="form-control" idx="${i}" value="${data.siteURLs[i]}">
            <div class="input-group-append">
              <button id="apply-url-${i}" class="btn btn-outline-secondary" idx="${i}" type="button">${plus}</button>
              <button id="remove-url-g-${i}" class="btn btn-outline-secondary" type="button">${dash}</button>
              <button id="remove-url-arr-${i}" class="remove-arr btn btn-outline-secondary" type="button">${trash}</button>
            </div>
          </div>
        `;
        $('#append-area').append(htmlString);
        currentURLs.push(data.siteURLs[i]);
      }
    }
  });

  // TODO: need solve dynamic added element

  // $(document).ready(function () {
  //   $('#remove-url-arr-1').click(function (e) {
  //     e.stopPropagation();
  //     e.stopImmediatePropagation();
  //     console.log('object');
  //     console.log(e);
  //   });
  // });

  $('#apply-url').click(function () {
    let url = $('#user-input-url').val();
    currentURLs.push(url);
    chrome.storage.sync.set({ siteURLs: currentURLs });
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        {
          code: `
            var googleSearchInput = document.getElementsByTagName('input')[3].value;
            document.getElementsByTagName('input')[3].value = googleSearchInput + ' -site:${url}';
          `
        }
      );
    });
    chrome.storage.sync.get('siteURLs', function(data) {
      console.log(data.siteURLs);
    });
  });

  $('#apply-all').click(function () {
    const urlFromArray = currentURLs.map(url => {
      return ` -site:${url}`;
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        {
          code: `
            var googleSearchInput = document.getElementsByTagName('input')[3].value;
            document.getElementsByTagName('input')[3].value = googleSearchInput + '${urlFromArray.join('')}';
          `
        }
      );
    });
  });

  $('#clear-all').click(function () {
    $('#user-input-url').val('');
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        {
          code: `
            var googleSearchInput = document.getElementsByTagName('input')[3].value;
            var queryStringArray = googleSearchInput.split(' ');
            console.log(queryStringArray);
            var newQueryStringArray = queryStringArray.filter(queryString => {
              return !queryString.includes('-site:')
            });
            console.log(newQueryStringArray);
            document.getElementsByTagName('input')[3].value = newQueryStringArray.join(' ');
          `
        }
      );
    });
  });

  $('#submit-search').click(function () {
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
  });
});

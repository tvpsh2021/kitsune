'use strict';

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log('The color is green.');
  });
  chrome.storage.sync.set({ siteURLs: [] }, function () {
    console.log('All sets.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'www.google.com' },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

console.log('background running');

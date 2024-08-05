chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === "update" || details.reason === "install") {
    setTimeout(() => {
      chrome.notifications.create('updateNotification', {
        type: 'basic',
        iconUrl: 'imgs/icon128.png',
        title: 'Extension Updated',
        message: 'The Unbounce Variant True Conversion Rate Calculator extension has been updated to the latest version.',
        priority: 2
      });
    }, 30000); // 30000 milliseconds = 30 seconds
  }
});

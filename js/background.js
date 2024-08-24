chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "update") {
        // Create the notification
        chrome.notifications.create({
            type: "basic",
            iconUrl: "../imgs/noti128.png",
            title: "Extension Updated!",
            message: "The Unbounce Variant Conversion Rate Calculator has been updated. Click to see what's new.",
            priority: 2
        });
    }
});
chrome.notifications.onClicked.addListener(function(notificationId) {
    chrome.tabs.create({ url: "https://github.com/kevinhansberger/Unofficial-Unbounce-Variant-Conversion-Rate-Calculator-Google-Chrome-Extension" }); // Replace with your URL
});

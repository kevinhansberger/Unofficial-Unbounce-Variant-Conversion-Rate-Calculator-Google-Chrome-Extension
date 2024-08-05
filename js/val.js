document.addEventListener('DOMContentLoaded', function() {
    // Function to check the URL
    function checkURL() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            var url = activeTab.url;
            if (url.startsWith("https://app.unbounce.com/") && url.endsWith("overview")) {
                document.getElementById('valArea').style.display = 'none';
            } else {
                document.getElementById('rateForm').style.display = 'none';
                document.getElementById('footer').style.display = 'none';
                document.getElementById('valArea').style.display = 'block';
            }
        });
    }

    // Run the URL check when the extension is opened
    checkURL();
});

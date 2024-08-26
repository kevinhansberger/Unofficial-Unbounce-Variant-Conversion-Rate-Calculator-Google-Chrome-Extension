document.addEventListener('DOMContentLoaded', function() {
    const bookmarkIcon = document.getElementById('bookmarkIcon');
    const monitorIcon = document.getElementById('monitorIcon'); // Assuming monitorIcon is already defined in stats.html
    const bookmarksArea = document.getElementById('bookmarksArea');
    const bookmarksImage = document.getElementById('bookmarksImage'); // Assuming this is the element for bookmarks.png
    const bookmarksIcon = document.getElementById('bookmarksIcon'); // Assuming this is the id for bookmarks.png icon in stats.html

    // Load the current page URL and set up bookmarks
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentUrl = tabs[0].url;
        const pageName = tabs[0].title;

        // Load bookmarks from storage and update the UI
        chrome.storage.sync.get(['bookmarks'], function(result) {
            const bookmarks = result.bookmarks || [];
            updateBookmarkIcon(bookmarks, currentUrl);
            updateMonitorIcon(bookmarks, currentUrl);
            updateBookmarksArea(bookmarks);
            toggleBookmarksImageVisibility(bookmarks);
        });

        // Handle bookmarking/unbookmarking
        bookmarkIcon.addEventListener('click', function() {
            chrome.storage.sync.get(['bookmarks'], function(result) {
                let bookmarks = result.bookmarks || [];
                const index = bookmarks.findIndex(bookmark => bookmark.url === currentUrl);

                if (index === -1) {
                    // Add bookmark
                    bookmarks.push({ url: currentUrl, title: pageName });
                    bookmarkIcon.src = "/imgs/functs/bookmark-checked.png";
                } else {
                    // Remove bookmark
                    bookmarks.splice(index, 1);
                    bookmarkIcon.src = "/imgs/functs/bookmark-unchecked.png";
                }

                // Save updated bookmarks to storage
                chrome.storage.sync.set({ bookmarks }, function() {
                    updateBookmarksArea(bookmarks);
                    updateMonitorIcon(bookmarks, currentUrl);
                    toggleBookmarksImageVisibility(bookmarks);
                });
            });
        });
    });

    // Update bookmark icon based on whether the current URL is bookmarked
    function updateBookmarkIcon(bookmarks, currentUrl) {
        const isBookmarked = bookmarks.some(bookmark => bookmark.url === currentUrl);
        bookmarkIcon.src = isBookmarked ? "/imgs/functs/bookmark-checked.png" : "/imgs/functs/bookmark-unchecked.png";
    }

    // Update monitor icon based on whether the current URL is bookmarked
    function updateMonitorIcon(bookmarks, currentUrl) {
        const isBookmarked = bookmarks.some(bookmark => bookmark.url === currentUrl);
        monitorIcon.style.display = isBookmarked ? "inline" : "none";
    }

    // Update bookmarksArea to list all bookmarked URLs
    function updateBookmarksArea(bookmarks) {
        bookmarksArea.innerHTML = ''; // Clear current list

        if (bookmarks.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No bookmarks yet.';
            bookmarksArea.appendChild(message);
        } else {
            // Add "Your Bookmarks:" heading
            const heading = document.createElement('p');
            heading.textContent = 'Your Bookmarks:';
            bookmarksArea.appendChild(heading);

            // List each bookmark
            bookmarks.forEach(bookmark => {
                const link = document.createElement('a');
                link.href = bookmark.url;
                link.textContent = bookmark.title;
                link.target = "_blank"; // Open the link in a new tab
                link.style.display = 'block'; // Make each link appear on a new line

                // Apply style if set
                if (bookmark.style === 'ultra-bold') {
                    link.style.fontWeight = '900'; // Ultra bold
                }

                bookmarksArea.appendChild(link);

                // Add a <br> element after each link
                const lineBreak = document.createElement('br');
                bookmarksArea.appendChild(lineBreak);
            });
        }
    }

    // Show or hide the bookmarks.png icon based on whether there are any bookmarks
    function toggleBookmarksImageVisibility(bookmarks) {
        if (bookmarks.length === 0) {
            bookmarksIcon.style.display = 'none';
        } else {
            bookmarksIcon.style.display = 'inline';
        }
    }

    // Listen for messages to update bookmark styles
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'updateBookmarkStyles') {
            chrome.storage.sync.get(['bookmarks'], function(result) {
                updateBookmarksArea(result.bookmarks || []);
                updateMonitorIcon(result.bookmarks || [], window.location.href);
                toggleBookmarksImageVisibility(result.bookmarks || []);
            });
        }
    });
});

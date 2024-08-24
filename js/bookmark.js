document.addEventListener('DOMContentLoaded', function() {
    const bookmarkIcon = document.getElementById('bookmarkIcon');
    const bookmarksArea = document.getElementById('bookmarksArea');

    // Load the current page URL and set up bookmarks
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentUrl = tabs[0].url;
        const pageName = tabs[0].title;

        // Load bookmarks from storage
        chrome.storage.sync.get(['bookmarks'], function(result) {
            const bookmarks = result.bookmarks || [];
            updateBookmarkIcon(bookmarks, currentUrl);
            updateBookmarksArea(bookmarks);
        });

        // Handle bookmarking/unbookmarking
        bookmarkIcon.addEventListener('click', function() {
            chrome.storage.sync.get(['bookmarks'], function(result) {
                let bookmarks = result.bookmarks || [];
                const index = bookmarks.findIndex(bookmark => bookmark.url === currentUrl);

                if (index === -1) {
                    // Add bookmark
                    bookmarks.push({ url: currentUrl, title: pageName });
                    bookmarkIcon.src = "/imgs/bookmark-checked.png";
                } else {
                    // Remove bookmark
                    bookmarks.splice(index, 1);
                    bookmarkIcon.src = "/imgs/bookmark-unchecked.png";
                }

                // Save updated bookmarks to storage
                chrome.storage.sync.set({ bookmarks }, function() {
                    updateBookmarksArea(bookmarks);
                });
            });
        });
    });

    // Update bookmark icon based on whether the current URL is bookmarked
    function updateBookmarkIcon(bookmarks, currentUrl) {
        const isBookmarked = bookmarks.some(bookmark => bookmark.url === currentUrl);
        bookmarkIcon.src = isBookmarked ? "/imgs/bookmark-checked.png" : "/imgs/bookmark-unchecked.png";
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
                bookmarksArea.appendChild(link);

                // Add a <br> element after each link
                const lineBreak = document.createElement('br');
                bookmarksArea.appendChild(lineBreak);
            });
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {

    const bookmarksIcon = document.getElementById('bookmarksIcon');
    const closeBookmarksIcon = document.getElementById('closeBookmarksIcon');
    const rateForm = document.getElementById('rateForm');
    const pageName = document.getElementById('pageName');
    const footer = document.getElementById('footer');
    const bookmarksArea = document.getElementById('bookmarksArea');

    bookmarksIcon.addEventListener('click', function() {
        rateForm.style.display = 'none';
        pageName.style.display = 'none';
        footer.style.display = 'none';
        bookmarksArea.style.display = 'block';
    });

    closeInfoIcon.addEventListener('click', function() {
        window.location.reload();
    });

});

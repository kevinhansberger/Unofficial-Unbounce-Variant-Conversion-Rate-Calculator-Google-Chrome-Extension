document.addEventListener('DOMContentLoaded', function() {

    const bookmarksIcon = document.getElementById('bookmarksIcon');
    const closeIcon = document.getElementById('closeIcon');
    const rateForm = document.getElementById('rateForm');
    const pageName = document.getElementById('pageName');
    const footer = document.getElementById('footer');
    const closeArea = document.getElementById('closeArea');
    const bookmarksArea = document.getElementById('bookmarksArea');

    bookmarksIcon.addEventListener('click', function() {
        rateForm.style.display = 'none';
        pageName.style.display = 'none';
        footer.style.display = 'none';
        closeArea.style.display = 'block';
        bookmarksArea.style.display = 'block';
    });

    closeIcon.addEventListener('click', function() {
        window.location.reload();
    });

});

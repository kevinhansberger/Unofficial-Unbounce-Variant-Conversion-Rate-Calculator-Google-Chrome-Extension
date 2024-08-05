document.addEventListener('DOMContentLoaded', function() {

    const infoIcon = document.getElementById('infoIcon');
    const closeInfoIcon = document.getElementById('closeInfoIcon');
    const rateForm = document.getElementById('rateForm');
    const pageName = document.getElementById('pageName');
    const footer = document.getElementById('footer');
    const infoArea = document.getElementById('infoArea');

    infoIcon.addEventListener('click', function() {
        rateForm.style.display = 'none';
        pageName.style.display = 'none';
        footer.style.display = 'none';
        infoArea.style.display = 'block';
    });

    closeInfoIcon.addEventListener('click', function() {
        window.location.reload();
    });

});

document.addEventListener('DOMContentLoaded', function() {

    const infoIcon = document.getElementById('infoIcon');
    const closeIcon = document.getElementById('closeIcon');
    const rateForm = document.getElementById('rateForm');
    const pageName = document.getElementById('pageName');
    const footer = document.getElementById('footer');
    const closeArea = document.getElementById('closeArea');
    const infoArea = document.getElementById('infoArea');

    infoIcon.addEventListener('click', function() {
        rateForm.style.display = 'none';
        pageName.style.display = 'none';
        footer.style.display = 'none';
        closeArea.style.display = 'block';
        infoArea.style.display = 'block';
    });

    closeIcon.addEventListener('click', function() {
        window.location.reload();
    });

});

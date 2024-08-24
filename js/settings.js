document.addEventListener('DOMContentLoaded', function() {

    const settingsIcon = document.getElementById('settingsIcon');
    const closeIcon = document.getElementById('closeIcon');
    const rateForm = document.getElementById('rateForm');
    const pageName = document.getElementById('pageName');
    const footer = document.getElementById('footer');
    const closeArea = document.getElementById('closeArea');
    const settingsArea = document.getElementById('settingsArea');
    const numberVisitors = document.getElementById('numberVisitors');

    // Load saved value or set default to 30
    const savedNumberVisitors = localStorage.getItem('numberVisitors');
    numberVisitors.value = savedNumberVisitors !== null ? savedNumberVisitors : 30;

    settingsIcon.addEventListener('click', function() {
        rateForm.style.display = 'none';
        pageName.style.display = 'none';
        footer.style.display = 'none';
        closeArea.style.display = 'block';
        settingsArea.style.display = 'block';
    });

    closeIcon.addEventListener('click', function() {
        window.location.reload();
    });

    numberVisitors.addEventListener('change', function() {
        localStorage.setItem('numberVisitors', numberVisitors.value);
    });

});

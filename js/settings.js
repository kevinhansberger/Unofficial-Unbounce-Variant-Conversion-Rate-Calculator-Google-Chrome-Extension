document.addEventListener('DOMContentLoaded', function() {

    const settingsIcon = document.getElementById('settingsIcon');
    const closeSettingsIcon = document.getElementById('closeSettingsIcon');
    const rateForm = document.getElementById('rateForm');
    const pageName = document.getElementById('pageName');
    const footer = document.getElementById('footer');
    const settingsArea = document.getElementById('settingsArea');
    const numberVisitors = document.getElementById('numberVisitors');

    // Load saved value or set default to 30
    const savedNumberVisitors = localStorage.getItem('numberVisitors');
    numberVisitors.value = savedNumberVisitors !== null ? savedNumberVisitors : 30;

    settingsIcon.addEventListener('click', function() {
        rateForm.style.display = 'none';
        pageName.style.display = 'none';
        footer.style.display = 'none';
        settingsArea.style.display = 'block';
    });

    closeSettingsIcon.addEventListener('click', function() {
        window.location.reload();
    });

    numberVisitors.addEventListener('change', function() {
        localStorage.setItem('numberVisitors', numberVisitors.value);
    });

});

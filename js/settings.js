document.addEventListener('DOMContentLoaded', function() {

    const settingsIcon = document.getElementById('settingsIcon');
    const closeSettingsIcon = document.getElementById('closeSettingsIcon');
    const rateForm = document.getElementById('rateForm');
    const pageName = document.getElementById('pageName');
    const footer = document.getElementById('footer');
    const settingsArea = document.getElementById('settingsArea');
    const numberConversions = document.getElementById('numberConversions');

    // Load saved value or set default to 30
    const savedNumberConversions = localStorage.getItem('numberConversions');
    numberConversions.value = savedNumberConversions !== null ? savedNumberConversions : 30;

    settingsIcon.addEventListener('click', function() {
        rateForm.style.display = 'none';
        pageName.style.display = 'none';
        footer.style.display = 'none';
        settingsArea.style.display = 'block';
    });

    closeSettingsIcon.addEventListener('click', function() {
        window.location.reload();
    });

    numberConversions.addEventListener('change', function() {
        localStorage.setItem('numberConversions', numberConversions.value);
    });

});

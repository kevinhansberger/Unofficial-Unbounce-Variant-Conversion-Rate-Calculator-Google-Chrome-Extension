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

  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }

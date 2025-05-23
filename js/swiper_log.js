  function showTooltip(event, message) {
      const modal = document.getElementById("tooltip-modal");
      const content = document.getElementById("tooltip-content");
      content.textContent = message;
      modal.style.display = "block";
    }

    function closeTooltip() {
      document.getElementById("tooltip-modal").style.display = "none";
    }
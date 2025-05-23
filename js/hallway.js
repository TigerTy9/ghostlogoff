       function viewSuspects() {
        // Replace with actual navigation logic
        loadPage('suspectlineup.html'); // Adjust the path as needed
    }
    
    function goToLab() {
        // Replace with actual navigation logic
        loadPage('evidence.html'); // Adjust the path as needed
    }

    function showTooltip(event, text) {
      const tooltip = document.getElementById('information-box');
        // Remove highlight from all dots
        document.querySelectorAll('.evidence-dot').forEach(dot => {
          dot.classList.remove('selected-dot');
        });

        // Highlight the clicked dot
        event.target.classList.add('selected-dot');
                playClickSound();

         // Show evidence info
  if (text.includes("Notebook")) {
    tooltip.innerHTML = `
      <h2>Notebook Evidence</h2>
      <p>${text}</p>
      <button onclick="viewNotebook()" style="
        margin-top: 12px;
        background-color: #58a6ff;
        border: none;
        color: #0d1117;
        padding: 10px 16px;
        font-size: 14px;
        border-radius: 6px;
        cursor: pointer;
      ">View Notebook</button>
      <img src="Images/Notebook.png" style="width: 100%; border-radius: 6px; margin-top: 38px; margin-bottom: 12px;">
    `;
  } else if (text.includes("Fiber")) {
    tooltip.innerHTML = `
      <h2>Fibers Evidence</h2>
      <p>${text}</p>
      <button onclick="viewFibers()" style="
        margin-top: 12px;
        background-color: #58a6ff;
        border: none;
        color: #0d1117;
        padding: 10px 16px;
        font-size: 14px;
        border-radius: 6px;
        cursor: pointer;
      ">View Fibers</button>
    `;
     } else if (text.includes("Digital Evidence")) {
    tooltip.innerHTML = `
      <h2>Key Swipper Log</h2>
      <p>${text}</p>
      <button onclick="viewSwipperLog()" style="
        margin-top: 12px;
        background-color: #58a6ff;
        border: none;
        color: #0d1117;
        padding: 10px 16px;
        font-size: 14px;
        border-radius: 6px;
        cursor: pointer;
      ">View Swipper Log</button>
    `;
  } else {
    tooltip.innerHTML = `<p>${text}</p>`;
  }

      tooltip.style.display = 'block';
    }

    window.onclick = function(e) {
      if (!e.target.classList.contains('evidence-dot')) {
        //document.getElementById('information-box').style.display = 'none';
        
      }
    }

      function viewNotebook() {
        //alert("Opening fingerprint comparison view..."); 
        loadPage('handwriting.html'); // Adjust the path as needed
        // In production, replace alert with navigation or modal logic
        // window.location.href = 'fingerprints.html';
                playClickSound();

    }

      function viewSwipperLog() {
        //alert("Opening fingerprint comparison view..."); 
        loadPage('swiper_log.html'); // Adjust the path as needed
        // In production, replace alert with navigation or modal logic
        // window.location.href = 'fingerprints.html';
        playClickSound();
    }

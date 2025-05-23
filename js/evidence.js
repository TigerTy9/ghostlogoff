    function goToHallway() {
        // Replace with actual navigation logic
        loadPage('hallway.html'); // Adjust the path as needed
    }

  function showTooltip(event, text) {
  const tooltip = document.getElementById('information-box');

  // Remove highlight from all dots
  document.querySelectorAll('.evidence-dot').forEach(dot => {
    dot.classList.remove('selected-dot');
  });

  // Highlight the clicked dot
  event.target.classList.add('selected-dot');

  
  // Show evidence info
  if (text.includes("Fingerprint")) {
    tooltip.innerHTML = `
      <h2>Fingerprint Evidence</h2>
      <p>${text}</p>
      <button onclick="viewFingerprints()" style="
        margin-top: 12px;
        background-color: #58a6ff;
        border: none;
        color: #0d1117;
        padding: 10px 16px;
        font-size: 14px;
        border-radius: 6px;
        cursor: pointer;
      ">View Prints</button>
        <img src="Images/TrackPad.png" style="width: 100%; border-radius: 6px; margin-top: 68px; margin-bottom: 12px;">
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
        <img src="Images/FiberOnCarpet.png" style="width: 100%; border-radius: 6px; margin-top: 68px; margin-bottom: 12px;">
    `;
    } else if (text.includes("The laptop appears to have")) {
    tooltip.innerHTML = `
      <h2>Data on Computer</h2>
      <p>${text}</p>
      <button onclick="viewComputerAnalysis()" style="
        margin-top: 12px;
        background-color: #58a6ff;
        border: none;
        color: #0d1117;
        padding: 10px 16px;
        font-size: 14px;
        border-radius: 6px;
        cursor: pointer;
      ">Preform Computer Forensics</button>
    `;

     } else if (text.includes("Blood Pattern")) {
    tooltip.innerHTML = `
      <h2>Blood Spatter</h2>
      <p>${text}</p>
      <button onclick="viewBloodComparison()" style="
        margin-top: 12px;
        background-color: #58a6ff;
        border: none;
        color: #0d1117;
        padding: 10px 16px;
        font-size: 14px;
        border-radius: 6px;
        cursor: pointer;
      ">Perform Blood Comparison</button>
    `;
  } else if (text.includes("Body:")) {
    tooltip.innerHTML = `
      <h2>Body Testing</h2>
      <p>${text}</p>
      <button onclick="viewTODE()" style="
        margin-top: 12px;
        background-color: #58a6ff;
        border: none;
        color: #0d1117;
        padding: 10px 16px;
        font-size: 14px;
        border-radius: 6px;
        cursor: pointer;
      ">Perform TODE Calculations</button>
    `;
  } else {
    tooltip.innerHTML = `<p>${text}</p>`;
  }

  tooltip.style.display = 'block';
}


  function showLicenseCard() {
    const license = document.getElementById('license-popup');
    const isHidden = license.classList.contains('hidden');

    if (isHidden) {
      license.classList.remove('hidden');
      // Position license card to a fixed position above the hallway button
      license.style.top = '58%';  // Adjust as needed
      license.style.left = '50%';
      license.style.transform = 'translate(-50%, -50%)';
    } else {
      license.classList.add('hidden');
    }
  }

  // Optional: close popup when clicking outside
  document.addEventListener('click', function (e) {
    const license = document.getElementById('license-popup');
    const dot = document.querySelector('.evidence-dot[onclick*="showLicenseCard"]');

    if (!license.contains(e.target) && e.target !== dot) {
      license.classList.add('hidden');
    }
  });

    window.onclick = function(e) {
      if (!e.target.classList.contains('evidence-dot')) {
     //   document.getElementById('information-box').style.display = 'none';
      }
    }

    function viewFingerprints() {
        //alert("Opening fingerprint comparison view..."); 
        loadPage('fingerprints.html'); // Adjust the path as needed
        // In production, replace alert with navigation or modal logic
        // window.location.href = 'fingerprints.html';
                playClickSound();

    }

        function viewTODE() {
        //alert("Opening fingerprint comparison view..."); 
        loadPage('tode.html'); // Adjust the path as needed
        // In production, replace alert with navigation or modal logic
        // window.location.href = 'fingerprints.html';
                playClickSound();

    }

     function viewFibers() {
        //alert("Opening fingerprint comparison view..."); 
        loadPage('fibers.html'); // Adjust the path as needed
        // In production, replace alert with navigation or modal logic
        // window.location.href = 'fingerprints.html';
                playClickSound();

    }

 function viewComputerAnalysis() {
        //alert("Opening fingerprint comparison view..."); 
        loadPage('computeranalysis.html'); // Adjust the path as needed
        // In production, replace alert with navigation or modal logic
        // window.location.href = 'fingerprints.html';
                playClickSound();

    }

     function viewBloodComparison() {
        //alert("Opening fingerprint comparison view..."); 
        loadPage('bloodcomparison.html'); // Adjust the path as needed
        // In production, replace alert with navigation or modal logic
        // window.location.href = 'fingerprints.html';
                playClickSound();

    }
  
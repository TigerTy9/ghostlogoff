
const shirtNames = {
  1: "Red Flannel",
  2: "Black Hoodie",
  3: "Gray Sweater",
  4: "Blue Jacket"
};

let currentZone = null;

function clearAllMatches() {
  const confirmClear = confirm("Are you sure you want to clear all matches and possible matches?");
  if (confirmClear) {
    localStorage.removeItem('fiber_matchedZone');
    localStorage.removeItem('fiber_possibleMatchedZones');
    updateMatchDisplay();
  }
}


function openModal(zoneNumber) {
  currentZone = zoneNumber;
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  modalImg.src = `images/clothing/thread_zoom_${zoneNumber}.png`;
  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function selectMatch() {
  if (currentZone !== null) {
    const matchedZone = localStorage.getItem('fiber_matchedZone');

    if (matchedZone == currentZone) {
      // Toggle off if it's already matched
      localStorage.removeItem('fiber_matchedZone');
    } else {
      localStorage.setItem('fiber_matchedZone', currentZone);
    }

    updateMatchDisplay();
    closeModal();
  }
}



function selectPossibleMatch() {
  if (currentZone !== null) {
    let possibleMatches = JSON.parse(localStorage.getItem('fiber_possibleMatchedZones') || '[]');
    const index = possibleMatches.indexOf(currentZone);

    if (index === -1) {
      possibleMatches.push(currentZone); // Add to possible
    } else {
      possibleMatches.splice(index, 1); // Remove from possible (toggle off)
    }

    localStorage.setItem('fiber_possibleMatchedZones', JSON.stringify(possibleMatches));
    updateMatchDisplay();
    closeModal();
  }
}


function updateMatchDisplay() {
  const matchedZone = localStorage.getItem('fiber_matchedZone');
  const possibleMatchedZones = JSON.parse(localStorage.getItem('fiber_possibleMatchedZones') || '[]');

  for (let i = 1; i <= 4; i++) {
    const result = document.getElementById(`result-${i}`);
    if (matchedZone == i) {
      result.innerHTML = `<div class="matched-text">MATCHED</div>`;
    } else if (possibleMatchedZones.includes(i)) {
      result.innerHTML = `<div class="matched-text" style="color:#ffaa00;">POSSIBLE MATCH</div>`;
    } else {
      result.innerHTML = `<div class="nomatch-text">NO MATCH</div>`;
    }
  }
}



window.addEventListener('load', () => {
  if (!localStorage.getItem('fiber_possibleMatchedZones')) {
    localStorage.setItem('fiber_possibleMatchedZones', JSON.stringify([]));
  }
  checkFullscreen();
  updateMatchDisplay();
});

function loadPageClothingLineup() {
if (!localStorage.getItem('fiber_possibleMatchedZones')) {
    localStorage.setItem('fiber_possibleMatchedZones', JSON.stringify([]));
  }
  checkFullscreen();
  updateMatchDisplay();
}

// Make it globally accessible
window.loadPageClothingLineup = loadPageClothingLineup;
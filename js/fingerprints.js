 if ('visualViewport' in window) {
  const toolbar = document.getElementById('toolbar');
  const toolbarHeight = toolbar.offsetHeight;

  function lockToolbarToBottomCenter() {
    const vv = window.visualViewport;

    const top = vv.offsetTop + vv.height - toolbarHeight - 10; // 10px margin from bottom
    const left = vv.offsetLeft + (vv.width / 2) - (toolbar.offsetWidth / 2);

    toolbar.style.top = `${top}px`;
    toolbar.style.left = `${left}px`;
  }

  visualViewport.addEventListener('scroll', lockToolbarToBottomCenter);
  visualViewport.addEventListener('resize', lockToolbarToBottomCenter);
  window.addEventListener('load', lockToolbarToBottomCenter);
}

  
  function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  let currentMarkMode = null;
  const savedMarks = JSON.parse(localStorage.getItem('fingerprintMarks') || '[]');
  let markToRemove = null;

 function setMarkMode(mode) {
    currentMarkMode = mode;
    document.querySelectorAll('#toolbar button').forEach(btn => {
      btn.classList.remove('active-mode');
    });
    const modeButton = Array.from(document.querySelectorAll('#toolbar button'))
      .find(btn => btn.innerText.toLowerCase().includes(mode));
    if (modeButton) {
      modeButton.classList.add('active-mode');
    }
  }

  function disableMarkMode() {
    currentMarkMode = null;
    document.querySelectorAll('#toolbar button').forEach(btn => btn.classList.remove('active-mode'));
  }

  function clearMarks() {
    if (!confirm('Are you sure you want to clear all markings?')) return;
    document.querySelectorAll('.mark-circle').forEach(el => el.remove());
    localStorage.removeItem('fingerprintMarks');
  }
let dragTarget = null;
  let offsetX, offsetY;

  document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('mark-circle')) {
      dragTarget = e.target;
      const rect = dragTarget.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      e.preventDefault();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (dragTarget) {
      const parentRect = dragTarget.parentElement.getBoundingClientRect();
      let x = e.clientX - parentRect.left - offsetX;
      let y = e.clientY - parentRect.top - offsetY;
            dragTarget.classList.add('selected-mark'); // Show highlight while dragging

      dragTarget.style.left = `${x}px`;
      dragTarget.style.top = `${y}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (dragTarget) {
      saveMarksToStorage();
    }
    dragTarget = null;
  });

  function saveMarksToStorage() {
  const allMarks = [];
  document.querySelectorAll('.fingerprint-wrapper').forEach(wrapper => {
    const bounds = wrapper.getBoundingClientRect(); // capture actual display size
    const wrapperIndex = Array.from(document.querySelectorAll('.fingerprint-wrapper')).indexOf(wrapper);
    const marks = wrapper.querySelectorAll('.mark-circle');

    marks.forEach(mark => {
      allMarks.push({
        wrapperIndex,
        left: mark.style.left,
        top: mark.style.top,
        type: mark.classList.contains('mark-ridge') ? 'ridge' : 'bifurcation',
        wrapperWidth: bounds.width,
        wrapperHeight: bounds.height
      });
    });
  });

  localStorage.setItem('fingerprintMarks', JSON.stringify(allMarks));
}


  function restoreMarks() {
    console.log("Yes!");
    const wrappers = document.querySelectorAll('.fingerprint-wrapper');
    savedMarks.forEach(({ wrapperIndex, left, top, type }) => {
      const wrapper = wrappers[wrapperIndex];
      if (wrapper) {
        const mark = createMarkElement(left, top, type);
        wrapper.appendChild(mark);
      }
    });
  }

  function createMarkElement(left, top, type) {
    const mark = document.createElement('div');
    mark.classList.add('mark-circle', type === 'ridge' ? 'mark-ridge' : 'mark-bifurcation');
    mark.style.left = left;
    mark.style.top = top;

    mark.addEventListener('click', function (e) {
      e.stopPropagation();

      // 🔴 NEW: remove mode
      if (currentMarkMode === 'remove') {
        this.remove();
        saveMarksToStorage();
        return;
      }

      // selection toggle logic
      if (markToRemove && markToRemove !== this) {
        markToRemove.classList.remove('selected-mark');
      }
      if (this.classList.contains('selected-mark')) {
        this.classList.remove('selected-mark');
        markToRemove = null;
      } else {
        this.classList.add('selected-mark');
        markToRemove = this;
      }
    });

    mark.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.remove();
      saveMarksToStorage();
    });

    return mark;
  }

  function removeSelectedMark() {
    if (markToRemove) {
      markToRemove.remove();
      markToRemove = null;
      saveMarksToStorage();
    }
  }

  document.querySelectorAll('.print-card img, .print-card-suspect img').forEach(img => {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    wrapper.classList.add('fingerprint-wrapper');
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    wrapper.addEventListener('click', function (e) {
      // Adding new mark only if mode is ridge/bifurcation
      if (currentMarkMode !== 'ridge' && currentMarkMode !== 'bifurcation') return;
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const mark = createMarkElement(`${x - 6}px`, `${y - 6}px`, currentMarkMode);
      wrapper.appendChild(mark);
      saveMarksToStorage();
    });
  });

  window.addEventListener('load', restoreMarks);

  // LocalStorage keys
  const MATCH_KEY = 'fingerprintMatch';
  const POSSIBLE_MATCH_KEY = 'fingerprintPossibleMatches';

  function loadMatchData() {
    return {
      match: localStorage.getItem(MATCH_KEY),
      possibles: JSON.parse(localStorage.getItem(POSSIBLE_MATCH_KEY) || '[]'),
    };
  }

  function saveMatchData(match, possibles) {
    localStorage.setItem(MATCH_KEY, match || '');
    localStorage.setItem(POSSIBLE_MATCH_KEY, JSON.stringify(possibles));
  }

  function toggleMatch(id) {
    let { match, possibles } = loadMatchData();
    const isSelected = match === id;

    // Toggle off if already selected
    match = isSelected ? null : id;

    // If setting a new match, remove from possibles
    if (match && possibles.includes(match)) {
      possibles = possibles.filter(p => p !== match);
    }

    saveMatchData(match, possibles);
    updateUI();
  }

  function togglePossible(id) {
    let { match, possibles } = loadMatchData();
    const index = possibles.indexOf(id);

    if (index >= 0) {
      possibles.splice(index, 1); // remove
    } else {
      possibles.push(id); // add
      // If already marked as match, remove
      if (match === id) {
        match = null;
      }
    }

    saveMatchData(match, possibles);
    updateUI();
  }

  function updateUI() {
    const { match, possibles } = loadMatchData();

    document.querySelectorAll('.print-card-suspect').forEach(card => {
      const id = card.getAttribute('data-id');
      const matchBtn = card.querySelector('.btn-match');
      const possBtn = card.querySelector('.btn-possible');

      matchBtn.classList.toggle('active', match === id);
      possBtn.classList.toggle('active', possibles.includes(id));
    });
  }

 function initSuspectButtons() {
  const cards = document.querySelectorAll('.print-card-suspect');
  cards.forEach((card, index) => {
    const id = `suspect-${index + 1}`;
    card.setAttribute('data-id', id);

    const matchBtn = document.createElement('button');
    matchBtn.textContent = 'Match';
    matchBtn.className = 'btn-match';
    matchBtn.onclick = () => toggleMatch(id);

    const possBtn = document.createElement('button');
    possBtn.textContent = 'Possible Match';
    possBtn.className = 'btn-possible';
    possBtn.onclick = () => togglePossible(id);

    // Wrap both buttons in a row
    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-row';
    buttonRow.appendChild(matchBtn);
    buttonRow.appendChild(possBtn);

    card.appendChild(buttonRow);
  });

  updateUI();
}

function loadPageFingerprints() {
    restoreMarks();
    initSuspectButtons();
    lockToolbarToBottomCenter();
}

// Make it globally accessible
window.loadPageFingerprints = loadPageFingerprints;
  window.addEventListener('DOMContentLoaded', initSuspectButtons);

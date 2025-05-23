  window.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.getElementById('back-button');
  const backLabel = document.getElementById('back-destination');
  const referrer = document.referrer;

  const originMatches = referrer && new URL(referrer).origin === window.location.origin;
  const path = originMatches ? new URL(referrer).pathname : '';
  const fallbackHref = 'evidence.html';

  const labelMap = {
    '/hallway.html': 'Hallway',
    '/evidence.html': 'Lab',
    '/fingerprints.html': 'Fingerprints',
    '/bloodcomparison.html': 'Blood Comparison',
    '/suspectlineup.html': 'Suspect Lineup',
    '/handwriting.html': 'Handwritting',
    '/notes.html': 'Case Notes',
    '/index.html': 'Main Menu',
    '/clothing-lineup.html': 'Clothing Lineup',
    '/fibers.html': 'Fibers',
  };

  if (originMatches && referrer !== window.location.href) {
    backBtn.href = referrer;

    const label = labelMap[path] || referrer.replace(/^https?:\/\/[^/]+/, '');
    backLabel.textContent = label;
  } else {
    backBtn.href = fallbackHref;
    backLabel.textContent = 'Lab';
  }
});

  const suspects = ['eli', 'monroe', 'weller', 'tess'];

  function saveSuspectChoice() {
  const selected = document.getElementById("suspect-choice").value;
  localStorage.setItem("ghostlogoff_suspect_choice", selected);
}

function loadSuspectChoice() {
  const saved = localStorage.getItem("ghostlogoff_suspect_choice");
  if (saved) {
    document.getElementById("suspect-choice").value = saved;
  }
}

function saveAnswers() {
  for (let i = 1; i <= 5; i++) {
    const val = document.getElementById(`q${i}`).value;
    localStorage.setItem(`ghostlogoff_q${i}`, val);
  }
}

function loadAnswers() {
  for (let i = 1; i <= 5; i++) {
    const saved = localStorage.getItem(`ghostlogoff_q${i}`);
    if (saved) {
      document.getElementById(`q${i}`).value = saved;
    }
  }
}

function saveUserConclusion() {
  const val = document.getElementById("user-conclusion").value;
  localStorage.setItem("ghostlogoff_user_conclusion", val);
}

function loadUserConclusion() {
  const saved = localStorage.getItem("ghostlogoff_user_conclusion");
  if (saved) {
    document.getElementById("user-conclusion").value = saved;
  }
}


  function saveNote(key) {
    const value = document.getElementById(`textarea-${key}`).value;
    localStorage.setItem(`ghostlogoff_notes_${key}`, value);
  }

  function loadNotes() {
    suspects.forEach(s => {
      const saved = localStorage.getItem(`ghostlogoff_notes_${s}`);
      if (saved) {
        document.getElementById(`textarea-${s}`).value = saved;
      }
    });
  }

  function focusNotes(key) {
    suspects.forEach(s => {
      const box = document.getElementById(`notes-${s}`);
      box.classList.remove('active');
    });
    const targetBox = document.getElementById(`notes-${key}`);
    targetBox.classList.add('active');
    targetBox.querySelector('textarea').focus();
  }

 function promptPassword() {
  const correctPassword = "teacher2025";
  const input = prompt("Enter teacher password to view the solution:");

  if (input === correctPassword) {
    localStorage.setItem("ghostlogoff_unlocked_solution", "true");
    window.location.href = "solution.html";
  } else {
    alert("❌ Incorrect password. Access denied.");
  }
}


  async function exportNotesToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Ghost Logoff – My Suspect Notes", 20, 20);

    let y = 30;
    suspects.forEach((s, i) => {
      const suspectName = {
        eli: "Eli Navarro",
        monroe: "Mrs. Monroe",
        weller: "Mr. Weller",
        tess: "Tess Monroe"
      }[s];

      const note = localStorage.getItem(`ghostlogoff_notes_${s}`) || "";

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${i + 1}. ${suspectName}`, 20, y);
      y += 8;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);

      const lines = doc.splitTextToSize(note, 170);
      doc.text(lines, 20, y);
      y += lines.length * 7 + 10;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("ghostlogoff_notes.pdf");
  }

  window.onload = () => {
    loadNotes();
    loadSuspectChoice();
    loadUserConclusion();
    loadAnswers();
    focusNotes('eli'); // default visible
    
  };

async function exportFingerprintPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const fingerprintMarks = JSON.parse(localStorage.getItem("fingerprintMarks") || "[]");
  const imagePaths = [
    "prints/unknown_fingerprint.png",
    "prints/marcus_fingerprint.png",
    "prints/suspect1_fingerprint.png",
    "prints/suspect2_fingerprint.png",
    "prints/suspect3_fingerprint.png",
    "prints/suspect4_fingerprint.png",
  ];

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.src = src;
    });
  };

  const displayWidth = 204;
  const displayHeight = 277;
  const debugColors = ["#ffdddd", "#ddffdd", "#ddddff", "#ffffdd", "#ddffff", "#ffddff"];

  for (let i = 0; i < imagePaths.length; i++) {
    const img = await loadImage(imagePaths[i]);
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    const scaleX = naturalWidth / displayWidth;
    const scaleY = naturalHeight / displayHeight;

    const canvas = document.createElement("canvas");
    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    const ctx = canvas.getContext("2d");

    // Distinct background color
    ctx.fillStyle = debugColors[i % debugColors.length];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Slight image transparency
    ctx.globalAlpha = 0.85;
    ctx.drawImage(img, 0, 0);
    ctx.globalAlpha = 1.0;

    // Optional: outline the canvas/image boundary
    ctx.strokeStyle = "#0000ff";
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    fingerprintMarks
      .filter(mark => mark.wrapperIndex === i)
      .forEach(mark => {
   const rawX = parseFloat(mark.left.replace('px', '')) + 5;
const rawY = parseFloat(mark.top.replace('px', '')) + 8;

const scaleX = naturalWidth / mark.wrapperWidth;
const scaleY = naturalHeight / mark.wrapperHeight;

const x = rawX * scaleX;
const y = rawY * scaleY;


        ctx.beginPath();
        ctx.arc(x, y, 14, 0, 2 * Math.PI);
        ctx.lineWidth = 4;
        ctx.strokeStyle = mark.type === "ridge" ? "#00ff00" : "#ff00ff";
        ctx.stroke();
      });

    const dataUrl = canvas.toDataURL("image/png");
    const imgPDFWidth = 60;
    const imgPDFHeight = (canvas.height / canvas.width) * imgPDFWidth;

    if (i > 0) doc.addPage();
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text(`Fingerprint ${i + 1}`, 20, 20);
    doc.addImage(dataUrl, "PNG", 20, 30, imgPDFWidth, imgPDFHeight);
  }

  doc.save("fingerprint_markups.pdf");
}

async function exportCaseSummaryPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // STEP 1: Notes Section
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Ghost Logoff – Suspect Notes", 20, 20);

  const suspects = ['eli', 'monroe', 'weller', 'tess'];
  let y = 30;
  suspects.forEach((s, i) => {
    const suspectName = {
      eli: "Eli Navarro",
      monroe: "Mrs. Monroe",
      weller: "Mr. Weller",
      tess: "Tess Monroe"
    }[s];

    const note = localStorage.getItem(`ghostlogoff_notes_${s}`) || "";

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`${i + 1}. ${suspectName}`, 20, y);
    y += 8;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(note, 170);
    doc.text(lines, 20, y);
    y += lines.length * 7 + 10;

    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });

  // STEP 2: Fingerprint Images – All on one page in 2 columns
  const fingerprintMarks = JSON.parse(localStorage.getItem("fingerprintMarks") || "[]");
  const imagePaths = [
    { src: "prints/unknown_fingerprint.png", label: "Unknown Partial Print" },
    { src: "prints/marcus_fingerprint.png", label: "Marcus Ellery" },
    { src: "prints/suspect1_fingerprint.png", label: "Eli Navarro" },
    { src: "prints/suspect2_fingerprint.png", label: "Mrs. Monroe" },
    { src: "prints/suspect3_fingerprint.png", label: "Mr. Weller" },
    { src: "prints/suspect4_fingerprint.png", label: "Tess Monroe" }
  ];

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.src = src;
    });
  };

  doc.addPage();
  doc.setFontSize(16);
  doc.setFont("Helvetica", "bold");
  doc.text("Fingerprint Comparisons", 20, 20);

  const imgPDFWidth = 40;
  const padding = 20;
  const marginX = 20;
  const startY = 40;
  let col = 0;
  let row = 0;

  for (let i = 0; i < imagePaths.length; i++) {
    const { src, label } = imagePaths[i];
    const img = await loadImage(src);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    ctx.strokeStyle = "#0000ff";
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    fingerprintMarks
      .filter(mark => mark.wrapperIndex === i)
      .forEach(mark => {
        const rawX = parseFloat(mark.left.replace('px', '')) + 5;
        const rawY = parseFloat(mark.top.replace('px', '')) + 8;
        const scaleX = canvas.width / mark.wrapperWidth;
        const scaleY = canvas.height / mark.wrapperHeight;
        const x = rawX * scaleX;
        const y = rawY * scaleY;

        ctx.beginPath();
        ctx.arc(x, y, 14, 0, 2 * Math.PI);
        ctx.lineWidth = 4;
        ctx.strokeStyle = mark.type === "ridge" ? "#00ff00" : "#ff00ff";
        ctx.stroke();
      });

    const dataUrl = canvas.toDataURL("image/png");
    const imgPDFHeight = (canvas.height / canvas.width) * imgPDFWidth;

    const x = marginX + col * (imgPDFWidth + padding);
    let yPos = startY + row * (imgPDFHeight + 20);

    if (yPos + imgPDFHeight + 20 > 280) {
    doc.addPage();
    row = 0;
    yPos = startY; // recalculate for new page
    }

    doc.setFontSize(12);
    doc.text(`${label}`, x, yPos - 5);
    doc.addImage(dataUrl, "PNG", x, yPos, imgPDFWidth, imgPDFHeight);

    const legendX = marginX + 2 * (imgPDFWidth + padding); // 3rd column (right of 2 images)
    const legendRendered = row === 0; // Only render legend on first row

    col++;
    if (col === 2) {
    // Only add the key once in the first row
    if (legendRendered) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Key:", legendX, yPos);

        // Ridge Ending (green)
        doc.setDrawColor(0, 255, 0);
        doc.setLineWidth(2);
        doc.circle(legendX + 6, yPos + 9, 4, "S");
        doc.setFont("Helvetica", "normal");
        doc.text("Ridge Ending", legendX + 15, yPos + 10);

        // Bifurcation (magenta)
        doc.setDrawColor(255, 0, 255);
        doc.circle(legendX + 6, yPos + 23, 4, "S");
        doc.text("Bifurcation", legendX + 15, yPos + 24);

        // Reset draw color
        doc.setDrawColor(0);
    }

  col = 0;
  row++;
    }
  }

  doc.addPage();
doc.setFont("Helvetica", "bold");
doc.setFontSize(16);
doc.text("Handwriting Comparison", 20, 20);

doc.setFont("Helvetica", "normal");
doc.setFontSize(12);

    // STEP 3: Fiber Match Analysis
  const zoneToSuspect = {
    1: "Eli Navarro",
    2: "Mrs. Monroe",
    3: "Mr. Weller",
    4: "Tess Monroe"
  };

  const possibleMatchedZones = JSON.parse(localStorage.getItem("fiber_possibleMatchedZones") || "[]");
  const matchedZone = parseInt(localStorage.getItem("fiber_matchedZone"));

  let fiberSectionY = y > 230 ? 20 : y + 10;
  if (fiberSectionY === 20) doc.addPage();

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Fiber Match Analysis", 20, fiberSectionY);
  fiberSectionY += 10;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);

  if (possibleMatchedZones.length > 0) {
    doc.text("Possible fiber matches found on clothing of:", 20, fiberSectionY);
    fiberSectionY += 8;
    possibleMatchedZones.forEach(zone => {
      const name = zoneToSuspect[zone];
      if (name) {
        doc.text(`• ${name}`, 26, fiberSectionY);
        fiberSectionY += 7;
      }
    });
  } else {
    doc.text("No possible fiber matches were recorded.", 20, fiberSectionY);
    fiberSectionY += 8;
  }

  if (matchedZone && zoneToSuspect[matchedZone]) {
    fiberSectionY += 5;
    doc.setFont("Helvetica", "bold");
    doc.text(`Confirmed match: ${zoneToSuspect[matchedZone]}`, 20, fiberSectionY);
  } else {
    fiberSectionY += 5;
    doc.setFont("Helvetica", "italic");
    doc.text("No confirmed fiber match was identified.", 20, fiberSectionY);
  }

 // STEP 4: Handwriting Comparison Verdict and Notes
// doc.addPage(); // Uncomment if you want this on a new page

const verdict = localStorage.getItem("hw_verdict");
const notes = localStorage.getItem("hw_notes") || "(No handwriting notes provided)";

let verdictText;
let verdictColor;

if (verdict === "match") {
  verdictText = "Match (The handwriting samples appear to match)";
  verdictColor = [0, 200, 0]; // Green
} else if (verdict === "not-match") {
  verdictText = "Not Match (The handwriting samples appear different)";
  verdictColor = [255, 0, 0]; // Red
} else {
  verdictText = "No verdict selected.";
  verdictColor = [100, 100, 100]; // Gray
}

// Apply color and write verdict
doc.setTextColor(...verdictColor);
const verdictLines = doc.splitTextToSize(`Verdict: ${verdictText}`, 170);
doc.text(verdictLines, 20, 30);

// Reset text color for notes
doc.setTextColor(0, 0, 0);
const notesLines = doc.splitTextToSize(`Details: ${notes}`, 170);
doc.text(notesLines, 20, 40 + verdictLines.length * 7);


    // STEP 5: Analysis Questions + Responses
  doc.addPage();
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Analysis Questions", 20, 20);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);

  const questions = [
    "1. Which pieces of evidence were most helpful in narrowing down the suspects?",
    "2. How did fingerprint comparisons influence your conclusion?",
    "3. What do you think was Tess Monroe's motivation or reasoning?",
    "4. If you were the investigator, what other questions would you ask the suspects?",
    "5. What protocols could be put in place to prevent this situation in the future?"
  ];

  let qY = 30;
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const response = localStorage.getItem(`ghostlogoff_q${i + 1}`) || "";
    const qLines = doc.splitTextToSize(`${q}`, 170);
    const aLines = doc.splitTextToSize(`Answer: ${response}`, 170);

    doc.setFont("Helvetica", "bold");
    doc.text(qLines, 20, qY);
    qY += qLines.length * 7 + 4;

    doc.setFont("Helvetica", "normal");
    doc.text(aLines, 20, qY);
    qY += aLines.length * 7 + 10;

    if (qY > 260) {
      doc.addPage();
      qY = 20;
    }
  }

// STEP 6: Suspect Selection
doc.addPage();
doc.setFont("Helvetica", "bold");
doc.setFontSize(16);
doc.text("Primary Suspect Selection", 20, 20);

const selectedSuspect = localStorage.getItem("ghostlogoff_suspect_choice") || "(No suspect selected)";
const correctSuspect = "Tess Monroe";

doc.setFont("Helvetica", "normal");
doc.setFontSize(12);

let feedbackText = "";
if (selectedSuspect === correctSuspect) {
  doc.setTextColor(0, 200, 0); // green
  feedbackText = " (Correct)";
} else if (selectedSuspect && selectedSuspect !== "(No suspect selected)") {
  doc.setTextColor(255, 0, 0); // red
  feedbackText = " (Incorrect)";
}

doc.text(`Selected suspect: ${selectedSuspect}${feedbackText}`, 20, 30);

// Reset text color to default (black)
doc.setTextColor(0, 0, 0);



  // STEP 7: User-Written Conclusion
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Investigator's Conclusion", 20, 50);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);

  const userConclusion = localStorage.getItem("ghostlogoff_user_conclusion") || "(No conclusion provided)";
  const userLines = doc.splitTextToSize(userConclusion.trim(), 170);
  doc.text(userLines, 20, 60);

  doc.save("ghostlogoff_case_summary.pdf");
}

function loadPageSuspectLineup() {
 loadNotes();
    loadSuspectChoice();
    loadUserConclusion();
    loadAnswers();
    focusNotes('eli'); // default visible
    
    const backBtn = document.getElementById('back-button');
  const backLabel = document.getElementById('back-destination');
  const referrer = document.referrer;

  const originMatches = referrer && new URL(referrer).origin === window.location.origin;
  const path = originMatches ? new URL(referrer).pathname : '';
  const fallbackHref = 'evidence.html';

  const labelMap = {
    '/hallway.html': 'Hallway',
    '/evidence.html': 'Lab',
    '/fingerprints.html': 'Fingerprints',
    '/bloodcomparison.html': 'Blood Comparison',
    '/suspectlineup.html': 'Suspect Lineup',
    '/handwriting.html': 'Handwritting',
    '/notes.html': 'Case Notes',
    '/index.html': 'Main Menu',
    '/clothing-lineup.html': 'Clothing Lineup',
    '/fibers.html': 'Fibers',
  };

  if (originMatches && referrer !== window.location.href) {
    backBtn.href = referrer;

    const label = labelMap[path] || referrer.replace(/^https?:\/\/[^/]+/, '');
    backLabel.textContent = label;
  } else {
    backBtn.href = fallbackHref;
    backLabel.textContent = 'Lab';
  }
}

// Make it globally accessible
window.loadPageSuspectLineup = loadPageSuspectLineup;
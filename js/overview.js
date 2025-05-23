document.getElementById('reset-button').addEventListener('click', () => {
  const confirmReset = confirm("Are you sure you want to clear all saved data?");
  if (confirmReset) {
    localStorage.clear();
    sessionStorage.clear();
    alert("All data has been cleared.");
    location.reload(); // Optional: reload to reset state
  }
});

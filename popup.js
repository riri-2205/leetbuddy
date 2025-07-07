document.addEventListener('DOMContentLoaded', function() {
  const hintsToggle = document.getElementById('hintsToggle');
  const hfTokenInput = document.getElementById('hfToken');
  const saveTokenBtn = document.getElementById('saveToken');
  const tokenStatus = document.getElementById('tokenStatus');

  // Load current settings
  chrome.storage.local.get(['hintsEnabled', 'hfToken'], function(data) {
    hintsToggle.checked = data.hintsEnabled ?? true;
    if (data.hfToken) {
      hfTokenInput.value = data.hfToken;
      showStatus('Token configured ✅', 'success');
    }
  });

  // Handle hints toggle
  hintsToggle.addEventListener('change', function() {
    chrome.storage.local.set({ hintsEnabled: this.checked });
  });

  // Handle token saving
  saveTokenBtn.addEventListener('click', function() {
    const token = hfTokenInput.value.trim();
    
    if (!token) {
      showStatus('Please enter a token', 'error');
      return;
    }

    if (!token.startsWith('hf_')) {
      showStatus('Invalid token format. Should start with "hf_"', 'error');
      return;
    }

    chrome.storage.local.set({ hfToken: token }, function() {
      showStatus('Token saved successfully! ✅', 'success');
    });
  });

  // Handle enter key in token input
  hfTokenInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveTokenBtn.click();
    }
  });

  function showStatus(message, type) {
    tokenStatus.textContent = message;
    tokenStatus.className = `status-message ${type}`;
    setTimeout(() => {
      if (type === 'error') {
        tokenStatus.textContent = '';
        tokenStatus.className = 'status-message';
      }
    }, 3000);
  }
});
async function injectHint() {
  const pathParts = window.location.pathname.split("/");
  const problemSlug = pathParts[2];
  
  // Create hint box with loading state
  const hintBox = document.createElement("div");
  hintBox.id = "leet-hint-box";
  hintBox.innerHTML = "💡 <span class='hint-loading'>Generating AI hint...</span>";
  document.body.appendChild(hintBox);
  
  try {
    // Get hint (now async)
    const hint = await getHintFromTitle(problemSlug);
    hintBox.innerHTML = "💡 Hint: " + hint;
    
    // Add a refresh button for getting new AI hints
    const refreshBtn = document.createElement("button");
    refreshBtn.innerHTML = "🔄";
    refreshBtn.className = "hint-refresh-btn";
    refreshBtn.title = "Generate new AI hint";
    refreshBtn.onclick = async () => {
      refreshBtn.innerHTML = "⏳";
      refreshBtn.disabled = true;
      try {
        const newHint = await getHintFromTitle(problemSlug);
        hintBox.innerHTML = "💡 Hint: " + newHint;
        hintBox.appendChild(refreshBtn);
        refreshBtn.innerHTML = "🔄";
        refreshBtn.disabled = false;
      } catch (error) {
        console.error('Failed to refresh hint:', error);
        refreshBtn.innerHTML = "🔄";
        refreshBtn.disabled = false;
      }
    };
    hintBox.appendChild(refreshBtn);
    
  } catch (error) {
    console.error('Error generating hint:', error);
    hintBox.innerHTML = "💡 Hint: " + getHintFromTitleSync(problemSlug);
  }
}

window.addEventListener("load", () => {
  chrome.storage.local.get("hintsEnabled", (data) => {
    const isEnabled = data.hintsEnabled ?? true;
    if (isEnabled) {
      setTimeout(injectHint, 2000);
    }
  });
});
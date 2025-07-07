function injectHint() {
  const pathParts = window.location.pathname.split("/");
  const problemSlug = pathParts[2];
  const hint = getHintFromTitle(problemSlug);

  const hintBox = document.createElement("div");
  hintBox.id = "leet-hint-box";
  hintBox.textContent = "💡 Hint: " + hint;
  document.body.appendChild(hintBox);
}

window.addEventListener("load", () => {
  chrome.storage.local.get("hintsEnabled", (data) => {
    const isEnabled = data.hintsEnabled ?? true;
    if (isEnabled) {
      setTimeout(injectHint, 2000);
    }
  });
});
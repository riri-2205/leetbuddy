const toggle = document.getElementById("hintToggle");

chrome.storage.local.get("hintsEnabled", (data) => {
  toggle.checked = data.hintsEnabled ?? true;
});

toggle.addEventListener("change", () => {
  chrome.storage.local.set({ hintsEnabled: toggle.checked });
});
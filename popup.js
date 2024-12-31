console.log("Popup.js loaded");

document.getElementById("downloadHtml").addEventListener("click", async () => {
    console.log("Download HTML button clicked");
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    browser.runtime.sendMessage({ action: "downloadHtml", tabId: tab.id });
});

document.getElementById("sendHtml").addEventListener("click", async () => {
    console.log("Send HTML to Server button clicked");
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    browser.runtime.sendMessage({ action: "sendHtml", tabId: tab.id });
});


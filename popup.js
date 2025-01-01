console.log("Popup.js loaded");

document.getElementById("downloadHtml").addEventListener("click", async () => {
    console.log("Download HTML button clicked");
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    browser.runtime.sendMessage({ action: "downloadHtml", tabId: tab.id });
});

document.getElementById("sendHtml").addEventListener("click", async () => {
    console.log("Send HTML to Server button clicked");

    const serverUrlInput = document.getElementById("serverUrl").value.trim();

    let serverUrl = serverUrlInput;
    if (!serverUrlInput) {
        // Get the default URL from storage
        const result = await browser.storage.local.get("defaultUrl");
        serverUrl = result.defaultUrl || "";
    }

    if (!serverUrl) {
        alert("Please enter a valid server URL.");
        return; // Exit if no URL is available
    }

    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    browser.runtime.sendMessage({
        action: "sendHtml",
        tabId: tab.id,
        serverUrl, // Use the input or default URL
    });

    window.close();
});

document.getElementById("settingsBtn").addEventListener("click", () => {
    browser.runtime.openOptionsPage();
});

console.log("Popup.js loaded");

document.getElementById("downloadHtml").addEventListener("click", async () => {
    console.log("Download HTML button clicked");
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    browser.runtime.sendMessage({ action: "downloadHtml", tabId: tab.id });
});

document.getElementById("sendHtml").addEventListener("click", async () => {
    console.log("Send HTML to Server button clicked");

    // Get the server URL from the input field
    const serverUrl = document.getElementById("serverUrl").value.trim();
    if (!serverUrl) {
        alert("Please enter a valid server URL.");
        return; // Exit if the input is empty
    }

    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    browser.runtime.sendMessage({
        action: "sendHtml",
        tabId: tab.id,
        serverUrl, // Pass the server URL to the background script
    });

    // Close the popup after the button is clicked
    window.close();
});

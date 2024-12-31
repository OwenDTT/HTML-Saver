console.log("Extension.js loaded");

browser.runtime.onMessage.addListener(async (message, sender) => {
    console.log("Message received in background script:", message);  // Log the received message

    if (message.action === "downloadHtml") {
        console.log("Download HTML action triggered");
        await downloadHtml(message.tabId);
    } else if (message.action === "sendHtml") {
        console.log("Send HTML action triggered");
        await sendHtmlToServer(message.tabId);
    }
});

async function downloadHtml(tabId) {
    console.log("Downloading HTML for tab:", tabId);

    // Get the HTML content of the active tab
    const [htmlContent] = await browser.tabs.executeScript(tabId, {
        code: "document.documentElement.outerHTML",
    });

    // Get the page title and generate a timestamp
    const [pageTitle] = await browser.tabs.executeScript(tabId, {
        code: "document.title",
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Ensure the filename is safe (remove characters that aren't allowed in filenames)
    const safeTitle = pageTitle.replace(/[<>:"/\\|?*]/g, '');

    // Create the filename by combining the page title and the timestamp
    const fileName = `${safeTitle}_${timestamp}.html`;

    // Create a Blob from the HTML content
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    // Download the HTML content
    browser.downloads.download({
        url,
        filename: fileName,
        saveAs: true,
    });

    console.log("HTML content downloaded successfully as:", fileName);
}

async function sendHtmlToServer(tabId) {
    console.log("Sending HTML to server for tab:", tabId);
    const htmlContent = await browser.tabs.executeScript(tabId, {
        code: "document.documentElement.outerHTML",
    });

    const data = new FormData();
    data.append("html_content", htmlContent[0]);

    fetch("https://cwa.braingia.org/htmlsaver/", {
        method: "POST",
        body: data,
    })
        .then((response) => response.json())
        .then((serverResponse) => {
            console.log("HTML content successfully sent to server:", serverResponse);
        })
        .catch((error) => {
            console.error("Error sending HTML content to server:", error);
        });
}

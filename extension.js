browser.runtime.onMessage.addListener(async (message) => {
    if (message.action === "downloadHtml") {
        const html = await browser.tabs.executeScript(message.tabId, {
            code: "document.documentElement.outerHTML",
        });
        const title = await browser.tabs.executeScript(message.tabId, {
            code: "document.title || 'page'",
        });
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `${title[0]}_${timestamp}.html`;

        const blob = new Blob([html[0]], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        browser.downloads.download({
            url,
            filename: fileName,
            saveAs: true,
        });
    } else if (message.action === "sendHtml") {
        const html = await browser.tabs.executeScript(message.tabId, {
            code: "document.documentElement.outerHTML",
        });
        const pageUrl = await browser.tabs.executeScript(message.tabId, {
            code: "window.location.href",
        });

        // Prepare the data to send
        const formData = new FormData();
        formData.append("html_content", html[0]);
        formData.append("page_url", pageUrl[0]);

        try {
            const response = await fetch(message.serverUrl, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Successfully sent HTML to server:", result);
        } catch (error) {
            console.error("Error sending HTML to server:", error);
        }
    }
});

// Listen for changes in the tab (when a new page is loaded or tab is updated)
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Get the value of the "sendToServer" setting from localStorage
    const sendToServer = localStorage.getItem('sendToServer') === 'true';
    const defaultUrl = localStorage.getItem('defaultUrl') || 'https://example.url.com'; // Default URL if none specified

    // If the setting is enabled and the page is fully loaded, send HTML content to server
    if (sendToServer && changeInfo.status === 'complete') {
        browser.tabs.executeScript(tabId, {
            code: `
        console.log("Sending page to server...");

        const pageUrl = window.location.href;
        const htmlContent = document.documentElement.outerHTML;
        const pageTitle = document.title || "page";

        // Prepare data to send via POST
        const data = new FormData();
        data.append('html_content', htmlContent);
        data.append('page_url', pageUrl);

        fetch('${defaultUrl}', { // Use the default URL here
          method: 'POST',
          body: data,
        })
        .then(response => response.json())
        .then(serverResponse => {
          console.log("Content successfully sent to the server:", serverResponse);
        })
        .catch(error => {
          console.error("Error sending content to the server:", error);
        });
      `
        });
    }
});

// Event listener for the extension's browser action (when clicked)
browser.browserAction.onClicked.addListener((tab) => {
    // Get the value of the "sendToServer" setting from localStorage
    const sendToServer = localStorage.getItem('sendToServer') === 'true';
    const defaultUrl = localStorage.getItem('defaultUrl') || 'https://example.url.com'; // Default URL if none specified

    // If the setting is enabled, send the HTML content of the page to the server
    if (sendToServer) {
        browser.tabs.executeScript(tab.id, {
            code: `
        console.log("Sending page to server...");

        const pageUrl = window.location.href;
        const htmlContent = document.documentElement.outerHTML;
        const pageTitle = document.title || "page";

        // Prepare data to send via POST
        const data = new FormData();
        data.append('html_content', htmlContent);
        data.append('page_url', pageUrl);

        fetch('${defaultUrl}', { // Use the default URL here
          method: 'POST',
          body: data,
        })
        .then(response => response.json())
        .then(serverResponse => {
          console.log("Content successfully sent to the server:", serverResponse);
        })
        .catch(error => {
          console.error("Error sending content to the server:", error);
        });
      `
        });
    } else {
        console.log("Send to server is disabled.");
    }
});

// Event listener for the popup menu (when the user selects an option)
browser.runtime.onMessage.addListener((message) => {
    if (message.action === "downloadHtml") {
        // Get the current tab's HTML content
        browser.tabs.query({ active: true, currentWindow: true })
            .then((tabs) => {
                const tab = tabs[0];
                browser.tabs.executeScript(tab.id, {
                    code: `
            const pageUrl = window.location.href;
            const htmlContent = document.documentElement.outerHTML;
            const pageTitle = document.title || "page";

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = \`\${pageTitle}_\${timestamp}.html\`;

            const blob = new Blob([htmlContent], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log("HTML content downloaded successfully as:", fileName);
          `
                });
            })
            .catch(err => console.error("Error accessing active tab:", err));
    }

    if (message.action === "sendHtmlToServer") {
        const urlToSend = message.url || localStorage.getItem('defaultUrl') || 'https://example.url.com'; // Default URL if none specified

        // Send the HTML content to the server
        browser.tabs.query({ active: true, currentWindow: true })
            .then((tabs) => {
                const tab = tabs[0];
                browser.tabs.executeScript(tab.id, {
                    code: `
            const pageUrl = window.location.href;
            const htmlContent = document.documentElement.outerHTML;
            const pageTitle = document.title || "page";

            const data = new FormData();
            data.append('html_content', htmlContent);
            data.append('page_url', pageUrl);

            fetch('${urlToSend}', { // Send the request to the URL provided
              method: 'POST',
              body: data,
            })
            .then(response => response.json())
            .then(serverResponse => {
              console.log("Content successfully sent to the server:", serverResponse);
            })
            .catch(error => {
              console.error("Error sending content to the server:", error);
            });
          `
                });
            })
            .catch(err => console.error("Error accessing active tab:", err));
    }
});

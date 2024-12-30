browser.browserAction.onClicked.addListener((tab) => {
  browser.tabs.executeScript(tab.id, {
    code: `
      console.log("Extension triggered!");

      // Get the current page's URL
      const pageUrl = window.location.href;
      console.log("Page URL:", pageUrl);

      // Get the HTML content of the current active tab
      const htmlContent = document.documentElement.outerHTML;
      console.log("HTML content retrieved successfully.");

      // Get the page title
      const pageTitle = document.title || "page";
      console.log("Page title:", pageTitle);

      // Log the size of the HTML content
      console.log("HTML content size:", new TextEncoder().encode(htmlContent).length);

      // Prepare the data to send via POST
      const data = new FormData();
      data.append('html_content', htmlContent);
      data.append('page_url', pageUrl);

      // Send the content to the specified URL
      fetch('https://example.url.com', {
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

      // Function to download the HTML content as a file
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
});

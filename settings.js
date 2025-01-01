// Handle tab switching
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and hide all contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Handle saving default server URL
document.getElementById('saveSettings').addEventListener('click', () => {
    const defaultUrl = document.getElementById('defaultUrl').value;
    localStorage.setItem('defaultUrl', defaultUrl);
    alert('Default URL saved!');
});

// Handle saving the "send every website to the server" setting
document.getElementById('saveBasicSettings').addEventListener('click', () => {
    const sendToServer = document.getElementById('sendToServer').checked;
    localStorage.setItem('sendToServer', sendToServer);
    alert('Settings saved!');
});

// Load saved settings on page load
window.addEventListener('load', () => {
    // Load default server URL
    const savedUrl = localStorage.getItem('defaultUrl');
    if (savedUrl) {
        document.getElementById('defaultUrl').value = savedUrl;
    }

    // Load "send every website to the server" setting
    const sendToServer = localStorage.getItem('sendToServer') === 'true';
    document.getElementById('sendToServer').checked = sendToServer;
});

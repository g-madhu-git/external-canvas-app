// Listen for messages from Salesforce Canvas (parent window)
window.addEventListener('message', function(event) {
    console.log('Received message from Salesforce:', event.data);

    // Example: Show an alert when receiving a specific message
    if (event.data && event.data.type === 'FROM_SALESFORCE') {
        alert('Salesforce says: ' + event.data.message);
    }
}, false);

// Send a message to Salesforce when button is clicked
document.getElementById('sendMessageButton').addEventListener('click', function() {
    if (window.parent) {
        window.parent.postMessage({ 
            type: 'FROM_EXTERNAL_APP', 
            message: 'Hello Salesforce, this is External App!' 
        }, '*');
    }
});

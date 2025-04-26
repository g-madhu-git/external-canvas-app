// Initialize the Canvas SDK
(function() {
    console.log('Initializing the Canvas SDK...');  // Log when script execution starts

    // Wait for the document to be ready
    window.addEventListener('message', function(event) {
        console.log('Received message from Salesforce:', event);  // Log the event data received

        // Check if the message is from Salesforce (you may need to adjust the domain)
        if (event.origin !== 'https://your.salesforce.instance.com') {
            console.log('Invalid source:', event.origin);  // Log invalid sources
            return;
        }

        // Parse the signed request from the message
        var signedRequest = event.data.signedRequest;
        if (!signedRequest) {
            console.log('Signed request not found!');  // Log if signed request is not found
            return;
        }

        console.log('Signed request received:', signedRequest);  // Log the received signed request

        // Decode the signed request
        var decoded = parseSignedRequest(signedRequest);
        console.log('Decoded Signed Request:', decoded);  // Log the decoded signed request payload

        // Initialize the Canvas SDK with the signed request data
        if (window.canvasApp) {
            console.log('Initializing Canvas SDK with signed request...');
            canvasApp.init({
                signedRequest: signedRequest,  // Send the signed request to the Canvas SDK
                userInfo: decoded  // Additional user information can be passed here
            });

            // Example of calling Salesforce API to retrieve some data (e.g., Account)
            canvasApp.get('/services/data/v50.0/query/', { q: 'SELECT Name FROM Account LIMIT 5' })
                .then(function(response) {
                    console.log('Salesforce Response:', response);  // Log Salesforce API response
                    // You can handle the response, display it, or do any other action
                })
                .catch(function(error) {
                    console.error('Error retrieving Salesforce data:', error);  // Log any errors from API calls
                });

            // Sending a test message back to Salesforce
            sendMessageToSalesforce();
        } else {
            console.log('Canvas SDK not initialized');  // Log if Canvas SDK is not available
        }
    });

    // Function to parse the signed request
    function parseSignedRequest(signedRequest) {
        console.log('Parsing signed request...');
        var parts = signedRequest.split('.');
        var payload = JSON.parse(atob(parts[1])); // Base64 decode the payload part of the signed request
        console.log('Parsed payload:', payload);  // Log the parsed payload
        return payload;
    }

    // Function to send a test message to Salesforce
    function sendMessageToSalesforce() {
        var message = {
            greeting: 'Hello from External App! I am authenticated.'
        };

        console.log('Sending message to Salesforce:', message);  // Log the message being sent to Salesforce
        // Post the message to the parent (Salesforce)
        parent.postMessage(message, '*');
    }

})();

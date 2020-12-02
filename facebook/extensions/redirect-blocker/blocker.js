/*
Block the redirect from the Facebook authorization endpoint
to the redirect_uri, print the authorization response in page
 */

const patterns = [
    // Pattern for the Authorization Code flow
    "*://*/*code=*#_=_*",
    // Pattern for the Implicit flow
    "*://*/*#access_token=*"
];

let enabled = true;
localStorage.setItem("enabled", JSON.stringify(enabled));

// Block the request
function block(request) {
    if (!enabled) return;

    // Facebook Authorization Code flow
    let response = "data:text/plain," + encodeURIComponent(request.url);
    return {redirectUrl: response};
}

// Event triggered when a request is about to be made
browser.webRequest.onBeforeRequest.addListener(block, {urls: patterns}, ["blocking"]);

// Listen to messages from the popup
browser.runtime.onConnect.addListener((port) => {
    if (port.name === "popup-port") {
        port.onMessage.addListener((msg) => {
            enabled = msg.enabled;
        });
    }
});
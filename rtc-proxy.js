let connection;

let extId = document.querySelector("meta[name='X-Sniffer-ExtId']").content

const OriginalRTCPeerConnection = RTCPeerConnection;
class XConnection extends RTCPeerConnection {
    constructor() {
        chrome.runtime.sendMessage(extId, {cmd: "clear"});
        connection = new OriginalRTCPeerConnection();
        return connection;
    }
}

let lastDescription = null;
setInterval(() => {
    if(!connection) {
        return;
    }

    if(!connection.remoteDescription) {
        return;
    }

    let description = connection.remoteDescription.sdp;
    if(description != lastDescription) {
        console.log(description)
        chrome.runtime.sendMessage(extId, {cmd: "sdp", sdp: description});
    }
}, 500);

window["RTCPeerConnection"] = XConnection;
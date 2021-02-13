var knownIps = [];

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        switch(request.cmd) {
            case "clear":
                clear();
                break;
            case "sdp":
                parseSDP(request.sdp);
                break;
        }
    }
);

function parseSDP(body) {
    body.split("\n")
        .filter(line => line.startsWith("a=candidate"))
        .forEach(candidate => parseCandidate(candidate));
}

function clear() {
    var table = document.getElementById("data");
    var body = table.tBodies[0];
    body.parentNode.removeChild(body);
}

function parseCandidate(candidate) {
    var table = document.getElementById("data");

    var parts = candidate.split(" ");
    var ip = parts[4];
    var type = parts[7];

    // we do not want double IPs (from TCP/UDP)
    if(knownIps.indexOf(ip) > -1) {
        return;
    }
    knownIps.push(ip);

    var row = table.insertRow();
    var typeCell = row.insertCell(0);
    var ipCell = row.insertCell(1);
    var descCell = row.insertCell(2);

    typeCell.innerHTML = type;
    ipCell.innerHTML = ip;

    if(type == 'srflx') {
        fetch("http://cli.fyi/" + ip)
            .then(r => r.json())
            .then(resp => {
                if(!resp.data) {
                    return;
                }

                var data = resp.data;
                descCell.innerHTML = `${data.organisation} (${data.city}, ${data.country})`
            });
    }
}
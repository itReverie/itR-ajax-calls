// SCENARIO:
//
// This web page needs to make four AJAX calls to load its content.
// 1. These AJAX calls should all happen asynchronously and concurrently.
// 2. Each time an AJAX calls completes, update the progress bar.
// 3. When all four AJAX calls complete, display the content
//    for each box.
//
// Box one:   https://jstest.getsandbox.com/one
// Box two:   https://jstest.getsandbox.com/two
// Box three: https://jstest.getsandbox.com/three
// Box four:  https://jstest.getsandbox.com/four
//
// The AJAX returns the following JSON structure: {"content": string}


window.onload = function (e) {
    renderResults();
}

function renderResults() {
    var dictionary = [];
    dictionary.push({key: 1, value: "one"});
    dictionary.push({key: 2, value: "two"});
    dictionary.push({key: 3, value: "three"});
    dictionary.push({key: 4, value: "four"});

    for (let i = 0; i < dictionary.length; i++) {
        //console.log(dictionary[i].key+' '+ dictionary[i].value);
        makeRequest('box ' + dictionary[i].value, 'http://www.coincap.io/coins');//'https://jstest.getsandbox.com/' + dictionary[i].key);
    }
}


function makeRequest(box, url) {

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.setRequestHeader('Content-Type', 'application/json');

    //Assynchronous not working
    // request.onload = function () {

    //Synchronous Working
    request.onreadystatechange = function() {
        console.log(request.status);
            if (request.status >= 200 && request.status < 400) {
                // Success!
                var resp = request.responseText;
                console.log(resp);
                var toRender = JSON.parse(resp);
                console.log(toRender);
            } else {
                // We reached our target server, but it returned an error

            }
        };

    request.onerror = function () {
        console.log(request.statusText);
    };

    request.send();
}





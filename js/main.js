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

//Good references
//http://youmightnotneedjquery.com/
//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests
//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest

const DONE = 4;
const SUCCESS = 200;
const progressBar = document.getElementById("progress-bar");

window.onload = function (e) {
    loadContent();
}

function loadContent() {
    var dictionary = [];
    dictionary.push({key: 1, value: "one"});
    dictionary.push({key: 2, value: "two"});
    dictionary.push({key: 3, value: "three"});
    dictionary.push({key: 4, value: "four"});

    for (let i = 0; i < dictionary.length; i++) {
        //console.log(dictionary[i].key+' '+ dictionary[i].value);
        makeRequest('http://jstest.getsandbox.com/'+dictionary[i].value, myCallback, dictionary[i])
    }
}


function myCallback(item) {
    var resp = this.responseText;
    //I am stringifing because i was having a non valid Json error
    var respToString = JSON.stringify(resp);
    //RESULT in Json. I am making double parsing as it seems there is a bug with the json.parse
    var respTojson = JSON.parse(JSON.parse(respToString));
    //console.log(' k:' + item.key + ' v:' + item.value + ' r:' + respTojson.content);
    document.getElementsByClassName('box ' + item.value)[0].innerHTML = respTojson.content;
}


//Assynchronous
function requestCompleted() {
    //console.log(this.arguments)
    if (this.readyState === DONE) {
        if (this.status === SUCCESS) {
            this.callback.apply(this, this.arguments);
        }
    }
}

function requestError() {
    console.log(this.statusText);
}

function requestProgress (e) {
    //console.log(e.lengthComputable);

    if (e.lengthComputable) {
        progressBar.max = e.total;
        progressBar.value = e.loaded;
    }


    //OPTION 1
    // var contentLength;
    // if (e.lengthComputable) {
    //     contentLength = e.total;
    // } else {
    //     contentLength = e.target.getResponseHeader('x-decompressed-content-length');
    // }
    // console.log( contentLength);

    //OPTION 1
    // if (this.status === 200) {
    //     var curLoadedMB = (e.loaded / 1024.0 / 1024.0).toFixed(2);
    //     var totalMB = (e.total / 1024.0 / 1024.0).toFixed(2);
    //     var result=((e.loaded / e.total) * 100);
    //     console.log(result);
    // }

}

function onLoadStart()
{
    progressBar.innerHTML = 0;
}
function onLoadEnd(e)
{
    progressBar.innerHTML = e.loaded;
}



function makeRequest(url, callback) {

    var request = new XMLHttpRequest();
    request.callback = callback;
    request.arguments = Array.prototype.slice.call(arguments, 2);
    request.onload = requestCompleted;
    request.onerror = requestError;
    request.onprogress =requestProgress;
    request.onloadstart = onLoadStart;
    request.onloadend = onLoadEnd;
    request.open('GET', url, true);
    request.send();
}







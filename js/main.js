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
//const myUrl = 'http://jstest.getsandbox.com/one';
//const myUrl='http://www.coincap.io/coins';

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
    //RESULT in Json
    var respTojson = JSON.parse(JSON.parse(respToString));
    console.log(' k:' + item.key + ' v:' + item.value + ' r:' + respTojson.content);

    document.getElementsByClassName('box ' + item.value)[0].innerHTML = respTojson.content;

}


//Assynchronous
function requestSuccess() {
    //console.log(this.arguments)
    this.callback.apply(this, this.arguments);
}

function requestError() {
    console.log(this.statusText);
}

function makeRequest(url, callback) {

    var request = new XMLHttpRequest();
    request.callback = callback;
    request.arguments = Array.prototype.slice.call(arguments, 2);
    request.onload = requestSuccess;
    request.onerror = requestError;
    request.open('GET', url, true);
    request.send();
}







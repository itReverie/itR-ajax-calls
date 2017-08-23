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

const progressBar = document.getElementById("progress-bar");
const dictionary = [];
dictionary.push({key: 1, value: "one"});
dictionary.push({key: 2, value: "two"});
dictionary.push({key: 3, value: "three"});
dictionary.push({key: 4, value: "four"});

window.onload = function (e) {
    loadContent().then(r=>renderContent(r));
}

function loadContent() {
    return new Promise(function (resolve, reject) {
        let dictionaryContent = [];

        for (let i = 0; i < dictionary.length; i++) {
            getContentPerBox(dictionary[i].value)
                .then(r => {
                    dictionaryContent.push({key:dictionary[i].value, value:r});
                    if(dictionaryContent.length===4){
                        resolve(dictionaryContent);
                    }
                })
                .catch(function (error) {
                    reject(console.log('J: ' + error))
                });
        }
    });
}

function getContentPerBox(boxName) {
    return new Promise(function (resolve, reject) {
        makeRequest('http://jstest.getsandbox.com/' + boxName, 'GET', null)
            .catch(function (error) {
                reject(console.log('E: ' + error))
            })
            .then(response => resolve(this.readJson(response)))
            .catch(function (error) {
                reject(console.log('J: ' + error))
            });
    });
}

function renderContent(dictionaryContent){
    for (var key in dictionaryContent) {
        console.log(dictionaryContent[key].key +' '+dictionaryContent[key].value);
        document.getElementsByClassName('box ' + dictionaryContent[key].key)[0].innerHTML = dictionaryContent[key].value;
    }
}

function readJson(resp) {
    //I am stringifing because i was having a non valid Json error
    var respToString = JSON.stringify(resp);
    //RESULT in Json. I am making double parsing as it seems there is a bug with the json.parse
    var respTojson = JSON.parse(JSON.parse(respToString));
    return respTojson.content;
}


//Asynchronous
function requestProgress(e) {
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
    //  progressIndicator.update(e.loaded / contentLength);

    //OPTION 1
    // if (this.status === 200) {
    //     var curLoadedMB = (e.loaded / 1024.0 / 1024.0).toFixed(2);
    //     var totalMB = (e.total / 1024.0 / 1024.0).toFixed(2);
    //     var result=((e.loaded / e.total) * 100);
    //     console.log(result);
    // }

}

function onLoadStart() {
    progressBar.innerHTML = 0;
}

function onLoadEnd(e) {
    progressBar.innerHTML = e.loaded;
}

function makeRequest(url, method, params) {
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest();
       //request.setRequestHeader("Content-type", "application/json");
        request.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(this.responseText);
            } else {
                reject({
                    status: this.status,
                    statusText: request.statusText
                });
            }
        };
        request.onerror = function () {
            reject({
                status: this.status,
                statusText: request.statusText
            });
        };
        request.onprogress = requestProgress;
        request.onloadstart = onLoadStart;
        request.onloadend = onLoadEnd;
        request.open(method, url, true);
        request.send(params);
    });
}







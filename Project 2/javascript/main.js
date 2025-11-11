window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};

let displayTerm = "";

function searchButtonClicked(){
    console.log("searchButtonClicked() called");
    
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/random";

    let GIPHY_KEY = "iifeUwqrJwcSy6EPSBth1uaYCCGFe2ZM";

    let url = GIPHY_URL;
    url += "?api_key=" + GIPHY_KEY;

    console.log(url);

    getData(url);
} 

function getData(url) {
    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e) {
    let xhr = e.target;

    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    if (!obj.data || obj.data.length == 0) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        return;
    }

    let result = obj.data;

    let smallURL = result.images.fixed_width_small.url;
    if (!smallURL) smallURL = "images/no-images-found.png";

    let url = result.url;

    let line = `<div class='result'>`;
    line += `<span><a target='_blank' href='${url}'>View on Giphy</a></span>`;

    line += `<br>Rating: ${result.rating.toUpperCase()}<br>`;
    line += `<img src='${smallURL}' title= '${result.id}'/></div>`;

    document.querySelector("#content").innerHTML = line;

    let tags = [];
    let slug = result.slug.split('-');

    if (slug.length <= 1) {
        dataLoaded(e);
        return;
    }

    for (let i = 0; i < slug.length - 1; i++)  {
        tags.push(slug[i].trim().toLowerCase());
    }

    let answerBox = document.querySelector("#content");
    let bigGuess = "<div class='guess'>";

    for (let tag of tags) {
        let guess = `<span value='${tag}'>`;
        guess += `?</span>`;
        bigGuess += guess;
    }
    bigGuess += `</div>`;
    answerBox.innerHTML += bigGuess;

    console.log(tags);

    document.querySelector("input").addEventListener('change', (event) => {
        for (let tag of tags) {
            if (tag.includes(event.target.value)) {
                document.querySelector(`span[value='${tag}']`).innerHTML = tag;
            }
        }
    });
}

function dataError(e) {
    console.log("An error has occurred.");
}

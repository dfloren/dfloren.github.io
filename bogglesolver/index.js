const DICT_API_BASE_URL = new URL("https://api.dictionaryapi.dev");
const GRID_SIZE = 4;
const smallSpinner = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
const DEFINITION_NOT_FOUND = "".concat("Definition not found, try Google.", String.fromCodePoint(0x1F937));

async function getDefinitionAsync(word) {
    let fetchPromise = await fetch(new URL(`/api/v2/entries/en/${word}`, DICT_API_BASE_URL));
    if (fetchPromise.status === 404) {
        throw new Error("Definition not found");
    }

    return await fetchPromise.json();
};

function populateWords() {
    let wordsContainer = document.getElementById("words-container");

    // only justify if showing placeholder text (init or no words on board lol)
    wordsContainer.classList.remove("justify-content-center");

    wordsContainer.innerHTML = "";

    for (let i = 0; i < 200; i++) {
        let wordBtn = document.createElement("button");
        wordBtn.type = "button";

        let wordKeys = [...wordMap.keys()];

        wordBtn.innerText = wordKeys[wordKeys.length * Math.random() << 0];

        // popover config
        wordBtn.setAttribute("data-bs-toggle", "popover");
        wordBtn.setAttribute("data-bs-title", wordBtn.innerText);
        wordBtn.setAttribute("data-bs-content", smallSpinner);
        wordBtn.setAttribute("data-bs-html", true);
        wordBtn.setAttribute("data-bs-trigger", "focus");

        wordBtn.addEventListener('click', setPopoverContent);

        wordsContainer.append(wordBtn);

    }

    document.getElementById("solve-btn").innerHTML = "Solve";

    popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
}

function buildPopoverContent(dictApiResponse) {

    let definitionsArray = [];

    for (let meaning of dictApiResponse[0]["meanings"]) {
        definitionsArray.push(
            `<strong>${meaning["partOfSpeech"]}</strong>: ${meaning["definitions"][0]["definition"]}`
        );
    }

    return definitionsArray.join("<br>");
}

function setPopoverContent(clickEvent) {
    if (clickEvent.target.getAttribute("definition-cached")) {
        return;
    }

    let popoverInstance = bootstrap.Popover.getInstance(clickEvent.target);

    getDefinitionAsync(clickEvent.target.innerText)
        .then((response) => {
            popoverInstance.setContent({
                '.popover-body': buildPopoverContent(response),
            })
        })
        .catch((e) => {
            console.log(e.message);
            popoverInstance.setContent({
                '.popover-body': DEFINITION_NOT_FOUND,
            })
        }).finally(() => clickEvent.target.setAttribute("definition-cached", true));
}

function solve() {
    let solveBtn = document.getElementById("solve-btn");
    solveBtn.innerHTML = ''.concat(smallSpinner, " ", "Solving...");

    let inputArray = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE));
    document.querySelectorAll("input.tile-input").forEach((value, key) => {
        inputArray[Math.floor(key / GRID_SIZE)][key % GRID_SIZE] = value.value;
    });

    /**
     * TODO:
     * 1. generate letter combinations from inputArray (grid)
     * 2. Filter for words
     * 3. Pass words to populateWords()
     */

    // artificial loading time
    setTimeout(() => populateWords(), 1000);

    return false;

}

function autotabTile(tile) {
    if (tile.value.length < tile.maxLength) {
        return;
    }

    let nextTileInput;
    if (tile.closest("td")?.nextElementSibling) {
        nextTileInput = tile.closest("td").nextElementSibling.querySelector("input");
    } else if (tile.closest("tr")?.nextElementSibling) {
        nextTileInput = tile.closest("tr").nextElementSibling.querySelector("input");
    } else {
        nextTileInput = tile.closest("body").querySelector("#solve-btn");
    }
    nextTileInput.focus();
}

function clearGame() {
    let tileInputs = document.querySelectorAll("input.tile-input");
    tileInputs.forEach(t => t.value = "");
    document.querySelector("input.tile-input").focus();

    clearWordList();
}

function clearWordList() {
    let wordsContainer = document.getElementById("words-container");
    wordsContainer.classList.add("justify-content-center");
    wordsContainer.innerText = "Words will appear here when the board is solved."
}

function loadApp() {
    // create grid
    let tilesTable = document.getElementById("tiles-table");

    for (let i = 0; i < GRID_SIZE; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < GRID_SIZE; j++) {
            let col = document.createElement("td");
            col.classList.add("col");

            let tile = document.createElement("input");
            tile.minLength = 1;
            tile.maxLength = 1;
            tile.id = `R${i}C${j}`;
            tile.name = `R${i}C${j}`;
            tile.pattern = "[A-Za-z]"
            tile.type = "text";
            tile.setAttribute("required", "");
            tile.setAttribute("form", "tiles-form");
            tile.setAttribute("autocomplete", "off");
            tile.classList.add("tile-input");
            tile.addEventListener('input', () => autotabTile(tile));
            tile.addEventListener('click', () => tile.select());

            col.append(tile);

            row.append(col);

        }

        tilesTable.append(row);
    }

    document.forms["tiles-form"].onsubmit = solve;

    // solve button
    let solveBtn = document.createElement("button");
    solveBtn.setAttribute("form", "tiles-form");
    solveBtn.classList.add("btn", "btn-success");
    solveBtn.id = "solve-btn"
    solveBtn.type = "submit";
    solveBtn.value = "Solve";
    solveBtn.innerText = "Solve";
    document.getElementById("game-btns-container").append(solveBtn);

    // clear button
    let clearBtn = document.createElement("button");
    clearBtn.classList.add("btn", "btn-secondary");
    clearBtn.innerText = "Clear";
    clearBtn.addEventListener('click', () => clearGame());
    document.getElementById("game-btns-container").append(clearBtn);

    clearWordList();

    // artificial loading time
    setTimeout(() => {
        document.querySelector("#parent-container").toggleAttribute("hidden");
        document.querySelector("#loading-banner").remove();
        document.querySelector(".tile-input").focus();
    }, 1000);
}

let wordMap;
fetch("resources/words_dictionary.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Could not fetch dictionary map. HTTP Status: ${response.status}`);
        }
        return response.json()
    })
    .then(response => wordMap = new Map(Object.entries(response)))
    .then(() => loadApp())
    .catch(e => alert(`${e.message}`));

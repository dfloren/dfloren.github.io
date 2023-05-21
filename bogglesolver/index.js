import { getDefinitionAsync, getWords } from "./service/wordservice.js";
import { Trie } from "./utility/trie.js";
import { bestFiveByFive } from "./utility/board.js";


const GRID_SIZE = 5;

// Popover placeholders
const DEFINITION_NOT_FOUND_PLACEHOLDER = "".concat("Definition not found, try Google.", String.fromCodePoint(0x1F937));

// Word list placeholders
const DEFAULT_WORD_LIST_PLACEHOLDER = "Words will appear here when the board is solved."
const NO_WORDS_FOUND_PLACEHOLDER = "No words found!";

let currentPopoverElement;

let wordSet;

let trie;


function buildSmallSpinnerHTML() {
    return '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
}

function buildPopoverContentHTML(dictApiResponse) {

    let definitionsArray = [];

    for (let item of dictApiResponse) {
        for (let meaning of item["meanings"]) {
            for (let definition of meaning["definitions"]) {
                definitionsArray.push(
                    `<strong>${meaning["partOfSpeech"]}</strong>: ${definition["definition"]}`
                );
            }
        }
    }

    return definitionsArray.join("<br><br>");
}

function buildNoDefinitionContentHTML(word) {
    let content = DEFINITION_NOT_FOUND_PLACEHOLDER;
    content += `<br>
    Search link (<div class="fa fa-external-link" style="font-size: 16px;"></div>): 
    <a href="https://google.com/search?q=${word}+definition" target="_blank">
    ${word}
    </a>
    `
    return content;
}

function setPopoverContent(clickEvent) {
    if (clickEvent.target.getAttribute("definition-cached")) {
        return;
    }

    let popoverInstance = bootstrap.Popover.getInstance(clickEvent.target);

    let content = "";
    getDefinitionAsync(clickEvent.target.innerText)
        .then((response) => content = buildPopoverContentHTML(response))
        .catch((e) => content = buildNoDefinitionContentHTML(clickEvent.target.innerText))
        .finally(() => {
            popoverInstance.setContent({
                '.popover-body': content,
            })
            clickEvent.target.setAttribute("definition-cached", true)
        });
}

function clearTiles() {
    let tileInputs = document.querySelectorAll("input.tile-input");
    tileInputs.forEach(t => t.value = "");
}

function disableGrid() {
    document.querySelectorAll(".tile-input").forEach((tile) => {
        tile.toggleAttribute("disabled", true);
    });
}

function enableGrid() {
    document.getElementById("solve-btn").toggleAttribute("disabled", false);
    document.querySelectorAll(".tile-input").forEach((tile) => {
        tile.toggleAttribute("disabled", false);
    });
}

function setWordListPlaceholder(placeholder) {
    let wordsContainer = document.getElementById("words-container");
    wordsContainer.classList.toggle("words-container-placeholder-content", true);
    wordsContainer.classList.toggle("words-container-word-content", false);
    wordsContainer.innerText = placeholder;
}

function clearWordList() {
    let wordsContainer = document.getElementById("words-container");
    wordsContainer.classList.toggle("words-container-placeholder-content", false);
    wordsContainer.classList.toggle("words-container-word-content", true);
    wordsContainer.innerText = "";
}

function populateWordList(words) {
    let wordsContainer = document.getElementById("words-container");

    clearWordList();

    for (let word of words) {
        let wordBtn = document.createElement("button");
        wordBtn.type = "button";
        wordBtn.innerText = word;

        wordBtn.setAttribute("data-bs-toggle", "popover");
        wordBtn.setAttribute("data-bs-title", word);
        wordBtn.setAttribute("data-bs-content", buildSmallSpinnerHTML());
        wordBtn.setAttribute("data-bs-html", true);
        wordBtn.setAttribute("data-bs-trigger", "focus");

        wordBtn.addEventListener('click', setPopoverContent);

        wordsContainer.append(wordBtn);
    }

    // bootstrap popover
    var popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    var popoverList = [...popoverTriggerList].map(popoverTriggerEl => {
        popoverTriggerEl.addEventListener('click', () => {
            currentPopoverElement = bootstrap.Popover.getInstance(popoverTriggerEl)
        });
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

function solve() {
    let solveBtn = document.getElementById("solve-btn");
    solveBtn.toggleAttribute("disabled", true);
    solveBtn.innerHTML = ''.concat(buildSmallSpinnerHTML(), " ", "Solving...");

    disableGrid();

    // 1 second to setup spinner properly
    setTimeout(() => {
        let letterGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE));
        document.querySelectorAll("input.tile-input").forEach((value, key) => {
            letterGrid[Math.floor(key / GRID_SIZE)][key % GRID_SIZE] = value.value.toUpperCase();
        });

        // TODO: generate letter combinations + tile placement from grid
        let combinations = getWords(letterGrid, GRID_SIZE, trie);

        let words = combinations.filter(c => wordSet.has(c) && c.length >= 3).sort();

        if (!words.length) {
            setWordListPlaceholder(NO_WORDS_FOUND_PLACEHOLDER);
        } else {
            populateWordList(words);
        }

        document.getElementById("solve-btn").innerHTML = "Solve";
    }, 1000);

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
    clearTiles();
    enableGrid();
    setWordListPlaceholder(DEFAULT_WORD_LIST_PLACEHOLDER);

    document.querySelector("input.tile-input").focus();
}

function loadApp() {
    // create grid
    let tilesTable = document.getElementById("tiles-table");

    for (let i = 0; i < GRID_SIZE; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < GRID_SIZE; j++) {
            let tile = document.createElement("input");
            tile.setAttribute("autocomplete", "off");
            tile.setAttribute("form", "tiles-form");
            tile.setAttribute("id", `R${i}C${j}`);
            tile.setAttribute("maxLength", "1");
            tile.setAttribute("minLength", "1");
            tile.setAttribute("name", `R${i}C${j}`);
            tile.setAttribute("pattern", "[A-Za-z]");
            tile.setAttribute("type", "text");
            tile.setAttribute("value", bestFiveByFive[i][j]);
            tile.toggleAttribute("required", true);
            tile.addEventListener('click', () => tile.select());
            tile.addEventListener('input', () => autotabTile(tile));
            tile.classList.add("tile-input");

            let col = document.createElement("td");
            col.classList.add("col");
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
    clearBtn.addEventListener("click", () => clearGame());
    document.getElementById("game-btns-container").append(clearBtn);

    setWordListPlaceholder(DEFAULT_WORD_LIST_PLACEHOLDER);

    document.getElementById("parent-container").addEventListener('scroll', () => {
        currentPopoverElement?.hide();
    });
    document.getElementById("words-container").addEventListener('scroll', () => {
        currentPopoverElement?.hide();
    });

    // artificial loading time
    setTimeout(() => {
        document.getElementById("parent-container").toggleAttribute("hidden");
        document.getElementById("loading-banner").remove();
        document.getElementById("solve-btn").focus();
    }, 1000);
}

fetch("resources/dictionary.txt")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch dictionary. HTTP Status: ${response.status}`);
        }
        return response.text();
    })
    .then(response => {
        wordSet = new Set(response.split("\n"))
        trie = Trie.trieFromWordList(wordSet);
    })
    .then(() => loadApp())
    .catch(e => alert(`${e.message}`));

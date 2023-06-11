import { getDefinitionAsync, getWords } from "./scripts/service/wordservice.js";
import { Trie } from "./scripts/utility/trie.js";
import { exampleSixBySix } from "./scripts/utility/board.js";


const DICT_LOCAL_URL = "../resources/dictionary.txt";

const MIN_GRID_SIZE = 4;
const DEFAULT_GRID_SIZE = 5;
const MAX_GRID_SIZE = 6;
let CURRENT_GRID_SIZE = DEFAULT_GRID_SIZE;

// Popover placeholders
const DEFINITION_NOT_FOUND_PLACEHOLDER = "".concat("Definition not found, try Google.", String.fromCodePoint(0x1F937));

// Word list placeholders
const DEFAULT_WORD_LIST_PLACEHOLDER = `Words will appear here when the board is solved.\n
Click on a word to see its definition. Hover to reveal it on the board (touch on mobile).
`
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

function clearGame() {
    clearTiles();
    enableGrid();
    setWordListPlaceholder(DEFAULT_WORD_LIST_PLACEHOLDER);

    document.querySelector("input.tile-input").focus();
}

function randomizeGame() {
    for (let row = 0; row < CURRENT_GRID_SIZE; row++) {
        for (let col = 0; col < CURRENT_GRID_SIZE; col++) {
            document.getElementById(`R${row}C${col}`).value = 
            String.fromCharCode(Math.floor(Math.random() * (90 - 65)) + 65);
        }
    }

    enableGrid();
    solve();
}

function displayPath(combinationPath) {
    let size = combinationPath.length;

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++)  {
            if (combinationPath[row][col] === true) {
                let tile = document.getElementById(`R${row}C${col}`);
                tile.classList.toggle("highlighted-tile", true);
            }
        }
    }
}

function removeDisplayedPath(combinationPath) {
    let size = combinationPath.length;

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++)  {
            if (combinationPath[row][col] === true) {
                let tile = document.getElementById(`R${row}C${col}`);
                tile.classList.toggle("highlighted-tile", false);
            }
        }
    }
}

function populateWordList(words, combinationMap) {
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

        // mouse highlight
        wordBtn.addEventListener('mouseover', () => displayPath(combinationMap.get(word)));
        wordBtn.addEventListener('mouseout', () => removeDisplayedPath(combinationMap.get(word)));

        // touch highlight
        wordBtn.addEventListener('focus', () => displayPath(combinationMap.get(word)));
        wordBtn.addEventListener('blur', () => removeDisplayedPath(combinationMap.get(word)));

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
    solveBtn.innerHTML = ''.concat(buildSmallSpinnerHTML(), " ", "Boggling...");

    disableGrid();

    // 100ms to setup spinner properly
    setTimeout(() => {
        let letterGrid = Array(CURRENT_GRID_SIZE).fill(null).map(() => Array(CURRENT_GRID_SIZE));
        document.querySelectorAll("input.tile-input").forEach((value, key) => {
            letterGrid[Math.floor(key / CURRENT_GRID_SIZE)][key % CURRENT_GRID_SIZE] = value.value.toUpperCase();
        });

        let combinationsMap = getWords(letterGrid, CURRENT_GRID_SIZE, trie);

        let words = [...combinationsMap.keys()].filter(c => wordSet.has(c) && c.length >= 3).sort();

        if (!words.length) {
            setWordListPlaceholder(NO_WORDS_FOUND_PLACEHOLDER);
        } else {
            populateWordList(words, combinationsMap);
        }

        document.getElementById("solve-btn").innerHTML = "Solve";
    }, 100);

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

function createBoard(gridSize) {
    CURRENT_GRID_SIZE = gridSize;

    document.getElementById("grid-size-info-container").innerText = `${CURRENT_GRID_SIZE} x ${CURRENT_GRID_SIZE}`;

    let tilesTable = document.getElementById("tiles-table");

    tilesTable.textContent = "";

    for (let i = 0; i < gridSize; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < gridSize; j++) {
            let tile = document.createElement("input");
            tile.setAttribute("autocomplete", "off");
            tile.setAttribute("form", "tiles-form");
            tile.setAttribute("id", `R${i}C${j}`);
            tile.setAttribute("maxLength", "1");
            tile.setAttribute("minLength", "1");
            tile.setAttribute("name", `R${i}C${j}`);
            tile.setAttribute("aria-label", `R${i}C${j}`)
            tile.setAttribute("pattern", "[A-Za-z]");
            tile.setAttribute("type", "text");
            tile.setAttribute("value", exampleSixBySix[i][j]);
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

    enableGrid();
    setWordListPlaceholder(DEFAULT_WORD_LIST_PLACEHOLDER);
}

function updateGridSizeButtons() {
    document.getElementById("minus-size-btn").toggleAttribute("disabled", CURRENT_GRID_SIZE === MIN_GRID_SIZE ? true : false);
    document.getElementById("plus-size-btn").toggleAttribute("disabled", CURRENT_GRID_SIZE === MAX_GRID_SIZE ? true : false);
}

function loadApp() {
    document.forms["tiles-form"].onsubmit = solve;

    // solve button
    let solveBtn = document.createElement("button");
    solveBtn.setAttribute("form", "tiles-form");
    solveBtn.classList.add("btn", "btn-primary");
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

    // randomize button
    let randomizeBtn = document.createElement("button");
    randomizeBtn.classList.add("btn", "btn-secondary");
    randomizeBtn.setAttribute("aria-label", "shuffle-button")
    randomizeBtn.innerHTML = '<i class="fa fa-random" style="font-size: 16px;"></i>';
    randomizeBtn.addEventListener("click", () => randomizeGame());
    document.getElementById("game-btns-container").append(randomizeBtn);

    // grid size buttons
    let minusSizeBtn = document.createElement("button");
    minusSizeBtn.setAttribute("id", "minus-size-btn");
    minusSizeBtn.setAttribute("aria-label", "minus-size-btn");
    minusSizeBtn.classList.add("btn", "btn-outline-primary", "rounded-circle");
    minusSizeBtn.innerHTML = '<i class="fa fa-minus-circle" style="font-size: 22px;"></i>';
    minusSizeBtn.addEventListener('click', () => {
        if (CURRENT_GRID_SIZE > MIN_GRID_SIZE) {
            createBoard(--CURRENT_GRID_SIZE);
        }
        updateGridSizeButtons();
    });

    let plusSizeBtn = document.createElement("button");
    plusSizeBtn.setAttribute("id", "plus-size-btn");
    plusSizeBtn.setAttribute("aria-label", "plus-size-btn");
    plusSizeBtn.classList.add("btn", "btn-outline-primary", "rounded-circle");
    plusSizeBtn.innerHTML = '<i class="fa fa-plus-circle" style="font-size: 22px;"></i>';
    plusSizeBtn.addEventListener('click', () => {
        if (CURRENT_GRID_SIZE < MAX_GRID_SIZE) {
            createBoard(++CURRENT_GRID_SIZE);
        }
        updateGridSizeButtons();
    });

    let sizeHeaderContainer = document.getElementById("size-header-container")
    sizeHeaderContainer.insertAdjacentElement("afterbegin", minusSizeBtn);
    sizeHeaderContainer.insertAdjacentElement("beforeend", plusSizeBtn);
    
    // hide popovers on scroll
    document.getElementById("parent-container").addEventListener('scroll', () => {
        currentPopoverElement?.hide();
    });
    document.getElementById("words-container").addEventListener('scroll', () => {
        currentPopoverElement?.hide();
    });

    createBoard(DEFAULT_GRID_SIZE);

    document.getElementById("parent-container").toggleAttribute("hidden");
    document.getElementById("loading-banner").remove();
}

fetch(DICT_LOCAL_URL)
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

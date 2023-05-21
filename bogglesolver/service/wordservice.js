const DICT_API_BASE_URL = new URL("https://api.dictionaryapi.dev");

export async function getDefinitionAsync(word) {
    let fetchPromise = await fetch(new URL(`/api/v2/entries/en/${word}`, DICT_API_BASE_URL));
    if (fetchPromise.status === 404) {
        throw new Error("Definition not found");
    }

    return await fetchPromise.json();
}

/**
 * 
 * @param {*} grid - 2D array of letters
 * @param {*} size - size of grid
 * @param {*} trie - Trie representing the word bank
 * @returns A map where key = word, value = 2D array representing traversal path
 */
export function getWords(grid, size, trie) {

    let directions = [
        [-1, 0],  // up
        [1, 0],   // down
        [0, -1],  // left
        [0, 1],   // right
        [-1, -1], // up-left
        [-1, 1],  // up-right
        [1, -1],  // down-left
        [1, 1],   // down-right
    ];  

    let result = new Map();

    function getNextLetter(visitedGrid, row, col, combination) {
        /**
         * Max combinations
         * 2x2 - 60
         * 3x3 - 10 296
         * 4x4 - 12 029 624 (~40 secs without Trie, ~3 seconds with)
         * 5x5 - RangeError: Too many properties to enumerate (lol)
         * 
         * Not all combinations will be words. Use a Trie to avoid unnecessary traversals.
         */

        for (let [r, c] of directions) {
            let nextRow = row + r;
            let nextCol = col + c;
            if (nextRow >= size || nextRow < 0 || nextCol >= size || nextCol < 0) {
                continue;
            }

            if (visitedGrid[nextRow][nextCol]) {
                continue;
            }

            let newCombination = Array.from(combination);
            newCombination.push(grid[nextRow][nextCol]);

            if (!trie.isPrefix(newCombination.join(''))) {
                continue;
            }

            let newVisitedGrid = JSON.parse(JSON.stringify(visitedGrid));
            newVisitedGrid[nextRow][nextCol] = true;

            result.set(newCombination.join(""), newVisitedGrid);

            getNextLetter(newVisitedGrid, nextRow, nextCol, newCombination);
        }
    }

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            let visitedGrid = [];
            for (let row = 0; row < size; row++) {
                let cols = Array.apply(null, Array(size)).map(a => false);
                visitedGrid.push(cols);
            }
            visitedGrid[row][col] = true;
            // using array instead of string for easier copying
            let combination = [grid[row][col]];
            getNextLetter(visitedGrid, row, col, combination);
        }
    }

    return result;
}

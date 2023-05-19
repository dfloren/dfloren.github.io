const DICT_API_BASE_URL = new URL("https://api.dictionaryapi.dev");

export async function getDefinitionAsync(word) {
    let fetchPromise = await fetch(new URL(`/api/v2/entries/en/${word}`, DICT_API_BASE_URL));
    if (fetchPromise.status === 404) {
        throw new Error("Definition not found");
    }

    return await fetchPromise.json();
}

export function getLetterCombinations(grid, size) {
    return ["hello", "this", "is", "a", "word", "asdf"];
}

class Node {
    constructor(value) {
        this.value = value;
        this.children = {};
    }
}

export class Trie {
    constructor() {
        this.root = new Node(null);
    }

    insert(word) {
        let current = this.root;

        for (let c of word) {
            if (!current.children.hasOwnProperty(c)) {
                current.children[c] = new Node(c);
            }
            current = current.children[c];
        }
    }

    isPrefix(prefix) {
        let current = this.root;

        for (let c of prefix) {
            if (!current.children.hasOwnProperty(c)) {
                return false;
            }
            current = current.children[c];
        }

        return true;
    }

    static trieFromWordList(wordList) {
        let trie = new Trie();

        for (let word of wordList) {
            trie.insert(word);
        }

        return trie;
    }
}
function insertLetter(letter, context) {
    addAction(
        { type: "smart_app_data", payload: { action: "insert_letter", letter } },
        context
    );
}

function insertWord(word, context) {
    addAction(
        { type: "smart_app_data", payload: { action: "insert_word", word } },
        context
    );
}

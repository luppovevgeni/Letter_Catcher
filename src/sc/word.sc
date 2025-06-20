theme: /

    state: Word
        q!: слово $Word::word
        q!: * слово $Word::word *
        q!: проверь слово $Word::word
        q!: вставь слово $Word::word
    
        script:
            log('word: context: ' + JSON.stringify($context));
            var word = $parseTree._word;
            if (word) {
                word = word.trim().toUpperCase();
                if (word.length != 5) {
                    $reactions.answer("Слово обязательно должно состоять из 5 букв.");
                } else {
                    insertWord(word, $context);
                    $reactions.answer("Пробую слово " + word);
                }
            } else {
                $reactions.answer("Не понял слово, попробуйте еще раз.");
            }

            addSuggestions(["Слово маска", "Помощь"], $context);
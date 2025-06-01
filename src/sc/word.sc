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
                } else if (!isValidWord(word)) {
                    $reactions.answer("Извините я не знаю такое слово, попробуйте другое.");
                } else {
                    insertWord(word, $context);
                    $reactions.answer("Пробуем слово " + word);
                }
            } else {
                $reactions.answer("Не понял слово, попробуйте еще раз.");
            }

            addSuggestions(["Буква а", "Помощь"], $context);
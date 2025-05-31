theme: /bukvolov

    state: Word
        q!: слово $Word::word
    
        script:
            var w = $parseTree._word.trim().toUpperCase();
            insertWord(w, $context);
            $reactions.answer("Пробуем слово " + w);
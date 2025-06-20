theme: /

    state: Letter
        q!: буква $Letter::letter
        q!: * буква $Letter::letter *
        q!: проверь букву $Letter::letter
        q!: вставь букву $Letter::letter
        
        script:
            log('letter: context: ' + JSON.stringify($context));
            var letter = $parseTree._letter;
            if (letter) {
                letter = letter.trim().toUpperCase();
                if (letter.length === 1 && /[А-ЯЁA-Z]/.test(letter)) {
                    insertLetter(letter, $context);
                    $reactions.answer("Вставляю букву " + letter);
                } else {
                    $reactions.answer("Пожалуйста, назовите одну букву.");
                }
            } else {
                $reactions.answer("Не понял букву, попробуйте еще раз.");
            }

            addSuggestions(["Буква а", "Помощь"], $context);
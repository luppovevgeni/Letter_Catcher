theme: /bukvolov

    state: Letter
        q!: буква $Letter::letter          # захватываем слово (длина 1-2 символа)

        script:
            var l = $parseTree._word.trim().toUpperCase();
            insertLetter(l, $context);
            $reactions.answer("Вставляю букву " + l);

theme: /

    state: Letter
        q!: буква $Letter::letter

        script:
            var l = $parseTree._word.trim().toUpperCase();
            insertLetter(l, $context);
            $reactions.answer("Вставляю букву " + l);

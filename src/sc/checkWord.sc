theme: /

    state: CheckWord
        @event: action=try_word

        script:
            log('CheckWord: context: ' + JSON.stringify($context));
            var word = $parseTree._word;
            if (word) {
                word = word.trim().toUpperCase();
                if (!isValidWord(word)) {
                    $reactions.answer("Извините я не знаю такое слово, попробуйте другое.");
                } else {
                    replyWordResult(ok, $context);
                    $reactions.answer("Пробуем слово " + word);
                }
            } else {
                $reactions.answer("Не понял слово, попробуйте еще раз.");
            }
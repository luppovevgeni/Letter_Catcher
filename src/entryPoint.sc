require: slotfilling/slotFilling.sc
  module = sys.zb-common

require: js/actions.js
require: sc/letter.sc
require: sc/word.sc

patterns:
    $AnyText = $nonEmptyGarbage
    $String = $nonEmptyGarbage
    $Number = $nonEmptyGarbage
    $Letter = $nonEmptyGarbage
    $Word = $nonEmptyGarbage

theme: /

    state: Start
        q!: $regex</start>
        q!: (запусти|открой|вруби) (букволов|5 букв|вордл)
        a: Привет! Добро пожаловать в игру! Скажите "слово [ваше слово]" или "буква [ваша буква]".

        script:
            addSuggestions(["Помощь"], $context);

    state: Help
        q!: (помощь|что ты умеешь|как [тебя] использовать|помоги|команды)
        a: Доступные команды:
        a: Скажите "слово", а затем произнесите слово, например: "слово бетон";
        a: Скажите "буква", а затем произнесите букву, например: "буква а";

        script:
            addSuggestions(["Слово бетон", "Буква а"], $context);

    state: Fallback
        event!: noMatch
        script:
            var userInput = $request.query;
            if (userInput && userInput.length > 0) {
                $reactions.answer("Я не понимаю эту команду. Скажите 'помощь', чтобы узнать доступные команды.");
            } else {
                $reactions.answer("Попробуйте сказать 'слово [ваше слово]' или 'буква [ваша буква]'.");
            }
            addSuggestions(["Помощь", "Слово школа", "Буква а"], $context);
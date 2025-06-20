function insertWord(word, context) {
    addAction(
        {
            type: "insert_word",
            word: word
        },
        context
    );
}

function insertLetter(letter, context) {
    addAction(
        {
            type: "insert_letter",
            letter: letter
        },
        context
    );
}

function addAction(action, context) {
    var command = {
        type: "smart_app_data",
        action: action,
    };
    
    for (
        var index = 0;
        context.response.replies && index < context.response.replies.length;
        index++
    ) {
        if (
            context.response.replies[index].type === "raw" &&
            context.response.replies[index].body &&
            context.response.replies[index].body.items
        ) {
            context.response.replies[index].body.items.push({ command: command });
            return;
        }
    }

    return reply({ items: [{ command: command }] }, context.response);
}

function reply(body, response) {
    var replyData = {
        type: "raw",
        body: body,
    };
    response.replies = response.replies || [];
    response.replies.push(replyData);
}

function addSuggestions(suggestions, context) {
    var buttons = [];

    suggestions.forEach(function (suggest) {
        buttons.push({
            action: {
                text: suggest,
                type: "text",
            },
            title: suggest,
        });
    });

    reply({ suggestions: { buttons: buttons } }, context.response);
}
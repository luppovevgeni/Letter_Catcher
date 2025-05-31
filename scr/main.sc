import { createScenario } from '@sberdevices/salutejs';

export const scenario = createScenario(({ api }) => ({
  letter: {
    match: /^буква\s+([а-яё])$/i,
    handle: async (ctx) => {
      const letter = ctx.match[1].toUpperCase();
      api.sendActions([
        {
          type: 'smart_app_data',
          payload: { action: 'insert_letter', letter },
        },
      ]);
      await api.say(`Вставляю букву ${letter}`);
    },
  },
  word: {
    match: /^слово\s+([а-яё]{5,})$/i,

    handle: async (ctx) => {
      const word = ctx.match[1].toUpperCase();

      api.sendActions([
        {
          type: 'smart_app_data',
          payload: { action: 'insert_word', word },
        },
      ]);

      await api.say(`Пробуем слово ${word}`);
    },
  },

}));

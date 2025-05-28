import express from 'express';
import {
  createSystemScenario,
  createUserScenario,
  SaluteRequest,
  SaluteResponse,
} from '@salutejs/scenario';

/* ---------- интенты ---------- */
const intents = {
  ENTER_LETTER: { matchers: [/^\s*буква\s+([А-ЯЁ])\s*$/iu] },
  ENTER_WORD:   { matchers: [/^\s*слово\s+([А-ЯЁ]{2,5})\s*$/iu] }, // ← 2-5 букв
  SUBMIT:       { matchers: [/^\s*(ввод|проверить|готово)\s*$/iu] },
};

/* ---------- пользовательский сценарий ---------- */
const userScenario = createUserScenario({
  enterLetter: {
    match: ({ intent }) => intent?.name === 'ENTER_LETTER',
    handle: ({ intent, res }) => {
      const letter = intent.slots[0].value.toUpperCase();
      res.appendCommand({ type: 'smart_app_data', smart_app_data: { action: 'enterLetter', letter }});
      res.setPronounceText(`Добавил букву ${letter}`);
    },
  },

  enterWord: {
    match: ({ intent }) => intent?.name === 'ENTER_WORD',
    handle: ({ intent, res }) => {
      const word = intent.slots[0].value.toUpperCase();
      res.appendCommand({ type: 'smart_app_data', smart_app_data: { action: 'enterWord', word }});
      res.setPronounceText(`Пробуем слово ${word}`);
    },
  },

  submit: {
    match: ({ intent }) => intent?.name === 'SUBMIT',
    handle: ({ res }) => {
      res.appendCommand({ type: 'smart_app_data', smart_app_data: { action: 'submit' }});
      res.setPronounceText('Проверяем');
    },
  },
});

/* ---------- системный сценарий ---------- */
const systemScenario = createSystemScenario({
  RUN_APP:  ({ res }) => res.setPronounceText('🤖 Готов! Говори «буква …» или «слово …».'),
  NO_MATCH: ({ res }) => res.setPronounceText('Не понял, повтори ещё раз'),
});

/* ---------- express ---------- */
const app = express();
app.use(express.json());

app.post('/api/hook', async (req, res) => {
  const saluteReq = SaluteRequest.create(req.body);
  const saluteRes = SaluteResponse.create(saluteReq);
  await userScenario({ req: saluteReq, res: saluteRes, session: {} }, intents)
     || systemScenario({ req: saluteReq, res: saluteRes, session: {} });
  res.json(saluteRes.message);
});

app.use(express.static('public'));
app.listen(process.env.PORT ?? 3000, () => console.log('[SMARTAPP] слушаем :3000'));

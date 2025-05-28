/* ---------------- ассистент ---------------- */
const assistant = window.assistant.createSmartappDebugger?.({
  token: '<ВАШ_ТОКЕН>',
  initPhrase: 'запусти букволов',
  getState: () => ({})
}) ?? window.assistant.createAssistant({
  getState: () => ({}),
  getRecoveryState: () => ({})
});

assistant.on('data', ({ type, smart_app_data }) => {
  if (type !== 'smart_app_data') return;
  const { action, letter, word } = smart_app_data;
  if (action === 'enterLetter') handleKeyClick(letter);
  if (action === 'enterWord')   enterWholeWord(word);
  if (action === 'submit')      submitWord();
});

/* --------------- глобальные данные --------------- */
const ROWS = 6, COLS = 5;
let WORDS = [], correctWord = '', row = 0, col = 0, over = false;

const board    = document.getElementById('board');
const kb       = document.getElementById('keyboard');
const overlay  = document.getElementById('overlay');
const msgEl    = document.getElementById('modal-message');
const closeBtn = document.getElementById('close-btn');

closeBtn.onclick = () => { overlay.classList.remove('overlay--show'); newRound(); };
overlay.onclick  = e => { if (e.target === overlay) overlay.classList.remove('overlay--show'); };

/* --------------- старт --------------- */
fetch('words.txt').then(r=>r.text()).then(t=>{
  WORDS = t.trim().split('\n').map(w=>w.toUpperCase());
  buildBoard(); buildKeyboard(); newRound();
});

/* --------------- генерация --------------- */
function buildBoard(){
  board.innerHTML='';
  for(let r=0;r<ROWS;r++){
    const rowDiv=document.createElement('div');rowDiv.className='board-row';
    for(let c=0;c<COLS;c++){
      const cell=document.createElement('div');
      cell.className='cell';cell.dataset.row=r;cell.dataset.col=c;
      rowDiv.appendChild(cell);
    }
    board.appendChild(rowDiv);
  }
}
function buildKeyboard(){
  kb.innerHTML='';
  const rows=['ЙЦУКЕНГШЩЗХЪ','ФЫВАПРОЛДЖЭ','ENTER ЯЧСМИТЬБЮ ⌫'];
  rows.forEach(str=>[...str].forEach(ch=>{
    if(ch===' ') return;
    const btn=document.createElement('button');
    btn.className='key'+(['ENTER','⌫'].includes(ch)?' key--wide':'');
    btn.textContent=ch;
    btn.onclick=()=>ch==='ENTER'?submitWord():ch==='⌫'?backspace():handleKeyClick(ch);
    kb.appendChild(btn);
  }));
}

/* --------------- раунд --------------- */
function newRound(){
  correctWord = WORDS[Math.floor(Math.random()*WORDS.length)];
  row=col=0; over=false;
  document.querySelectorAll('.cell').forEach(c=>{c.textContent='';c.className='cell';});
  document.querySelectorAll('.key').forEach(k=>k.classList.remove('key--correct','key--present','key--absent'));
}

/* --------------- ввод --------------- */
function handleKeyClick(ch){
  if(over||col>=COLS) return;
  board.querySelector(`[data-row='${row}'][data-col='${col}']`).textContent=ch;
  col++;
}
function backspace(){
  if(over||col===0) return;
  col--;
  board.querySelector(`[data-row='${row}'][data-col='${col}']`).textContent='';
}
function enterWholeWord(word){
  if(over){return;}
  if(word.length!==COLS){ showModal('Слово должно быть 5 букв'); return; }
  [...word].forEach((ch,i)=>{
    board.querySelector(`[data-row='${row}'][data-col='${i}']`).textContent=ch;
  });
  col=COLS; submitWord();
}

/* --------------- проверка --------------- */
function submitWord(){
  if(over||col<COLS) return;
  const guess=[...Array(COLS)].map((_,i)=>
    board.querySelector(`[data-row='${row}'][data-col='${i}']`).textContent).join('');
  if(!WORDS.includes(guess)){ showModal('Слова нет в словаре'); return; }

  for(let i=0;i<COLS;i++){
    const cell=board.querySelector(`[data-row='${row}'][data-col='${i}']`);
    const l=guess[i], key=[...kb.children].find(k=>k.textContent===l);
    if(l===correctWord[i]){
      cell.classList.add('cell--correct'); key?.classList.add('key--correct');
    }else if(correctWord.includes(l)){
      cell.classList.add('cell--present');
      if(!key?.classList.contains('key--correct')) key?.classList.add('key--present');
    }else{ cell.classList.add('cell--absent'); key?.classList.add('key--absent'); }
  }

  if(guess===correctWord){ over=true; showModal('🎉 Победа!'); return; }
  row++; col=0;
  if(row===ROWS){ over=true; showModal(`Было слово ${correctWord}`); }
}

/* --------------- модалка --------------- */
function showModal(text){ msgEl.textContent=text; overlay.classList.add('overlay--show'); }

/* --------------- физ. клавиатура --------------- */
document.addEventListener('keydown',e=>{
  if(overlay.classList.contains('overlay--show')) return;
  const k=e.key.toUpperCase();
  if(k==='ENTER') submitWord();
  else if(k==='BACKSPACE') backspace();
  else if(/^[А-ЯЁ]$/.test(k)) handleKeyClick(k);
});

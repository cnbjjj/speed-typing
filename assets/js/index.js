'use strict';

import { query, event, cssVar, shuffle, log } from './utils.js';

const words =
    ['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population',
        'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute',
        'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle',
        'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy',
        'database', 'periodic', 'capitalism', 'abominable', 'component', 'future',
        'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'coffee', 'beauty', 'agency',
        'chocolate', 'eleven', 'technology', 'alphabet', 'knowledge', 'magician',
        'professor', 'triangle', 'earthquake', 'baseball', 'beyond', 'evolution',
        'banana', 'perfumer', 'computer', 'management', 'discovery', 'ambition', 'music',
        'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button',
        'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
        'fantastic', 'economy', 'interview', 'awesome', 'challenge', 'science', 'mystery',
        'famous', 'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
        'keyboard', 'window'];

const TIME_LIMIT = 10;
const WORD_TIME_LIMIT = 5;
const billboard = getRecords();
const bgSnd = new Audio('assets/snd/bg.mp3', { loop: true });
const btn = query('input[type="button"]');
const input = query('input[type="text"]');
const stage = query('.stage');
const info = query('.info');
const gameContainer = query('body');
const gameData = {
    reset: function () {
        clearInterval(this.timeId);
        clearInterval(this.autoId);
        this.words = shuffle([...words]);
        this.time = 0;
        this.hits = 0;
        this.counter = 0;
        this.welcome = 'Ready?';
        return this;
    }
}.reset();
const settings = {
    word: '',
    freq: WORD_TIME_LIMIT,
    step: 50,
    container: stage,
    gen: true,
    display: false,
    //
    add: [],
    rm: [],
    call: null
};

function start() {
    reset();
    gameContainer.classList.add('gaming');
    gameContainer.classList.remove('result');
    event(input, 'focusout', () => setTimeout(() => input.focus(), 0)).focus();
    transChars({ add: ['out'], rm: ['out', 'visible'], call: () => showWord() });
    gameData.timeId = setInterval(update, 1000);
    bgSnd.play();
}

function end() {
    const record = { hits: gameData.hits, total: words.length, date: new Date().toLocaleString("en-US", { hour12: false }) };
    const order = setRecord(record);
    transChars({
        add: ['out'], rm: ['out', 'visible'], call: () => {
            btn.value = 'Try again?';
            reset();
            gameContainer.classList.add('result');
            const word = `#${order}_${record.hits}/${record.total}`;
            gameData.welcome = word;
            showWord({ word: word, display: true });
        }
    });
    bgSnd.pause();
}

function reset() {
    input.value = '';
    gameContainer.classList.remove('gaming');
    gameData.reset();
}

function update() {
    info.innerHTML = `<li>Hits: ${gameData.hits}</li>
    <li>Time: ${(TIME_LIMIT - gameData.time)}</li>`;
    if (gameData.time++ >= TIME_LIMIT || gameData.words.length === 0)
        end();
}

function check(value) {
    const word = gameData.words[0];
    value.split('').forEach((char, i) => {
        if (char === word[i])
            transChar(query(`.stage > .char${i}`), ['out'], ['out', 'visible']);
    });
    if (value === word) {
        gameData.hits++;
        showWord();
    }
}

function showWord(options = {}) {
    let { word, freq, step, container, gen, display } = { ...settings, ...options };
    if (display) {
        loop('timeId', () => showWord({ word, freq, step, container, gen }), freq);
    }
    if (word === '') {
        gameData.words.shift();
        word = gameData.words[0];
        loop('autoId', () => {
            container.children[gameData.counter++].classList.add('pass');
            if (gameData.counter >= container.children.length) showWord();
        }, freq / container.children.length, gameData.counter = 0);
    }
    input.value = '';
    cssVar('--clr', Math.floor(Math.random() * 100));
    gen ? container.innerHTML = word.split('').map((char, i) => `<span class="char char${i}">${char}</span>`).join('') : container.innerHTML = container.innerHTML.replace(/visible/g, '');
    transChars({ add: ['in', 'visible'], rm: ['in'], call: () => input.value = '', step: step, container: container });
}

function loop(id, call, interval, ...args) {
    clearInterval(gameData[id]);
    gameData[id] = setInterval(call, interval * 1000, ...args);
}

function transChars(options = {}) {
    let { add, rm, call, step, container } = { ...settings, ...options };
    Array.from(container.children).forEach((char, i) => setTimeout(() => { transChar(char, add, rm) }, i * step));
    if (call !== null) setTimeout(call, container.children.length * step);
}

function transChar(char, add = [], rm = []) {
    char.classList.add(...add);
    event(char, 'animationend', () => char.classList.remove(...rm));
}

function toggleBillboard(param = {}) {
    query('.billboard').innerHTML = '';
    if (query('body').classList.toggle('records')) {
        displayBillboard([...billboard].splice(0, 10));
    } else {
        showWord(param);
    }
}

function displayBillboard(records) {
    let billboardStr = '';
    records.forEach((record, rid) => {
        let str = `${rid + 1}${String(record.hits).padStart(2, '0')}@${record.date.split(',')[0]}`;
        billboardStr += str.split('').map((char, i) => `<span style="--group:${rid}" class="${i === 0 ? 'first' : ''} board char char${i}">${char}</span>`).join('');
    });
    query('.billboard').innerHTML = billboardStr;
    showWord({ word: billboardStr, freq: 10, step: 25, container: query('.billboard'), gen: false, display: true });
}

function setRecord(record) {
    billboard.push(record);
    localStorage.setItem('records', JSON.stringify(billboard));
    return billboard.sort((a, b) => b.hits - a.hits).findIndex((r) => record.date === r.date) + 1;
}
function getRecords() {
    return (JSON.parse(localStorage.getItem('records')) ?? []).sort((a, b) => b.hits - a.hits);
}

event(btn, 'click', start);
event(input, 'input', () => check(input.value));
event(bgSnd, 'ended', () => bgSnd.play());
event(document, 'click', (e) => {
    if (e.target !== btn && gameContainer.classList.contains('result'))
        toggleBillboard({ word: gameData.welcome, display: true });
});
showWord({ word: gameData.welcome, display: true });
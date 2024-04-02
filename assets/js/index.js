'use strict';

import { Score } from './Score.js';
import { query, event, cssVar } from './Utils.js';

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
const bgSnd = new Audio('assets/snd/bg.mp3', { loop: true });
const btn = query('input[type="button"]');
const input = query('input[type="text"]');
const stage = query('section > div');
const info = query('.info');
const gameContainer = query('body');
const gameData = { reset: function () { this.timeId = 0; this.words = []; this.time = 0; this.hits = 0 } };

function start() {
    reset();
    gameContainer.classList.add('gaming');
    event(input, 'blur', () => input.focus()).focus();
    transChars(['out'], ['out', 'visible'], () => showWord());
    gameData.timeId = setInterval(update, 1000);
    bgSnd.play();
}

function end() {
    const score = new Score(gameData.hits, words.length, new Date());
    console.log("Game Over", score);
    transChars(['out'], ['out', 'visible'], () => {
        showWord(`Hits_${score.hits}/${score.total}`);
        btn.value = 'Try again?';
        reset();
    });
    bgSnd.pause();
}

function reset() {
    input.value = '';
    clearInterval(gameData.timeId);
    gameContainer.classList.remove('gaming');
    gameData.reset();
    gameData.words = [...words].sort((a, b) => Math.random() < 0.5 ? -1 : 1);
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
            transChar(query(`.char${i}`), ['out'], ['out', 'visible']);
    });
    if (value === word) {
        gameData.words.shift();
        gameData.hits++;
        showWord();
    }
}

function showWord(word = '') {
    if (word === '') word = gameData.words[0];
    input.value = '';
    cssVar('--clr', Math.floor(Math.random() * 10) * 137.508);
    stage.innerHTML = word.split('').map((char, i) => `<span class="char char${i}">${char}</span>`).join('');
    transChars(['in', 'visible'], ['in']);
}

function transChars(add = [], rm = [], call = null, step = 50) {
    Array.from(stage.children).forEach((char, i) => setTimeout(() => { transChar(char, add, rm) }, i * step));
    if (call !== null) setTimeout(call, stage.children.length * step);
}

function transChar(char, add = [], rm = []) {
    char.classList.add(...add);
    event(char, 'animationend', () => char.classList.remove(...rm));
}

event(btn, 'click', start);
event(input, 'input', () => check(input.value));
event(bgSnd, 'ended', () => bgSnd.play());
showWord("Ready?");
'use strict';

import { Score } from './Score.js';
import { query, event, cssVar, shuffle } from './Utils.js';

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

const TIME_LIMIT = 99;
const WORD_TIME_LIMIT = 5;
const bgSnd = new Audio('assets/snd/bg.mp3', { loop: true });
const btn = query('input[type="button"]');
const input = query('input[type="text"]');
const stage = query('section > div');
const info = query('.info');
const gameContainer = query('body');
const gameData = { reset: function () { 
    clearInterval(this.timeId); 
    clearInterval(this.autoId); 
    this.words = shuffle([...words]); 
    this.time = 0; 
    this.hits = 0; 
    this.counter = 0; 
    return this; 
}};

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
        btn.value = 'Try again?';
        reset();
        display(`Hits_${score.hits}/${score.total}`);
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
            transChar(query(`.char${i}`), ['out'], ['out', 'visible']);
    });
    if (value === word) {
        gameData.hits++;
        showWord();
    }
}

function showWord(word = '') {
    if (word === '') {
        gameData.words.shift();
        word = gameData.words[0];
        clearInterval(gameData.autoId);
        gameData.autoId = setInterval(() => {
            stage.children[gameData.counter++].classList.add('pass');
            if (gameData.counter >= stage.children.length) showWord();
        }, WORD_TIME_LIMIT * 1000 / stage.children.length, gameData.counter = 0);
    }
    input.value = '';
    cssVar('--clr', Math.floor(Math.random() * 100) * 137.508);
    stage.innerHTML = word.split('').map((char, i) => `<span class="char char${i}">${char}</span>`).join('');
    transChars(['in', 'visible'], ['in'], () => input.value = '');
}

function display(word){
    clearInterval(gameData.timeId);
    gameData.timeId = setInterval(() => showWord(word), WORD_TIME_LIMIT * 1000);
    showWord(word);
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
display('Ready?');
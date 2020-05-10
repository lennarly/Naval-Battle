// Постоянные значения, используемые в игре
const TIMEOUT = 100;
const ALPHABET = 'АБВГДЕЖЗИКЛМНОП';
const SIZE = [10, 10];
const SHIPS = [
    [1, 4],
    [2, 3],
    [3, 2],
    [4, 1]
];
const COLOR_SUNK = 'red';
const COLOR_HIGHLIGHT = '#3366CC';
const IMG_CIRCLE = '<img src="/img/circle.png" alt=""/>';
const IMG_CROSS = '<img src="/img/close.png" alt=""/>';

// Игра остановлена
let stop = false;

// Имя игрока
let name = null;

// Всевозможные ходы в игре
let moves = [];

// Хранение элементов доски для каждого игока
let player = [];
let computer = [];

// Количество попаданий корабельных элементов
let playerHits = 0;
let computerHits = 0;

// Хранение подробной информации о других кораблях
let playerShipsInfo = [];
let computerShipsInfo = [];

// Текущий ход (true = ход игрока)
let currentTurn = true;

// Ходы, сыгранные компьютером
let computerPlayedMoves = [];

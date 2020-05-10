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

// Основная инициализация для игры.
window.onload = () => {
    document.getElementById('play').addEventListener('click', start);
};

/**
 * Старт игры
 */
function start() {

    name = document.getElementById('login').value;

    if (name === '') {
        return alert('Некорректное имя!');
    }

    updateHTML("name", name);

    initialize(SIZE[0], SIZE[1]);
    makeGame();

    document.getElementById('auth').style.display = 'none';
    document.getElementById('game').style.display = 'block';

}

/**
 * Инициализация позиций игры
 */
function initialize() {
    for (let x = 1; x <= SIZE[0]; x++) {
        for (let y = 1; y <= SIZE[1]; y++) {
            moves.push([x, y]);
        }
    }
}

/**
 * Создание списка смещений для определенного элемента корабля
 * @returns {*[]}
 */
function getOffsets() {
    return [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 0],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
    ];
}

/**
 * Перезагрузка игры
 */
function restart() {

    // Элемент контейнера
    const container = document.getElementById("board");

    // Создание доски
    container.innerHTML = '';

    // По умолчанию
    moves = [];
    player = [];
    computer = [];
    playerHits = 0;
    computerHits = 0;
    playerShipsInfo = [];
    computerShipsInfo = [];
    computerPlayedMoves = [];
    currentTurn = true;

    // Возобновляем игру
    stop = false;

    // Скрываем сообщение
    document.getElementById('message').style.display = 'none';

    // Создание игры
    initialize(SIZE[0], SIZE[1]);
    makeGame();

}

/**
 * Создает основные игровые элементы (диалоги, доски, корабли)
 */
function makeGame() {

    // Элемент контейнера
    const container = document.getElementById("board");

    // Создание доски
    container.innerHTML += makeBoard("board", "player");
    container.innerHTML += makeBoard("board", "computer");

    // Создание кораблей
    makeShips("player", true);
    makeShips("computer", false);
}


/**
 * Генерирование игровой доски
 * @param parent
 * @param tag
 * @returns {string}
 */
function makeBoard(parent, tag) {

    // HTML таблицы
    let board = `<table id=${tag} class="board-${tag}">`;

    // Горизонтальный / вертикальный индекс
    let horizontalIndex = 0;
    let verticalIndex = 1;

    // Массив досок
    let boardArray = [];
    let boardArrayRow = [];

    // Генерирование таблицы
    for (let positionX = 0; positionX <= SIZE[0] + 1; positionX++) {

        // Открытие тега
        board += '<tr>';

        // Первая строка
        if (positionX === 0) {

            for (let positionY = 0; positionY <= SIZE[1] + 1; positionY++) {
                if (positionY === 0 || positionY === SIZE[1] + 1) {
                    board += `<td></td>`;
                } else {
                    board += `<td class="index">${ALPHABET[horizontalIndex++]}</td>`;
                }
            }

            // Последняя строка
        } else if (positionX === SIZE[0] + 1) {

            boardArrayRow = [];

            for (let positionY = 0; positionY <= SIZE[1] + 1; positionY++) {
                board += `<td></td>`;
                boardArrayRow.push(0);
            }

            boardArray.push(boardArrayRow);

            // Остальные строки
        } else {

            boardArrayRow = [];

            for (let positionY = 0; positionY <= SIZE[1] + 1; positionY++) {
                if (positionY === 0) {
                    board += `<td class="index">${verticalIndex++}</td>`;
                } else if (positionY === SIZE[1] + 1) {
                    board += `<td></td>`;
                } else {
                    board += `<td class="game-tile" id="${positionX}_${positionY}" onclick="onTileClick(${positionX}, ${positionY})"></td>`;
                    boardArrayRow.push(0);
                }
            }

            boardArray.push(boardArrayRow);
        }

        // Закрытие тега
        board += '</tr>';
    }

    // Закрытия тега для таблицы
    board += '</table>';

    // Сохранение доски
    tag === 'player' ? player = boardArray : computer = boardArray;

    // Возврат доски
    return board;
}

/**
 * Инициализация генерации кораблей
 * @param tag
 * @param draw
 */
function makeShips(tag, draw) {
    SHIPS.forEach(ship => {
        placeShip(ship, tag, draw);
    });
}

/**
 * Размещение корабля (длина, ориентация)
 * @param ship
 * @param tag
 * @param draw
 */
function placeShip(ship, tag, draw) {

    // Элемент доски
    let board = document.getElementById(tag);
    let rows = board.getElementsByTagName("tr");

    // Количество кораблей
    let amount = ship[0];

    // Длина корабля
    let length = ship[1];

    for (let index = 1; index <= amount; index++) {

        // Случайная ориентация
        let orientation = Math.random() < 0.5;

        // Случайная позиция
        let position = getRandomPosition();

        // Выбор ориентации
        if (orientation) {
            while (position[1] + length > 10) {
                position = getRandomPosition();
            }
        } else {
            while (position[0] + length > 10) {
                position = getRandomPosition();
            }
        }

        // Получение изначальных координат
        let boatPositions = getPositions(position, length, orientation);

        // Валидность координат
        let isValid = validatePositions(boatPositions, tag);

        // До тех пор, пока корабль не будет нарушать правил расположения
        while (!isValid) {

            orientation = Math.random() < 0.5;
            position = getRandomPosition();

            if (orientation) {
                while (position[1] + length > 10) {
                    position = getRandomPosition();
                }
            } else {
                while (position[0] + length > 10) {
                    position = getRandomPosition();
                }
            }

            boatPositions = getPositions(position, length, orientation);
            isValid = validatePositions(boatPositions, tag);
        }

        // Информация о лодках
        let shipInfo = [];

        boatPositions.forEach(boatPosition => {

            let positionX = boatPosition[0];
            let positionY = boatPosition[1];

            if (tag === "player") {
                player[positionX][positionY] = 1;
            } else {
                computer[positionX][positionY] = 1;
            }

            if (draw) {
                const element = rows[boatPosition[0]].getElementsByTagName("td")[boatPosition[1]];
                element.style.backgroundColor = COLOR_HIGHLIGHT;
            }

            shipInfo.push(boatPosition);
        });

        // Помещение информацию в соответствующий массив (игрок || компьютер)
        if (tag === "player") {
            playerShipsInfo.push(shipInfo);
        } else {
            computerShipsInfo.push(shipInfo);
        }
    }
}


/**
 * Создание всех позиций для возможного корабля
 * @param position
 * @param length
 * @param orientation
 * @returns {[]}
 */
function getPositions(position, length, orientation) {

    let boatPositions = [];

    for (let i = 0; i < length; i++) {
        let x, y;

        if (orientation) {
            x = position[0];
            y = position[1] + i;
        } else {
            x = position[0] + i;
            y = position[1];
        }

        boatPositions.push([x, y]);
    }

    return boatPositions;
}

/**
 * Валидация расположения корабля
 * @param boat_positions
 * @param tag
 * @returns {boolean}
 */
function validatePositions(boat_positions, tag) {
    let valid = true;
    boat_positions.forEach(boat => {
        getOffsets().forEach(offset => {
            try {
                // Содержит ли любое из этих смещений значение 1
                const row = boat[0] + offset[0];
                const column = boat[1] + offset[1];
                // Значение элемента
                const value = (tag === "player") ? player[row][column] : computer[row][column];
                // Проверка условия
                if (value !== 0 && value !== undefined) {
                    valid = false;
                }
            } catch (e) {}
        });
    });
    return valid;
}

/**
 * Обновление содержимого HTML компонента
 * @param component
 * @param html
 */
function updateHTML(component, html) {
    document.getElementById(component).innerHTML = html;
}

import { createCircle, createCross } from './utils.js';
import '../assets/styles/style.css';
// Создаем матрицу данных
let matrixData = [
  ['*', '*', '*'],
  ['*', '*', '*'],
  ['*', '*', '*'],
];
const storedMatrixData = localStorage.getItem('matrixData');
const storedCrossScore = localStorage.getItem('crossScoreData');
const storedCircleScore = localStorage.getItem('circleScoreData');
const storedDrawScore = localStorage.getItem('drawScoreData');
//ходы и счёт
let turn = 0;
let crossScore = 0;
let circleScore = 0;
let drawScore = 0;
// Получаем контейнер для матрицы
const matrixContainer = document.querySelector('.matrix__container');
// Получаем кнопку
const newGameButton = document.querySelector('.matrix__button');
//получаем строку для победителя
const winner = document.querySelector('.matrix__winner');
//получаем лейблы для переключения режимов
const labelOptions = document.querySelectorAll('.matrix__option__item__label');
//достаём радиокнопки
const humanOptions = document.querySelector('.matrix__option__item__human');
const aiOptions = document.querySelector('.matrix__option__item__ai');

const crossPoint = document.querySelector('.cross__point');
const circlePoint = document.querySelector('.circle__point');
const drawPoint = document.querySelector('.draw__point');
//функцуия отвечающая за ход в игре для двух игроков
const putMark = (cell, row, col) => {
  if (turn < 9 && humanOptions.checked) {
    let turn_char = '0';
    if (turn % 2 == 0) {
      turn_char = 'x';
      cell.appendChild(createCross());
      console.log(turn);
    } else {
      turn_char = '0';
      cell.appendChild(createCircle());
      console.log(turn);
    }
    matrixData[row][col] = turn_char;
    localStorage.setItem('matrixData', JSON.stringify(matrixData));
    turn += 1;
    checkWinConditions();
  }
};

//функция для отрисовки ходов из localStorage
const renderingTurn = (matrixData) => {
  for (let i = 0; i < matrixData.length; i++) {
    for (let j = 0; j < matrixData.length; j++) {
      let cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
      if (matrixData[i][j] == '*') continue;
      if (matrixData[i][j] == '0') {
        cell.appendChild(createCircle());
      } else if (matrixData[i][j] == 'x') {
        cell.appendChild(createCross());
      }
    }
  }
};
//функцуия отвечающая за ход в игре для игры с компьютером
const putMarkAI = (cell, row, col) => {
  if (turn < 9 && aiOptions.checked) {
    let turn_char = 'x';
    if (turn % 2 == 0) {
      matrixData[row][col] = turn_char;
      localStorage.setItem('matrixData', JSON.stringify(matrixData));
      cell.appendChild(createCross());
      makeAIMove(turn_char);
    }
    turn += 1;
    checkWinConditions();
  }
};

//функция проверяет какие ячейки ещё свободны
const freeСells = () => {
  let freeСellsArr = [];
  for (let i = 0; i < matrixData.length; i++) {
    for (let j = 0; j < matrixData.length; j++) {
      if (matrixData[i][j] == '*') {
        freeСellsArr.push([i, j]);
      }
    }
  }
  return freeСellsArr;
};

//Функция для ИИ. Сначала узнаём все свободные ячейки, выбираем рандомный индекс и просто вставляем туда нолик
function makeAIMove(turn_char) {
  const freeCellsArr = freeСells();
  // Если есть свободные ячейки, ИИ делает случайный ход
  if (freeCellsArr.length > 0) {
    const randomIndex = Math.floor(Math.random() * freeCellsArr.length);
    const [row, col] = freeCellsArr[randomIndex];
    // Делаем ход ИИ
    let cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    turn += 1;
    turn_char = '0';
    matrixData[row][col] = turn_char;
    localStorage.setItem('matrixData', JSON.stringify(matrixData));
    cell.appendChild(createCircle());
  }
}

//функция новой игры
const newGame = () => {
  const cells = document.querySelectorAll('.cell');
  for (let i = 0; i < matrixData.length; i++) {
    for (let j = 0; j < matrixData.length; j++) {
      matrixData[i][j] = '*';
    }
  }
  localStorage.setItem('matrixData', JSON.stringify(matrixData));
  cells.forEach((cell) => {
    while (cell.firstChild) {
      cell.removeChild(cell.firstChild);
    }
  });
  turn = 0;
};

//функция проверки победы
function checkWin(matrix, player) {
  // Проверка по строкам и колонкам
  for (let i = 0; i < 3; i++) {
    if (
      (matrix[i][0] === player && matrix[i][1] === player && matrix[i][2] === player) ||
      (matrix[0][i] === player && matrix[1][i] === player && matrix[2][i] === player)
    ) {
      return true;
    }
  }
  // Проверка по диагоналям
  if (
    (matrix[0][0] === player && matrix[1][1] === player && matrix[2][2] === player) ||
    (matrix[0][2] === player && matrix[1][1] === player && matrix[2][0] === player)
  ) {
    return true;
  }
  return false;
}

//функция вызова проверки победы
const checkWinConditions = () => {
  if (checkWin(matrixData, 'x')) {
    winner.innerText = 'Крестики победили!';
    crossScore += 1;
    localStorage.setItem('crossScoreData', crossScore);
    crossPoint.innerText = crossScore;

    turn = 9;
  } else if (checkWin(matrixData, '0')) {
    winner.innerText = 'Нолики победили!';
    circleScore += 1;
    localStorage.setItem('circleScoreData', circleScore);
    circlePoint.innerText = circleScore;

    turn = 9;
  } else {
    if (turn == 9) {
      winner.innerText = 'Ничья!';
      drawScore += 1;
      localStorage.setItem('drawScoreData', drawScore);
      drawPoint.innerText = drawScore;
    }
    console.log('Продолжаем игру...');
  }
};

// Заполняем контейнер дивами и связываем их с матрицей
for (let i = 0; i < matrixData.length; i++) {
  for (let j = 0; j < matrixData.length; j++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = i;
    cell.dataset.col = j;
    matrixContainer.appendChild(cell);
    cell.addEventListener('click', function () {
      const row = parseInt(this.dataset.row, 10);
      const col = parseInt(this.dataset.col, 10);

      if (humanOptions.checked) {
        putMark(this, row, col);
      } else if (aiOptions.checked) {
        putMarkAI(this, row, col);
      }
    });
  }
}

//вешаем слушатель на кнопку новой игры
newGameButton.addEventListener('click', (ev) => {
  ev.preventDefault();
  newGame();
});

//вешаем слушатель на переключение режимов игры
labelOptions.forEach((label) => {
  label.addEventListener('click', () => {
    labelOptions.forEach((otherLabel) => {
      otherLabel.classList.remove('active');
    });
    label.classList.add('active');
    newGame();
  });
});

//проверяем, есть ли что-то в нашем хранилище. Если есть, то берём эти данные
if (storedMatrixData) {
  matrixData = JSON.parse(storedMatrixData);
  renderingTurn(matrixData);
} else {
  matrixData = [
    ['*', '*', '*'],
    ['*', '*', '*'],
    ['*', '*', '*'],
  ];
}

const getStoreScore = (storedScore, score, scorePoint) => {
  if (storedScore) {
    score = Number(storedScore);
    scorePoint.innerText = score;
  } else {
    score = 0;
    scorePoint.innerText = score;
  }
  return score;
};
crossScore = getStoreScore(storedCrossScore, crossScore, crossPoint);
circleScore = getStoreScore(storedCircleScore, circleScore, circlePoint);
drawScore = getStoreScore(storedDrawScore, drawScore, drawPoint);

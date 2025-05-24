'use strict';

// Selecting Elements From HTML
const score0 = document.getElementById('score--0');
const score1 = document.getElementById('score--1');
const name0 = document.getElementById('name--0');
const name1 = document.getElementById('name--1');
const current0 = document.getElementById('current--0')
const current1 = document.getElementById('current--1')
const dice = document.querySelector('.dice');
const rollButton = document.querySelector('.btn--roll');
const holdButton = document.querySelector('.btn--hold');
const newGameButton = document.querySelector('.btn--new');
const Player0 = document.querySelector('.player--0');
const Player1 = document.querySelector('.player--1');
const showInstructions = document.querySelector('.instructions');
const closeInstructions = document.querySelector('.return-game');
const closePenalty = document.querySelector('.penalties-return');
const modal = document.querySelector('.instructions-list');
const overlay = document.querySelector('.overlay');
const penaltiesModal = document.querySelector('.pnealties-modal');
const penalty = document.querySelector('.penalty');
const newPenalty = document.querySelector('.new-penalty');
const addPlayers = document.querySelector('.add-players')
const name1Input = document.querySelector('.name-1')
const name2Input = document.querySelector('.name-2')
// Starting Conditions
score0.textContent = 0;
score1.textContent = 0;
let scores = [0,0];
let activePlayer = 0;
let currentscore = 0;
let playing = true;
dice.classList.add('hidden');

let penalties = [];

fetch('penalties.json')
  .then(response => response.json())
  .then(data => {
    penalties = data;
  })
  .catch(error => console.error('مش حملت الأحكام:', error));

function getRandomPenalty() {
  if (penalties.length === 0) return "مفيش أحكام متاحة!";
  const randomIndex = Math.floor(Math.random() * penalties.length);
  return penalties[randomIndex];
}


// Show Modal
function showModal(){
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function showPenaltiesModal(){
    penaltiesModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    penalty.textContent = getRandomPenalty();
}

function getNewPenalty(){
    penalty.textContent = getRandomPenalty();
}


function closePenaltiesModal(){
    penaltiesModal.classList.add('hidden');
    overlay.classList.add('hidden');
}

// CLose Modal
function closeModal(){
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}


// Switch Player Functionallity
function switchPlayer(){
    if(Player0.classList.contains('player--active')){
        activePlayer = 1;
        Player0.classList.remove('player--active');
        Player1.classList.add('player--active');
    }
    else{
        activePlayer = 0;
        Player1.classList.remove('player--active');
        Player0.classList.add('player--active');
    }
}

// Rolling Dice Function
function rollDice(){
    if(playing){
     // Generate Random Number Between 1 and 6
    const diceNumber = Math.floor(Math.random() * 6) + 1;
    name1Input.value = '';
    name2Input.value = '';
    // Display Dice
    dice.classList.remove('hidden');
    dice.src = `images/dice-${diceNumber}.png`
    // Check if the rolled number is 1
    if(diceNumber === 1){
        currentscore = 0;
        document.getElementById(`current--${activePlayer}`).textContent = currentscore;
        switchPlayer();
    }else{
        currentscore += diceNumber;
        document.getElementById(`current--${activePlayer}`).textContent = currentscore;
    } 
    }
}


// Hold Score Functionality
function holdScore(){
    if(playing){
    // Add Score For Current Player To Total Score
    scores[activePlayer] += currentscore;
    document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

    if(scores[activePlayer] >= 100){
        document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
        document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
        dice.classList.add('hidden')
        playing = false;
        showPenaltiesModal();
    }
    else{
        currentscore = 0;
        document.getElementById(`current--${activePlayer}`).textContent = currentscore;
        switchPlayer();
    }
    }
}

// reset game functionality
function resetGame(){
    score0.textContent = 0;
    score1.textContent = 0;
    scores = [0,0];
    activePlayer = 0;
    dice.classList.add('hidden');
    currentscore = 0
    current0.textContent = currentscore;
    current1.textContent = currentscore;
    document.querySelector(`.player--0`).classList.remove('player--winner');
    document.querySelector(`.player--1`).classList.remove('player--winner');
    document.querySelector(`.player--0`).classList.add('player--active');
    document.querySelector(`.player--1`).classList.remove('player--active');
    playing = true;
}

function addPlayersFunction(){
    if(!name1Input.value || !name2Input.value){
        alert("Please Enter Names First!")
    }else{
    name0.textContent = name1Input.value;
    name1.textContent = name2Input.value;
    }
}

// Buttons Functionality
rollButton.addEventListener('click' , rollDice);
holdButton.addEventListener('click' , holdScore);
newGameButton.addEventListener('click' , resetGame);
showInstructions.addEventListener('click' , showModal)
closeInstructions.addEventListener('click' , closeModal)
overlay.addEventListener('click' , closeModal)
closePenalty.addEventListener('click' , closePenaltiesModal)
newPenalty.addEventListener('click' , getNewPenalty)
addPlayers.addEventListener('click' , addPlayersFunction)
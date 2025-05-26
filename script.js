'use strict';

// تعريف العناصر من الـ HTML
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
// إعادة تعيين القيم الأولية
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


// الفانكشن المسؤلة عن اظهار المودال
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

// الفانكشن المسؤلة عن اغلاق المودال
function closePenaltiesModal(){
    penaltiesModal.classList.add('hidden');
    overlay.classList.add('hidden');
}

function closeModal(){
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}


// الفانكشن المسؤلة عن تبديل اللاعبين
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

// تعريف عنصر الصوت
const diceSound = new Audio('dice-roll.mp3');

// الفانكشن المسؤلة عن دوران النرد
function rollDice(){
    if(playing){
     // تشغيل صوت رمي النرد
     diceSound.currentTime = 0;
     diceSound.play();
     // توليد رقم عشوائى بين 1 و 6
     const diceNumber = Math.floor(Math.random() * 6) + 1;
     name1Input.value = '';
     name2Input.value = '';
     // ظهور النرد
     dice.classList.remove('hidden');
     dice.src = `images/dice-${diceNumber}.png`
     // التحقق اذا كان الرقم يساوى واحد او لا 
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


// ساوند الاضافة
const holdSound = new Audio('hold-sound.mp3');
const winSound = new Audio('fanfare-sound.mp3');
// الفانكشن المسؤلة عن حفظ النتيجة
function holdScore(){
    if(playing){
    // إضافة النتيجة الحالية إلى النتيجة الإجمالية
    scores[activePlayer] += currentscore;
    document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];
    holdSound.currentTime = 0;
    holdSound.play();
    if(scores[activePlayer] >= 100){
        document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
        document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
        dice.classList.add('hidden')
        playing = false;
        winSound.currentTime = 0;
        winSound.play();
        document.getElementById(`current--${activePlayer}`).textContent = 0;
        showPenaltiesModal();
    }
    else{
        currentscore = 0;
        document.getElementById(`current--${activePlayer}`).textContent = currentscore;
        switchPlayer();
    }
    }
}

// الفانكشن المسؤلة عن اعادة تعيين اللعبة
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

// اضافة الأحداث على الأزرار
rollButton.addEventListener('click' , rollDice);
holdButton.addEventListener('click' , holdScore);
newGameButton.addEventListener('click' , resetGame);
showInstructions.addEventListener('click' , showModal)
closeInstructions.addEventListener('click' , closeModal)
overlay.addEventListener('click' , closeModal)
closePenalty.addEventListener('click' , closePenaltiesModal)
newPenalty.addEventListener('click' , getNewPenalty)
addPlayers.addEventListener('click' , addPlayersFunction)
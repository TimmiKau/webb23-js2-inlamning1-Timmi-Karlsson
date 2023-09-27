//add button
const rockBtn = document.getElementById('rock')
const paperBtn = document.getElementById('paper')
const scissorsBtn = document.getElementById('scissors')

//add computer
const computer = document.querySelector('.computer')
const computerPlayerText = document.getElementById('computer-player')
const computerChoiceText = document.getElementById('computer-choice')
const computerResult = document.getElementById('computer-Result')
const computerScoreText = document.getElementById('computer-score')

// Game info user
const user = document.querySelector('.user')
const userPlayerText = document.getElementById('user-player')
const userChoiceText = document.getElementById('user-choice')
const userResult = document.getElementById('user-Result')
const userScoreText = document.getElementById('user-score')

//Computer
let computerChoice = 2
let computerScore = 0

//User
let userChoice = 1
let userScore = 0
let userName = addUserName()

function addUserName() {
  let name = prompt('Pleas enter your name:')
  return name
}


function fetchScoreBoardData() {

  fetch('/api/scoreboard')
    .then((response) => {
      if (response.ok) {
        console.log(response)
        return response.json()
      } else {
        throw new error('Failed to fetch scoreboard data')
      }
    })

    .then((scoreBoardData) => {
      const scoreboardDiv = document.getElementById('scoreboard')

      //Clear the div
      scoreboardDiv.innerHTML = ''

      //Make the title
      const sBTitle = document.createElement('h2')
      sBTitle.textContent = 'Scoreboard'
      scoreboardDiv.appendChild(sBTitle)

      //Loop through the fetched data
      scoreBoardData.forEach((entry) => {
        const entryElement = document.createElement('h3')
        entryElement.textContent = `${entry.player}: ${entry.score}p`
        scoreboardDiv.appendChild(entryElement)
      })
    })
    .catch((error) => {
      console.error('Error', error)
    })
}


function Computer() {
  let choice = Math.round(Math.random() * 2 + 1)
  console.log(choice)

  if (choice === 1) {
    //Rock
    computerChoice = 1
    computerChoiceText.innerHTML = 'Rock'
    evaluate()
  } else if (choice === 2) {
    //Paper
    computerChoice = 2
    computerChoiceText.innerHTML = 'Paper'
    evaluate()
  } else if (choice === 3) {
    //Scissors
    computerChoice = 3
    computerChoiceText.innerHTML = 'Scissors'
    evaluate()
  }
}

function evaluate() {
  if (computerChoice === userChoice) {
    // All Draw
    console.log('draw')
    userResult.innerHTML = 'Draw'
    computerResult.innerHTML = 'Draw'
    winner()
  } else if (
    (computerChoice === 1 && userChoice === 3) ||
    (computerChoice === 3 && userChoice === 2) ||
    (computerChoice === 2 && userChoice === 1)
  ) {
    console.log('computer is the winner')
    computerResult.innerHTML = 'Win'
    userResult.innerHTML = 'lose'
    computerScore++
    computerScoreText.innerHTML = computerScore
    winner()
  } else if (
    (computerChoice === 3 && userChoice === 1) ||
    (computerChoice === 2 && userChoice === 3) ||
    (computerChoice === 1 && userChoice === 2)
  ) {
    console.log('player is the winner')
    userResult.innerHTML = 'Win'
    computerResult.innerHTML = 'lose'
    userScore++
    userScoreText.innerHTML = userScore
    winner()
  }
}

function winner() {
  if (computerScore === 1) {
    disableButtons()
    const newScoreEntry = {player: userName, score: userScore}
    sendHighscoreData(newScoreEntry)
    showModal(`${userName} Highscore : ${userScore}`, resetGame)
  }
}


function showModal(message, callback) {
  const modal = document.getElementById('myModal')
  const modalMessage = document.getElementById('modalMessage')
  const modalBtn = document.getElementById('modalBtn')

  modalMessage.textContent = message

  modalBtn.addEventListener('click', function () {
    fetchScoreBoardData()
    callback()
  })
}

// Function to fetch and read highscore.json from the server
function fetchHighscoreData() {
  fetch('/api/readHighscore')
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch highscore data');
      }
    })
    .then((scoreBoardData) => {
    })
    .catch((error) => {
      console.error('Error', error);
    });
}

function sendHighscoreData(newScoreData) {

  fetch('/api/updateHighscore', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newScoreData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Failed to update highscore data. Server responded with status ${response.status}`);
      }
    })
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error('Error updating highscore data:', error);
    });
}




//Take user input
rockBtn.addEventListener('click', () => {
  console.log('test b')
  userChoice = 1
  userChoiceText.innerHTML = 'Rock'
  Computer()
})
paperBtn.addEventListener('click', () => {
  userChoice = 2
  userChoiceText.innerHTML = 'Paper'
  Computer()
})
scissorsBtn.addEventListener('click', () => {
  userChoice = 3
  userChoiceText.innerHTML = 'Scissors'
  Computer()
})

function startGame() {
  resetGame()
  userPlayerText.innerHTML = userName
  enableButtons()

  //Fetch scoreboard data
  fetchScoreBoardData()
}

function resetGame() {
  computerScore = 0
  userScore = 0
  computerScoreText.innerText = '0'
  userScoreText.innerText = '0'
  userChoiceText.innerHTML = ' '
  computerChoiceText.innerHTML = ' '
  userResult.innerHTML = ' '
  computerResult.innerHTML = ' '
  enableButtons()
}
function disableButtons() {
  rockBtn.disabled = true
  paperBtn.disabled = true
  scissorsBtn.disabled = true
}

function enableButtons() {
  rockBtn.disabled = false
  paperBtn.disabled = false
  scissorsBtn.disabled = false
}
startGame()
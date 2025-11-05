const boxes = document.querySelectorAll(".box");
const emojiContainer = document.querySelector(".emoji-container");
const playerAccount = document.querySelector(".start-game .player");
const form = document.querySelector(".start-game form");
const account = document.querySelector(".start-game > div:last-child");
const resetBtn = form.nextElementSibling;
const nextBtn = resetBtn.nextElementSibling;
const firstPlayer = document.querySelector(".first-player");
const secondPlayer = document.querySelector(".second-player");
const startGame = document.querySelector(".start-game");
const warningNameMsg = form.firstElementChild.lastElementChild;
const warningPassMsg = form.children[1].lastElementChild;
const closeBtn = document.querySelector(".close-btn");
const leftArrow = document.querySelector(".blue");
const rightArrow = document.querySelector(".red");
const asides = document.querySelectorAll("aside");
const asidesCloseBtns = document.querySelectorAll("aside .close-btn");

if (localStorage.FirstPlayer != null) {
  putSignedInPlayer("FirstPlayer", firstPlayer);
}
if (localStorage.FirstPlayer != null) {
  putSignedInPlayer("SecondPlayer", secondPlayer);
}

function putSignedInPlayer(key, player) {
  let localPlayerData = JSON.parse(localStorage.PlayersData) || [];
  for (let i = 0; i < localPlayerData.length; i++) {
    if (localPlayerData[i].username == localStorage[key]) {
      let profileImg = document.createElement("img");
      let name = document.createElement("h3");
      profileImg.src = localPlayerData[i].profile;
      name.innerHTML = localPlayerData[i].username;
      player.innerHTML = "";
      player.append(profileImg, name);
    }
  }
  player.classList.add("full");
}

let player;
firstPlayer.addEventListener("click", () => {
  if (firstPlayer.classList.contains("full")) {
    getPlayerInfo(firstPlayer);
    return;
  }
  player = firstPlayer;
  playerAccount.lastElementChild.innerHTML = "Player One";
  startGame.style.top = "50%";
  focusOnPlayer("#1496bc");
});
secondPlayer.addEventListener("click", () => {
  if (secondPlayer.classList.contains("full")) {
    getPlayerInfo(secondPlayer);
    return;
  }
  player = secondPlayer;
  playerAccount.lastElementChild.innerHTML = "Player Two";
  startGame.style.top = "50%";
  focusOnPlayer("#c05151");
});

function getPlayerInfo(player) {
  document.querySelector(".player-info")?.remove();

  let playerName = player.lastElementChild.innerHTML;
  let playerInfoCard = document.createElement("div");
  let signOutBtn = document.createElement("button");
  let closeBtn = document.createElement("div");
  let info = ["Matches", "Wins", "Losses", "Draws"];
  let localPlayerData = JSON.parse(localStorage.PlayersData) || [];
  let playerData;

  if (player == firstPlayer) {
    playerInfoCard.style.left = "-102px";
    signOutBtn.style.backgroundColor = " #1496bc";
  } else {
    playerInfoCard.style.right = "-102px";
    signOutBtn.style.backgroundColor = "#c05151";
  }

  playerInfoCard.className = "player-info";

  for (let i = 0; i < localPlayerData.length; i++) {
    if (localPlayerData[i].username == playerName.trim()) {
      playerData = localPlayerData[i];
      break;
    }
  }

  playerInfoCard.append(player.cloneNode(true));
  for (let i = 0; i < info.length; i++) {
    let row = document.createElement("div");
    let data = `
     <span>Total ${info[i]}</span>
     <span>:</span>
     <span>${playerData[`total${info[i]}`] || 0}</span>
  `;
    row.innerHTML = data;
    if (info[i] == "Matches") {
      row.setAttribute("title","open");
      row.addEventListener("click", () => {
        if (player == firstPlayer) {
          asides[0].classList.add("active");
        } else {
          asides[1].classList.add("active");
        }
        getMatchesData(row.previousElementSibling.lastElementChild.innerHTML)
      });
    }
    playerInfoCard.append(row);
  }

  signOutBtn.innerHTML = "Sing Out";
  closeBtn.classList = "close-btn";
  playerInfoCard.append(signOutBtn, closeBtn);
  player.parentElement.append(playerInfoCard);
  isPlayerInfoCardActive = true;

  signOutBtn.addEventListener("click", () => {
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].innerHTML = "";
      boxes[i].classList.remove("full");
    }
    player.innerHTML = `<span>+</span>`;
    player.classList.remove("full");
    playerInfoCard.remove();
  });

  closeBtn.addEventListener("click", () => {
    playerInfoCard.remove();
  });
}

function getMatchesData(playerName) {
  let matchesBox = document.querySelector(".matches-box");
  let playersData = getPlayersData();
  let player;

 for (let i = 0; i < 2; i++) {
  if (playerName == playersData[i].username) {
    player = playersData[i];
  }
 }

  const groupedByDate = player.matchHistory.reduce((acc, item) => {
  (acc[item.date] ??= []).push(item);
  return acc;
},{});

const groups = Object.entries(groupedByDate).map(([date, items]) => ({
  date,
  items
}));

console.log(groups)

 let data = `<h3 class="date">3 Aug 2025</h3>
        <div class="match-result">
          <div class="first-player">
               <img src="./imgs/(1).png" alt="face" />
        <h3>player one</h3>
          </div>
          <div class="result">
            <div>0</div> | <div>1</div>
          </div>
          <div class="second-player">
               <img src="./imgs/(1).png" alt="face" />
        <h3>player one</h3>
          </div>
        </div>`
}

closeBtn.addEventListener("click", () => {
  startGame.style.top = "-50%";
  resetBtn.click();
});

asidesCloseBtns.forEach(btn => {
 btn.addEventListener("click", () => {
  btn.parentElement.classList.remove("active");
})
})

function focusOnPlayer(playerClr) {
  playerAccount.style.backgroundColor = playerClr;
  form.style.backgroundColor = playerClr;
  nextBtn.style.backgroundColor = playerClr;
  resetBtn.style.backgroundColor = playerClr;
  account.style.color = playerClr;
  resetBtn.click();
}

let isNameCorrect = false;
let isPasswordCorrect = false;
let checkPattern = true;

let [playerName, password] = form.querySelectorAll("input");

playerName.addEventListener("input", () => {
  playerAccount.lastElementChild.innerHTML = playerName.value;
  if (!checkPattern) return;
  let nameReg = /^[a-zA-Z]{2,}(?:\s{1,4}[a-zA-Z]{2,})*$/i;
  if (nameReg.test(playerName.value.trim())) {
    warningNameMsg.style.display = "none";
    isNameCorrect = true;
  } else {
    warningNameMsg.style.display = "block";
    warningNameMsg.innerHTML =
      "Do not use any Spacial character (!,&,%,*,#...)";
    isNameCorrect = false;
  }
});

password.addEventListener("input", () => {
  if (!checkPattern) return;
  let passReg = /^(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/i;
  if (passReg.test(password.value.trim())) {
    warningPassMsg.style.display = "none";
    isPasswordCorrect = true;
  } else {
    warningPassMsg.innerHTML =
      "Your password should contain (Big character,Number,Special character)";
    warningPassMsg.style.display = "block";
    isPasswordCorrect = false;
  }
});

nextBtn.addEventListener("click", () => {
  let profileImg = document.createElement("img");
  let name = document.createElement("h3");
  let selectedImg = emojiContainer.querySelector(".active");

  if (checkPattern) {
    if (!(isPasswordCorrect && isNameCorrect)) return;
    if (singUp(selectedImg)) return;

    name.innerHTML = playerName.value;
    profileImg.src = selectedImg?.src || "./imgs/(1).png";
    isPasswordCorrect = false;
    isNameCorrect = false;
    if (player == firstPlayer) {
      localStorage.FirstPlayer = playerName.value.trim();
    } else {
      localStorage.SecondPlayer = playerName.value.trim();
    }
  } else if (singIn()) {
    let playerData = singIn();
    name.innerHTML = playerData.username;
    profileImg.src = playerData.profile;
    if (player == firstPlayer) {
      localStorage.FirstPlayer = playerName.value.trim();
    } else {
      localStorage.SecondPlayer = playerName.value.trim();
    }
  } else return;

  player.innerHTML = "";
  player.append(profileImg, name);
  player.classList.add("full");
  startGame.style.top = "-50%";
  resetBtn.click();
});

function singUp(profileImg) {
  let localPlayerData;
  if (localStorage.PlayersData) {
    localPlayerData = JSON.parse(localStorage.PlayersData);
  } else localPlayerData = [];

  for (let i = 0; i < localPlayerData.length; i++) {
    if (localPlayerData[i].username == playerName.value.trim()) {
      warningNameMsg.innerHTML = "The username is already used";
      warningNameMsg.style.display = "block";
      return true;
    }
  }

  let newPlayer = {
    username: playerName.value.trim(),
    password: password.value.trim(),
    profile: profileImg?.src || "./imgs/(1).png",
  };
  localPlayerData.push(newPlayer);
  localStorage.PlayersData = JSON.stringify(localPlayerData);
  return false;
}

function singIn() {
  let localPlayerData =
    localStorage.PlayersData == undefined
      ? [1]
      : JSON.parse(localStorage.PlayersData);

  for (let i = 0; i < localPlayerData.length; i++) {
    if (localPlayerData[i].username == playerName.value.trim()) {
      warningNameMsg.style.display = "none";
      if (localPlayerData[i].password == password.value.trim()) {
        warningPassMsg.style.display = "none";

        return localPlayerData[i];
      } else {
        warningPassMsg.innerHTML = "The password is incorrect!";
        warningPassMsg.style.display = "block";
        return false;
      }
    } else if (i == localPlayerData.length - 1) {
      warningNameMsg.innerHTML = "The username doesn't exist";
      warningNameMsg.style.display = "block";
      return false;
    }
  }
}

resetBtn.addEventListener("click", () => {
  let [name, password] = form.querySelectorAll("input");
  name.value = "";
  password.value = "";
  [...emojiContainer.children].forEach((icon) => {
    icon.className = "";
  });
});

account.addEventListener("click", () => {
  let profileEmoji = form.lastElementChild;

  if (profileEmoji.classList.contains("active")) {
    warningNameMsg.style.display = "none";
    warningPassMsg.style.display = "none";
    profileEmoji.classList = "";
    document.querySelector(".start-game h2").innerHTML = "Sign In";
    account.innerHTML = "Create Account";
    checkPattern = false;
  } else {
    checkPattern = true;
    profileEmoji.classList = "active";
    document.querySelector(".start-game h2").innerHTML = "Create Account";
    account.innerHTML = "Log In";
  }
});

[...emojiContainer.children].forEach((icon) => {
  icon.addEventListener("click", () => {
    [...emojiContainer.children].forEach((icon) => {
      icon.className = "";
    });
    icon.className = "active";
    playerAccount.firstElementChild.src = icon.src;
  });
});

let isFirstMove = true;
let nextMove;
let isFirstPlayerTurn;

document.addEventListener("click", (ele) => {
  let element = ele.target;
  let singInMsg = document.querySelector(".sign-in-msg");
  let isItFull =
    firstPlayer.classList.contains("full") &&
    secondPlayer.classList.contains("full");

  if (!isItFull) {
    singInMsg.style.top = "20px";
    return;
  } else singInMsg.style.top = "-45px";

  if (element.className == "full") return;
  if (element.className == "box") {
    createPopup(element);
  }
});

function createPopup(box) {
  boxes.forEach((box) => {
    if (box.children.length > 0) box.children[0].remove();
  });

  let popup = document.createElement("div");
  let X = document.createElement("div");
  let O = document.createElement("div");
  popup.className = "xo-popup";
  X.className = "x-shape";
  O.className = "o-shape";

  X.textContent = "❌";
  O.textContent = "✔️";

  if (isFirstPlayerTurn) {
    popup.classList.add("first-player-clr");
  } else {
    popup.classList.add("second-player-clr");
  }

  if (isFirstMove) {
    X.textContent = "X";
    O.textContent = "O";
  }
  popup.append(X, O);
  box.append(popup);
}

// Put What Player choose
let firstPlayerShape;
let secondPlayerShape;

document.addEventListener("click", (ele) => {
  let isTarget =
    ele.target.classList.contains("x-shape") ||
    ele.target.classList.contains("o-shape");
  if (!isTarget) return;

  let XOBox = ele.target;
  let box = XOBox.parentElement.parentElement;

  if (isFirstMove) {
    box.innerHTML = XOBox.innerHTML;
    choosePlayersShape(XOBox);
    changeArrowDirection();

    box.classList.add("full");
    isFirstMove = false;
    isFirstPlayerTurn = !isFirstPlayerTurn;
    return;
  }

  if (XOBox.className == "x-shape") {
    XOBox.parentElement.remove();
    return;
  }

  changeArrowDirection();

  box.classList.add("full");
  box.innerHTML = isFirstPlayerTurn ? firstPlayerShape : secondPlayerShape;
  isItWinner(box.innerHTML);
  isFirstPlayerTurn = !isFirstPlayerTurn;
});

function chooseWhoWillStart() {
  let randomNum = Math.round(Math.random() * 1);
  leftArrow.style.opacity = 0;
  rightArrow.style.opacity = 0;
  [leftArrow, rightArrow][randomNum].style.opacity = 1;
  isFirstPlayerTurn = [true, false][randomNum];
}
chooseWhoWillStart();

function choosePlayersShape(XOBox) {
  if (isFirstPlayerTurn) {
    firstPlayerShape = XOBox.classList.contains("x-shape") ? "X" : "O";
    secondPlayerShape = firstPlayerShape == "X" ? "O" : "X";
  } else {
    secondPlayerShape = XOBox.classList.contains("x-shape") ? "X" : "O";
    firstPlayerShape = secondPlayerShape == "X" ? "O" : "X";
  }
}
function changeArrowDirection() {
  if (isFirstPlayerTurn) {
    leftArrow.style.opacity = 0;
    rightArrow.style.opacity = 1;
  } else {
    rightArrow.style.opacity = 0;
    leftArrow.style.opacity = 1;
  }
}
const options = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

function isItWinner(shape) {
  for (let i = 0; i < options.length; i++) {
    let counter = 0;
    for (let j = 0; j < 3; j++) {
      if (
        boxes[options[i][j] - 1].textContent.toLowerCase() ===
        shape.toLowerCase()
      )
        counter++;
      if (counter == 3) {
        gameEndPopup(false);
        return;
      }
    }
  }

  let fullBoxes = 0;
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].classList.contains("full")) fullBoxes++;
  }
  if (fullBoxes == 9) gameEndPopup(true);
}

function gameEndPopup(isItDraw) {
  let winner = (isFirstPlayerTurn ? firstPlayer : secondPlayer).cloneNode(true);
  let container = document.createElement("div");
  let header = document.createElement("h2");
  let button = document.createElement("button");

  container.className = "game-end-popup";
  button.innerHTML = "Play Again";
  container.append(header, button);
  document.body.append(container);

  if (isItDraw) {
    header.innerHTML = `It's A Draw!`;
    let div = document.createElement("div");
    let span = document.createElement("span");
    div.style = "display: flex;align-items: center;gap: 23px";
    span.style.fontSize = "40px";
    span.innerHTML = "🫱🏻‍🫲🏼";
    div.append(firstPlayer.cloneNode(true));
    div.append(span);
    div.append(secondPlayer.cloneNode(true));

    header.parentElement.append(div);
    registerMatchesData(true);
  } else {
    header.innerHTML = `The Winner is:`;
    header.parentElement.append(winner);
    registerMatchesData(false);
  }

  button.addEventListener("click", () => {
    boxes.forEach((box) => {
      box.innerHTML = "";
      box.classList.remove("full");
    });
    isFirstMove = true;
    container.remove();
  });
}

function registerMatchesData(isItDraw) {
  let [firstPlayerData, secondPlayerData, localPlayerData] = getPlayersData();

  firstPlayerData.totalMatches++;
  secondPlayerData.totalMatches++;

  let result;
  if (isItDraw) {
    firstPlayerData.totalDraws++;
    secondPlayerData.totalDraws++;
    result = "Draw";
  } else if (isFirstPlayerTurn) {
    firstPlayerData.totalWins++;
    secondPlayerData.totalLosses++;
    result = "Win";
  } else {
    firstPlayerData.totalLosses++;
    secondPlayerData.totalWins++;
    result = "Lose";
  }
  registerMatchDetails([
    firstPlayerData,
    secondPlayerData,
    localPlayerData,
    result,
  ]);
}

function registerMatchDetails(data) {
  let [firstPlayerData, secondPlayerData, localPlayerData, result] = data;
  let date = new Date().toISOString().split("T")[0];

  let first = {
    date: date,
    matchId: `Ma-${Date.now()}`,
    opponent: secondPlayerData.username,
    result: result,
    score: {
      player: result == "Draw" ? 0 : result == "Win" ? 1 : 0,
      opponent: result == "Draw" ? 0 : result == "Win" ? 0 : 1,
    },
  };

  let second = { ...first };
  second.opponent = firstPlayerData.username;
  second.result = result == "Draw" ? "Draw" : result == "Win" ? "Lose" : "Win";
  second.score = {
    player: first.score.opponent,
    opponent: first.score.player,
  };

  firstPlayerData.matchHistory.push(first);
  secondPlayerData.matchHistory.push(second);
  localStorage.PlayersData = JSON.stringify(localPlayerData);
}

function getPlayersData() {
  let localPlayerData = JSON.parse(localStorage.PlayersData) || [];
  let firstPlayerName = firstPlayer.lastElementChild.innerHTML;
  let secondPlayerName = secondPlayer.lastElementChild.innerHTML;
  let first, second;

  for (let i = 0; i < localPlayerData.length; i++) {
    if (localPlayerData[i].username == firstPlayerName)
      first = localPlayerData[i];
    if (localPlayerData[i].username == secondPlayerName)
      second = localPlayerData[i];
  }
  initializePlayerData(first);
  initializePlayerData(second);
  return [first, second, localPlayerData];
}

function initializePlayerData(player) {
  player.totalMatches = player.totalMatches || 0;
  player.totalDraws = player.totalDraws || 0;
  player.totalWins = player.totalWins || 0;
  player.totalLosses = player.totalLosses || 0;
  player.matchHistory = player.matchHistory || [];
  return player;
}

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

console.log(localStorage["First Player"]);
if (localStorage["First Player"] != null) {
  putSignedInPlayer(["First Player"], firstPlayer);
}
if (localStorage["Second Player"] != null) {
  putSignedInPlayer(["Second Player"], secondPlayer);
}

function putSignedInPlayer(key, player) {
  let localPlayerData = JSON.parse(localStorage.getItem("players Data")) || [];
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
  player = firstPlayer;
  playerAccount.lastElementChild.innerHTML = "Player One";
  startGame.style.top = "50%";
  focusOnPlayer("#1496bc");
});
secondPlayer.addEventListener("click", () => {
  player = secondPlayer;
  playerAccount.lastElementChild.innerHTML = "Player Two";
  startGame.style.top = "50%";
  focusOnPlayer("#c05151");
});

closeBtn.addEventListener("click", () => {
  startGame.style.top = "-50%";
  resetBtn.click();
});

function focusOnPlayer(playerClr) {
  playerAccount.style.backgroundColor = playerClr;
  form.style.backgroundColor = playerClr;
  nextBtn.style.backgroundColor = playerClr;
  resetBtn.style.backgroundColor = playerClr;
  resetBtn.click();
  account.style.color = playerClr;
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
      localStorage.setItem("First Player", playerName.value.trim());
    } else {
      localStorage.setItem("Second Player", playerName.value.trim());
    }
  } else if (singIn()) {
    let playerData = singIn();
    name.innerHTML = playerData.username;
    profileImg.src = playerData.profile;
    if (player == firstPlayer) {
      localStorage.setItem("First Player", playerName.value.trim());
    } else {
      localStorage.setItem("Second Player", playerName.value.trim());
    }
  } else return;

  player.innerHTML = "";
  player.append(profileImg, name);
  player.classList.add("full");
  startGame.style.top = "-50%";
  resetBtn.click();
});

function singUp(profileImg) {
  let localPlayerData = JSON.parse(localStorage.getItem("players Data")) || [];

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
  localStorage.setItem("players Data", JSON.stringify(localPlayerData));
  return false;
}

function singIn() {
  let localPlayerData = JSON.parse(localStorage.getItem("players Data")) || [];

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
// Create XO popup in box
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
  let isTarget = ele.target.classList.contains("x-shape") || ele.target.classList.contains("o-shape");
  if (!isTarget) return;

  let XOBox = ele.target;
  let box = XOBox.parentElement.parentElement;

  if (isFirstMove) {
    box.innerHTML = XOBox.innerHTML;
    choosePlayersShape(XOBox)
    changeArrowDirection()

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
  isFirstPlayerTurn = !isFirstPlayerTurn;
  isItWinner(box.innerHTML);
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
        gameEndPopup(
          (isFirstPlayerTurn ? firstPlayer : secondPlayer).lastElementChild
            .innerHTML
        );
        return;
      }
    }
  }

  let fullBoxes = 0;
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].classList.contains("full")) fullBoxes++;
  }
  if (fullBoxes == 9) gameEndPopup(null);
}

function gameEndPopup(winner) {
  let container = document.createElement("div");
  let header = document.createElement("h2");
  let button = document.createElement("button");

  if (winner) {
    header.innerHTML = `The Winner is: ${winner}`;
  } else {
    header.innerHTML = `It's A Draw!`;
  }
  container.className = "game-end-popup";
  button.innerHTML = "Play Again";

  container.append(header, button);
  document.body.append(container);

  button.addEventListener("click", () => {
    boxes.forEach((box) => {
      box.innerHTML = "";
      box.classList.remove("full");
    });
    isFirstMove = true;
    container.remove();
  });
}

const body = document.body;
const boxes = document.querySelectorAll(".box");
const emojiContainer = document.querySelector(".emoji-container");
const playerOne = document.querySelector(
  ".start-game .players div:first-child"
);
const playerTwo = playerOne.nextElementSibling;
const form = document.querySelector(".start-game form");
const account = document.querySelector(".start-game > div:last-child");
const resetBtn = form.nextElementSibling;
const nextBtn = resetBtn.nextElementSibling;

playerOne.addEventListener("click", () => {
  focusOnPlayer(playerTwo, playerOne, "#1496bc");
});
playerTwo.addEventListener("click", () => {
  focusOnPlayer(playerOne, playerTwo, "#c05151");
});

function focusOnPlayer(firstPlayer, secondPlayer, playerClr) {
  firstPlayer.classList.remove("active");
  secondPlayer.classList.add("active");
  form.style.backgroundColor = playerClr;
  nextBtn.style.backgroundColor = playerClr;
  resetBtn.style.backgroundColor = playerClr;
  account.style.color = playerClr;
}

let isNameCorrect = false;
let isPasswordCorrect = false;

let [playerName, password] = form.querySelectorAll("input");
playerName.addEventListener("input", () => {
  let nameReg = /^[a-zA-Z]{2,}(?:\s{1,4}[a-zA-Z]{2,})*$/i;
  if (nameReg.test(playerName.value)) {
    form.firstElementChild.lastElementChild.style.display = "none";
    isNameCorrect = true;
  } else {
    isNameCorrect = false;
    form.firstElementChild.lastElementChild.style.display = "block";
  }
});

password.addEventListener("input", () => {
  let passReg = /^(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/i;
  if (passReg.test(password.value)) {
    form.children[1].lastElementChild.style.display = "none";
    isPasswordCorrect = true;
  } else {
    isPasswordCorrect = false;
    form.children[1].lastElementChild.style.display = "block";
  }
});

let isFirstPlayerSignin = false;
let isSecondPlayerSignin = false;
nextBtn.addEventListener("click", () => {
  if (!(isNameCorrect && isPasswordCorrect)) return;
  let portfolio = document.createElement("img");
  let name = document.createElement("h3");
  let emoji = emojiContainer.querySelector(".active");
  portfolio.src = emoji?.src || "./imgs/(1).png";
  name.innerHTML = playerName.value;

  if (playerOne.classList.contains("active")) {
    playerOne.innerHTML = "";
    playerOne.append(portfolio, name);
    isFirstPlayerSignin = true;
    if (!isSecondPlayerSignin) playerTwo.click();
  } else {
    playerTwo.innerHTML = "";
    playerTwo.append(portfolio, name);
    isSecondPlayerSignin = true;
    if (!isFirstPlayerSignin) playerOne.click();
  }

  isPasswordCorrect = false;
  isNameCorrect = false;
  resetBtn.click();

  if (isFirstPlayerSignin && isSecondPlayerSignin) {
    let container = document.querySelector(".start-game")
    container.style.width = 0;
    container.style.padding = 0;
    container.style.border = 0;
  }
});

resetBtn.addEventListener("click", () => {
  let [name, password] = form.querySelectorAll("input");
  name.value = "";
  password.value = "";
});

account.addEventListener("click", () => {
  let profileEmoji = form.lastElementChild;

  if (profileEmoji.classList.contains("active")) {
    profileEmoji.classList = "";
    document.querySelector(".start-game h2").innerHTML = "Log IN";
    account.innerHTML = "Create Account";
  } else {
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
  });
});

let isFirstMove = true;
let lastMove;
let playerClr;

document.addEventListener("click", (ele) => {
  if (ele.target.className == "full") return;
  if (ele.target.className == "box") {
    boxes.forEach((box) => {
      if (box.children.length > 0) box.children[0].remove();
    });

    let popup = document.createElement("div");
    let X = document.createElement("div");
    let O = document.createElement("div");

    popup.className = "xo-popup";
    X.className = "x";
    O.className = "o";

    if (isFirstMove) {
      X.textContent = "X";
      O.textContent = "O";
    } else {
      X.style.backgroundColor = "white";
      O.style.backgroundColor = "white";

      if (playerClr == lastMove) {
        popup.style.backgroundColor = "#283ecf";
        popup.classList.add("change-clr");
      }

      X.textContent = "❌";
      O.textContent = "✔️";
    }
    popup.append(X, O);
    ele.target.append(popup);
  }
});

document.addEventListener("click", (ele) => {
  let isTarget = ele.target.className == "x" || ele.target.className == "o";
  if (!isTarget) return;

  let box = ele.target.parentElement.parentElement;

  if (isFirstMove) {
    box.innerHTML = ele.target.className == "x" ? "X" : "O";
    playerClr = ele.target.className;
    lastMove = ele.target.className == "x" ? "x" : "o";
    box.classList.add("full");
    isFirstMove = false;
    return;
  }

  if (ele.target.className == "x") {
    ele.target.parentElement.remove();
    return;
  }

  box.innerHTML = lastMove == "x" ? "O" : "X";
  lastMove = lastMove == "x" ? "o" : "x";
  box.classList.add("full");
  isItWinner(lastMove);
});

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
function isItWinner(lastMove) {
  for (let i = 0; i < options.length; i++) {
    let counter = 0;
    for (let j = 0; j < 3; j++) {
      if (boxes[options[i][j] - 1].textContent.toLowerCase() === lastMove)
        counter++;

      if (counter == 3) {
        gameEndPopup(lastMove);
        return;
      }
    }
  }
}

function gameEndPopup(winner) {
  let container = document.createElement("div");
  let header = document.createElement("h2");
  let button = document.createElement("button");

  container.className = "game-end-popup";
  header.innerHTML = `The Winner is: ${winner}`;
  button.innerHTML = "Play Again";

  container.append(header, button);
  document.body.append(container);

  button.addEventListener("click", () => {
    boxes.forEach((box) => (box.innerHTML = ""));
    container.remove();
  });
}

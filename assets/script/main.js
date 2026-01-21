/**
 * Tic Tac Toe Game
 * ----------------
 * Vanilla JavaScript project.
 *
 * Features:
 * - Sign In / Sign Up system
 * - Local & Session Storage persistence
 * - Match history & statistics
 * - Two-player gameplay
 *
 * Author: Souhayl
 */

/*=================== Get Elements ==================*/
const UI = {
  registerPlayers: document.querySelector(".register-players"),
  registerCloseBtn: document.querySelector(".register-players .close-btn"),
  registerCardHeader:  document.querySelector(".register-players h2"),
  playerAccount: document.querySelector(".register-players .player"),
  form: document.querySelector(".register-players form"),
  authBtn: document.getElementById("authBtn"),
  emojiContainer: document.querySelector(".emoji-container"),
  emojis: document.querySelectorAll(".emoji-container img"),
  resetBtn: document.getElementById("reset"),
  nextBtn: document.getElementById("next"),
  playerNameField: document.getElementById("name"),
  passwordField: document.getElementById("password"),
  warningNameMsg: document.querySelector(".warning.name"),
  warningPassMsg: document.querySelector(".warning.password"),
  firstPlayer: document.querySelector(".first-player .account"),
  secondPlayer: document.querySelector(".second-player .account"),
  cardInfoCloseBtn: document.querySelectorAll(".player-info .close-btn"),
  leftArrow: document.querySelector(".blue"),
  start: document.querySelector(".start"),
  rightArrow: document.querySelector(".red"),
  boxes: document.querySelectorAll(".box"),
  asides: document.querySelectorAll("aside .matches-container"),
  asidesCloseBtns: document.querySelectorAll("aside .close-btn"),
  roundContainer: document.querySelector(".rounds"),
  firstPlayerScore: document.querySelector(".rounds .first-player-score"),
  secondPlayerScore: document.querySelector(".rounds .second-player-score"),
  roundNum: document.querySelector(".rounds .round-num span"),
  signOutBtns: document.querySelectorAll(".player-info button"),
  signInMsg: document.querySelector(".sign-in-msg"),
  totalMatchesContainers: document.querySelectorAll(".player-info div:nth-child(2)")
};

/*=================== Game State ==================*/
const gameState = {
  isNameCorrect: false,
  isPasswordCorrect: false,
  isSignUp: true,
  isFirstMove: true,
  isFirstPlayerTurn: true,
}

/*=================== Data Module ==================*/
let player;

const DataModule = (function () {
  let localPlayerData = localStorage.PlayersData
    ? JSON.parse(localStorage.PlayersData)
    : [];

  if (sessionStorage.roundNum == null) {
    sessionStorage.roundNum = 1;
    sessionStorage.firstPlayerScore = 0;
    sessionStorage.secondPlayerScore = 0;
  }

  UI.roundNum.innerHTML = sessionStorage.roundNum;
  UI.secondPlayerScore.innerHTML = sessionStorage.secondPlayerScore;
  UI.firstPlayerScore.innerHTML = sessionStorage.firstPlayerScore;

  function addNewPlayer(newPlayer) {
    newPlayer.totalMatches = 0;
    newPlayer.totalWins = 0;
    newPlayer.totalLosses = 0;
    newPlayer.totalDraws = 0;
    newPlayer.matchHistory = [];
    localPlayerData.push(newPlayer);
    localStorage.PlayersData = JSON.stringify(localPlayerData);
  }

  function getPlayerInfo(name) {
    return localPlayerData.find((user) => user.username == name.trim());
  }

  function getMatchesGroupByDate(playerData) {
    return playerData.matchHistory.reduce((acc, item) => {
      (acc[item.date] ??= []).push(item);
      return acc;
    }, {});
  }

  function addLastSignInPlayerName() {
    if (player == UI.firstPlayer) {
      localStorage.FirstPlayer = UI.playerNameField.value.trim();
      return;
    }

    localStorage.SecondPlayer = UI.playerNameField.value.trim();
  }

  function registerMatchesData(isItDraw) {
    let localPlayerData = JSON.parse(localStorage.PlayersData);
    let firstPlayerName = UI.firstPlayer.lastElementChild.innerHTML;
    let secondPlayerName = UI.secondPlayer.lastElementChild.innerHTML;
    let firstPlayerData = localPlayerData.find(
      (p) => p.username == firstPlayerName,
    );
    let secondPlayerData = localPlayerData.find(
      (p) => p.username == secondPlayerName,
    );

    firstPlayerData.totalMatches++;
    secondPlayerData.totalMatches++;

    +UI.roundNum.innerHTML++;

    let result;

    if (isItDraw) {
      firstPlayerData.totalDraws++;
      secondPlayerData.totalDraws++;
      result = "Draw";
    } else if (gameState.isFirstPlayerTurn) {
      firstPlayerData.totalWins++;
      secondPlayerData.totalLosses++;
      +UI.firstPlayerScore.innerHTML++;
      result = "Win";
    } else {
      firstPlayerData.totalLosses++;
      secondPlayerData.totalWins++;
      +UI.secondPlayerScore.innerHTML++;
      result = "Lose";
    }

    sessionStorage.roundNum = +UI.roundNum.innerHTML;
    sessionStorage.firstPlayerScore = +UI.firstPlayerScore.innerHTML;
    sessionStorage.secondPlayerScore = +UI.secondPlayerScore.innerHTML;

    registerMatchDetails([firstPlayerData, secondPlayerData, result]);

    localStorage.PlayersData = JSON.stringify(localPlayerData);
  }

  function registerMatchDetails(data) {
    let [firstPlayerData, secondPlayerData, result] = data;
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
    second.result =
      result == "Draw" ? "Draw" : result == "Win" ? "Lose" : "Win";
    second.score = {
      player: first.score.opponent,
      opponent: first.score.player,
    };

    firstPlayerData.matchHistory.push(first);
    secondPlayerData.matchHistory.push(second);
  }

  return {
    doFirstPlayerSignedIn: localStorage.FirstPlayer != null,
    doSecondPlayerSignedIn: localStorage.SecondPlayer != null,
    addNewPlayer,
    getPlayerInfo,
    getMatchesGroupByDate,
    addLastSignInPlayerName,
    registerMatchesData,
  };
})();

/*=================== UI Module ==================*/
const UIModule = (function () {
  // Get Last Signed In Players
  if (DataModule.doFirstPlayerSignedIn) {
    let playerData = DataModule.getPlayerInfo(localStorage.FirstPlayer);
    if (playerData) createPlayerAccount(playerData, UI.firstPlayer);
  }

  if (DataModule.doSecondPlayerSignedIn) {
    let playerData = DataModule.getPlayerInfo(localStorage.SecondPlayer);
    if (playerData) createPlayerAccount(playerData, UI.secondPlayer);
  }

  function createPlayerAccount(
    playerName = UI.playerNameField.value,
    playerContainer = player,
  ) {
    let profileImg = document.createElement("img");
    let name = document.createElement("h3");
    let selectedImg = UI.emojiContainer.querySelector(".active");

    name.innerHTML = playerName;
    profileImg.src = selectedImg?.src || "./assets/imgs/(1).png";

    if (typeof playerName == "object") {
      name.innerHTML = playerName.username;
      profileImg.src = playerName.profile;
    }

    playerContainer.innerHTML = "";
    playerContainer.append(profileImg, name);
    playerContainer.classList.add("full");
    UI.registerPlayers.classList.remove("active");
    UI.resetBtn.click();
  }

  function showPlayerInfo(playerEle, playerClr, num) {
    if (playerEle.classList.contains("full")) {
      let playerInfoCard = playerEle.nextElementSibling;
      let totalMatchesContainer = playerInfoCard.querySelector(
        "[data-totalMatches]",
      );
      let totalWinsContainer = playerInfoCard.querySelector("[data-totalWins]");
      let totalLossesContainer =
        playerInfoCard.querySelector("[data-totalLosses]");
      let totalDrawsContainer =
        playerInfoCard.querySelector("[data-totalDraws]");
      let playerData = DataModule.getPlayerInfo(
        playerEle.lastElementChild.innerHTML,
      );

      playerInfoCard.classList.add("active");
      playerInfoCard.firstElementChild.innerHTML = playerEle.innerHTML;
      totalMatchesContainer.innerHTML = playerData.totalMatches;
      totalWinsContainer.innerHTML = playerData.totalWins;
      totalLossesContainer.innerHTML = playerData.totalLosses;
      totalDrawsContainer.innerHTML = playerData.totalDraws;
      return;
    }

    player = playerEle;
    UI.playerAccount.lastElementChild.innerHTML = `Player ${num}`;
    UI.registerPlayers.classList.add("active");
    focusOnPlayer(playerClr);
  }

  function focusOnPlayer(playerClr) {
    UI.playerAccount.style.background = playerClr;
    UI.form.style.background = playerClr;
    UI.nextBtn.style.background = playerClr;
    UI.resetBtn.style.background = playerClr;
    UI.authBtn.style.color = playerClr.match(/#\w+/gi)[1];
    UI.resetBtn.click();
  }

  function showAllMatches(ele) {
    let playerInfoCard = ele.closest(".player-info");
    let player = playerInfoCard.firstElementChild;
    let asideNum = 1;

    UI.asides[0].parentElement.classList.remove("active");
    UI.asides[1].parentElement.classList.add("active");

    if (playerInfoCard.hasAttribute("data-first")) {
      UI.asides[0].parentElement.classList.add("active");
      UI.asides[1].parentElement.classList.remove("active");
      asideNum = 0;
    }

    getMatchesData(player, asideNum);
  }

  function getMatchesData(player, asideNum) {
    let playerName = player.lastElementChild.innerHTML;
    let playerData = DataModule.getPlayerInfo(playerName);
    let matchesByDate = DataModule.getMatchesGroupByDate(playerData);

    UI.asides[asideNum].innerHTML = "";

    for (let date in matchesByDate) {
      let matchesBox = document.createElement("div");

      let data = `
      <h3 class="date">${date}</h3>
      ${createMatchesBoxes(matchesByDate[date], player)}
      `;

      matchesBox.className = "matches-box";
      matchesBox.innerHTML = data;
      UI.asides[asideNum].append(matchesBox);
    }
  }

  function createMatchesBoxes(matchesGroup, player) {
    let matches = "";

    matchesGroup.forEach((match) => {
      let playerScore = match.score.player;
      let opponentScore = match.score.opponent;
      let opponent = DataModule.getPlayerInfo(match.opponent);
      let bgClr = player.classList.contains("second-player-clr")
        ? ""
        : "second-player-clr";

      let matchResultBox = `
        <div class="match-result">

          ${player.outerHTML}

          <div class="result">
            <div>${playerScore}</div> | <div>${opponentScore}</div>
          </div>

          <div class="account ${bgClr}">
            <img src="${opponent.profile}" alt="face" />
            <h3>${opponent.username}</h3>
          </div>

        </div>`;

      matches += matchResultBox;
    });

    return matches;
  }

  function signOut(ele) {
    let playerInfoCard = ele.closest(".player-info");
    let playerProfile = playerInfoCard.previousElementSibling;

    UI.roundNum.innerHTML = 1;
    UI.firstPlayerScore.innerHTML = 0;
    UI.secondPlayerScore.innerHTML = 0;

    UI.boxes.forEach((ele) => {
      ele.innerHTML = "";
      ele.classList.remove("full");
    });

    playerProfile.innerHTML = `<span>+</span>`;
    playerProfile.classList.remove("full");
    getPlayersProfiles();
    playerInfoCard.classList.remove("active");

    sessionStorage.roundNum = 1;
    sessionStorage.firstPlayerScore = 0;
    sessionStorage.secondPlayerScore = 0;

    UI.roundNum.innerHTML = 1;
    UI.secondPlayerScore.innerHTML = 0;
    UI.firstPlayerScore.innerHTML = 0;
  }

  function signUp() {
    if (!(gameState.isPasswordCorrect && gameState.isNameCorrect)) return;

    let selectedImg = UI.emojiContainer.querySelector(".active");

    if (DataModule.getPlayerInfo(UI.playerNameField.value.trim())) {
      UI.warningNameMsg.innerHTML = "The username is already used";
      UI.warningNameMsg.style.display = "block";
      return true;
    }

    DataModule.addNewPlayer({
      username: UI.playerNameField.value.trim(),
      password: UI.passwordField.value.trim(),
      profile: selectedImg?.src || "./assets/imgs/(1).png"
    });

    DataModule.addLastSignInPlayerName();
    createPlayerAccount();
    gameState.isPasswordCorrect = false;
    gameState.isNameCorrect = false;

    return false;
  }

  function signIn() {
    let playerData = DataModule.getPlayerInfo(UI.playerNameField.value);

    if (playerData == undefined) {
      UI.warningNameMsg.innerHTML = "The username doesn't exist";
      UI.warningNameMsg.style.display = "block";
      return false;
    }

    UI.warningNameMsg.style.display = "none";

    if (playerData.password !== password.value.trim()) {
      UI.warningPassMsg.innerHTML = "The password is incorrect!";
      UI.warningPassMsg.style.display = "block";
      return false;
    }

    UI.warningPassMsg.style.display = "none";

    DataModule.addLastSignInPlayerName();
    createPlayerAccount(playerData);
    return playerData;
  }

  function resetFields() {
    UI.playerNameField.value = "";
    UI.passwordField.value = "";
    UI.emojis.forEach((icon) => {
      icon.className = "";
    });
  }

  function registerPlayer() {
    if (gameState.isSignUp) {
      UIModule.signUp();
    } else UIModule.signIn();

    getPlayersProfiles();
  }

  function checkUsername() {
    let playerProfileName = UI.playerAccount.lastElementChild;
    playerProfileName.innerHTML = UI.playerNameField.value;

    if (!gameState.isSignUp) return;

    let nameReg = /^[a-zA-Z]{2,}(?:\s{1,4}[a-zA-Z]{1,})*$/i;
    let playerName = UI.playerNameField.value.trim();

    if (nameReg.test(playerName)) {
      UI.warningNameMsg.style.display = "none";
      gameState.isNameCorrect = true;
    } else {
      UI.warningNameMsg.style.display = "block";
      UI.warningNameMsg.innerHTML =
        "Do not use any Spacial character (!,&,%,*,#...)";
      gameState.isNameCorrect = false;
    }
  }

  function checkPassword() {
    if (!gameState.isSignUp) return;

    let passReg = /^(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/i;

    if (passReg.test(UI.passwordField.value.trim())) {
      UI.warningPassMsg.style.display = "none";
      gameState.isPasswordCorrect = true;
    } else {
      UI.warningPassMsg.innerHTML =
        "Your password should contain (Number,Special character)";
      UI.warningPassMsg.style.display = "block";
      gameState.isPasswordCorrect = false;
    }
  }

  function getPlayersProfiles() {
    const playersProfiles = UI.roundContainer.querySelectorAll(".account");
    let players = [UI.firstPlayer, UI.secondPlayer];

    for (let i in [...playersProfiles]) {
      playersProfiles[i].innerHTML = "<span>?</span>";

      if (players[i].classList.contains("full")) {
        playersProfiles[i].innerHTML = "";
        playersProfiles[i].innerHTML = players[i].innerHTML;
      }
    }
  }
  getPlayersProfiles();

  function toggleSignInUp() {
    let profileEmoji = UI.form.lastElementChild;

    gameState.isSignUp = !gameState.isSignUp;

    if (profileEmoji.classList.contains("active")) {
      UI.warningNameMsg.style.display = "none";
      UI.warningPassMsg.style.display = "none";
      profileEmoji.classList = "";
      UI.registerCardHeader.innerHTML = "Sign In";
      UI.authBtn.innerHTML = "Sign Up";
    } else {
      profileEmoji.classList = "active";
      UI.registerCardHeader.innerHTML = "Create Account";
      UI.authBtn.innerHTML = "Sign In";
    }
  }

  function selectEmoji(icon) {
    UI.emojis.forEach((e) => (e.className = ""));
    icon.className = "active";
    UI.playerAccount.firstElementChild.src = icon.src;
  }

  function checkIfPlayersSignedIn(box) {
    let isItFull =
      UI.firstPlayer.classList.contains("full") &&
      UI.secondPlayer.classList.contains("full");

    if (!isItFull) {
      UI.signInMsg.style.top = "20px";
      return;
    } else UI.signInMsg.style.top = "-65px";

    if (box.classList.contains("full")) return;
    createPopup(box);
  }

  function createPopup(box) {
    let XOpopup = document.querySelector(".xo-popup");

    XOpopup?.remove();

    let bgClr = "second-player-clr";
    let XContent = "❌";
    let OContent = "✔️";
    UI.start.innerHTML = "PLAY";

    if (gameState.isFirstPlayerTurn) {
      bgClr = "first-player-clr";
    }

    if (gameState.isFirstMove) {
      XContent = "X";
      OContent = "O";
      UI.start.innerHTML = "START";
    }

    let popup = `
    <div class="xo-popup ${bgClr}">
    <div class="x-shape">${XContent}</div>
    <div class="o-shape">${OContent}</div>
    </div>
    `;

    box.insertAdjacentHTML("beforeend", popup);

    let XShape = document.querySelector(".x-shape");
    let OShape = document.querySelector(".o-shape");

    XShape.addEventListener("click", (e) => chooseShape(e, XShape));
    OShape.addEventListener("click", (e) => chooseShape(e, OShape));
  }

  let firstPlayerShape;
  let secondPlayerShape;

  function chooseShape(e, XOBox) {
    e.stopPropagation();

    let box = XOBox.parentElement.parentElement;

    if (gameState.isFirstMove) {
      box.innerHTML = XOBox.innerHTML;
      choosePlayersShape(XOBox);
      changeArrowDirection();

      box.classList.add("full");
      gameState.isFirstMove = !gameState.isFirstMove;
      gameState.isFirstPlayerTurn = !gameState.isFirstPlayerTurn;
      return;
    }

    if (XOBox.className == "x-shape") {
      XOBox.parentElement.remove();
      return;
    }

    changeArrowDirection();

    box.classList.add("full");
    box.innerHTML = gameState.isFirstPlayerTurn ? firstPlayerShape : secondPlayerShape;
    checkWinner(box.innerHTML);
    gameState.isFirstPlayerTurn = !gameState.isFirstPlayerTurn;
  }

  function chooseWhoWillStart() {
    let randomNum = Math.round(Math.random() * 1);
    UI.leftArrow.style.opacity = 0;
    UI.rightArrow.style.opacity = 0;
    [UI.leftArrow, UI.rightArrow][randomNum].style.opacity = 1;
    gameState.isFirstPlayerTurn = [true, false][randomNum];
  }
  chooseWhoWillStart();

  function choosePlayersShape(XOBox) {
    if (gameState.isFirstPlayerTurn) {
      firstPlayerShape = XOBox.classList.contains("x-shape") ? "X" : "O";
      secondPlayerShape = firstPlayerShape == "X" ? "O" : "X";
    } else {
      secondPlayerShape = XOBox.classList.contains("x-shape") ? "X" : "O";
      firstPlayerShape = secondPlayerShape == "X" ? "O" : "X";
    }
  }

  function changeArrowDirection() {
    UI.rightArrow.style.opacity = 0;
    UI.leftArrow.style.opacity = 1;

    if (gameState.isFirstPlayerTurn) {
      UI.leftArrow.style.opacity = 0;
      UI.rightArrow.style.opacity = 1;
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

  function checkWinner(shape) {
    for (let option of options) {

      let counter = 0;

      for (let ind of option) {

        if (UI.boxes[ind - 1].textContent.toLowerCase() === shape.toLowerCase())
          counter++;

        if (counter == 3) {
          gameEndPopup(false);
          return;
        }
      }
    }

    let fullBoxes = 0;

    UI.boxes.forEach((box) =>
      box.classList.contains("full") ? fullBoxes++ : "",
    );

    if (fullBoxes == 9) gameEndPopup(true);
  }

  function gameEndPopup(isItDraw) {
    let headerTxt = `The Winner is:`;
    let winner = (
      gameState.isFirstPlayerTurn ? UI.firstPlayer : UI.secondPlayer
    ).cloneNode(true).outerHTML;

    if (isItDraw) {
      headerTxt = `It's A Draw!`;
      winner = `
       <div style="display: flex;align-items: center;gap: 16px">
          ${UI.firstPlayer.cloneNode(true).outerHTML}
          <span style="font-size:40px;">🫱🏻‍🫲🏼</span>
          ${UI.secondPlayer.cloneNode(true).outerHTML}
        </div>`;
    }

    DataModule.registerMatchesData(isItDraw);

    let container = `
      <div class="game-end-popup">
        <h2>${headerTxt}</h2>
        ${winner}
        <button id="popupBtn">Play Again</button>
      </div>`;

    document.body.insertAdjacentHTML("afterend", container);
  }

  function playAgain(ele) {
    if (ele.id !== "popupBtn") return;

    UI.boxes.forEach((box) => {
      box.innerHTML = "";
      box.classList.remove("full");
    });

    gameState.isFirstMove = !gameState.isFirstMove;
    ele.parentElement.remove();
  }

  function removeCard(btn) {
    btn.parentElement.classList.remove("active");
  }

  return {
    createPlayerAccount,
    showPlayerInfo,
    showAllMatches,
    signOut,
    signIn,
    signUp,
    resetFields,
    registerPlayer,
    checkUsername,
    checkPassword,
    toggleSignInUp,
    selectEmoji,
    checkIfPlayersSignedIn,
    playAgain,
    removeCard,
  };
})();

/*=================== Events Module ==================*/
const EventsModule = (function () {
  const firstClr = "linear-gradient(45deg, #00133c, #018bd5)";
  const secondClr = "linear-gradient(45deg, #3c0000, #d50101)";

  UI.firstPlayer.addEventListener("click", () =>
    UIModule.showPlayerInfo(UI.firstPlayer, firstClr, "One"),
  );

  UI.secondPlayer.addEventListener("click", () =>
    UIModule.showPlayerInfo(UI.secondPlayer, secondClr, "Two"),
  );

  UI.totalMatchesContainers.forEach((ele) => {
    ele.addEventListener("click", (ele) => UIModule.showAllMatches(ele.target));
  });

  UI.signOutBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => UIModule.signOut(e.target));
  });

  UI.registerCloseBtn.addEventListener("click", () => {
    UI.registerPlayers.classList.remove("active");
    UI.resetBtn.click();
  });

  UI.asidesCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.classList.remove("active");
    });
  });

  UI.nextBtn.addEventListener("click", UIModule.registerPlayer);

  UI.resetBtn.addEventListener("click", UIModule.resetFields);

  UI.playerNameField.addEventListener("input", UIModule.checkUsername);
  UI.passwordField.addEventListener("input", UIModule.checkPassword);

  UI.authBtn.addEventListener("click", UIModule.toggleSignInUp);

  UI.emojis.forEach((icon) => {
    icon.addEventListener("click", () => UIModule.selectEmoji(icon));
  });

  UI.boxes.forEach((box) =>
    box.addEventListener("click", () => UIModule.checkIfPlayersSignedIn(box)),
  );
  UI.cardInfoCloseBtn.forEach((btn) => {
    btn.addEventListener("click", () => UIModule.removeCard(btn));
  });
  document.addEventListener("click", (e) => UIModule.playAgain(e.target));
})();

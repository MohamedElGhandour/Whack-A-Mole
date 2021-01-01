const game = (() => {
  //defination variables
  const holes = document.querySelectorAll(".hole");
  const scoreBoard = document.querySelector(".score");
  const moles = document.querySelectorAll(".mole");
  const sound = document.querySelector(".hit-sound");
  const button = document.querySelector("button");
  const gameOver = document.querySelector(".gameOver");
  const min = document.querySelector("input[name='minTime']");
  const max = document.querySelector("input[name='maxTime']");
  const gameTime = document.querySelector("input[name='gameTime']");
  let instance, timeout, lastHole, score, end;

  //create a function to make a random time for mole to pop from the hole
  const timeCreation = (min, max) =>
    Math.round(Math.random() * (max - min) + min);

  // create random hole
  const selectedHole = () => {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if (hole === lastHole) return selectedHole(); //prevent same hole from getting the same number
    lastHole = hole;
    return hole;
  };

  // game mechanism
  const peep = () => {
    if (!end) {
      const time = timeCreation(parseInt(min.value), parseInt(max.value)); //get a random time to determine how long mole should peep
      const hole = selectedHole(); //get the random hole from the randomHole function
      hole.classList.add("up"); //add the CSS class so selected mole can "pop up"
      timeout = setTimeout(() => {
        hole.classList.remove("up"); //make the selected mole "pop down" after a random time
        if (!end) peep();
      }, time);
    }
  };

  // hit the mole
  const bonk = (e) => {
    if (!end) {
      if (!e.isTrusted) return; // 7asby allah w n3ma el wakeel ya kalb ya 5asees (cheater)
      if (isPlaying(sound)) {
        sound.pause();
        sound.currentTime = 0;
      }
      score = score + 1;
      sound.play();
      scoreBoard.textContent = score;
      e.currentTarget.parentNode.classList.remove("up"); //make the selected mole "pop down" after a bonk (click)
      //this.parentNode //this refers to item clicked (Tranditional Function)
    }
  };
  moles.forEach((mole) => mole.addEventListener("click", bonk));

  // to reset game
  const reset = () => {
    time = null;
    hole = null;
    scoreBoard.textContent = 0;
    clearTimeout(timeout);
    holes.forEach((hole) => {
      if (hole.classList.contains("up")) {
        hole.classList.remove("up");
      }
    });
  };

  // check if audio is playing
  const isPlaying = (audio) => !audio.paused;

  // initial
  const init = () => {
    if (instance) reset();
    if (!gameOver.classList.contains("hidden"))
      gameOver.classList.add("hidden");
    instance = true;
    end = false;
    score = 0;
    button.textContent = "restart".toUpperCase();
    peep();
    setTimeout(() => {
      gameOver.classList.remove("hidden");
      return (end = true);
    }, parseInt(gameTime.value)); //show random moles for 10 seconds
  };
  return {
    init,
    button,
  };
})();
game.button.addEventListener("click", game.init);

/* ********************************************************\
 * Walker - Path to Darkness
 * A game about walking the long road of life.
 * Author: Esa Koskinen (mmKALLL)
 *
 * NOT FOR REDISTRIBUTION OF ANY KIND. ALL RIGHTS RESERVED.
 * Copyright (c) 2017-2018 Esa Koskinen
 * ********************************************************/
(function () {
  function startNewGame() {
    window.location.href = "./ingame.html";
  }
  document.getElementById("new-game-button").addEventListener("click", startNewGame);

})();

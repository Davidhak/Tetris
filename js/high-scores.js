const highScoresList = document.getElementById('highScoresList');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

highScoresList.innerHTML =
  highScores
    .map(playerScore => {
      return `<li class="high-score">${playerScore.name} - ${playerScore.playerScore} points</li>`;
    })
    .join("");


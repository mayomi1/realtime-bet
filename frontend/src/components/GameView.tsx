import { useSelector } from "react-redux";
import { RootState } from "../store";

const GameView = () => {
  const games = useSelector((state: RootState) => state.game.games);

  return (
    <div>
      {games.map((game) => (
        <div key={game.id}>
          <h3>
            {game.team1} vs {game.team2}
          </h3>
          <p>Score: {game.score}</p>
          <p>Remaining Time: {game.remainingTime}</p>
          <p>Odds: {game.odds.team1} - {game.odds.team2}</p>
        </div>
      ))}
    </div>
  );
};

export default GameView;

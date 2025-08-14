import DOMPurify from "dompurify";
import { Link } from "react-router-dom";

interface GameCardProps {
  game: {
    id: number;
    name: string;
    background_image: string;
    description: string;
    released: string;
    genres?: string[];
  };
}

const GameCard = ({ game }: GameCardProps) => {
  return (
    <div
      key={game.id}
      className="bg-white rounded-lg shadow-lg p-6 flex flex-col lg:flex-row max-w-4xl mx-auto mb-6 transition-all duration-300 ease-in-out hover:bg-gray-100 hover:shadow-2xl"
    >
      <div className="w-full lg:w-1/3">
        <Link to={`/games/${game.id}`}>
          <img
            src={game.background_image}
            alt={game.name}
            className="w-full h-64 object-cover rounded-md"
          />
        </Link>
      </div>

      <div className="w-full lg:w-2/3 lg:ml-4 p-4 rounded-lg flex flex-col justify-between gap-y-4 lg:gap-y-0">
        <div className="text-2xl font-bold text-gray-900">
          <Link to={`/games/${game.id}`}>
            <p
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {game.name.toUpperCase()}
            </p>
          </Link>
        </div>

        <Link to={`/games/${game.id}`}>
          <p
            className="text-gray-700"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(game.description),
            }}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          />
        </Link>

        <div className="flex flex-wrap gap-x-2 gap-y-2">
          {game.genres &&
            game.genres.map((genre: string, index: number) => (
              <div
                key={index}
                className="bg-gray-800 text-white text-xs font-semibold py-1 px-3 rounded-full"
              >
                {genre}
              </div>
            ))}
        </div>

        <div className="text-sm text-gray-600">
          Released on: {new Date(game.released).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default GameCard;

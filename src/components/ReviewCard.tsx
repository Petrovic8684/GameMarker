import { Link } from "react-router-dom";
import { renderStars } from "../util/RenderStars";

interface ReviewCardProps {
  review: {
    id: string;
    game: {
      id: number;
      name: string;
      background_image: string;
    };
    createdBy: {
      id: number;
      username: string;
      image: string;
      gender: string;
    };
    createdAt: string;
    rating: number;
    comment: string;
    difficulty: string;
    completed: boolean;
    platform: string;
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div
      key={review.id}
      className="bg-white rounded-lg shadow-lg p-6 flex flex-col lg:flex-row max-w-4xl mx-auto mb-6 transition-all duration-300 ease-in-out hover:bg-gray-100 hover:shadow-2xl"
    >
      <div className="w-full lg:w-1/3">
        <Link to={`/reviews/${review.id}`}>
          <img
            src={review.game.background_image}
            alt={review.game.name}
            className="w-full h-64 object-cover rounded-md"
          />
        </Link>
      </div>

      <div className="w-full lg:w-2/3 lg:ml-4 p-4 rounded-lg flex flex-col justify-between gap-y-4 lg:gap-y-0">
        <div className="text-2xl font-bold text-gray-900">
          <Link to={`/games/${review.game.id}`}>
            <p
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {review.game.name.toUpperCase()}
            </p>
          </Link>
        </div>

        {review.rating ? (
          <div className="flex items-center gap-x-1">
            {renderStars(review.rating)}
          </div>
        ) : (
          <></>
        )}

        {review.comment ? (
          <Link to={`/reviews/${review.id}`}>
            <p
              className="text-gray-700"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {review.comment}
            </p>
          </Link>
        ) : (
          <></>
        )}

        <div className="flex flex-wrap gap-x-2 gap-y-2">
          {review.difficulty ? (
            <div
              className={`${
                review.difficulty === "Story"
                  ? "bg-blue-500"
                  : review.difficulty === "Easy"
                  ? "bg-green-500"
                  : review.difficulty === "Normal"
                  ? "bg-yellow-500"
                  : review.difficulty === "Hard"
                  ? "bg-orange-500"
                  : review.difficulty === "Ultra Hard"
                  ? "bg-red-500"
                  : review.difficulty === "Nightmare"
                  ? "bg-purple-500"
                  : "bg-gray-400"
              } text-white text-xs font-semibold py-1 px-3 rounded-full`}
            >
              {review.difficulty}
            </div>
          ) : (
            <></>
          )}

          {review.completed ? (
            <div
              className={`${
                review.completed ? "bg-green-500" : "bg-red-500"
              } text-white text-xs font-semibold py-1 px-3 rounded-full`}
            >
              {review.completed ? "Completed" : "Not Completed"}
            </div>
          ) : (
            <></>
          )}

          {review.platform ? (
            <div className="bg-gray-800 text-white text-xs font-semibold py-1 px-3 rounded-full">
              {review.platform}
            </div>
          ) : (
            <></>
          )}
        </div>
        {review.createdBy ? (
          <div className="text-sm text-gray-600">
            Reviewed by{" "}
            <Link
              className="text-blue-500 cursor-pointer"
              to={`/users/${review.createdBy.id}`}
            >
              {review.createdBy.username}
            </Link>{" "}
            on {new Date(review.createdAt).toLocaleDateString()}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;

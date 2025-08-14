import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import ClipLoader from "react-spinners/ClipLoader";
import DOMPurify from "dompurify";
import ReviewModal from "../components/ReviewModal";
import getUserInfoFromToken from "../lib/getUserInfo";

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const navigate = useNavigate();

  const { myUserId } = getUserInfoFromToken() || {};

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(`reviews/game/${id}`);
        response.data.game.reviews = response.data.reviews;

        setGame(response.data.game);
      } catch (err: any) {
        setError(err.response?.data.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const handleAddReview = async (reviewData: any) => {
    try {
      const response = await api.post(`/reviews`, reviewData);
      setGame((prev: any) => {
        return {
          ...prev,
          reviews: [...prev.reviews, reviewData],
        };
      });

      navigate(`/reviews/${response.data.review.id}`);
    } catch (err: any) {
      setError(
        err.response?.data.message || "An error occurred while adding review."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <ClipLoader color="#3498db" loading={loading} size={50} />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mt-24">{error}</div>
      ) : (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col md:gap-y-6 gap-y-4">
            <div>
              <Link to={`https://rawg.io/games/${game.slug}`}>
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-96 object-cover rounded-md"
                />
              </Link>
            </div>

            <h1 className="text-3xl font-bold inline-block text-gray-900">
              <Link to={`https://rawg.io/games/${game.slug}`}>
                {game.name.toUpperCase()}
              </Link>
            </h1>

            <div>
              <p
                className="text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(game.description),
                }}
              />
            </div>

            <div className="flex flex-wrap gap-x-2 gap-y-2">
              {game.genres &&
                game.genres.map((genre: { name: string }, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-800 text-white text-xs font-semibold py-1 px-3 rounded-full"
                  >
                    {genre.name}
                  </div>
                ))}
            </div>

            <div className="text-sm text-gray-600">
              Released on: {new Date(game.released).toLocaleDateString()}
            </div>

            <div className="flex md:flex-row flex-col md:items-center md:gap-x-4 items:start gap-y-4">
              {myUserId &&
              game.reviews &&
              !game.reviews.some(
                (review: any) => review.createdBy.id === myUserId
              ) ? (
                <div>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                    onClick={() => {
                      setShowReviewModal(true);
                    }}
                  >
                    Leave review
                  </button>
                </div>
              ) : (
                <></>
              )}

              <div>
                <Link
                  to={`/reviews/game/${game.id}`}
                  className="text-blue-500 hover:underline"
                >
                  See reviews for this game
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleAddReview}
        game={game}
      />
    </div>
  );
};

export default GameDetail;

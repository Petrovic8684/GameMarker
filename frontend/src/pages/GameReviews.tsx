import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import ReviewCard from "../components/ReviewCard";
import { ClipLoader } from "react-spinners";

const GameReviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews/game/${id}`);
        setReviews(response.data.reviews);
      } catch (err: any) {
        setError(err.response?.data.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="mx-auto p-6">
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <ClipLoader color="#3498db" loading={loading} size={50} />
            </div>
          ) : reviews.length <= 0 ? (
            <div className="text-gray-700 text-center mt-24">
              No reviews found for this game.
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
          ) : (
            reviews.map((review: any) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GameReviews;

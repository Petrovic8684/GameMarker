import { useState, useEffect } from "react";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import ReviewCard from "../components/ReviewCard";
import ClipLoader from "react-spinners/ClipLoader";

const Landing = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("/reviews/landing");
        setReviews(response.data.reviews);
      } catch (err: any) {
        setError(err.response?.data.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto p-6">
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <ClipLoader color="#3498db" loading={loading} size={50} />
            </div>
          ) : reviews.length === 0 ? (
            <div>
              <div className="text-gray-700 text-center mt-24">
                {!localStorage.getItem("token") ? (
                  <>
                    Welcome to GameMarker!
                    <br />
                    Please{" "}
                    <a
                      href="/login"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      login
                    </a>{" "}
                    in order to see latest game reviews.
                  </>
                ) : (
                  <>
                    Seems like you are not following anyone. <br />
                    Follow someone to see their latest reviews!
                  </>
                )}
              </div>

              {localStorage.getItem("token") && (
                <div className="text-center text-red-500 mt-2">
                  {error && <div>{error}</div>}
                </div>
              )}
            </div>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;

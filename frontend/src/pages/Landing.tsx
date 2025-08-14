import { useState, useEffect } from "react";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import ReviewCard from "../components/ReviewCard";
import ClipLoader from "react-spinners/ClipLoader";
import getUserInfoFromToken from "../lib/getUserInfo";

const Landing = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "followers">("all");

  const { myUserId } = getUserInfoFromToken() || {};

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const endpoint =
          myUserId && filter === "followers" ? "/reviews/landing" : "/reviews";
        const response = await api.get(endpoint);
        setReviews(response.data.reviews);
      } catch (err: any) {
        setError(err.response?.data.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {myUserId && (
        <div className="flex justify-center mt-6 gap-x-6">
          <label className="flex items-center gap-x-2">
            <input
              type="radio"
              name="reviewFilter"
              value="all"
              checked={filter === "all"}
              onChange={() => setFilter("all")}
              className="accent-blue-600"
            />
            All Reviews
          </label>
          <label className="flex items-center gap-x-2">
            <input
              type="radio"
              name="reviewFilter"
              value="followers"
              checked={filter === "followers"}
              onChange={() => setFilter("followers")}
              className="accent-blue-600"
            />
            Followers Reviews
          </label>
        </div>
      )}

      <div className="container mx-auto p-6">
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <ClipLoader color="#3498db" loading={loading} size={50} />
            </div>
          ) : (
            <>
              {myUserId ? (
                <></>
              ) : (
                <div className="text-center my-8">
                  {" "}
                  Welcome to GameMarker!
                  <br />
                  Please{" "}
                  <a
                    href="/login"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    login
                  </a>{" "}
                  in order to interact with the community.
                </div>
              )}
              {reviews.length === 0 ? (
                <div>
                  {filter === "followers" ? (
                    <div className="text-gray-700 text-center mt-24">
                      <p>Seems like you are not following anyone!</p>
                    </div>
                  ) : (
                    <div className="text-gray-700 text-center mt-24">
                      <p>No reviews found!</p>
                    </div>
                  )}

                  <div className="text-center text-red-500 mt-2">
                    {error && <div>{error}</div>}
                  </div>
                </div>
              ) : (
                reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;

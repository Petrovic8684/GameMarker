import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import ClipLoader from "react-spinners/ClipLoader";
import { renderStars } from "../util/RenderStars";
import DOMPurify from "dompurify";
import getUserInfoFromToken from "../lib/getUserInfo";
import ReviewModal from "../components/ReviewModal";
import { femaleImage, maleImage } from "../lib/defaultImg";

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const navigate = useNavigate();

  const { myUserId, myUserRole } = getUserInfoFromToken() || {};

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await api.get(`/reviews/${id}`);
        setReview(response.data.review);
      } catch (err: any) {
        setError(err.response?.data.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const handleUpdate = async (updatedReviewData: any) => {
    try {
      const response = await api.patch(`/reviews/${id}`, updatedReviewData);
      setReview(response.data.review);
      setShowReviewModal(false);
    } catch (err: any) {
      setError(err.response?.data.message || "Failed to update review.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/reviews/${id}`);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data.message || "Failed to delete review.");
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
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col gap-y-6">
            <div className="flex md:flex-row md:items-center md:gap-y-0 gap-y-4 flex-col items-start flex-col">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  <Link to={`/games/${review.game.id}`}>
                    {review.game.name.toUpperCase()}
                  </Link>
                </h1>

                {review.rating ? (
                  <div className="flex items-center gap-x-1 mt-1">
                    {renderStars(Number(review.rating))}
                    <span className="ml-2 text-gray-600 sm:inline hidden">
                      Rating: {review.rating}/10
                    </span>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="md:ml-auto flex items-center gap-x-4">
                {myUserId === review.createdBy.id && (
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none cursor-pointer"
                    onClick={() => setShowReviewModal(true)}
                  >
                    Update
                  </button>
                )}
                {myUserRole === "admin" ||
                (myUserId === review.createdBy.id &&
                  review.createdBy.role !== "admin") ? (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none cursor-pointer
                "
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={
                    review.createdBy.image
                      ? review.createdBy.image
                      : review.createdBy.gender === "male"
                      ? maleImage
                      : femaleImage
                  }
                  alt={review.createdBy.username}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <Link
                  className="text-blue-500 text-xl font-semibold cursor-pointer"
                  to={`/users/${review.createdBy.id}`}
                >
                  {review.createdBy.username}
                </Link>
                <p className="text-sm text-gray-600">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {review.comment ? (
              <div>
                <p
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(review.comment),
                  }}
                />
              </div>
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
                      : review.difficulty === "Medium"
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
          </div>
        </div>
      )}

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleUpdate}
        game={review?.game}
        initialData={review}
      />
    </div>
  );
};

export default ReviewDetail;

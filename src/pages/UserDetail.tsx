import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import ClipLoader from "react-spinners/ClipLoader";
import ReviewCard from "../components/ReviewCard";
import FollowerRow from "../components/FollowerRow";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import getUserInfoFromToken from "../lib/getUserInfo";
import { femaleImage, maleImage } from "../lib/defaultImg";
import BioModal from "../components/BioModal";

const UserDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsCollapsed, setReviewsCollapsed] = useState<boolean>(true);
  const [followersCollapsed, setFollowersCollapsed] = useState<boolean>(true);
  const [showBioModal, setShowBioModal] = useState(false);

  const { myUserId, myUserRole } = getUserInfoFromToken() || {};

  const handleCheckIsFollowing = async (userId: number) => {
    const followersResponse = await api.get(`/followers/user/${userId}`);

    const alreadyFollowing =
      followersResponse?.data.followData?.some(
        (follower: any) => follower.follower.id === myUserId
      ) ?? false;

    return { alreadyFollowing, followData: followersResponse.data.followData };
  };

  useEffect(() => {
    const fetchUserAndFollowers = async () => {
      if (!id) return;

      try {
        const userResponse = await api.get(`/reviews/user/${id}`);
        const userData = userResponse.data;

        const { alreadyFollowing, followData } = await handleCheckIsFollowing(
          +id
        );

        userData.user.followers = followData;
        userData.user.alreadyFollowing = alreadyFollowing;

        setData(userData);
      } catch (err: any) {
        setError(
          err.response?.data.message || "An error occurred fetching user data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndFollowers();
  }, [id, myUserId]);

  const handleUpdateBio = async (updatedBio: string | null) => {
    try {
      const response = await api.patch(`/users/${id}/bio`, { bio: updatedBio });

      setData((prev: any) => ({
        ...prev,
        user: {
          ...prev.user,
          bio: response.data.user.bio,
        },
      }));

      setShowBioModal(false);
    } catch (err: any) {
      setError(err.response?.data.message || "Failed to update bio.");
    }
  };

  const handleFollow = async (userId: number) => {
    try {
      await api.post(`/followers/user/${userId}`);

      setData((prevData: any) => ({
        ...prevData,
        user: {
          ...prevData.user,
          alreadyFollowing: true,
        },
      }));
    } catch (err: any) {
      setError(
        err.response?.data.message || "An error occurred while following user."
      );
    }
  };

  const handleUnfollow = async (userId: number) => {
    try {
      await api.delete(`/followers/user/${userId}`);

      setData((prevData: any) => ({
        ...prevData,
        user: {
          ...prevData.user,
          alreadyFollowing: false,
        },
      }));
    } catch (err: any) {
      setError(
        err.response?.data.message ||
          "An error occurred while unfollowing user."
      );
    }
  };

  const handleDismiss = async (followId: number) => {
    try {
      await api.patch(`/followers/${followId}`);
      setData((prevData: any) => {
        const updatedFollowers = prevData.user.followers.map((follower: any) =>
          follower.id === followId ? { ...follower, dismissed: true } : follower
        );

        return {
          ...prevData,
          user: {
            ...prevData.user,
            newFollowersCount: prevData.user.newFollowersCount - 1,
            followers: updatedFollowers,
          },
        };
      });
    } catch (err: any) {
      setError(
        err.response?.data.message || "An error occurred while following user."
      );
    }
  };

  const toggleReviewsCollapse = () => {
    setReviewsCollapsed(!reviewsCollapsed);
  };

  const toggleFollowersCollapse = () => {
    setFollowersCollapsed(!followersCollapsed);
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#3498db" loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex md:flex-row md:items-center flex-col md:gap-y-0 gap-y-4 items-start flex-col mb-6">
            <div className="min-w-24 max-h-24 max-w-24 min-h-24 rounded-full overflow-hidden">
              <img
                src={
                  data.user.image
                    ? data.user.image
                    : data.user.gender === "male"
                    ? maleImage
                    : femaleImage
                }
                alt={data.user.username}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:ml-4 flex flex-col gap-y-2">
              <h1 className="flex flex-col md:flex-row md:items-center justify-center">
                <p className="text-3xl font-bold text-gray-800 md:mr-2">
                  {data.user.username}
                </p>
                {data.user.id === 1 && (
                  <div className="flex">
                    <p className="text-xl text-gray-500 mt-[4px] mr-2 hidden md:block">
                      -
                    </p>
                    <p className="text-xl text-gray-500 mt-[4px]">
                      APP CREATOR 👑
                    </p>
                  </div>
                )}
              </h1>
              <p
                className={`text-sm ${
                  data.user.role === "admin"
                    ? "text-green-500"
                    : "text-gray-600"
                }`}
              >
                {data.user.role.toUpperCase()}
              </p>
            </div>

            <div className="md:ml-auto flex items-center gap-x-4">
              {myUserId && myUserId === data.user.id && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none cursor-pointer"
                  onClick={() => {
                    setShowBioModal(true);
                  }}
                >
                  Edit Bio
                </button>
              )}

              {myUserId &&
                myUserId !== data.user.id &&
                (data.user.alreadyFollowing ? (
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none cursor-pointer"
                    onClick={() => handleUnfollow(data.user.id)}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none cursor-pointer"
                    onClick={() => handleFollow(data.user.id)}
                  >
                    Follow
                  </button>
                ))}
              {myUserRole === "admin" &&
                myUserId !== data.user.id &&
                data.user.role !== "admin" && (
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none cursor-pointer">
                    Ban
                  </button>
                )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Bio</h2>
            <p className="text-gray-700">
              {data.user.bio ?? "No bio available"}
            </p>
          </div>

          {myUserId === data.user.id && (
            <div className="mt-6">
              <div className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div
                  className="mr-2 p-1 rounded-full hover:bg-gray-200 cursor-pointer"
                  title="Toggle followers list"
                  onClick={toggleFollowersCollapse}
                >
                  {followersCollapsed ? (
                    <FaChevronDown className="text-gray-600" />
                  ) : (
                    <FaChevronUp className="text-gray-600" />
                  )}
                </div>
                Followed by{" "}
                {data.user.newFollowersCount > 0 ? (
                  <p
                    className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex justify-center items-center ml-2"
                    title="Followers count"
                  >
                    {data.user.newFollowersCount}
                  </p>
                ) : (
                  <></>
                )}
              </div>
              {!followersCollapsed && (
                <div className="space-y-4">
                  {data.user.followers && data.user.followers.length > 0 ? (
                    data.user.followers.map((follow: any) => {
                      return (
                        <FollowerRow
                          key={follow.id}
                          follow={follow}
                          handleCheckIsFollowing={() =>
                            handleCheckIsFollowing(follow.follower.id)
                          }
                          handleFollow={() => handleFollow(follow.follower.id)}
                          handleUnfollow={() =>
                            handleUnfollow(follow.follower.id)
                          }
                          handleDismiss={() => handleDismiss(follow.id)}
                        />
                      );
                    })
                  ) : (
                    <p className="text-gray-700">No followers available.</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <div
                className="mr-2 p-1 rounded-full hover:bg-gray-200 cursor-pointer"
                title="Toggle reviews list"
                onClick={toggleReviewsCollapse}
              >
                {reviewsCollapsed ? (
                  <FaChevronDown className="text-gray-600" />
                ) : (
                  <FaChevronUp className="text-gray-600" />
                )}
              </div>
              Reviews by {data.user.username}
            </h2>
            {!reviewsCollapsed && (
              <div className="space-y-4">
                {data.reviews && data.reviews.length > 0 ? (
                  data.reviews.map((review: any) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <p className="text-gray-700">No reviews available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <BioModal
        isOpen={showBioModal}
        onClose={() => setShowBioModal(false)}
        onSubmit={handleUpdateBio}
        initialBio={data.user.bio}
      />
    </div>
  );
};

export default UserDetail;

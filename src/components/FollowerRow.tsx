import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { femaleImage, maleImage } from "../lib/defaultImg";
import { IoArrowUndoCircle, IoAlertCircle } from "react-icons/io5";

interface FollowerProps {
  follow: {
    id: number;
    follower: {
      id: number;
      avatar?: string;
      username: string;
      email: string;
      role: string;
      image: string;
      gender: string;
      isBanned: boolean;
    };
    createdAt: string;
    dismissed: boolean;
  };
  handleCheckIsFollowing: () => any;
  handleFollow: () => void;
  handleUnfollow: () => void;
  handleDismiss: () => void;
}

const FollowerRow = ({
  follow,
  handleCheckIsFollowing,
  handleFollow,
  handleUnfollow,
  handleDismiss,
}: FollowerProps) => {
  const [isFollowing, setIsFollowing] = useState<boolean>();

  useEffect(() => {
    const evaluateFollowingStatus = async () => {
      const status = await handleCheckIsFollowing();
      setIsFollowing(status.alreadyFollowing);
    };

    evaluateFollowingStatus();
  }, [handleCheckIsFollowing]);

  return (
    <div className="flex items-center gap-x-4">
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <img
          src={
            follow.follower.image
              ? follow.follower.image
              : follow.follower.gender === "male"
              ? maleImage
              : femaleImage
          }
          alt={follow.follower.username}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <Link to={`/users/${follow.follower.id}`}>
          <h3 className="text-lg font-semibold text-blue-500 cursor-pointer">
            {follow.follower.username}
          </h3>
        </Link>
        <p className="text-sm text-gray-600">
          <span className="block sm:hidden">
            {new Date(follow.createdAt).toLocaleDateString()}
          </span>
          <span className="hidden sm:block">
            {new Date(follow.createdAt).toLocaleString()}
          </span>
        </p>
      </div>

      <div className="flex sm:gap-x-4 gap-x-2 items-center">
        {follow.follower.isBanned === false ? (
          <>
            {isFollowing ? (
              <button
                className="hidden sm:block bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none cursor-pointer"
                onClick={handleUnfollow}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="hidden sm:block bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none cursor-pointer"
                onClick={handleFollow}
              >
                Follow back
              </button>
            )}

            {isFollowing ? (
              <IoArrowUndoCircle
                onClick={handleUnfollow}
                className="block sm:hidden text-yellow-500 w-8 h-8 cursor-pointer"
                title="Unfollow"
              />
            ) : (
              <IoArrowUndoCircle
                onClick={handleFollow}
                className="block sm:hidden text-green-500 w-8 h-8 cursor-pointer"
                title="Follow back"
              />
            )}
          </>
        ) : (
          <></>
        )}

        {!follow.dismissed && (
          <button
            className="hidden sm:block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none cursor-pointer"
            onClick={handleDismiss}
          >
            Dismiss
          </button>
        )}

        {!follow.dismissed && (
          <IoAlertCircle
            onClick={handleDismiss}
            className="block sm:hidden text-blue-500 w-8 h-8 cursor-pointer"
            title="Dismiss"
          />
        )}
      </div>
    </div>
  );
};

export default FollowerRow;

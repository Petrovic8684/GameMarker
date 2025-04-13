import { useState, useEffect } from "react";
import getUserInfoFromToken from "../lib/getUserInfo";
import { renderDynamicStars } from "../util/RenderStars";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: any) => void;
  game: any;
  initialData?: any;
}

const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  game,
  initialData,
}: ReviewModalProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);

  const { myUserId } = getUserInfoFromToken() || {};

  useEffect(() => {
    if (isOpen) {
      setRating(initialData?.rating ?? null);
      setComment(initialData?.comment ?? null);
      setCompleted(
        initialData?.completed === true
          ? true
          : initialData?.completed === false
          ? false
          : null
      );
      setDifficulty(initialData?.difficulty ?? null);
      setPlatform(initialData?.platform ?? null);

      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    const reviewData = {
      gameId: game.id,
      rating,
      comment,
      completed,
      difficulty,
      platform,
      createdBy: { id: myUserId },
    };
    onSubmit(reviewData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-6">
      <div className="absolute inset-0 backdrop-blur-xl backdrop-brightness-40"></div>

      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg z-10 overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-semibold mb-4">{game.name}</h2>

        <div>
          <div className="mb-4">
            <label className="block text-gray-700">Rating</label>
            <div className="flex gap-x-1 mt-2">
              {renderDynamicStars(rating, setRating)}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Comment</label>
            <textarea
              value={comment || ""}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-scroll"
              rows={4}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Completed the Game?</label>
            <div className="flex gap-x-4 mt-1">
              <label>
                <input
                  type="radio"
                  name="completed"
                  checked={completed === true}
                  onChange={() => setCompleted(true)}
                  className="mr-2"
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="completed"
                  checked={completed === false}
                  onChange={() => setCompleted(false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Difficulty</label>
            <select
              value={difficulty || ""}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Choose difficulty
              </option>
              <option value="Story">Story</option>
              <option value="Easy">Easy</option>
              <option value="Normal">Normal</option>
              <option value="Hard">Hard</option>
              <option value="Ultra Hard">Ultra Hard</option>
              <option value="Nightmare">Nightmare</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700">Platform</label>
            <select
              value={platform || ""}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Choose platform
              </option>
              <option value="PC">PC</option>
              <option value="PlayStation">PlayStation</option>
              <option value="Xbox">Xbox</option>
              <option value="Switch">Nintendo Switch</option>
              <option value="Mobile">Mobile (iOS/Android)</option>
              <option value="SteamDeck">Steam Deck</option>
              <option value="Nintendo3DS">Nintendo 3DS</option>
              <option value="PlayStationVita">PlayStation Vita</option>
              <option value="GameBoy">Game Boy</option>
              <option value="SegaGenesis">Sega Genesis</option>
              <option value="Atari">Atari</option>
              <option value="RetroConsoles">
                Retro console (NES, SNES, Sega Master System...)
              </option>
              <option value="CloudGaming">
                Cloud Gaming (xCloud, GeForce Now, Stadia...)
              </option>
              <option value="VirtualReality">
                Virtual Reality (Oculus Rift, PlayStation VR...)
              </option>
              <option value="HandheldPC">
                Handheld PC (ASUS ROG Ally, Lenovo Legion Go...)
              </option>
            </select>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

import { FaStar } from "react-icons/fa";

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const stars = [];

  for (let i = 0; i < fullStars; i++)
    stars.push(<FaStar size={20} key={i} className="text-yellow-500" />);

  for (let i = fullStars; i < 10; i++)
    stars.push(<FaStar size={20} key={i} className="text-gray-300" />);

  return stars;
};

const renderDynamicStars = (rating: any, setRating: any) => {
  return Array.from({ length: 10 }, (_, index) => (
    <span
      key={index}
      className={`cursor-pointer text-xl ${
        rating && rating >= index + 1 ? "text-yellow-400" : "text-gray-300"
      }`}
      onMouseEnter={() => setRating(index + 1)}
      onClick={() => setRating(index + 1)}
    >
      <FaStar size={20} />
    </span>
  ));
};

export { renderStars, renderDynamicStars };

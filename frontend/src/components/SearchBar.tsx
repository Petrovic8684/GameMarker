import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(inputValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, onSearch]);

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search games..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default SearchBar;

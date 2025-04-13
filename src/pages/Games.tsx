import { useState, useEffect } from "react";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import GameCard from "../components/GameCard";
import SearchBar from "../components/SearchBar";
import ClipLoader from "react-spinners/ClipLoader";

const Games = () => {
  const [games, setGames] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      if (searchQuery.trim() === "") {
        setGames([]);
        setNoResults(false);
        return;
      }

      setLoading(true);
      setNoResults(false);
      try {
        const response = await api.get(
          `/games?search=${searchQuery}&page=1&page_size=10`
        );
        setGames(response.data.games);
        setNoResults(response.data.games.length === 0);
      } catch (err: any) {
        setError(err.response?.data.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto p-6">
        <div className="max-w-md mx-auto">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <ClipLoader color="#3498db" loading={loading} size={50} />
            </div>
          ) : noResults ? (
            <div className="text-gray-700 text-center mt-24">
              No games found matching your search.
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
          ) : (
            games.map((game) => <GameCard key={game.id} game={game} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Games;

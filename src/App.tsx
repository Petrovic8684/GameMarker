import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Landing from "./pages/Landing";
import Games from "./pages/Games";
import ReviewDetail from "./pages/ReviewDetail";
import GameDetail from "./pages/GameDetail";
import UserDetail from "./pages/UserDetail";
import GameReviews from "./pages/GameReviews";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/games" element={<Games />} />
      <Route path="/reviews/:id" element={<ReviewDetail />} />
      <Route path="/reviews/game/:id" element={<GameReviews />} />
      <Route path="/games/:id" element={<GameDetail />} />
      <Route path="/users/:id" element={<UserDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

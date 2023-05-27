import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Shows from "./pages/Profile/shows";
import MovieTheater from "./pages/MoviesTheater.js";
import BookShow from "./pages/Bookshow";

function App() {
  const { loading } = useSelector((state) => state.loaders);
  return (
    <div>
      {loading && (
        <div className="loader-parent">
          <div className="loader"></div>
        </div>
      )}
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>} />
          <Route path="/shows" element={<ProtectedRoute><Shows/></ProtectedRoute>} />
          <Route path="/movies/:movieId" element={<ProtectedRoute><MovieTheater/></ProtectedRoute>} />
          <Route path="/book-show/:showId" element={<ProtectedRoute><BookShow/></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

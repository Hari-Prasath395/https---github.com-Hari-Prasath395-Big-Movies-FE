import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import "./Home.css";


const Home = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchMovies = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "http://localhost:8000/api/movies/getAllMovies"
      );
      if (Array.isArray(response.data.data)) {
        setMovies(response.data.data);
      } else {
        console.error("Invalid movies data:", response.data);
      }  dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Failed to fetch movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="row g-3 mt-2 mx-2">
      {movies.map((movie, index) => (
        <div key={movie._id} className="col-md-2 mb-3">
          <img
            src={movie.PosterImageUrl}
            alt="Movie Poster"
            className="img-fluid"
            onClick={() =>
              navigate(
                `/movies/${movie._id}?date=${moment().format("YYYY-MM-DD")}`
              )
            }
            style={{
              height: "300px",
              width: "200px",
              objectFit: "cover",
              border: "5px solid #2f3542",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          />
          <div className="mt-2 text-center">{movie.Title}</div>
        </div>
      ))}
    </div>
  );
};

export default Home;

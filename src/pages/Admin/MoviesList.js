import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import MoviesForm from "./MoviesForm";
import axios from "axios";
import { MdEditSquare } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import "./MoviesList.css";


export default function MoviesList() {
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState("add");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const dispatch = useDispatch();
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const fetchMovies = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "https://big-movies-backend.onrender.com/api/movies/getAllMovies"
      );
      if (Array.isArray(response.data.data)) {
        setMovies(response.data.data);
      } else {
        console.error("Invalid movies data:", response.data);
      }
      dispatch(hideLoading());
    } catch (error) {
     
      console.error("Failed to fetch movies:", error);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      dispatch(showLoading());
      await axios.delete(
        `https://big-movies-backend.onrender.com/api/movies/deleteMovie/${movieId}`
      );
      // Movie deleted successfully,
      fetchMovies(); // Fetch updated movie list
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Failed to delete the movie:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-primary mx-2 mt-2" onClick={openModal}>
          Add Movies
        </button>
      </div>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Poster</th>
            <th>Title</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Language</th>
            <th>Genre</th>
            <th>Release Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id}>
              <td>
                <img
                  src={movie.PosterImageUrl}
                  alt="Movie Poster"
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
              <td>{movie.Title}</td>
              <td>{movie.Description}</td>
              <td>{movie.Duration}</td>
              <td>{movie.Language}</td>
              <td>{movie.Genre}</td>
              {/* const formattedReleaseDate = new Date(selectedMovie.ReleaseDate).toISOString().substr(0, 10); */}
              <td>{new Date(movie.ReleaseDate).toLocaleDateString()}</td>
              <td>
                <MdEditSquare
                  style={{
                    color: "blue",
                    marginRight: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setFormType("edit");
                    openModal();
                  }}
                />

                <MdDeleteSweep
                  style={{ color: "red", cursor: "pointer" }}
                  size={20}
                  onClick={() => handleDeleteMovie(movie._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Add Movie Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          content: {
            border: "none",
            background: "none",
            overflow: "auto", // Add 'overflow: auto' to enable scrolling
            maxHeight: "80vh", // Set a maximum height for the modal
          },
        }}
      >
        <MoviesForm
          closeModal={closeModal}
          formType={formType}
          selectedMovie={selectedMovie}
          fetchMovies={fetchMovies}
        />
      </Modal>
    </div>
  );
}

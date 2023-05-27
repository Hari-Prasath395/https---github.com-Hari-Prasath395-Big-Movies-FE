import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { MdDeleteSweep } from "react-icons/md";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/loaderSlice";
import './shows.css'

const Shows = () => {
  const location = useLocation();
  const [theaterName, setTheaterName] = useState("");
  const [theaterId, setTheaterId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  /** */
  const [shows, setShows] = useState([]);

  const [showData, setShowData] = useState({
    showName: "",
    date: "",
    time: "",
    movie: "",
    ticketPrice: "",
    totalSeats: "",
    availableSeats: "",
  });
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get("theaterName");
    const theaterId = searchParams.get("theaterId");
    setTheaterName(name);
    console.log(theaterId);
    console.log(theaterName);
    setTheaterId(theaterId);
  }, [location.search]);

  useEffect(() => {
    fetchMovies();
    fetchTheaters();
  }, [theaterId]);

  const openShowModal = () => {
    setShowModal(true);
  };

  const closeShowModal = () => {
    setShowModal(false);
  };

  const handleAddShow = async () => {
    try {
      const data = { ...showData, theater: theaterId }; // Use theaterId instead of theaterName
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:8000/api/theater/addShow",
        data
      );

      console.log(response.data);
      setShows((prevShows) => [...prevShows, response.data]);
      setShowModal(false);
      setShowData({
        showName: "",
        date: "",
        time: "",
        movie: "",
        ticketPrice: "",
        totalSeats: "",
        availableSeats: "",
      }); dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Failed to add show:", error);
    }
  };

  const handleDeleteShow = async (showId) => {
    try {
      dispatch(showLoading());
      await axios.delete(
        `http://localhost:8000/api/theater/deleteShow/${showId}`
      );

      setShows((prevShows) => prevShows.filter((show) => show._id !== showId));
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Failed to delete show:", error);
    }
  };

  const handleInputChange = (e) => {
    setShowData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

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
      } dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Failed to fetch movies:", error);
    }
  };

  const fetchTheaters = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `http://localhost:8000/api/theater/getShowsByTheater/${theaterId}`
      );
      if (Array.isArray(response.data.data)) {
        setShows(response.data.data);
        console.log(response.data.data);
      } else {
        console.error("Invalid theaters data:", response.data);
      } dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Failed to fetch theaters:", error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h5 className="mx-3 mt-3">Shows - {theaterName}</h5>
        <button
          className="btn btn-dark btn-sm mx-2 mt-2"
          onClick={openShowModal}
        >
          Add Show
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Show Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Movie</th>
            <th>Ticket Price</th>
            <th>Total Seats</th>
            <th>Available Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shows.map((show) => (
            <tr key={show._id}>
              <td>{show.showName}</td>
              <td>{new Date(show.date).toLocaleDateString()}</td>
              {/* <td>{show.date}</td> */}
              <td>{show.time}</td>
              <td>{show.movie.Title}</td>
              <td>{show.ticketPrice}</td>
              <td>{show.totalSeats}</td>
              <td>{show.availableSeats}</td>
              <td>
                <MdDeleteSweep
                  style={{ color: "red", cursor: "pointer" }}
                  size={30}
                  onClick={() => handleDeleteShow(show._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={showModal}
        onRequestClose={closeShowModal}
        contentLabel="Add Show Modal"
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
            overflowY: "scroll",
            maxHeight: "80vh",
          },
        }}
      >
        <div className="card">
          <div className="card-header">Add Show</div>
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Show Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="showName"
                  value={showData.showName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={showData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Time</label>
                <input
                  type="time"
                  className="form-control"
                  name="time"
                  value={showData.time}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Movie</label>
                <select
                  className="form-select"
                  name="movie"
                  value={showData.movie}
                  onChange={handleInputChange}
                >
                  <option value="">Select a movie</option>
                  {movies.map((movie) => (
                    <option key={movie._id} value={movie._id}>
                      {movie.Title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Ticket Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="ticketPrice"
                  value={showData.ticketPrice}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Total Seats</label>
                <input
                  type="number"
                  className="form-control"
                  name="totalSeats"
                  value={showData.totalSeats}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Available Seats</label>
                <input
                  type="number"
                  className="form-control"
                  name="availableSeats"
                  value={showData.availableSeats}
                  onChange={handleInputChange}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddShow}
              >
                Add
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={closeShowModal}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Shows;

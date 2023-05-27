
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import moment from "moment";
import "moment/locale/en-in"; 
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import "./MoviesTheater.css";

const MovieTheater = () => {
  const [movie, setMovie] = useState(null);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const dispatch = useDispatch();

  const fetchMovie = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `http://localhost:8000/api/movies/movieId/${movieId}?date=${date}`
      );
      if (response.data) {
        setMovie(response.data);
      } else {
        console.error("Invalid movie data:", response.data);
      }dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Failed to fetch movie:", error);
    }
  };



const fetchTheaters = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:8000/api/theater/getAllTheatersByMovie",
        { movie: movieId, date }
      );
      if (response.data && Array.isArray(response.data.data)) {
        setTheaters(response.data.data);
        setShows(response.data.data.flatMap(theater => theater.shows));
      } else {
        console.error("Invalid theaters data:", response.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Failed to fetch theaters:", error);
    }
  };
  


  useEffect(() => {
    fetchMovie();
  }, [movieId, date]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const selectedDate = searchParams.get("date");
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [location.search]);

  useEffect(() => {
    fetchTheaters();
  }, [movieId, date]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    navigate(`/movies/${movieId}?date=${selectedDate}`);
  };

  return (
    <div className="mx-2 mt-2">
      {movie ? (
        <div className="d-flex justify-content-between">
          <div>
            <h4>{movie.Title}</h4>
            <ul>
              <li>Duration: {movie.Duration} mins</li>
              <li>Language: {movie.Language}</li>
              <li>Genre: {movie.Genre}</li>
              <li>
                Release Date: {moment(movie.ReleaseDate).format("MMMM D, YYYY")}
              </li>
            </ul>
          </div>
          <div className="mx-2 mt-2">
            <label>Select Date:</label>
            <input
              type="date"
              min={moment().format("YYYY-MM-DD")}
              value={date}
              onChange={handleDateChange}
            />
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
  
      <hr />
  
      <div>
        <h4>Theaters</h4>
        {theaters && theaters.length > 0 ? (
          theaters.map((theater) => (
            <div key={theater._id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{theater.name}</h5>
                <p className="card-text">{theater.address}</p>
                <ul className="list-group">
                  {theater.shows.map((show) => {
                    const showTime = moment(show.time, "HH:mm").format("h:mm A");
                    return (
                      <li
                        key={show._id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        Show Time: {showTime}
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            navigate(`/book-show/${show._id}`)
                          }}
                        >
                          Book Now
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div>No theaters available</div>
        )}
      </div>
    </div>
  );
  
};

export default MovieTheater;



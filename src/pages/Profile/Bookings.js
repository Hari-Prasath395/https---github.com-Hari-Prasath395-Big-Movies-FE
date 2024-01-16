

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "./Bookings.css";

const Bookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  const getBookings = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "https://big-movies-backend.onrender.com/api/bookings/get-all-bookings"
      );
      if (response.data.success) {
        setBookings(response.data.data);
        dispatch(hideLoading());
      } else {
        dispatch(hideLoading());
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <div className="p-3">
      <table className="table">
        <thead>
          <tr>
            <th>Movie</th>
            <th>Theater</th>
            <th>Date</th>
            <th>Time</th>
            <th>Ticket Amount</th>
            <th>Booking ID</th>
            <th>Seats</th>
            <th>Poster Image</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.show.movie.Title}-{booking.show.movie.Language}</td>
              <td>{booking.show.theater.name}-{booking.show.theater.address}</td>
              <td>{moment(booking.show.date).format("MMMM DD, YYYY")}</td>
              <td>{moment(booking.show.time, "HH:mm").format("h:mm A")}</td>
              <td>Rs: {booking.show.ticketPrice}</td>
              <td>{booking._id}</td>
              <td>{booking.seats.join(", ")}</td>
              <td>
                <img
                  src={booking.show.movie.PosterImageUrl}
                  alt="Movie Poster"
                  className="poster-image"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import { useSelector } from "react-redux";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookShow = () => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const fetchShow = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/theater/getShowById", {
        showId: showId
      });
      if (response.data.success) {
        setShow(response.data.data);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log("Error occurred:", error.message);
    }
  };

  const getSeats = () => {
    const columns = 12;
    const totalSeats = show.totalSeats;
    const seatNumbers = Array.from(Array(totalSeats).keys());
    const rows = Math.ceil(totalSeats / columns);

    const seatClass = (seat, column) => {
      let classNames = "seat";
      const seatNumber = seat * columns + column + 1;

      if (selectedSeats.includes(seatNumber)) {
        classNames += " selected-seat";
      }
      if (show.bookedSeats.includes(seatNumber)) {
        classNames += " booked-seat";
      }

      return classNames;
    };

    return (
      <div className="d-flex flex-column gap-3 card">
        {Array.from(Array(rows).keys()).map((row, rowIndex) => (
          <div key={rowIndex} className="d-flex gap-3">
            {seatNumbers.slice(row * columns, (row + 1) * columns).map((seat, seatIndex) => (
              <div
                key={seatIndex}
                className={seatClass(seat, seatIndex)}
                onClick={() => {
                  const seatNumber = seat * columns + seatIndex + 1;
                  if (!show.bookedSeats.includes(seatNumber)) {
                    if (selectedSeats.includes(seatNumber)) {
                      setSelectedSeats(selectedSeats.filter((item) => item !== seatNumber));
                    } else {
                      setSelectedSeats([...selectedSeats, seatNumber]);
                    }
                  }
                }}
              >
                <h5 className="mb-0">{seat + 1}</h5>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const onToken = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/bookings/make-payment",
        {
          token: token,
          amount: selectedSeats.length * show.ticketPrice * 100
        }
      );

      if (response.data.success) {
        toast.success("Payment successful");
        book(response.data.transactionId);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error occurred:", error.message);
    }
  };

  const book = async (transactionId) => {
    try {
      const response = await axios.post("http://localhost:8000/api/bookings/bookshow", {
        show: showId,
        seats: selectedSeats,
        transactionId: transactionId,
        user: user._id
      });

      if (response.data.success) {
        toast.success("Booking successful");
        navigate("/profile");
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchShow();
  }, []);

  if (!show) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      
      <div className="header">
        <div className="header-left">
          <h4>{show.theater.name}</h4>
          <h6>{show.theater.address}</h6>
        </div>
        <div className="header-middle">
          <h4>
            {show.movie.Title}-{show.movie.Language}
          </h4>
        </div>
        <div className="header-right">
          <p>Date: {moment(show.date).format("MMMM DD, YYYY")}</p>
          <p>Time: {moment(show.time, "HH:mm").format("h:mm A")}</p>
        </div>
        <hr />
      </div>
      <div className="d-flex justify-content-center mt-5 p-3">{getSeats()}</div>
      <div className="d-flex justify-content-center p-3">
        <div>
          {selectedSeats.length > 0 && (
            <StripeCheckout
              token={onToken}
              amount={selectedSeats.length * show.ticketPrice * 100}
              stripeKey="pk_test_51NA79xSAQxzsriZxdwVFxbcFgkiUcRmNEllMDJd2s5KJ78yGuNtJWNmSKFccLlCFhCrqQQOnRpIa0UU7pD5Oh2uZ00TzIBzXCs"
            >
              <button className="btn btn-warning">Book Now</button>
            </StripeCheckout>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookShow;




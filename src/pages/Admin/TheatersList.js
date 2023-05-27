import React, { useState, useEffect } from "react";
import axios from "axios";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import "./TheatersList.css";


const TheatersList = () => {
  const [theaters, setTheaters] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "http://localhost:8000/api/theater/getTheaters"
      );
      if (Array.isArray(response.data.data)) {
        setTheaters(response.data.data);
      } else {
        console.error("Invalid theaters data:", response.data);
      }dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Failed to fetch theaters:", error);
    }
  };

  const handleAction = async (theaterId, currentStatus) => {
    try {
      dispatch(showLoading());
      const updatedStatus =
        currentStatus === "approved" ? "blocked" : "approved";
      const response = await axios.put(
        `http://localhost:8000/api/theater/updateStatus/${theaterId}`,
        { status: updatedStatus }
      );
      if (response.data.success) {
        const updatedTheaters = theaters.map((theater) => {
          if (theater._id === theaterId) {
            return { ...theater, status: updatedStatus };
          }
          return theater;
        });
        setTheaters(updatedTheaters);
      } else {
        console.error("Failed to update theater status:", response.data);
      }dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Failed to update theater status:", error);
    }
  };

  return (
    <div>
      <div className="table-responsive">
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {theaters.map((theater) => (
              <tr key={theater._id}>
                <td>{theater.name}</td>
                <td>{theater.address}</td>
                <td>{theater.phone}</td>
                <td>{theater.email}</td>
                <td>
                  {theater.status === "approved" ? (
                    <span className="text-success">Approved</span>
                  ) : (
                    <span className="text-warning">Pending</span>
                  )}
                </td>
                <td>
                  {theater.status === "approved" ? (
                    <button
                      className="btn btn-sm btn-block btn-warning"
                      onClick={() => handleAction(theater._id, theater.status)}
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-block btn-success"
                      onClick={() => handleAction(theater._id, theater.status)}
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TheatersList;

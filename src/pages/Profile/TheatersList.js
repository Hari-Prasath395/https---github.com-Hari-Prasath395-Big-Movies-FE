import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import TheaterForm from "./TheaterForm";
import { MdEditSquare } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import './TheatersList.css'

const TheatersList = () => {
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState("add");
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [theaters, setTheaters] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchTheaters();
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
      } dispatch(hideLoading());
    } 
    catch (error) {
      dispatch(hideLoading());
      console.error("Failed to fetch theaters:", error);
    }
  };

  const handleDeleteTheater = async (theaterId) => {
    try {
      dispatch(showLoading());
      await axios.delete(
        `http://localhost:8000/api/theater/deleteTheater/${theaterId}`
      );
      fetchTheaters(); // Fetch updated theater list
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Failed to delete the theater:", error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-dark mx-2 mt-2" onClick={openModal}>
          Add Theater
        </button>
      </div>
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
                  <MdEditSquare
                    style={{
                      color: "blue",
                      marginRight: "5px",
                      cursor: "pointer",
                    }}
                    size={30}
                    onClick={() => {
                      setSelectedTheater(theater);
                      setFormType("edit");
                      openModal();
                    }}
                  />

                  <MdDeleteSweep
                    style={{ color: "red", cursor: "pointer" }}
                    size={30}
                    onClick={() => handleDeleteTheater(theater._id)}
                  />
                   <Link
                    to={{
                      pathname: "/shows",
                      search: `?theaterName=${encodeURIComponent(
                        theater.name
                      )}&theaterId=${theater._id}`,
                      state: {
                        theaterId: theater._id,
                        theaterName: theater.name,
                      },
                    }}
                  >
                    Shows
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Add Theater Modal"
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
        <TheaterForm
          closeModal={closeModal}
          formType={formType}
          selectedTheater={selectedTheater}
          fetchTheaters={fetchTheaters}
        />
      </Modal>
    </div>
  );
};

export default TheatersList;

import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import './register.css'

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:8000/api/users/register",
        data
      );

      dispatch(hideLoading());

      console.log(response);
      // Registration successful
      toast.success(response.data.message);
      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      dispatch(hideLoading());
      if (error.response && error.response.status === 400) {
        // User already exists
        toast.error("User already exists. Please choose a different email.");
      } else {
        // Other registration errors
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card">
        <h3 className="mb-3 text-center">BIGMOVIES REGISTER</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              <FaUser /> Name
            </label>
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Enter Name"
              required
              value={username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter Email"
              required
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <FaLock /> Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter Password"
              required
              value={password}
              onChange={handleChange}
            />
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-primary" type="submit">
              Register
            </button>
          </div>
          <div className="text-center mt-2">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;

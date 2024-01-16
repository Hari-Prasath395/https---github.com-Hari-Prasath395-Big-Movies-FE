import React, { useEffect, useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import "./Login.css";


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email: formData.email,
      password: formData.password,
    };

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "https://big-movies-backend.onrender.com/api/users/login",
        data
      );
      dispatch(hideLoading());
      console.log(response);
      // Login successful
      toast.success("Login successful", { autoClose: 200 });
      setFormData({
        email: "",
        password: "",
      });

      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      dispatch(hideLoading());
      if (
        (error.response && error.response.status === 401, { autoClose: 200 })
      ) {
        // Incorrect credentials
        toast.error("Incorrect email or password");
      } else {
        // Other login errors
        toast.error("Login failed. Please try again.", { autoClose: 200 });
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card">
        <h3 className="mb-3 text-center">LOGIN</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={email}
              placeholder="Enter Email"
              onChange={handleChange}
              required
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
              value={password}
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
          <div className="text-center mt-2">
            <Link to="/register">Don't have an account? Register</Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;

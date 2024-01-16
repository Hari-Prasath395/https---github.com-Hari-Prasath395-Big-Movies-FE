






































import { AiOutlineLogout } from 'react-icons/ai';
import { BsFilm } from 'react-icons/bs';
import { RiMovie2Line } from 'react-icons/ri';
import { FaUserAlt } from 'react-icons/fa';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setUser } from '../redux/userSlice';
import { showLoading, hideLoading } from '../redux/loaderSlice';
import './ProtectedRoute.css';
function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get('https://big-movies-backend.onrender.com/api/users/getCurrentUser', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(hideLoading());
      dispatch(setUser(response.data.user));
      toast.success(response.data.message, { autoClose: 200 });
    } catch (error) {
      dispatch(hideLoading());
      dispatch(setUser(null));
      toast.error(error.message, { autoClose: 200 });
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getCurrentUser();
    } else {
      navigate('/login');
    }
  }, []);

  return user && (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => {
            navigate('/');
          }}>
            <RiMovie2Line  size={30} className="me-2" />
            BigMovies
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" style={{ cursor: 'pointer' }} onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/login');
                }}>
                  <AiOutlineLogout size={20} className="me-1" />
                  Logout
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{ cursor: 'pointer' }} onClick={() => {
                  if (user.isAdmin) {
                    navigate('/admin');
                  } else {
                    navigate('/profile');
                  }
                }}>
                  <FaUserAlt size={20} className="me-1" />
                  Profile
                </a>
              </li>
            </ul>
            <form className="d-flex">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-light" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
      <div className='content'>
        {children}
      </div>
    </div>
  );
}

export default ProtectedRoute;

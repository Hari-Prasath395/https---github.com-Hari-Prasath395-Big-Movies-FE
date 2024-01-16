import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {showLoading,hideLoading} from '../../redux/loaderSlice'
import './TheaterForm.css'

const TheaterForm = ({ closeModal, formType, selectedTheater,fetchTheaters }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.users);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
  });

  useEffect(() => {
    if (selectedTheater) {
      setFormData({
        name: selectedTheater.name,
        address: selectedTheater.address,
        phoneNumber: selectedTheater.phone,
        email: selectedTheater.email,
      });
    }
  }, [selectedTheater]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const owner = user.id;
    try {
      let response = null;
      if (formType === 'add') {
        dispatch(showLoading());
        response = await axios.post(
          'https://big-movies-backend.onrender.com/api/theater/addTheater',
          {
            name: formData.name,
            address: formData.address,
            phone: formData.phoneNumber,
            email: formData.email,
            owner: owner,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        ); dispatch(hideLoading());        fetchTheaters();
      } else {
        dispatch(showLoading());
        response = await axios.put(
          `https://big-movies-backend.onrender.com/api/theater/update/${selectedTheater._id}`,
          {
            name: formData.name,
            address: formData.address,
            phone: formData.phoneNumber,
            email: formData.email,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        ); dispatch(hideLoading());
      } fetchTheaters();
      dispatch(hideLoading());
      toast.success(response.data.message, { autoClose: 200 });
     
     
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.message, { autoClose: 200 });
    }

    closeModal();
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="modal-dialog modal-dialog-centered modal-md">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{formType === 'add' ? 'Add Theater' : 'Edit Theater'}</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <textarea className="form-control" id="address" name="address" rows="3" value={formData.address} onChange={handleChange}></textarea>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number
                </label>
                <input type="number" className="form-control" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TheaterForm;

import React, { useState,useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../../redux/loaderSlice';
import './MoviesForm.css';

const MoviesForm = ({ closeModal, formType, selectedMovie,fetchMovies }) => {

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    language: '',
    genre: '',
    releaseDate: '',
    imageUrl: '',
  });


  useEffect(() => {
    if (selectedMovie) {
      const formattedReleaseDate = new Date(selectedMovie.ReleaseDate).toISOString().substr(0, 10);
      setFormData({
        title: selectedMovie.Title,
        description: selectedMovie.Description,
        duration: selectedMovie.Duration,
        language: selectedMovie.Language,
        genre: selectedMovie.Genre,
        releaseDate: formattedReleaseDate,
        imageUrl: selectedMovie.PosterImageUrl,
      });
    }
  }, [selectedMovie]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      let response = null;
      if (formType === 'add') {
        dispatch(showLoading());
        response = await axios.post('https://big-movies-backend.onrender.com/api/movies/addMovie', {
          Title: formData.title,
          Description: formData.description,
          Duration: formData.duration,
          Language: formData.language,
          Genre: formData.genre,
          ReleaseDate: formData.releaseDate,
          PosterImageUrl: formData.imageUrl,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },  
        });dispatch(hideLoading());
      }else{
        dispatch(showLoading());
        response = await axios.put(`https://big-movies-backend.onrender.com/api/movies/updateMovie/${selectedMovie._id}`, {
       
          Title: formData.title,
          Description: formData.description,
          Duration: formData.duration,
          Language: formData.language,
          Genre: formData.genre,
          ReleaseDate: formData.releaseDate,
          PosterImageUrl: formData.imageUrl,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
      }
      dispatch(hideLoading());
      toast.success(response.data.message, { autoClose: 200 });
      fetchMovies(); // Fetch the updated movie list
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
    <div className="modal-body">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">{formType === 'add' ? 'Add Movie' : 'Edit Movie'}</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} >
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea className="form-control" id="description" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="duration" className="form-label">Duration</label>
                <input type="text" className="form-control" id="duration" name="duration" value={formData.duration} onChange={handleChange} />
              </div>
              <div className="col">
                <label htmlFor="language" className="form-label">Language</label>
                <select className="form-select" id="language" name="language" value={formData.language} onChange={handleChange}>
                  <option value="">Select Language</option>
                  <option value="Tamil">Tamil</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Kannada">Kannada</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="genre" className="form-label">Genre</label>
                <select className="form-select" id="genre" name="genre" value={formData.genre} onChange={handleChange}>
                  <option value="">Select Genre</option>
                  <option value="comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Action">Action</option>
                  <option value="Horror">Horror</option>
                </select>
              </div>
              <div className="col">
                <label htmlFor="releaseDate" className="form-label">Release Date</label>
                <input type="date" className="form-control" id="releaseDate" name="releaseDate" value={formData.releaseDate} onChange={handleChange} />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="imageUrl" className="form-label">Poster Image URL</label>
              <input type="text" className="form-control" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
            </div>
            <div className="card-footer d-flex justify-content-between">
              <button type="button" className="btn btn-secondary"  onClick={closeModal}>
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

export default MoviesForm;

import React, { useState } from 'react';
import './CreateUser.scss';
import { createUser } from '../../../../../utils/axiosFunc';
import { useNavigate } from 'react-router-dom';

export const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    information: '',
    password: '',
    refresh_token: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await createUser(formData);
      setSuccessMessage('User created successfully');
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        information: '',
        password: '',
        refresh_token: ''
      });
      navigate('/admin/users');

    } catch (error) {
      setErrorMessage('Error creating user');
    }
  };

  return (
    <div className="create-user-form">
      <h2>Create User</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form className='formCreateUser' onSubmit={handleSubmit}>
        <label>
          Логін:
          <input
            className='input-search input'
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Ім'я:
          <input
            className='input-search input'
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Прізвище:
          <input
            className='input-search input'
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Телефон:
          <input
            className='input-search input'
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
        <label>
          Електронна пошта:
          <input
            className='input-search input'
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Інформація:
          <textarea
            rows="5"
            className='input-search input textarea'
            name="information"
            value={formData.information}
            onChange={handleChange}
          />
        </label>
        <label>
          Пароль:
          <input
            className='input-search input'
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <label>
          Refresh Token:
          <input
            className='input-search input'
            type="text"
            name="refresh_token"
            value={formData.refresh_token}
            onChange={handleChange}
          />
        </label>
        <button className='button-add-user button' type="submit">Створити Користувача</button>
      </form>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import './Users.scss';
import { deleteUser, getAllUsers, patchUser } from '../../../../utils/axiosFunc';
import { useNavigate } from 'react-router-dom';

export function Users() {
  const navigate = useNavigate();
  // const refreshPage = () => {
  //   window.location.reload();
  // };
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({
    id: 0,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    information: '',
    role: '',
    forward_provider_message: false,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditedUser(user);
  };

  const stopEditing = () => {
    setEditingUserId(null);
    setEditedUser({
      id: 0,
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      information: '',
      role: '',
      forward_provider_message: false,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setEditedUser((prev) => ({
      ...prev,
      forward_provider_message: e.target.checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    patchUser(editedUser)
      .then((data) => {
        if (data) {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === editingUserId ? { ...user, ...editedUser } : user
            )
          );

          setSuccessMessage('User updated successfully');
          stopEditing();
          const timer = setTimeout(() => {
            setSuccessMessage('');
            clearTimeout(timer);
          }, 3000);
        }
      })
      .catch(() => {
        setErrorMessage('Error updating user');
        const timer = setTimeout(() => {
          setErrorMessage('');
          clearTimeout(timer);
        }, 3000);

      });
  };

  const delUser = async () => {
    await deleteUser(editedUser.id);
    getAllUsers()
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => console.error('Error fetching users:', error));
  };

  return (
    <div className="user-list-container">
      <h2>Список користувачів</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="user-cards">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            {editingUserId === user.id ? (
              <form className='formEditUser' onSubmit={handleSubmit}>
                <label> Логін:
                  <input
                    className='input-search input'
                    type="text"
                    name="username"
                    value={editedUser.username}
                    onChange={handleChange}
                    placeholder="Логін"
                  />
                </label>
                <label>Ім'я:
                  <input
                    className='input-search input'
                    type="text"
                    name="first_name"
                    value={editedUser.first_name}
                    onChange={handleChange}
                    placeholder="Ім'я"
                  />
                </label>
                <label> Прізвище:
                  <input
                    className='input-search input'
                    type="text"
                    name="last_name"
                    value={editedUser.last_name}
                    onChange={handleChange}
                    placeholder="Прізвище"
                  />
                </label>
                <label>Електронна пошта:
                  <input
                    // className='input input-email-edit-user'
                    className='input-search input'
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                </label>
                <label>Інформація:
                  <input
                    className='input-search input'
                    type="text"
                    name="information"
                    value={editedUser.information}
                    onChange={handleChange}
                    placeholder="Інформація"
                  />
                </label>
                <label>Роль:
                  <input
                    className='input-search input'
                    type="text"
                    name="role"
                    value={editedUser.role}
                    onChange={handleChange}
                    placeholder="Роль"
                  />
                </label>
                <div className="checkbox-container">
                  <label>
                    <input
                      className='checkbox'
                      type="checkbox"
                      name="forward_provider_message"
                      checked={editedUser.forward_provider_message}
                      onChange={handleCheckboxChange}
                    />
                    Пересилання повідомлень
                  </label>
                </div>
                <div className="buttons-container">
                  <button className="button" onClick={() => navigate('/admin/users')} type="submit">
                    Зберегти
                  </button>
                  <button className="button" type="button" onClick={delUser}>
                    Видалити
                  </button>
                  <button className="button" type="button" onClick={stopEditing}>
                    Скасувати
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className='edit-user-lable'><strong>ID:</strong> {user.id}</p>
                <p className='edit-user-lable'><strong>Логін:</strong> {user.username}</p>
                <p className='edit-user-lable'><strong>Ім'я:</strong> {user.first_name}</p>
                <p className='edit-user-lable'><strong>Прізвище:</strong> {user.last_name}</p>
                <p className='edit-user-lable'><strong>Email:</strong> {user.email}</p>
                <p className='edit-user-lable'><strong>Інформація:</strong> {user.information}</p>
                <p className='edit-user-lable'><strong>Роль:</strong> {user.role}</p>
                <p className='edit-user-lable'><strong>Пересилання повідомлень:</strong> {user.forward_provider_message ? 'Так' : 'Ні'}</p>
                <div className="buttons-container">
                  <button className="button" onClick={() => startEditing(user)}>
                    Редагувати
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

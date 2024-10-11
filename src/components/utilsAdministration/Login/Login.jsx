/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './Login.css';
import cn from 'classnames';
// import { getRefreshToken } from '../../../utils/axiosFunc';
import useStoreAuth from '../../../utils/StoreAuth';
import { CLIENT_ID } from '../../../services/httpClient';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../../utils/Loading/Loading';
import axios from 'axios';
import { CustomAlert, showAlert } from '../../../utils/CustomAlert/CustomAlert';

import { getCurrentUser, googleAutorization } from '../../../utils/axiosFunc';
import { SERVER_URL } from '../../../services/axiosClient';


export const Login = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const loading = useStoreAuth((state) => state.loading);
  const setLoading = useStoreAuth((state) => state.setLoading);
  // const user = useStoreAuth((state) => state.user);
  const setUser = useStoreAuth((state) => state.setUser);
  // const profile = useStoreAuth((state) => state.profile);
  // const setProfile = useStoreAuth((state) => state.setProfile);

  const [inputName, setInputName] = useState('');
  const [inputLastName, setInputLastName] = useState('');
  const [inputEmail, setInputEmail] = useState(localStorage.getItem('email') || '');
  const [inputPassword, setInputPassword] = useState(localStorage.getItem('password') || '');
  const [massege, setMassege] = useState(false);

  useEffect(() => {
    initializeGoogleSignIn();
  }, [isChecked]);

  const handleLoginGoogle = async (credentialResponse) => {
    setLoading(true);

    try {
      const authCode = credentialResponse.credential;

      // Відправка auth_code на бекенд
      const response = await googleAutorization({ auth_code: authCode });

      if (response.access_token && response.refresh_token) {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('token_type', response.token_type);

        const userResponse = await getCurrentUser();
        localStorage.setItem('user', JSON.stringify(userResponse));
        setUser(userResponse);
        console.log(userResponse);
        console.log('Авторизація успішна:', response);

        navigate('/');
        setLoading(false);
      } else {
        console.error('Спроба авторизації зазнала невдачі');
      }
    } catch (error) {
      console.error('Спроба входу зазнала невдачі', error);
    }
  };

  const initializeGoogleSignIn = () => {
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleLoginGoogle,
    });

    window.google.accounts.id.renderButton(
      document.getElementById('signInDiv'),
      {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        width: '240',
        locale: 'uk'
      }
    );
  };

  const handleRegistration = (event) => {
    event.preventDefault();
    if (inputName === '' || inputLastName === '' || inputEmail === '' || inputPassword === '') {
      alert('Заповніть всі поля');
      return;
    }
    if (inputPassword.length < 6) {
      alert('Пароль повинен містити не менше 6 символів');
      return;
    }
    const data = {
      'first_name': inputName,
      'last_name': inputLastName,
      'email': inputEmail,
      'password': inputPassword //str(min_length = 6)
    };
    localStorage.setItem('email', inputEmail);
    localStorage.setItem('password', inputPassword);
    console.log(data);
    setLoading(true);
    // SignUp(data).then((res) => {
    //   getCurrentUser().then((res) => {
    //     if (res.status === 200) {
    //       console.log(res);
    //       setUser(res.data);
    //     }
    //   });
    //   console.log(res);
    //   if (res.status === 200) {
    //     alert('Ви успішно зареєструвались');
    //   }
    //   if (res.status === 400) {
    //     alert('Користувач з таким емейлом вже існує');
    //   }
    //   if (res.status === 500) {
    //     alert('Щось пішло не так');
    //   }
    //   if (res.status === 404) {
    //     alert('Сервер не знайдено');
    //   }
    //   if (res.status === 401) {
    //     alert('Неавторизований доступ');
    //   }
    //   if (res.status === 403) {
    //     alert('Доступ заборонено');
    //   }
    // });
    axios.post(SERVER_URL +'/api/auth/signup', data, {
      headers: {
        'Content-Type': 'application/json' // Вказуємо, що відправляємо JSON
      }
    })
      .then(response => {

        if (response.status === 200 || response.status === 201) {
          setMassege(true);
        }
        console.log("Успішно:", response.data);
      })
      .catch(error => {
        if (error.response) {
          console.error("Деталі помилки:", error.response.data);
        } else {
          console.error("Помилка при виконанні запиту:", error.message);
        }
      }).finally((response) => {
        setLoading(false);
        const time = setTimeout(() => {
          showAlert();
          clearTimeout(time);
        }, 200);
      });
  }

  const login = async () => {
    if ( inputEmail === '' || inputPassword === '') {
      alert('Заповніть всі поля');
      return;
    }
    if (inputPassword.length < 6) {
      alert('Пароль повинен містити не менше 6 символів');
      return;
    }
    const data = {
      'username': inputEmail,
      'password': inputPassword
    };
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('username', data.username);
      params.append('password', data.password);

      const response = await axios.post(SERVER_URL +'/api/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        console.log('Успішний вхід:', response.data);
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        navigate('/');
      }
    } catch (error) {
      // window.location.reload();
      console.error('Помилка авторизації:', error);
    } finally {
      setLoading(false);
      setIsChecked(true);
    }
  }

  return (
    <div className="section" >
      <div className="container-logo">
        <div className="row full-height justify-content-center">
          {loading ? <Loading /> :
            <div className="col-12 text-center align-self-center py-5">
              {massege && <CustomAlert email={inputEmail} id="custom-alert" />}
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3">
                  <button
                    type='button'
                    className={cn('span', { 'active': !isChecked })}
                    onClick={() => setIsChecked(false)}
                  >
                    Увійти
                  </button>
                  <button
                    type='button'
                    className={cn('span', { 'active': isChecked })}
                    onClick={() => setIsChecked(true)}
                  >
                    Реістрація
                  </button>
                </h6>
                <input
                  className="checkbox"
                  type="checkbox"
                  id="reg-log"
                  name="reg-log"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                />

                <label htmlFor="reg-log"></label>

                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
                    <div className="card-front">
                      <div className="center-wrap">
                        <form className="section text-center">
                          <h4 className="mb-4 pb-3">Вхід</h4>
                          <div className="form-group">
                            <input
                              type="email"
                              name="logemail"
                              value={inputEmail}
                              className="form-style"
                              placeholder="Ваш Емейл"
                              id="logemail"
                              autoComplete="off"
                              onChange={(e) => setInputEmail(e.target.value)}
                            />
                            <i className="input-icon uil uil-at"></i>

                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="password"
                              name="logpass"
                              value={inputPassword}
                              className="form-style"
                              placeholder="Ваш Пароль"
                              id="logpass"
                              autoComplete="off"
                              onChange={(e) => setInputPassword(e.target.value)}
                            />
                            <i className="input-icon uil uil-lock-alt"></i>
                          </div>
                          <button
                            type='button'
                            className="btn-login mt-4"
                            onClick={login}
                          >
                            Увійти
                          </button>
                          {!isChecked && <div className='buttons_container_google_login'>
                            <div id="signInDiv"></div>
                          </div>}
                        </form>
                      </div>
                    </div>
                    <div className="card-back">
                      <div className="center-wrap">
                        <form className="section text-center">
                          <h4 className="mb-4 pb-3">Реістрація</h4>
                          <div className="form-group">
                            <input
                              value={inputName}
                              type="text"
                              name="logname"
                              className="form-style"
                              placeholder="Ваше Імʼя"
                              id="logname"
                              autoComplete="off"
                              onChange={(e) => setInputName(e.target.value)}
                            />
                            <i className="input-icon uil uil-user"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              value={inputLastName}
                              type="text"
                              name="logname"
                              className="form-style"
                              placeholder="Ваше Прізвище"
                              id="logLastName"
                              autoComplete="off"
                              onChange={(e) => setInputLastName(e.target.value)}
                            />
                            <i className="input-icon uil-user-circle"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              value={inputEmail}
                              type="email"
                              name="logemail"
                              className="form-style"
                              placeholder="Ваш Емейл"
                              id="logemail1"
                              autoComplete="off"
                              onChange={(e) => setInputEmail(e.target.value)}
                            />
                            <i className="input-icon uil uil-at"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              value={inputPassword}
                              type="password"
                              name="logpass"
                              className="form-style"
                              placeholder="Ваш Пароль"
                              id="logpass1"
                              autoComplete="off"
                              onChange={(e) => setInputPassword(e.target.value)}
                            />
                            <i className="input-icon uil uil-lock-alt"></i>
                          </div>
                          <a href="#/" className="btn-login mt-4" onClick={(event) => handleRegistration(event)}>
                            Зареєструватися
                          </a>
                          {isChecked && <div className='buttons_container_google_login'>
                            <div id="signInDiv"></div>
                          </div>}
                        </form>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>
  );
};

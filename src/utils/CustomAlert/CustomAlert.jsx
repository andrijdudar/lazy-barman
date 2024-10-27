import React, { useEffect } from 'react';
import './CustomAlert.scss';

export const showAlert = () =>  {
  const alertBox = document.getElementById('custom-alert');
  if (alertBox) {
    alertBox.classList.add('show');
  }
}

export function CustomAlert({email}) {

  const hideAlert = () => {
    const alertBox = document.getElementById('custom-alert');
    if (alertBox) {
      alertBox.classList.remove('show');
    }
  };

  useEffect(() => {
    const closeButton = document.getElementById('close-alert');
    const continueButton = document.getElementById('continue-alert'); // Новий елемент

    if (closeButton) {
      closeButton.addEventListener('click', hideAlert);
    }

    if (continueButton) {
      continueButton.addEventListener('click', hideAlert); // Додаємо обробник події на нову кнопку
    }

    return () => {
      if (closeButton) {
        closeButton.removeEventListener('click', hideAlert);
      }
      if (continueButton) {
        continueButton.removeEventListener('click', hideAlert); // Забираємо обробник події при розмонтаженні компонента
      }
    };
  }, []);

  return (
    <div id="custom-alert" className="custom-alert">
      <div className="alert-content">
        {/* <p>{massage || ''}</p> */}
        <h1>Дякуємо за реєстрацію. </h1>
        <h2 className='content_alert'>На ваш email відправлено лист для підтвердження та посилання на наш телеграм бот.</h2>
       <div className='container-alert-buttons'>
          {/* <a href={`http://${JSON.parse(localStorage.getItem('user')).email} || 'gmail.com`} id="close-alert" className="email-button">
            {buttonText || ''}
          </a> */}
           <a href={`http://${email}`} id="close-alert" className="email-button">
            Перейти на поштy
          </a>
          <a href='#/' id="continue-alert" className="email-button">
            Продовжити
          </a>
       </div>
      </div>
    </div >
  );
}

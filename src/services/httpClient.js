
export const SERVER_URL = 'https://marked-addia-ago-0dd6d371.koyeb.app';
// export const SERVER_URL = 'https://0cfd-194-44-160-206.ngrok-free.app';
// export const SERVER_URL_AUTH = 'https://marked-addia-ago-0dd6d371.koyeb.app';
export const GOOGLE_AUTH_URL = SERVER_URL + '/api/auth/google_auth';
export const CLIENT_ID = '175403963155-qg3ma8d95h6lck440svfkrf4mtm60nb3.apps.googleusercontent.com';
const handleResponse = async (response) => {

  // if (response.status === 401) {
  //   const refreshResponse = await fetch(SERVER_URL + '/api/auth/refresh_token', {
  //     method: 'GET',
  //     credentials: 'include',
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
  //     },
  //   });

  //   if (!refreshResponse.ok) {
  //     window.location.href = '/login';
  //     throw new Error('Помилка авторизації. Не вдалося оновити токен.');
  //   }
  //   return await refreshResponse.json();
  // }


  if (!response.ok) {
    console.log('помилка');
    throw new Error('Дані з сервера не отримано');
  }

  // if (response.status === 401) {
  //   console.log('Помилка авторизації');

  //   const refreshResponse = await fetch(SERVER_URL + '/api/auth/refresh_token', {
  //     method: "GET",
  //     headers: new Headers({
  //       'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
  //       "ngrok-skip-browser-warning": "69420",
  //     }),
  //     credentials: 'include',
  //   });

  //   if (!refreshResponse.ok) {
  //     console.log('Помилка оновлення токена. Потрібно залогінитись заново.');

  //     localStorage.removeItem('accessToken');
  //     localStorage.removeItem('refreshToken');

  //     // Перенаправляємо користувача на сторінку логіну
      //// window.location.href = 'https://andrijdudar.github.io/lazy-barmen'; // Замініть на правильний шлях до сторінки логіну
  //     return;
  //   }

  //   const refreshData = await refreshResponse.json();

  //   localStorage.setItem('access_token', refreshData.access_token);
  //   localStorage.setItem('refresh_token', refreshData.refresh_token);
  //   localStorage.setItem('token_type', refreshData.token_type);

  //   const retryResponse = await fetch(response.url, {
  //     method: response.config.method,
  //     headers: {
  //       ...response.config.headers,
  //       'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
  //     },
  //     body: response.config.body,
  //     credentials: 'include',
  //   });

  //   return await handleResponse(retryResponse);
  // }
  return await response.json();
}

export const client = {
  async get(url) {
    try {
      const response = await fetch(SERVER_URL + url, {
        method: "GET",
        headers: new Headers({
          'Authorization': `Bearer ${localStorage.getItem('access_token') }`,
          'X-Requested-With': 'XMLHttpRequest',
          "ngrok-skip-browser-warning": "69420",
        }),
      });
      return await handleResponse(response);
    }
    catch (error) {
      console.error('Помилка при виконанні GET запиту:', error);
      throw error;
    }
  },

  async post(url, data) {
    try {
      const formData = new FormData();
      // formData.append(data);
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key]);
        }
      }
      const response = await fetch(SERVER_URL + url, {
        method: 'POST',
        credentials: 'include',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'X-Requested-With': 'XMLHttpRequest',
          "ngrok-skip-browser-warning": "69420",
        }),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Помилка при виконанні POST запиту:', error);
      throw error;
    }
  },

  async put(url, data) {
    try {
      const response = await fetch(SERVER_URL + url, {
        method: 'PUT',
        credentials: 'include',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'X-Requested-With': 'XMLHttpRequest',
          "ngrok-skip-browser-warning": "69420",
        }),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Помилка при виконанні PUT запиту:', error);
      throw error;
    }
  },

  async patch(url, data) {
    try {
      const response = await fetch(SERVER_URL + url, {
        method: 'PATCH',
        credentials: 'include',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'X-Requested-With': 'XMLHttpRequest',
          "ngrok-skip-browser-warning": "69420",
        }),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Помилка при виконанні PATCH запиту:', error);
      throw error;
    }
  },

  async delete(url) {
    try {
      const response = await fetch(SERVER_URL + url, {
        method: 'DELETE',
        credentials: 'include',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'X-Requested-With': 'XMLHttpRequest',
          "ngrok-skip-browser-warning": "69420",
        }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Помилка при виконанні DELETE запиту:', error);
      throw error;
    }
  },



  async getRefresh(url) {
    try {
      const response = await fetch(SERVER_URL + url, {
        method: "GET",
        // credentials: 'include',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
          'X-Requested-With': 'XMLHttpRequest',
          "ngrok-skip-browser-warning": "69420",
        }),
      });
      return await handleResponse(response);
    }
    catch (error) {
      console.error('Помилка при виконанні GET запиту:', error);
      throw error;
    }
  },
//   async getRefresh(url) {
//     try {
//       const response = await fetch(SERVER_URL + url, {
//         method: "GET",
//         headers:{
//           'Authorization': `Bearer ${refreshToken}`,
//         },
//         // credentials: 'include',
//       });

//       // Перевіряємо тип контенту
//       const contentType = response.headers.get("content-type");
//       if (contentType && contentType.includes("application/json")) {
//         return await response.json();
//       } else {
//         const textResponse = await response.text();
//         console.error("Отримано не JSON:", textResponse);
//         throw new Error("Відповідь не є JSON");
//       }
//     } catch (error) {
//       console.error('Помилка при виконанні GET запиту:', error);
//       throw error;
//     }
//   }

}

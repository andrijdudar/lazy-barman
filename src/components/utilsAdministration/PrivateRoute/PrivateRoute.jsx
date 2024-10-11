/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// import { getCurrentUser } from '../../../utils/axiosFunc';
// import useStoreAuth from '../../../utils/StoreAuth';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const accessToken = localStorage.getItem('access_token');
  const location = useLocation();
  // const setUser = useStoreAuth((state) => state.setUser);

  useEffect(() => {
    // getCurrentUser()
    //   .then((response) => {
    //     setUser(response);
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);



  return accessToken ? (
    <Component {...rest} />
  ) : (
      <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;

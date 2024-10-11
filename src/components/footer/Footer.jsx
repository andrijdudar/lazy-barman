import React from 'react';
import useStoreAuth from '../../utils/StoreAuth';
import './Footer.css';

const Footer = () => {
  const user = useStoreAuth((state) => state.user);
  return (
    <footer className="footerr">
      <p>© 2024 React. Всі права захищені.
        {user?.email || "не авторизований"}</p>
    </footer>
  );
};

export default Footer;

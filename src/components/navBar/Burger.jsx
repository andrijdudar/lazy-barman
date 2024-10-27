import React from 'react';
import { useEffect } from "react";
import useStore from "../../utils/Store";
import "./Burger.scss";
import cn from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';


export const Burger = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const burger = useStore((state) => state.burger);
  const setBurger = useStore((state) => state.setBurger);

  useEffect(() => {
    const checkbox = document.getElementById('check');
    if (checkbox) {
      checkbox.checked = burger;
    }
  }, [burger]);

  const handleLogoutSuccess = async () => {
    await axios({
      method: 'POST',
      url: 'https://marked-addia-ago-0dd6d371.koyeb.app/api/auth/logout',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className={cn('grid-end')}>

      {location.pathname ===  '/menu' &&
        <div>
          <input
            className="checkboxBurger"
            id="check"
            type="checkbox"
            onClick={(event) => event.stopPropagation()}
            onChange={() => setBurger(!burger)}
          />
          <label htmlFor="check" className="menuButton">
            <span className="top"></span>
            <span className="mid"></span>
            <span className="bot"></span>
          </label>
        </div>
      }
    </div>

  );
};

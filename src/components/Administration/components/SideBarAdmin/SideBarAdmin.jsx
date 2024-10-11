import React, { useState, useEffect, useRef } from "react";
import "./SideBarAdmin.css";
import { Link, useNavigate } from "react-router-dom";
// import useStoreAuth from "../../../../utils/StoreAuth";
import iconLogout from "../../../../img/logout-24px.svg";
import axios from "axios";
// import { logout } from "../../../../utils/axiosFunc";



const ListSettings = [
  {
    id: 1,
    title: "Страви",
    subLinks: [
      { id: 1.1, path: 'addDish', title: "Додати Страву" },
      // { id: 1.2, title: "Страви" },
      // { id: 1.3, title: "Страви" },
    ],
  },
  {
    id: 2,
    title: "Категорії",
    subLinks: [
      { id: 2.1, path: 'categories', title: "Переглянути всі категорії" },
      { id: 2.2, path: 'addCategory', title: "Добавити категорію" },
      // { id: 2.3, title: "Страви" },
    ],
  },
  {
    id: 3,
    title: "Постачальники",
    subLinks: [
      { id: 3.1, path: '', title: "Переглянути Постачальників" },
      { id: 3.2, path: '', title: "Добаити Постачальника" },
      // { id: 3.3, title: "Страви" },
    ],
  },
  {
    id: 4,
    title: "Премікси",
    subLinks: [
      { id: 4.1, path: 'premix', title: "Переглянути Премікси" },
      { id: 4.2, path: 'addPremix', title: "Добивити Премікс" },
    ],
  },
  {
    id: 5,
    title: "Інгредієнти",
    subLinks: [
      { id: 5.1, path: 'ingredients', title: "Переглянути Інгредієнти" },
      // { id: 5.2, path:'', title: "Додати Інгредієнт" },
      // { id: 5.3, title: "Страви" },
    ],
  },
  {
    id: 6,
    title: "Замовлення",
    subLinks: [
      { id: 6.1, path: '', title: "Переглянути Замовлення" },
      { id: 6.2, path: '', title: "Додати Замовлення" },
      // { id: 6.3, title: "Страви" },
    ],
  },
  {
    id: 7,
    title: "Користувачі",
    subLinks: [
      { id: 7.1, path: 'users', title: "Переглянути Користувачів" },
      { id: 7.2, path: 'createUser', title: "Додати Користувача" },
      // { id: 7.3, title: "Страви" },
    ],
  },
  {
    id: 8,
    title: "Звіти",
    subLinks: [
      { id: 8.1, path: '', title: "Переглянути Звіти" },
      // { id: 8.2, path:'', title: "Додати Звіт" },
      // { id: 8.3, title: "Страви" },
    ],
  },
  {
    id: 9,
    title: "Налаштування",
    subLinks: [
      { id: 9.1, path: '', title: "Переглянути Налаштування" },
      // { id: 9.2, path:'', title: "Додати Налаштування" },
      // { id: 9.3, title: "Страви" },
    ],
  },
];

export function SideBarAdmin({ onLinkClick }) {
  const navigate = useNavigate();
  const [openDetailId, setOpenDetailId] = useState(null);
  const detailsRef = useRef([]);

  const handleLogoutSuccess = async () => {
    await axios({
      method: 'POST',
      url: 'https://marked-addia-ago-0dd6d371.koyeb.app/api/auth/logout',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });
    // fetch('https://marked-addia-ago-0dd6d371.koyeb.app/api/auth/logout', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
    //   },
    // })

    // setAccessToken(null);
    // setRefreshToken(null);
    // setProfile(null);
    // localStorage.removeItem('auth_code');
    // localStorage.removeItem('access_token');
    // localStorage.removeItem('refresh_token');
    // localStorage.removeItem('token_type');
    // localStorage.removeItem('profile');
    // localStorage.removeItem('user');
    localStorage.clear();
    navigate('/');
  };


  useEffect(() => {
    detailsRef.current = detailsRef.current.slice(0, ListSettings.length);
  }, []);

  const handleToggle = (id) => {
    setOpenDetailId((prevId) => (prevId === id ? null : id));
  };

  // useEffect(() => {
  //   detailsRef.current.forEach((detail, i) => {
  //     if (detail.current) {
  //       if (ListSettings[i].id === openDetailId) {
  //         detail.current.open = true;
  //       } else {
  //         detail.current.open = false;
  //       }
  //     }
  //   });
  // }, [openDetailId]);

  return (
    <div className="SideBarAdmin">
      {ListSettings.map((item, index) => {
        const ref = React.createRef();
        detailsRef.current[index] = ref;

        return (
          <details
            key={item.id}
            ref={ref}
            open={openDetailId === item.id}
            onClick={(e) => {
              e.preventDefault();
              handleToggle(item.id);
            }}
            className="sideBarAdminDetails"
          >
            <summary>{item.title}</summary>
            <div className="subLinksSideBarAdmin">
              {item.subLinks.map((subLink) => (
                <Link
                  key={subLink.id}
                  to={subLink.path}
                  relative="path"
                  className="admin-link"
                  onClick={() => {
                    // const time = setTimeout(() => {
                      onLinkClick();
                    //   clearTimeout(time);
                    // }, 300);
                  }}
                >
                  {subLink.title}
                </Link>

              ))}
            </div>
          </details>
        );
      })}
      <button onClick={handleLogoutSuccess} className="button logout" type="button"><img src={iconLogout} alt="logout" /></button>
    </div>
  );
}

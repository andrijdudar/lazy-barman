/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import './SideBar.css';
import SearchSelect from '../utilsAdministration/SearchSelect/SearchSelect';
import cn from 'classnames';
import { getAllCategories } from '../../utils/axiosFunc';
import { Loading } from '../../utils/Loading/Loading';
import { useLocation } from 'react-router-dom';
import { convertToOptionsSelect, filteredItems } from '../utilsAdministration/SearchSelect/SearchUtils';
import useStore from '../../utils/Store';


function SideBar() {
  const [activeCategoryIds, setActiveCategoryIds] = useState([]);

  const categories = useStore((state) => state.categories);
  const setCategories = useStore((state) => state.setCategories);

  const dishesCategory = useStore((state) => state.dishesCategory);
  const setDishesCategory = useStore((state) => state.setDishesCategory);

  const setSearchDishes = useStore((state) => state.setSearchDishes);

  const setTitleCategory = useStore((state) => state.setTitleCategory);
  const dishes = useStore((state) => state.dishes);

  const burger = useStore((state) => state.burger);
  const setBurger = useStore((state) => state.setBurger);

  const [loading, setLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    getAllCategories()
      .then((data) => {
        setCategories(data);
        localStorage.setItem('categories', JSON.stringify(data));
      }).catch(() => {
        setCategories([]);
        console.log('error in getAllCategories in SideBar.jsx');
      })
      .finally(() => { setLoading(false); });
  }, []);


  const options = useMemo(() => convertToOptionsSelect(dishesCategory), [dishesCategory]);

  const updateOptions = useCallback((options) => {
    setSearchDishes(filteredItems(dishesCategory, options));
  }, [dishesCategory]);



  const handleCards = (categoryId, categoryName) => {
    const selectedDishes = dishes.filter(item => item.category_id === categoryId);
    setDishesCategory(selectedDishes);
    setActiveCategoryIds([]);
    setTitleCategory(categoryName);
  }

  const handleMenuDish = (id, child, categoryName) => {
    const isActive = activeCategoryIds.includes(id);
    if (isActive) {
      setActiveCategoryIds(activeCategoryIds.filter(activeId => activeId !== id));
    } else {
      setActiveCategoryIds([...activeCategoryIds, id]);
      console.log(activeCategoryIds);
      if (!child) {
        handleCards(id, categoryName);
        setBurger(false);
      }
    }
  }

  const renderCategories = (parentId) => {
    return categories.filter(item => item.parent_id === parentId).map(item => (
      <li className="sidebar-item" key={item.id}>
        <button className='btn-aside sidebar-item' onClick={() => handleMenuDish(item.id, item.child, item.name)}>
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}{' '}{item.lenth}
        </button>
        {activeCategoryIds.includes(item.id) && item.child && (
          <ul className="sidebar-nav">
            {renderCategories(item.id)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div className={cn("wrapper",
      { 'wrapper-open': burger && location.pathname === '/menu' },
    )}>
      <div className='search'>
        <SearchSelect
          options={options}
          updateOptions={updateOptions}
          placeholder='Пошук страви'
          // selectOpen={true}
          path='/'
        />
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div id="sidebar-wrapper">
          <ul className={cn('sidebar-nav')}>

            <li className="sidebar-item item" onClick={() => {
              setDishesCategory(dishes);
              setTitleCategory('Всі страви');
              setBurger(false);
            }}>
              Всі страви
            </li>

            {renderCategories(1)}
          </ul>
        </div>
      )}

    </div>
  );
}

export default SideBar;

/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useEffect, useState } from 'react';
import './MenuCards.css';
import { getAllDishes, patchDish } from '../../utils/axiosFunc';
import { Link } from 'react-router-dom';
import listIcon from '../../img/ListIconsolid.svg';
import tableIcon from '../../img/ListIconlarge.svg';
import cn from 'classnames';
import { Loading } from '../../utils/Loading/Loading';
import useStore from '../../utils/Store';
// import cn from 'classnames';

export const MenuCards = () => {
  const setDishesCategory = useStore((state) => state.setDishesCategory);
  // const dishesCategory = useStore((state) => state.dishesCategory);
  // const dishes = useStore((state) => state.dishes);
  const setDishes = useStore((state) => state.setDishes);
  const [currentCardId, setCurrentCardId] = useState(null);
  const titleCategory = useStore((state) => state.titleCategory);
  const searchDishes = useStore((state) => state.searchDishes);
  const setSearchDishes = useStore((state) => state.setSearchDishes);
  const view = useStore((state) => state.view);
  const setView = useStore((state) => state.setView);
  const [loader, setLoader] = useState(false)

  // const setTitleCategory = useStore((state) => state.setTitleCategory);

  // const [titleSelectedCategory, setTitleSelectedCategory] = useState('Всі страви');
  // const [localDishesCategory, setLocalDishesCategory] = useState([]);

  // useEffect(() => {
  // setLocalDishesCategory(dishesCategory);
  // }, [dishesCategory]);

  useEffect(() => {
    setLoader(true);
    getAllDishes()
      .then((data) => {
        console.log(data);
        setDishes(data);
        setSearchDishes(data);
        setDishesCategory(data);
      })
      .catch(() => {
        setDishes([]);
        setSearchDishes([]);
        setDishesCategory([]);
      })
      .finally(() => setLoader(false));
  }, []);



  const toggleCard = (card) => {
    if (currentCardId === card.id) {
      setCurrentCardId(null);
      return;
    }
    setCurrentCardId(card.id);
  };

  return (
    <div className="menuCards">
      {loader ? (
        <Loading />
      ) : (
        <div>
          <div className='cardsHeader'>
            <h1>
              {titleCategory.charAt(0).toUpperCase() + titleCategory.slice(1)}
            </h1>
            <div className='view'>
              <button type='button' onClick={() => setView(!view)}>
                {view ? (
                  <img src={listIcon} alt="card" />
                ) : (
                  <img src={tableIcon} alt="card" />
                )}
              </button>
            </div>
          </div>


          <div className="cards">
            {searchDishes.map(card => (
              <div
                key={card.id}
                className={cn('card',
                  { 'cardList': !view },
                  { 'cardTable': view },
                  { 'active': currentCardId === card.id }
                )}
                onClick={() => toggleCard(card)}
                style={{
                  backgroundImage: card.image_url && `url(${card.image_url})`
                }}
              >

                <div className="card__content">
                  <div className="card__content-inner">
                    <div className="card__title">{card.dish_name}</div>
                    <div className="card__description">
                      <ul className="ingredients">
                        <li>
                          <h2>Склад:</h2>
                          <ul>
                            {card.dish_ingredients.map((item, index) => (
                              <div key={index}>
                                <li >{`${item.ingredient.name} - ${item.quantity} ${item.ingredient.measure}`}</li>
                                <hr />
                              </div>
                            ))}
                          </ul>
                          <ul>
                            {card.dish_premixes.map((item, index) => (
                              <>
                                <li key={index}>{`${item.premix.name} - ${item.quantity}`}</li>
                                <hr />
                              </>
                            ))}
                          </ul>
                        </li>

                      </ul>
                      <div className="description">
                        <h2>Опис:</h2>
                        {card.description}
                      </div>
                      <div className="btn-card">
                        <Link to={`/detailsDish/${card.id}`} className="button is-info is-outlined is-rounded is-hover">
                          Детальніше
                        </Link>

                        {!!card.dish_to_sold ? (
                          <button
                            className="button is-success is-outlined is-rounded is-hover"
                            onClick={() => patchDish({ id: card.id, dish_to_sold: false })}
                          >
                            Видалити з пріоритетних
                          </button>) : (
                          <button
                            className="button is-warning is-outlined is-rounded is-hover"
                            onClick={() => patchDish({ id: card.id, dish_to_sold: true })}
                          >
                            Додати в пріоритет
                          </button>)}
                        {!!card.stop_list ? (<button
                          className="button is-danger is-outlined is-rounded is-hover"
                          onClick={() => patchDish({ id: card.id, stop_list: false })}
                        >
                          Видалити з стоп листа
                        </button>) : (
                          <button
                            className="button is-danger is-outlined is-rounded is-hover"
                            onClick={() => patchDish({ id: card.id, stop_list: true })}
                          >
                            Додати в стоп лист
                          </button>)}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )
            )}
          </div>
        </div >)}
    </div>
  );
};

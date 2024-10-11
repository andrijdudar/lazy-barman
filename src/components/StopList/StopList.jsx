/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './StopList.css';
import useStore from '../../utils/Store';
import { getStopList } from '../../utils/axiosFunc';
import { Loading } from '../../utils/Loading/Loading';
import useStoreAuth from '../../utils/StoreAuth';



const StopList = () => {
  const user = useStoreAuth((state) => state.user);

  const fewDishes = useStore((state) => state.fewDishes);
  const setFewDishes = useStore((state) => state.setFewDishes);

  const stopList = useStore((state) => state.stopList);
  const setStopList = useStore((state) => state.setStopList);

  const dishesToBeSold = useStore((state) => state.dish_to_sold);
  const setDishToSold = useStore((state) => state.setDishToSold);

  const [loader, setLoader] = useState(true)

  useEffect(() => {
    const getData = async () => {
      console.log(user);
      try {
        const stopListResponse = await getStopList();
        console.log(stopListResponse);
        setStopList(stopListResponse.ended);
        setFewDishes(stopListResponse.runing_out);
        setDishToSold(stopListResponse.need_to_sold);
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    };

    getData();
  }, []);

  return (
    <div className='containerStoplist'>
      {loader ? (
        <Loading />
      ) : (
        <div className="stopList">
          <h1>Стоп-Лист</h1>

          <div className='stoplistContainer'>
            <div className='stoplistKichen'>
              <h2>Кухня</h2>
              <ul>
                {stopList.map((dish, index) => (
                  <li className='item' key={index}>
                    <span>{dish.dish_name}</span><button className='btn-x'><i className='icon delete'></i></button>
                  </li>
                ))}
              </ul>
            </div>
            <div className='stoplist-bar'>
              <h2>Бар</h2>
              <ul>
                {stopList.map((dish, index) => (
                  <li className='item' key={index}>
                    <span>{dish.dish_name}</span><button className='btn-x'><i className='icon delete'></i></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <h1>Мало</h1>
          <div className='stoplistContainer'>
            <div className='stoplistKichen'>
              <h2>Кухня</h2>
              <ul>
                {fewDishes.map((dish, index) => (
                  <li className='item'>
                    <span>{dish.dish_name}</span><button className='btn-x'><i className='icon delete'></i></button>
                  </li>
                ))}
              </ul>
            </div>
            <div className='stoplist-bar'>
              <h2 className='sub_title'>Бар</h2>
              <ul>
                {fewDishes.map((dish, index) => (
                  <li className='item'>
                    <span>{dish.dish_name}</span><button className='btn-x'><i className='icon delete'></i></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <h1>Продавати</h1>
          <div className='stoplistContainer'>
            <div className='stoplistKichen'>
              <h2>Кухня</h2>
              <ul>
                {dishesToBeSold.map((dish) => (
                  <li className='item' key={dish.id}>
                    <span>{dish.dish_name}</span><button className='btn-x'><i className='icon delete'></i></button>
                  </li>
                ))}
              </ul>
            </div>
            <div className='stoplist-bar'>
              <h2>Бар</h2>
              <ul>
                {dishesToBeSold.map((dish) => (
                  <li className='item' key={dish.id}>
                    <span>{dish.dish_name}</span><button className='btn-x'><i className='icon delete'></i></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default React.memo(StopList);

import React from 'react';
import { useEffect, useState } from 'react';
import { getCategoryById, getDishById } from '../../../../utils/axiosFunc';
import { deleteDish } from '../../../../utils/axiosFunc';
import './DishDetails.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../../../../utils/Loading/Loading';
import defaultImgDish from '../../../../img/istockphoto1055079680.jpg';

export function DishDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const selectedDishId = id ? +id : 0;
  const [dish, setDish] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('');


  useEffect(() => {
    console.log(selectedDishId);
    getDishById(selectedDishId).then((response) => {
      setDish(response);
      getCategoryById(response.category_id).then((response) => {
        setCurrentCategory(response);
      });
      console.log('dish', response);
    });
  }, [selectedDishId]);

  if (!dish) {
    return <Loading />;
  }


  return (
    <div className='DishDetails'>
      <img src={dish.image_url || defaultImgDish} alt={dish.dish_name} className="dish-image" />
      <h1>{dish.dish_name}</h1>
      <strong>Опис:</strong>
      <p className='item_value'>{dish.description || "Опис: не знайдено"}</p>

      <div>
        <strong>Інгредієнти:</strong>
        <div className='item_value'>
          {dish.dish_ingredients && dish.dish_ingredients.length > 0 ? (
            <ul>
              {Array.isArray(dish.dish_ingredients) && dish.dish_ingredients.map((ingredient) => (
                <li key={ingredient.ingredient_id}>
                  {ingredient.ingredient.name} - {ingredient.quantity + ingredient.ingredient.measure}
                </li>
              ))}

            </ul>
          ) : (
            <p>Інгредієнти: не знайдено</p>
          )}
        </div>
      </div>

      <div>
        <strong>Премікси:</strong>
        <div className='item_value'>
          {dish.dish_premixes && dish.dish_premixes.length > 0 ? (
            <ul>
              {dish.dish_premixes.map((premix) => (
                <li key={premix.premix_id}>
                  {premix.premix.name} - {premix.quantity}
                </li>
              ))}
            </ul>
          ) : (
            <p>Премікси: не знайдено</p>
          )}
        </div>
      </div>

      <div>
        <strong>Теги:</strong>
        <div className='item_value'>
          {dish.tags && dish.tags.length > 0 ? (
            <div>
              {dish.tags.map((tag) => (
                <span key={tag.id}>{tag.name_tag}, </span>
              ))}
            </div>
          ) : (
            <p>Теги: не знайдено</p>
          )}
        </div>
      </div>
      <div>
        <strong>Категорія:</strong>{" "}
        <p className='item_value'>
          {dish.category_id !== null
            ? currentCategory.name
            : "Ідентифікатор категорії: не знайдено"}
        </p>
      </div>

      <div>
        <strong>Коментарі:</strong>
        <div className='item_value'>
          {dish.comments && dish.comments.length > 0 ? (
            <ul>
              {dish.comments.map((comment) => (
                <li key={comment.id}>{comment.comment}</li>
              ))}
            </ul>
          ) : (
            <p>Коментарі: не знайдено</p>
          )}
        </div>
      </div>

      <div>
        <strong>Дата створення:</strong>{" "}
        <p className='item_value'>
          {dish.created_at
            ? new Date(dish.created_at).toLocaleDateString()
            : "Дата створення: не знайдено"}
        </p>
      </div>
      <div>
        <strong>Дата оновлення:</strong>{" "}
        <p className='item_value'>
          {dish.updated_at
            ? new Date(dish.updated_at).toLocaleDateString()
            : "Дата оновлення: не знайдено"}
        </p>
      </div>
      <div>
        <strong>В стоп-листі:</strong>{" "}
        <p className='item_value'> {dish.ended ? "Так" : "Ні"}</p>
      </div>
      <div>
        <strong>До продажу:</strong>{" "}
        <p className='item_value'>{dish.runing_out ? "Так" : "Ні"}</p>
      </div>

      <div>
        <strong>Ціна:</strong>{" "}
        <p className='item_value'>{dish.price ? dish.price : "Цінy не знайдено"}</p>
      </div>

      <div className='dishDetailsButtons'>
        {/* <Link to={`/admin/addDish/${selectedDishId}`} className="button is-warning is-outlined is-rounded is-hover">
          Редагувати страву
        </Link> */}
        <button
          onClick={() => {
            navigate(`/admin/addDish/${selectedDishId}`, { state: { scrollTo: true } });
          }}
          className='button is-warning is-outlined is-rounded is-hover'
        >
          Редагувати страву
        </button>
        <button
          className='button is-danger is-outlined is-rounded is-hover'
          onClick={() => {
            const confirm = window.confirm(
              `Ви впевнені, що хочете видалити страву "${dish.dish_name}"?`
            );
            if (confirm) {
              deleteDish(dish.id).then(() => navigate('/menu'));
              // navigate('/menu');
            }
          }}
        >
          Видалити з страву
        </button>
      </div>
    </div >

  );
}

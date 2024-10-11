import React from 'react';
import { useEffect, useState } from 'react';
import { getDishById } from '../../../../utils/axiosFunc';
import { deleteDish } from '../../../../utils/axiosFunc';
import './DishDetails.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../../../../utils/Loading/Loading';
import defaultImgDish from '../../../../img/istockphoto1055079680.jpg';

export function DishDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const selectedDishId = id ? +id : 0;
  const [dish, setDish] = useState(null);


  useEffect(() => {
console.log(selectedDishId);
    getDishById(selectedDishId).then((response) => {
      setDish(response);
      console.log('dish',response);
    });
  }, [selectedDishId]);

  if (!dish) {
    return <Loading />;
  }


    return (
      <div className='DishDetails'>
        <img src={dish.image_url || defaultImgDish} alt={dish.dish_name} className="dish-image" />
        <h1>{dish.dish_name}</h1>
        <p>{dish.description || "Опис: не знайдено"}</p>

        <div>
          <strong>Інгредієнти:</strong>
          {dish.ingredients && dish.ingredients.length > 0 ? (
            <ul>
              {Array.isArray(dish.ingredients) && dish.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.name} - {ingredient.quantity}
                </li>
              ))}

            </ul>
          ) : (
            <p>Інгредієнти: не знайдено</p>
          )}
        </div>

        <div>
          <strong>Премікси:</strong>
          {dish.premixes && dish.premixes.length > 0 ? (
            <ul>
              {dish.premixes.map((premix) => (
                <li key={premix.id}>
                  {premix.name} ({premix.description}) - {premix.quantity}
                </li>
              ))}
            </ul>
          ) : (
            <p>Премікси: не знайдено</p>
          )}
        </div>

        <div>
          <strong>Теги:</strong>
          {dish.tags && dish.tags.length > 0 ? (
            <ul>
              {dish.tags.map((tag) => (
                <li key={tag.id}>{tag.name_tag}</li>
              ))}
            </ul>
          ) : (
            <p>Теги: не знайдено</p>
          )}
        </div>

        <div>
          <strong>Коментарі:</strong>
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

        <p>
          <strong>Дата створення:</strong>{" "}
          {dish.created_at
            ? new Date(dish.created_at).toLocaleDateString()
            : "Дата створення: не знайдено"}
        </p>
        <p>
          <strong>Дата оновлення:</strong>{" "}
          {dish.updated_at
            ? new Date(dish.updated_at).toLocaleDateString()
            : "Дата оновлення: не знайдено"}
        </p>
        <p>
          <strong>В стоп-листі:</strong>{" "}
          {dish.stop_list ? "Так" : "Ні"}
        </p>
        <p>
          <strong>До продажу:</strong>{" "}
          {dish.dish_to_sold ? "Так" : "Ні"}
        </p>
        <p>
          <strong>Ідентифікатор категорії:</strong>{" "}
          {dish.category_id !== null
            ? dish.category_id
            : "Ідентифікатор категорії: не знайдено"}
        </p>
        <p>
          <strong>Назва категорії:</strong>{" "}
          {dish.category_name || "Назва категорії: не знайдено"}
        </p>
        <div className='dishDetailsButtons'>
          <Link to='/editDish' className="button is-warning is-outlined is-rounded is-hover">
            Редагувати страву
          </Link>
          <button
            className='button is-danger is-outlined is-rounded is-hover'
            onClick={() => {
              deleteDish(dish.id);
              navigate('/menu');
            }}
          >
            Видалити з страву
          </button>
        </div>
      </div>

    );
  }

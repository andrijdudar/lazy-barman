import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPremix, getAllIngredients } from '../../../../../utils/axiosFunc';
import SearchSelect from '../../../../utilsAdministration/SearchSelect/SearchSelect';
import { convertToOptionsSelect, filteredItems } from '../../../../utilsAdministration/SearchSelect/SearchUtils';
import './AddPremix.css';
import { Loading } from '../../../../../utils/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import IconDelete from '../../../../../img/delete-forever-24px.svg'

export function AddPremix() {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [hesErrorName, setHesErrorName] = useState(false);
  const [hesErrorIngredients, setHesErrorIngredients] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setHesErrorName(false);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientQuantityChange = (ingredientId, quantity = 1) => {
    const newSelectedIngredients = selectedIngredients.map((ingredient) => {
      if (ingredient.id === ingredientId) {
        console.log(ingredient);
        return { ...ingredient, quantity: quantity };
      }
      return ingredient;
    });
    setSelectedIngredients(newSelectedIngredients);
  };

  const updateOptions = useCallback((options) => {
    setIngredients(filteredItems(ingredients, options));
  }, [ingredients]);

  const handleIngredientSelect = (selectedOption) => {
    console.log('selectedOption:', selectedOption);
    selectedOption.length && setHesErrorIngredients(false);
    const newIngredient = {
      // ingredient: {
      // id: selectedOption.id,
      name: selectedOption.value,
      measure: selectedOption.measure || 'кг',
      // },
      ingredient_id: selectedOption.id,
      quantity: selectedOption.quantity || 0,
    };
    console.log('newIngredient:', newIngredient);
    const ingredientTrue = !selectedIngredients.find((item) => item.ingredient_id === newIngredient.ingredient_id);
    console.log('ingredientTrue:', ingredientTrue);
    if (ingredientTrue) {
      setSelectedIngredients((prevSelected) => [...prevSelected, newIngredient]);
    }
    console.log('selectedIngredients:', selectedIngredients);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    !formData.name ? setHesErrorName(true) : setHesErrorName(false);
    !selectedIngredients.length ? setHesErrorIngredients(true) : setHesErrorIngredients(false);
    console.log('ingredients:', selectedIngredients);

    const dataToSend = {
      name: formData.name,
      ingredients: selectedIngredients.map((ingredient) => ({
        id: ingredient.ingredient_id,
        // name: ingredient.name,
        quantity: ingredient.quantity,
      })),
      description: formData.description,
    };
    console.log('premix:', dataToSend)



    if (selectedIngredients.length && dataToSend.name) {
      setLoadingSubmit(true);
      createPremix(dataToSend)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setFormData({ name: '', description: '' });
          setSelectedIngredients([]);
          setLoadingSubmit(false);
          navigate('/admin/premix');
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    getAllIngredients()
      .then((res) => {
        setIngredients(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const optionsForm = useMemo(() => convertToOptionsSelect(ingredients), [ingredients]);

  return (
    <div className="AddPremix">
      <h2>Створити новий премікс</h2>
      {loading ? (
        <Loading />
      ) : (
        <form
          className='form_add_premix'
          onSubmit={handleSubmit}
        >
          <div className='field field-add-premix'>
            <label className='label'>Назва:</label>
            <div className='control constrol-input'>
              <input
                type="text"
                name="name"
                className="input input-name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {hesErrorName && <p className='error has-text-danger'>Поле не може бути пустим</p>}
          </div>
          <div className='field'>
            <label className='label'>Опис:</label>
            <div className='control'>
              <textarea
                name="description"
                className="textarea"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='field seach_select_add_premix'>
            <label className='label'>Інгредієнти:</label>
            <div className='consainer_search_select'>
              <SearchSelect
                options={optionsForm}
                updateOptions={updateOptions}
                placeholder='Пошук інгредієнтів...'
                selectOpen={true}
                path='/'
                onSelect={handleIngredientSelect}
              />
            </div>
            {selectedIngredients.map((ingredient) => (
              <ul key={ingredient.ingredient_id} className='field list_ingredeints'>
                <li className='control item_control'>
                  {/* <div className='control ingredi'> */}
                    <div className='label-ingredient'>{ingredient.name}</div>
                    <div className='control-end'>

                        <input
                          type="number"
                          step={0.01}
                          className="input-edit-premix input-search"
                          placeholder='1'
                          onChange={(e) => {
                            handleIngredientQuantityChange(ingredient.ingredient_id, parseFloat(e.target.value));
                          }}
                        />
                        <span className='ingredient-measure'>{ingredient.measure}</span>

                      <button
                        type="button"
                        className='icon-delete-ingredient button'
                        onClick={() => {
                          const filtredIngredients = selectedIngredients.filter((item) => item.ingredient_id !== ingredient.ingredient_id);
                          console.log('ingredient:', ingredient)
                          setSelectedIngredients(filtredIngredients);
                        }}
                      >
                        <img src={IconDelete} alt="delete" width={25} height={25} />
                      </button>
                    </div>
                  {/* </div> */}
                </li>
              </ul>
            ))}
            {hesErrorIngredients && <p className='error has-text-danger'>Страва не може бути без інгредієнтів</p>}
          </div>
          <button type="submit" className={cn('button', { 'is-loading': loadingSubmit })}>Відправити</button>
        </form>
      )}
    </div>
  );
}

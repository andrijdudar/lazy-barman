import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPremix, getAllIngredients, getAllPremixes } from '../../../../../utils/axiosFunc';
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
  const [premixes, setPremixes] = useState([]);
  const [selectedPremixes, setSelectedPremixes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [hesErrorName, setHesErrorName] = useState(false);

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
    console.log('ingredients:', selectedIngredients);

    const dataToSend = {
      name: formData.name,
      ingredients: selectedIngredients.map((ingredient) => ({
        id: ingredient.ingredient_id,
        quantity: ingredient.quantity,
      })),
      child_premixes: selectedPremixes.map((premix) => ({
        id: premix.id,
        quantity: premix.quantity,
      })),
      description: formData.description,
    };
    console.log('premix:', dataToSend)


    if ((selectedIngredients.length || selectedPremixes.length) && dataToSend.name) {
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
    getAllPremixes()
      .then((res) => {
        setPremixes(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const optionsForm = useMemo(() => convertToOptionsSelect(ingredients), [ingredients]);

  const handlePremixQuantityChange = (premixId, quantity = 1) => {
    const newSelectedPremix = selectedPremixes.map((premix) => {
      if (premix.id === premixId) {
        return { ...premix, quantity: quantity };
      }
      return premix;
    });
    setSelectedPremixes(newSelectedPremix);
  };

  const handlePremixesSelect = (selectedOption) => {
    const newPremix = {
      id: selectedOption.id,
      name: selectedOption.value,
      quantity: selectedOption.quantity || 0,
    };
    console.log('newPremix:', newPremix);
    const premixTrue = !selectedPremixes.find((item) => item.id === newPremix.id);
    if (premixTrue) {
      setSelectedPremixes((prevSelected) => [...prevSelected, newPremix]);
    }

  };

  const updateOptionsPremixes = useCallback((options) => {
    setPremixes(filteredItems(premixes, options));
  }, [premixes]);

  const optionsPremixes = useMemo(() => convertToOptionsSelect(premixes), [premixes]);

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
          <div className='field search_select_add_premix'>
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
                        setSelectedIngredients(filtredIngredients);
                      }}
                    >
                      <img src={IconDelete} alt="delete" width={25} height={25} />
                    </button>
                  </div>
                </li>
              </ul>
            ))}
          </div>
          <div className='field search_select_add_premix'>
            <label className='label'>Премікси:</label>
            <div className='consainer_search_select'>
              <SearchSelect
                options={optionsPremixes}
                updateOptions={updateOptionsPremixes}
                placeholder='Пошук преміксів...'
                selectOpen={true}
                path='/'
                onSelect={handlePremixesSelect}
              />
            </div>
            {selectedPremixes.map((premix) => (
              <ul key={premix.id} className='field list_ingredeints'>
                <li className='control item_control'>
                  <div className='label-ingredient'>{premix.name}</div>
                  <div className='control-end'>
                    <input
                      type="number"
                      step={0.01}
                      className="input-edit-premix input-search"
                      placeholder='1'
                      onChange={(e) => {
                        handlePremixQuantityChange(premix.id, parseFloat(e.target.value));
                      }}
                    />
                    <span className='ingredient-measure'>{premix.measure || 'кг'}</span>

                    <button
                      type="button"
                      className='icon-delete-ingredient button'
                      onClick={() => {
                        const filtredPremixes = selectedPremixes.filter((item) => item.id !== premix.id);
                        setSelectedPremixes(filtredPremixes);
                      }}
                    >
                      <img src={IconDelete} alt="delete" width={25} height={25} />
                    </button>
                  </div>
                </li>
              </ul>
            ))}
          </div>
          <button type="submit" className={cn('button', { 'is-loading': loadingSubmit })}>Відправити</button>
        </form>
      )}
    </div>
  );
}

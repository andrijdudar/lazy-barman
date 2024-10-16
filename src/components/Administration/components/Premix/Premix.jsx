/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import cn from 'classnames';
import { deletePremix, getAllIngredients, getAllPremixes, patchPremix } from '../../../../utils/axiosFunc';
import { Loading } from '../../../../utils/Loading/Loading';
import SearchSelect from '../../../utilsAdministration/SearchSelect/SearchSelect';
import { convertToOptionsSelect, filteredItems } from '../../../utilsAdministration/SearchSelect/SearchUtils';
import './Premix.css';
// import './AddPremix/AddPremix.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useStore from '../../../../utils/Store';
import IconDelete from '../../../../img/delete-forever-24px.svg'




export function Premix() {
  //#region start region state
  const premixes = useStore((state) => state.premixes);
  const setPremixes = useStore((state) => state.setPremixes);
  const [searchPremixes, setSearchPremixes] = useState([]);
  const [editPremix, setEditPremix] = useState(false);
  const [currentPremix, setCurrentPremix] = useState();

  const [ingredients, setIngredients] = useState([]);
  // const [searchIngredients, setSearchIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedPremixes, setSelectedPremixes] = useState([]);

  const [openDetailId, setOpenDetailId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [formData, setFormData] = useState(currentPremix || {});
  const [hesErrorName, setHesErrorName] = useState(false);
  const [hesErrorIngredients, setHesErrorIngredients] = useState(false);
  // const [errorQuantity, setErrorQuantity] = useState(false);
  //#endregion

  useEffect(() => {
    setLoading(true);

    getAllPremixes()
      .then((res) => {
        console.log(res);
        setPremixes(res);
        setSearchPremixes(res);

        getAllIngredients().then((res) => {
          setIngredients(res);
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setHesErrorName(false);
    const { name, value } = e.target;
    const parsedValue = name === 'using' ? (value === true) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  //#region start region search ingredients
  // const handleIngredientQuantityChange = (ingredientId, quantity) => {
  //   setSelectedIngredients(prevSelected => prevSelected.map(ingredient =>
  //     ingredient.ingredient.id === ingredientId ? { ...ingredient, quantity } : ingredient
  //   ));
  // };

  const handleIngredientQuantityChange = (ingredientId, quantity = 1) => {
    // setErrorQuantity(false);
    // if (quantity < 0) {
    //   setErrorQuantity(true);
    //   return;
    // }
    setSelectedIngredients(prevSelected =>
      prevSelected.map(ingredient =>
        ingredient.ingredient_id === ingredientId
          ? { ...ingredient, quantity }
          : ingredient
      )
    );
  };


  const handleIngredientSelect = (selectedOption) => {
    // selectedOptions.length && setHesErrorIngredients(false);
    // setSelectedIngredients((prevSelected) => {
    //   const prevIds = new Set(prevSelected.map(item => item.ingredient_id));
    //   const newIngredients = selectedOptions
    //     .filter(option => !prevIds.has(option.id))
    //     .map(option => ({
    //       ingredient: {
    //         id: option.id,
    //         name: option.value,
    //         measure: option.measure || 'кг',
    //       },
    //       ingredient_id: option.id,
    //       quantity: option.quantity || 0,
    //     }));
    //   return [...prevSelected, ...newIngredients];
    // });
    const newIngredient = {
      ingredient: {
        id: selectedOption.id,
        name: selectedOption.value,
        measure: selectedOption.measure || 'кг',
      },
      ingredient_id: selectedOption.id,
      quantity: selectedOption.quantity || 0,
    };
    const ingredientTrue = !selectedIngredients.find((item) => item.ingredient_id === newIngredient.ingredient_id);
    if (ingredientTrue) {
      setSelectedIngredients((prevSelected) => [...prevSelected, newIngredient]);
    }
  };
  //#endregion

  //#region  start region search premixes
  const options = useMemo(() => convertToOptionsSelect(premixes), [premixes]);

  const updateOptions = useCallback((options) => {
    setSearchPremixes(filteredItems(premixes, options));
  }, [premixes]);

  const optionsForm = useMemo(() => convertToOptionsSelect(ingredients), [ingredients]);

  const handleToggle = (id) => {
    setOpenDetailId((prevId) => (prevId === id ? null : id));
  };


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
  //#endregion

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      id: currentPremix.id,
      name: formData.name,
      ingredients: selectedIngredients.map(ingredient => ({
        id: ingredient.ingredient_id,
        quantity: ingredient.quantity,
      })),
      child_premixes: selectedPremixes,
      description: formData.description
    };

    const quantity = selectedIngredients.every(ingredient => ingredient.quantity > 0);
    !dataToSend.name && setHesErrorName(true);
    !selectedIngredients.length && setHesErrorIngredients(true);
    // !quantity && setErrorQuantity(true);

    if (selectedIngredients.length && dataToSend.name && quantity) {
      setLoadingSubmit(true);
      patchPremix(dataToSend).then((res) => {
        setSearchPremixes((prev) => prev.filter((item) => item.id !== currentPremix.id));
        setSearchPremixes((prev) => [...prev, res]);
        setEditPremix(false);
        setLoadingSubmit(false);
      });
    }
  };

  return (
    <div className="premixList">
      <h2>Список преміксів</h2>
      <div className='premixSearch'>
        <SearchSelect
          options={options}
          updateOptions={updateOptions}
          placeholder='Пошук преміксів...'
          selectOpen={true}
          path='/'
        />
      </div>
      {loading ? (
        <Loading />
      ) : (
        <ul className="ul">
          {searchPremixes.map((premix) => (
            <li key={premix.id} className="premixItem">
              <details
                className="detailsPremix"
                open={openDetailId === premix.id}
              >
                <summary
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPremix(premix);
                    setEditPremix(false);
                    setFormData(premix);
                    handleToggle(premix.id);
                    setSelectedIngredients(premix.premix_ingredients);

                    const premixes = premix.premix_children.map((item) => {

                      return {
                        id: item.child_premix.id,
                        name: item.child_premix.name,
                        quantity: item.quantity || 0,
                      };
                    });
                    setSelectedPremixes(premixes);
                  }}
                >
                  {premix.name}
                </summary>
                {!editPremix ? (
                  <div>
                    <strong>Опис:</strong>
                    <p>{premix.description || 'немає опису'}</p>
                    <ul>
                      <strong>Інгредієнти:</strong>
                      {selectedIngredients.map((premix_ingredient) => (
                        <li
                          key={premix_ingredient.ingredient_id} className="premixLi"
                        >
                          <strong>{premix_ingredient.ingredient.name}:</strong> {premix_ingredient.quantity} {premix_ingredient.ingredient.measure}
                        </li>
                      ))}
                      {selectedPremixes.map((premix) => (
                        <li
                          key={premix.id} className="premixLi"
                        >
                          <strong>{premix.name}:</strong> {premix.quantity} {premix.measure || 'кг'}
                        </li>
                      ))}
                    </ul>

                    <div className='btnContainer'>
                      <button
                        className='button is-ounded is-warning is-hovered is-outlined'
                        type='button'
                        onClick={() => {
                          setEditPremix(!editPremix);
                        }}
                      >
                        Редагувати
                      </button>

                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className='field'>
                      <label className='label'>Назва:</label>
                      <div className='control container-input'>
                        <input
                          type="text"
                          name="name"
                          className="input input-search is-medium is-rounded"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      {hesErrorName && <p className='error has-text-danger'>Поле не може бути пустим</p>}
                    </div>
                    <div className='field'>
                      <label className='label'>Опис:</label>
                      <div className='control container-input'>
                        <textarea
                          name="description"
                          className="textarea input-search"
                          value={formData.description}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Інгредієнти:</label>
                      <div className='ingredients-search-select'>
                        <SearchSelect
                          options={optionsForm}
                          placeholder='Пошук інгредієнтів...'
                          selectOpen={true}
                          size='is-medium'
                          path='/'
                          onSelect={handleIngredientSelect}
                        />
                      </div>

                      {hesErrorIngredients && <p className='error has-text-danger'>Страва не може бути без інгредієнтів</p>}
                      <ul className='field'>
                        {selectedIngredients.map(ingredient => (
                          <li key={ingredient.ingredient_id} className='control item_control'>

                              <div htmlFor='edit-ingredient-premix' className='label-ingredient'>{ingredient.ingredient.name}</div>
                              <div className='control-end'>
                                <input
                                  type="number"
                                  step={0.01}
                                  className="input-edit-premix input-search"
                                  value={ingredient.quantity}

                                  onChange={(e) => handleIngredientQuantityChange(ingredient.ingredient_id, parseFloat(e.target.value))}
                                />
                                <span className='ingredient-measure'>{ingredient.ingredient.measure || 'кг'}</span>
                                <button
                                  type='button'
                                  className='button icon-delete-ingredient'
                                  onClick={() => {
                                    console.log(selectedIngredients);
                                    console.log(ingredient);
                                    const filtredIngredients = selectedIngredients.filter((item) => item.ingredient_id !== ingredient.ingredient_id);
                                    setSelectedIngredients(filtredIngredients);
                                  }}
                                >
                                  <img src={IconDelete} alt="delete" width={25} height={25} />
                                </button>

                              </div>
                            {/* {errorQuantity && ingredient.quantity === 0 && <p className='error has-text-danger'> не може бути 0</p>} */}

                          </li>

                        ))}
                      </ul>
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
                            <div className='label-ingredient'>{premix.name
                            }</div>
                            <div className='control-end'>
                              <input
                                type="number"
                                step={0.01}
                                className=" input-edit-premix input-search"
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
                    <div className='button-submit-prmix'>
                      <button type="submit" className={cn('button', 'is-primary', { 'is-loading': loadingSubmit })}>Відправити</button>
                      <button
                        className={cn('button', { 'is-loading': loadingDelete })}
                        type='button'
                        onClick={() => {
                          setLoadingDelete(true);
                          deletePremix(premix.id).then(() => {
                            setSearchPremixes((perv) => {
                              return perv.filter((item) => item.id !== premix.id);
                            });
                            setLoadingDelete(false);
                          });
                        }}
                      >
                        Видалити
                      </button>

                    </div>
                  </form>
                )}
              </details>
            </li>
          ))}
        </ul>
      )
      }
    </div >
  );
}

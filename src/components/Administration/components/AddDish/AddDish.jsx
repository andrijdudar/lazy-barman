import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './AddDish.scss';
import { createNewDish, getAllCategories, getAllIngredients, getAllPremixes, getAllTags, getCategoryById, getDishById, patchDish, updatePhoto } from '../../../../utils/axiosFunc';
import SearchSelect from '../../../utilsAdministration/SearchSelect/SearchSelect';
import { convertToOptionsSelect, filteredItems } from '../../../utilsAdministration/SearchSelect/SearchUtils';
import IconDelete from '../../../../img/delete-forever-24px.svg';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { Loading } from '../../../../utils/Loading/Loading';


export const AddDish = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editDishId, setEditDishId] = useState(id);
  const [loading, setLoading] = useState(true);


  const [ingredients, setIngredients] = useState([]);
  const [premixes, setPremixes] = useState([]);
  const [tages, setTages] = useState([]);
  const [categories, setCategories] = useState([]);

  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedPremixes, setSelectedPremixes] = useState([]);
  const [selectedTages, setSelectedTages] = useState([]);
  const [selectedCategorie, setSelectedCategorie] = useState({});
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState('');
  const [errorPhoto, setErrorPhoto] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);


  useEffect(() => {
    const getData = async () => {
      try {
        const [ingredientsRes, premixesRes, tagesRes, categoriesRes] = await Promise.all([
          getAllIngredients(),
          getAllPremixes(),
          getAllTags(),
          getAllCategories(),
        ]);

        const categoreis = categoriesRes.filter((item) => item.child === false);
        setCategories(categoreis);
        setIngredients(ingredientsRes);
        setPremixes(premixesRes);
        setTages(tagesRes);

        console.log('categories:', categoriesRes);
        console.log('ingredients:', ingredientsRes);
        console.log('premix:', premixesRes);
        console.log('tags:', tagesRes);

      } catch (error) {
        setErrorMessage('Помилка при завантаженні даних');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData();


    if (editDishId) {
      getDishById(editDishId).then((response) => {
        console.log('response:', response);

        setDishName(response.dish_name);
        setDescription(response.description);
        setSelectedIngredients(response.dish_ingredients.map((item) => {
          return {
            id: item.ingredient_id,
            name: item.ingredient.name,
            quantity: item.quantity,
          };
        }));
        setSelectedPremixes(response.dish_premixes.map((item) => {
          return {
            id: item.premix_id,
            name: item.premix.name,
            quantity: item.quantity,
          };
        }));
        setSelectedTages(response.tags.map((item) => item.name_tag));
        setPrice(response.price);
        setPhoto(response.image_url);
        getCategoryById(response.category_id)
          .then((category) => setSelectedCategorie(category));
      })
        .catch((error) => {
          console.error(error);
          setErrorMessage('Помилка при завантаженні страви');
        })
        .finally(() => {
          setLoading(false);
        })
    }
  }, [editDishId]);

  const stopEditing = () => {
    setDishName('');
    setDescription('');
    setSelectedIngredients([]);
    setSelectedPremixes([]);
    setSelectedTages([]);
    setSelectedCategorie([]);
    setPrice(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingSubmit(true);



    const dataToSend = {
      dish_name: dishName,
      description: description || null,
      ingredients: selectedIngredients.length ? selectedIngredients : null,
      premixes: selectedPremixes.length ? selectedPremixes : null,
      tags: selectedTages,
      category_id: selectedCategorie.id,
      price: price || '0',
    };

    if (editDishId) {
      const dataToSend = {
        id: editDishId,
        dish_name: dishName,
        description: description || ' ',
        ingredients: selectedIngredients.map((item) => {
          return {
            id: item.id,
            quantity: item.quantity,
          };
        }) || [],
        premixes: selectedPremixes.map((item) => {
          return {
            id: item.id,
            quantity: item.quantity,
          };
        }),
        tags: selectedTages,
        category: selectedCategorie.name,
        price: price || '0',
      };
      patchDish(dataToSend).then((res) => {
        stopEditing();
        setSuccessMessage('Страву успішно змінено!');
        setLoadingSubmit(false);
        navigate('/detailsDish/' + res.id);
      }).catch(() => {
        setLoadingSubmit(false);
        setErrorMessage('Помилка при редагуванні страви');
      });

      return;
    }

    createNewDish(dataToSend)
      .then((res) => {
        if (photo) {
          const formData = new FormData();
          formData.append('id', res.id); // Додаємо id до даних
          formData.append('file', photo); // Додаємо файл до даних
          updatePhoto(formData).then((res) => {
            stopEditing();
            setSuccessMessage('Страву успішно додано!');
            setLoadingSubmit(false);
            navigate('/detailsDish/' + res.id);
          });

        } else {
          stopEditing();
          setSuccessMessage('Страву успішно додано!');
          setLoadingSubmit(false);
          setEditDishId(null);
          navigate('/detailsDish/' + res.id);
        }
      })

      .catch(() => {
        setLoadingSubmit(false);
        setErrorMessage('Помилка при додаванні страви');
      })

  };

  //#region Photo
  const handlePhoto = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file && file.type !== 'image/jpeg') {
      setErrorPhoto('Фото повинно бути у форматі jpeg або jpg');
      const wait = setTimeout(() => {
        setErrorPhoto('');
        clearTimeout(wait);
      }, 10000);
    }

    if (file && file.type === 'image/jpeg') {
      setPhoto(file);
      console.log(file);
      // Тут ви можете виконати додаткові дії з обраним файлом
    }
  };
  //#endregion

  // #region  Ingredients
  const handleIngredientQuantityChange = (ingredientId, quantity = 1) => {
    const newSelectedIngredients = selectedIngredients.map((ingredient) => {
      if (ingredient.id === ingredientId) {
        return { ...ingredient, quantity: quantity };
      }
      return ingredient;
    });
    setSelectedIngredients(newSelectedIngredients);
  };

  const handleIngredientSelect = (selectedOption) => {
    const newIngredient = {
      id: selectedOption.id,
      name: selectedOption.value,
      quantity: selectedOption.quantity || 1,
    };
    const ingredientTrue = !selectedIngredients.find((item) => item.id === newIngredient.id);
    if (ingredientTrue) {
      setSelectedIngredients((prevSelected) => [...prevSelected, newIngredient]);
    }
  };

  const updateOptionsIngredients = useCallback((options) => {
    setIngredients(filteredItems(ingredients, options));
  }, [ingredients]);

  const optionsIngredients = useMemo(() => convertToOptionsSelect(ingredients), [ingredients]);
  // #endregion

  // #region  Premixes
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
      quantity: selectedOption.quantity || 1,
    };
    const premixTrue = !selectedPremixes.find((item) => item.id === newPremix.id);
    if (premixTrue) {
      setSelectedPremixes((prevSelected) => [...prevSelected, newPremix]);
    }

  };

  const updateOptionsPremixes = useCallback((options) => {
    setPremixes(filteredItems(premixes, options));
  }, [premixes]);

  const optionsPremixes = useMemo(() => convertToOptionsSelect(premixes), [premixes]);
  // #endregion

  // #region  Tages
  const handleTagesSelect = (selectedOption) => {
    const newTag = selectedOption.value;
    // const tagTrue = !selectedTages.find((item) => item.id === newTag.id);
    // if (selectedTages.length < 1) {
    setSelectedTages((prevSelected) => [...prevSelected, newTag]);
    // }

  };

  const updateOptionsTages = useCallback((options) => {
    setTages(filteredItems(tages, options));
  }, [tages]);

  const [inputValueTag, setInputValueTag] = useState('');

  const optionsTages = useMemo(() => convertToOptionsSelect(tages), [tages]);
  // #endregion

  // #region  Categories
  const handleCategoriesSelect = (selectedOption) => {
    const newCategory = {
      id: selectedOption.id,
      name: selectedOption.value,
      // quantity: selectedOption.quantity || 0,
    };
    // const categoryTrue = !selectedCategorie.find((item) => item.id === newCategory.id);
    // if (categoryTrue) {
    setSelectedCategorie(newCategory);
    // setSelectedCategorie(newCategory);
    // }
  };

  const updateOptionsCategories = useCallback((options) => {
    setCategories(filteredItems(categories, options));
  }, [categories]);

  const optionsCategories = useMemo(() => convertToOptionsSelect(categories), [categories]);
  // #endregion

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="AddDish">
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form className='formAddDish' onSubmit={handleSubmit}>
        {editDishId ? <h1>Редагування страви</h1> : <h1>Додати нову страву</h1>}
        <label className='label_addDish'>
          Назва:
          <div className='inputContainer'>
            <input
              className='input-search input'
              type="text"
              placeholder='Назва страви'
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
            />
          </div>
        </label>

        <div className="file is-medium is-boxed ">
          <label className="file-label">
            <input
              className="file file-input"
              type="file"
              name="resume"
              onChange={handlePhoto}
            />
            {photo && (
              <div>
                {/* <img className='photo' src={URL.createObjectURL(photo)} alt="Картинка" /> */}
                {/* <img className='photo' src={photo} alt="Картинка" /> */}
              </div>
            )}
            {!photo &&
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload"></i>
                </span>
                <span className="file-label">
                  Фото
                </span>
              </span>}
            {errorPhoto &&
              <p className="help is-danger is-size-6">{errorPhoto}</p>}
          </label>
        </div>
        <label className='label_addDish'>
          Опис:
          <div className='control inputContainer'>
            <textarea
              className='textarea input-search'
              placeholder='Опис страви'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </label>
        <div className='label_addDish'>
          Інгредієнти:
          <div className='inputContainer'>
            <SearchSelect
              options={optionsIngredients}
              updateOptions={updateOptionsIngredients}
              placeholder='Пошук інгредієнтів...'
              selectOpen={true}
              path='/'
              onSelect={handleIngredientSelect}
            />
            {selectedIngredients.map((ingredient) => (
              <ul key={ingredient.id} className='field'>
                <li className='ingredient-li-container'>
                  <p className='label_addDish_item'>{ingredient.name}</p>
                  <div className='input-container ingredient-li'>
                    <input
                      type="number"
                      className="input-search input ingredient-li-input"
                      value={ingredient.quantity}
                      onChange={(e) => {
                        handleIngredientQuantityChange(ingredient.id, parseFloat(e.target.value));
                      }}
                    />
                    {/* <div className=''>{ingredient.measure}</div> */}
                    <button
                      type="button"
                      className='button button-del-ingredeint'
                      onClick={() => {
                        const filtredIngredients = selectedIngredients.filter((item) => item.id !== ingredient.id);
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
        </div>
        <div className='label_addDish'>
          Премікси:
          <div className='inputContainer'>
            <SearchSelect
              options={optionsPremixes}
              updateOptions={updateOptionsPremixes}
              placeholder='Пошук преміксів...'
              selectOpen={true}
              path='/'
              onSelect={handlePremixesSelect}
            />
            {selectedPremixes.map((premix) => (
              <ul key={premix.id} className='field'>
                <li className='ingredient-li-container'>
                  <p className='label_addDish_item'>{premix.name}</p>
                  <div className='input-container ingredient-li'>
                    <input
                      type="number"
                      className="input-search input ingredient-li-input"
                      value={premix.quantity}
                      onChange={(e) => {
                        handlePremixQuantityChange(premix.id, parseFloat(e.target.value));
                      }}
                    />
                    <button
                      type="button"
                      className='button button-del-ingredeint'
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
        </div>
        <div className='label_addDish'>
          Теги:
          <div className='inputContainer'>
            <div className='container_searchSelect_tag'>
              <SearchSelect
                options={optionsTages}
                updateOptions={updateOptionsTages}
                placeholder='Пошук тегів...'
                selectOpen={true}
                path='/'
                onSelect={handleTagesSelect}
                inputValue={(value) => setInputValueTag(value)}
              />
              {(inputValueTag) &&
                <button
                  type="button"
                  className='button button-add-tag'
                  onClick={() => {
                    setSelectedTages([...selectedTages, inputValueTag]);
                    setInputValueTag('');
                  }}
                >
                  Додати новий тег
                  {/* <svg width={20} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0Z" /><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7Zm-1-5C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10 -4.48-10-10-10Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8 -3.59 8-8 8Z" /></svg> */}
                </button>}
            </div>

            {selectedTages.map((tag, index) => (
              <ul key={index} className='field'>
                <li className='ingredient-li-container'>
                  <p className='label_addDish_item'>{tag}</p>
                  <div className='ingredient-li'>
                    <button
                      type="button"
                      className='button button-del-ingredeint'
                      onClick={() => {
                        const filtredTags = selectedTages.filter((item) => item !== tag);
                        setSelectedTages(filtredTags);
                      }}
                    >
                      <img src={IconDelete} alt="delete" width={25} height={25} />
                    </button>
                  </div>
                </li>
              </ul>
            ))}
          </div>
        </div>
        <div className='label_addDish'>
          Категорія:
          <div className='inputContainer'>
            <SearchSelect
              options={optionsCategories}
              updateOptions={updateOptionsCategories}
              placeholder='Пошук категорій...'
              selectOpen={true}
              path='/'
              onSelect={handleCategoriesSelect}
            />
            {/* {selectedCategorie.map((category) => ( */}
            {selectedCategorie.name &&
              <ul className='field'>
                <li className='ingredient-li-container'>
                  <p className='label_addDish_item'>{selectedCategorie.name}</p>
                  <div className='ingredient-li'>
                    <button
                      type="button"
                      className='button button-del-ingredeint'
                      onClick={() => {
                        setSelectedCategorie([]);
                      }}
                    // onClick={() => {
                    //   const filtredTags = selectedCategorie.filter((item) => item.id !== category.id);
                    //   setSelectedCategorie(filtredTags);
                    // }}
                    >
                      <img src={IconDelete} alt="delete" width={25} height={25} />
                    </button>
                  </div>
                </li>
              </ul>}
            {/* ))} */}
          </div>
        </div>
        <label className='label_addDish'>
          Ціна:
          <div className='inputContainer'>
            <input
              className='input-search input'
              type="number"
              value={price}
              placeholder='Ціна страви'
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </label>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className={classNames("button", { 'is-loading': loadingSubmit })} onClick={(e) => handleSubmit(e)}>
          {editDishId ? 'Зберегти' : 'Додати страву'}
        </button>
        <button type="button" className="button" onClick={stopEditing}>Скасувати</button>
      </form>
    </div>
  );
}

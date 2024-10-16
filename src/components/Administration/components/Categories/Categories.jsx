import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Categories.css';
import { deleteCategory, getAllCategories } from '../../../../utils/axiosFunc';
import SearchSelect from '../../../utilsAdministration/SearchSelect/SearchSelect';
import { convertToOptionsSelect, filteredItems } from '../../../utilsAdministration/SearchSelect/SearchUtils';
import { Loading } from '../../../../utils/Loading/Loading';


export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchCategories, setSearchCategories] = useState(categories);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  // const [editedName, setEditedName] = useState('');
  const [currentPaerntCategory, setCurentPaerntCategory] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCategories().then((data) => {
      // console.log(data);
      setCategories(data);
      setSearchCategories(data);
    }).catch((error) => {
      console.log('error in getAllCategories in Categories.jsx', error);
      setCategories([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const startEditing = (id, name, parentId) => {
    const parentCategory = getParentCategory(parentId);
    setCurentPaerntCategory(parentCategory);
    setEditingCategoryId(id);
    // setEditedName(name);
  };

  const stopEditing = () => {
    setCurentPaerntCategory({});
    setEditingCategoryId(null);
    // setEditedName('');
  };

  // const handleSave = (id) => {
  //   // Логіка для збереження змін, наприклад, відправка запиту на сервер
  //   stopEditing();
  // };

  const delCategory = (id) => {
    setCurentPaerntCategory({});

    deleteCategory(id)
    const updatedCategories = categories.filter((category) => category.id !== id);
    setCategories(updatedCategories);
    setSearchCategories(filteredItems(updatedCategories, options));
    stopEditing();
  };

  const getParentCategory = (id) => {
    const parentCategory = searchCategories.find((cat) => cat.id === id);
    if (parentCategory) {
      return parentCategory;
    }
    return 'Без батьківської категорії';
  };

  //#region SearchSelect

  const options = useMemo(() => convertToOptionsSelect(categories), [categories]);
  // console.log(options);

  const updateOptions = useCallback((options) => {
    setSearchCategories(filteredItems(categories, options));
  }, [categories]);
  //#endregion

  return (
    <div className="categoryList">
      <h1>Категорії</h1>
      {loading && <div className='loaderContainer'>
        <Loading />
      </div>}
      {!loading &&
        <div className='searchContainer'>
        <SearchSelect
          options={options}
          updateOptions={updateOptions}
          placeholder='Пошук категорії...'
          selectOpen={false}
          path='/'
        />
      </div>}
      <ul className="ul">
        {searchCategories.map((category) => (
          <li key={category.id} className="categoryItem">
            {editingCategoryId === category.id ? (
              <div className="editCategory">
                <div className='label'>
                 <div>
                    <span className='category_title'>Назва категорії: </span>
                    <span className='category_value'>{category.name}</span>
                 </div>
                  {/* <input
                    className='inputEdit input-search input is-rounded'
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  /> */}
                {/* </div> */}
                {/* <div className='searchSelectEdit'> */}
                {/* <div className='label'> */}
                 <div>
                    <span className='category_title'>Батьківська категорія: </span>
                    <span className='category_value'>{currentPaerntCategory.name}</span>
                 </div>
                  {/* <div className='searchContainer'>
                      <SearchSelect
                        options={options}
                        updateOptions={updateOptions}
                        placeholder='Пошук батьківськї категорії...'
                        // selectOpen={true}
                        onSelect={(category) => {
                          setCurentPaerntCategory({ id: 2, name: 'бар' });
                          console.log('category:', category);
                        }}
                        path='/'
                      />
                    </div> */}
                {/* </div> */}

                </div>
                <div>
                  {/* <button className='button' onClick={() => handleSave(category.id)}>Зберегти</button> */}
                  <button type='button' className='button' onClick={() => delCategory(category.id)}>Видалити</button>
                  <button className='button' onClick={stopEditing}>Скасувати</button>
                </div>
              </div>
            ) : (
              <div className="viewCategory">
                <h3 className='categoryName capitalize'>{category.name}</h3>
                <button className='button' onClick={() => startEditing(category.id, category.name, category.parent_id)}>Деталі</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

import React from 'react';
import { useCallback, useEffect, useMemo, useState } from "react";
import { convertToOptionsSelect, filteredItems } from "../../../../utilsAdministration/SearchSelect/SearchUtils";
import { addCategory, getAllCategories } from "../../../../../utils/axiosFunc";
import cn from "classnames";
import SearchSelect from "../../../../utilsAdministration/SearchSelect/SearchSelect";
import "./AddCategory.css";
import { useNavigate } from "react-router-dom";


export const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [nameCategory, setNameCategory] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories().then((data) => {
      console.log(data);
      setCategories(prev => [...prev, ...data]);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
      setCategories([]);
      setLoading(false);
    });
  }, []);

  const options = useMemo(() => convertToOptionsSelect(categories), [categories]);

  const updateOptions = useCallback((options) => {
    setCategories(filteredItems(categories, options));
  }, [categories]);


  const saveCategory = (e) => {
    e.preventDefault();
    console.log('parentCategory:', parentCategory);
    // if (!nameCategory || !parentCategory) {
    //   return;
    // }
    if (!parentCategory) {
      console.log('Не вибрана батьківська категорія');
      return;
    }

    const newCategory = {
      name: nameCategory,
      parent: parentCategory.name,
    }
    console.log(newCategory);
    setLoading(true);
    addCategory(newCategory).then((res) => {
      setLoading(false);
      navigate('/admin/categories');
    });
    console.log(nameCategory, parentCategory);
  }

  return (
    <div className="addCategory">
      <h1 className="titleAddCategory">Додати категорію</h1>
      <form className="form-add-category" onSubmit={saveCategory}>
        <div className="field field-add-category">
          <label className="label">Назва категорії: <span className="selectedCategory">{nameCategory}</span></label>
          <div className="control">
            <input
              className="input-search input is-medium is-rounded" type="text" placeholder="Назва категорії"
              value={nameCategory}
              onChange={(e) => setNameCategory(e.target.value)}
            />
            <div className='searchSelectEdit'>
              <div className='label'>
                Батьківська категорія: <span className="selectedCategory">{parentCategory.value || '---'}</span>
              </div>
              <SearchSelect
                className='searchSelect'
                options={options}
                updateOptions={updateOptions}
                placeholder='Пошук батьківськї категорії...'
                selectOpen={true}
                path='/'
                onSelect={(category) => {
                  const currentCategory = categories.find((item) => item.id === category.id);
                  setParentCategory(currentCategory)
                }}
              />
            </div>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button
              type="submit"
              className={cn('button button-add-category', {
                "is-loading": loading,
              })}
            >
              Зберегти
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

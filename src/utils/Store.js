import { create } from "zustand";
import { TAGS } from "../Obgects";

const useStore = create((set) => ({
  // formLogin: false,
  // setFormLogin: (formLogin) => set({ formLogin }),

  // user: null,
  // setUser: (user) => set({ user }),

  // access_token: JSON.parse(localStorage.getItem('access_token')) | null,
  // setAccessToken: (access_token) => set({ access_token }),

  // refresh_token: JSON.parse(localStorage.getItem('refresh_token')) | null,
  // setRefreshToken: (refresh_token) => set({ refresh_token }),

  // token_type: JSON.parse(localStorage.getItem('token_type')) | null,
  // setTokenType: (token_type) => set({ token_type }),

  titleCategory: 'Всі страви',
  setTitleCategory: (titleCategory) => set({ titleCategory }),

  // dishesFromServer: [],
  // setDishesFromServer: (dishesFromServer) => set({ dishesFromServer }),
  burger: false,
  setBurger: (burger) => set({ burger }),


  dishes: [],
  setDish: (dish) => set((state) => ({ dishes: { ...state.dishes, ...dish } })),
  setDishes: (dishes) => set({ dishes }),

  dishesCategory: [],
  setDishesCategory: (dishesCategory) => set({ dishesCategory }),

  searchDishes: [],
  setSearchDishes: (searchDishes) => set({ searchDishes }),

  categories: [],
  setCategories: (categories) => set({ categories }),
  setCategory: (category) => set((state) => ({ categories: { ...state.categories, ...category } })),

  tags: TAGS,
  setTag: (tag) => set((state) => ({ tags: { ...state.tags, ...tag } })),

  stopList: [],
  setStopList: (stopList) => set({ stopList }),

  fewDishes: [],
  setFewDishes: (fewDishes) => set({ fewDishes }),

  dish_to_sold: [],
  setDishToSold: (dish_to_sold) => set({ dish_to_sold }),

  ingredients: [],
  setIngredients: (ingredients) => set({ ingredients }),
  updateIngredient: (id, updatedData) => set((state) => ({
    ingredients: state.ingredients.map((ingredient) =>
      ingredient.id === id ? { ...ingredient, ...updatedData } : ingredient
    ),
  })),


  premixes: [],
  setPremixes: (premixes) => set({ premixes }),
  updatePremix: (id, updatedData) => set((state) => ({
    premixes: state.premixes.map((premix) =>
      premix.id === id ? { ...premix, ...updatedData } : premix
    ),
  })),

  providers: [],
  setProviders: (providers) => set({ providers }),

  users: [],
  setUsers: (users) => set({ users }),

  orders: [],
  setOrders: (orders) => set({ orders }),

  view: true,
  setView: (view) => set({ view }),

  options: [],
  setOptions: (options) => set({ options }),
}));

export default useStore;

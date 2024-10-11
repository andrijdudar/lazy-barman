import { create } from "zustand";

const useStoreAuth = create((set) => ({
  authenticated: false,
  setAuthenticated: (authenticated) => set({ authenticated }),

  user: null,
  setUser: (user) => set({ user }),

  profile: null,
  setProfile: (profile) => set({ profile }),

  role: null,
  setRole: (role) => set({ role }),


  // access_token: false,
  access_token: localStorage.getItem('access_token'),
  setAccessToken: (access_token) => set({ access_token }),


  // refresh_token: null,
  refresh_token: localStorage.getItem('refresh_token'),
  setRefreshToken: (refresh_token) => set({ refresh_token }),

  // token_type: null,
  token_type: localStorage.getItem('token_type'),
  setTokenType: (token_type) => set({ token_type }),

  loading: false,
  setLoading: (loading) => set({ loading }),

}));

export default useStoreAuth;

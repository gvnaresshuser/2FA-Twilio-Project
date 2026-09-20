import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const initialized = useAuthStore(
    (state) => state.initialized,
  );

  const setUser = useAuthStore(
    (state) => state.setUser,
  );

  const fetchCurrentUser = useAuthStore(
    (state) => state.fetchCurrentUser,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  return {
    user,
    loading,
    initialized,
    setUser,
    fetchCurrentUser,
    logout,
  };
};
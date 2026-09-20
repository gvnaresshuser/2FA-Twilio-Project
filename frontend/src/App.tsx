import { useEffect } from "react";

import AppRoutes from "./routes/AppRoutes";

import { useAuth } from "./hooks/useAuth";

function App() {
  const { fetchCurrentUser } = useAuth();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return <AppRoutes />;
}

export default App;

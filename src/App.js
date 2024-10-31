import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "./core/utils/constants";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { AuthContext } from "./context/authContext";
import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Register from "./components/Register";
import './styles/global.css'


const App = () => {
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true)
      } else {
        setIsAuth(false)
      }
    })
  }, [])

  return (
    <AuthContext.Provider value={{ isAuth }}>
      <RouterProvider
        router={
          createBrowserRouter(
            createRoutesFromElements(
              <Route path="/" element={<MainLayout />} >
                <Route path={ROUTE_CONSTANTS.LOGIN} element={isAuth ? <Navigate to={ROUTE_CONSTANTS.HOMEPAGE} /> : <Login />} />
                <Route path={ROUTE_CONSTANTS.REGISTER} element={isAuth ? <Navigate to={ROUTE_CONSTANTS.HOMEPAGE} /> : <Register />} />
                <Route path={ROUTE_CONSTANTS.HOMEPAGE} element={isAuth ? <HomePage /> : <Navigate to={ROUTE_CONSTANTS.LOGIN} />} />
              </Route>
            )
          )
        }
      />
    </AuthContext.Provider>
  )
}

export default App;

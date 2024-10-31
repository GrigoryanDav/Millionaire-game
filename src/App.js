import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "./core/utils/constants";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { AuthContext } from "./context/authContext";
import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import LoadingWrapper from "./components/LoadingWrapper";
import MainLayout from "./components/MainLayout";
import Register from "./components/Register";
import './styles/global.css'


const App = () => {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setLoading(false)
      setIsAuth(Boolean(user))
    })
  }, [])

  return (
    <AuthContext.Provider value={{ isAuth }}>
      <LoadingWrapper loading={loading}>
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
      </LoadingWrapper>
    </AuthContext.Provider>
  )
}

export default App;

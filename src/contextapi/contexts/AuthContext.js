import React, { createContext, useEffect, useReducer } from "react";
import jwtDecode from "jwt-decode";
import SplashScreen from "src/components/SplashScreen";
import { axiosInstance } from "src/utils/axs";
import useAuth from "../hooks/useAuth";
import {cookies as fieldArrayFieldsPropTypes} from "redux-form";
/* import baseurl from 'src/config/baseurl'; */

const authState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
  idConjunto:null,
};

const isValidToken = (accessToken) => {
  if (!accessToken) return false;
  const decoded = jwtDecode(accessToken);

  //Verifica si el toquen es vigente
  const valid = decoded.exp > Date.now() / 1000;
  return valid;
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "INITIALISE": {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user,
      };
    }
    case "LOGIN": {
      const { user } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    }
    case "LOGOUT": {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    }
    case "REGISTER": {
      const { user } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext({
  ...authState,
  method: "JWT",
  login: () => Promise.resolve(),
  logout: () => {},
  register: () => Promise.resolve(),
  conjuntoselect: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, authState);
  const { user } = useAuth();



  const login = async (email, password) => {
    const response = await axiosInstance.post("/auth/login", {
      email: email,
      password: password,
    });
    const jwt = response.data.accessToken;
    const user = response.data.user;
    setSession(jwt);
    dispatch({
      type: "LOGIN",
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    sessionStorage.clear();
    localStorage.removeItem('accessToken')
    setSession(undefined)
    window.localStorage.clear();
    dispatch({
      type: "LOGOUT",
    });
  };

  const register = async (email, name, password) => {
    const response = await axiosInstance.post("/api/account/register", {
      email,
      name,
      password,
    });
    const { accessToken, user } = response.data;
    window.localStorage.setItem("accessToken", accessToken);
    dispatch({
      type: "REGISTER",
      payload: {
        user,
      },
    });
  };

  /// USE EFFECT PARA EJECUTAR VALIDACION EN BASE A TOKENS
  useEffect(() => {
    const initialise = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
          };
          const response = await axiosInstance.get("/user", config);
          const user = response.data;

          dispatch({
            type: "INITIALISE",
            payload: { isAuthenticated: true, user },
          });
        } else {
          dispatch({
            type: "INITIALISE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALISE",
          payload: { isAuthenticated: false, user: null },
        });
      }
    };

    initialise();
  }, []);

  if (!state.isInitialised) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
        login,
        logout,
        register,
        conjuntoselect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

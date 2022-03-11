import React, { createContext, useEffect } from "react";
import SplashScreen from "../../components/Common/SplashScreen";
import { axiosInstance } from "../../utils/axs";
import firebase from "../../Firebase";
import * as FirestoreService from "../../views/login/services/firestore";
import { useSnackbar } from "notistack";

const authState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
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
const clearCacheData = () => {
  caches.keys().then((names) => {
    names.forEach((name) => {
      caches.delete(name);
    });
  });
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "INITIALISE": {
      const { isAuthenticated, user, isInitialised } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised,
        user,
      };
    }
    case "LOGIN": {
      const { user } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        isInitialised: false,

        user,
      };
    }
    case "LOGOUT": {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        idConjunto: null,
        isInitialised: false,
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
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, authState);
  const { enqueueSnackbar } = useSnackbar();

  const login = async (email, password) => {
    dispatch({
      type: "INITIALISE",
      payload: {
        isAuthenticated: false,
        isInitialised: true,
        user: null,
        idConjunto: null,
      },
    });
    var user = null;
    var userUid = null;
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        userUid = userCredential.user.uid;
        FirestoreService.loadWithEmail(email).then((respond) => {
          user = respond.data();
          let rol = null;
          if (typeof user?.Rol !== "undefined") {
            rol = JSON.parse(user?.Rol);
          }

          if (rol?.administrador || rol?.supervisor || rol?.superAdministrador) {
            window.localStorage.setItem("accessToken", respond.id);
            setSession(respond.id);
            enqueueSnackbar("Bienvenidos a mi casita", {
              variant: "success",
            });
            dispatch({
              type: "LOGIN",
              payload: {
                user,
              },
            });
          } else {
            setSession(null);
            dispatch({
              type: "LOGOUT",
            });
            enqueueSnackbar(
              "No tienes permisos para ingresar a la plataforma",
              {
                variant: "error",
              }
            );
          }
        });
      })
      .catch((error) => {
        dispatch({
          type: "INITIALISE",
          payload: {
            isAuthenticated: false,
            isInitialised: false,
            user: null,
            idConjunto: null,
          },
        });
        if (error.code === "auth/invalid-email") {
          enqueueSnackbar(
            "La dirección de correo electrónico está mal ingresada.",
            {
              variant: "error",
            }
          );
        }
        if (error.code === "auth/wrong-password") {
          enqueueSnackbar(
            "La contraseña no es válida o el usuario no tiene contraseña.",
            {
              variant: "error",
            }
          );
        }
        if (error.code === "auth/user-not-found") {
          enqueueSnackbar(
            "No hay ningún registro de usuario que corresponda a este identificador. Es posible que se haya eliminado al usuario.",
            {
              variant: "error",
            }
          );
        }
      });
  };
  const logout = async () => {
    await firebase.auth().signOut();
    window.localStorage.clear();
    clearCacheData();
    dispatch({
      type: "LOGOUT",
    });
  };

  useEffect(() => {
    const initialise = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");
        if (accessToken) {
          try {
            dispatch({
              type: "INITIALISE",
              payload: {
                isInitialised: true,
                user: null,
                idConjunto: null,
              },
            });
            FirestoreService.checkSuperUser(accessToken.toString()).then(
              (respond) => {
                setSession(respond.id);
                let user = respond.data();
                dispatch({
                  type: "LOGIN",
                  payload: {
                    user,
                  },
                });
              }
            );
          } catch (e) {}

          setSession(accessToken);
        } else {
          clearCacheData();

          dispatch({
            type: "INITIALISE",
            payload: {
              isAuthenticated: false,
              user: null,
              idConjunto: null,
            },
          });
        }
      } catch (err) {
        dispatch({
          type: "INITIALISE",
          payload: { isAuthenticated: false, user: null },
        });
      }
    };

    initialise();
  }, []);
  if (state.isInitialised) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ ...state, method: "JWT", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

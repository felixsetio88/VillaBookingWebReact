import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  user: null,
  isAdmin: false,
  loading: false,
  error: null,
};

try {
  const userData = localStorage.getItem("user");
  if(userData){
    const user = JSON.parse(userData);
    INITIAL_STATE.user = user;
    INITIAL_STATE.isAdmin = user.isAdmin;
  }
} catch(error){
  console.error(error);
}

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "REGISTER_START":
    case "LOGIN_START":
    case "VERIFY_REGISTER_START":
    case "RESET_PASSWORD_START":
    case "VERIFY_RESET_PASSWORD_START":
      return {
        user: null,
        isAdmin: false,
        loading: true,
        error: null,
      };
    case "REGISTER_SUCCESS":
    case "LOGIN_SUCCESS":
    case "RESET_PASSWORD_SUCCESS":
      return {
        user: action.payload,
        isAdmin: action.payload.isAdmin,
        loading: false,
        error: null,
      };
    case "VERIFY_REGISTER_SUCCESS":
    case "VERIFY_RESET_PASSWORD_SUCCESS":
      return {
        user: null,
        isAdmin: false,
        loading: false,
        error: null,
      };
    case "REGISTER_FAILURE":
    case "LOGIN_FAILURE":
    case "RESET_PASSWORD_FAILURE":
    case "VERIFY_REGISTER_FAILURE":
    case "VERIFY_RESET_PASSWORD_FAILURE":
      return {
        user: null,
        isAdmin: false,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        isAdmin: false,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  useEffect(() => {
    if(state.user){
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
    console.log(state.user)
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAdmin: state.isAdmin,
        firstname: state.firstname,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// Your main component or context file

import React, { createContext, useContext, useReducer } from "react";
import { rootReducer } from "../reducers/rootReducer";

const initialState = {
  responseData: {
    loading: false,
    error: null,
    data: "",
  },
  uploadedFile: {
    filesList: [],
  },
  // Add other initial values as needed
};

const AppContext = createContext(null);
const AppDispatchContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
};

export function useApp() {
    return useContext(AppContext);
  }
  
  export function useAppDispatch() {
    return useContext(AppDispatchContext);
  }

// export { AppContext, AppProvider };

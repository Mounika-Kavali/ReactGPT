import fileReducer from "./fileReducer";
import queryResponseReducer from "./queryResponseReducer";



// Combine multiple reducers into one
export const rootReducer = (state, action) => {
    return {
      responseData: queryResponseReducer(state.responseData, action),
      uploadedFile: fileReducer(state.uploadedFile, action),
      // Add other reducers as needed
    };
  };
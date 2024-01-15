export const GENERATE_RESPONSE_REQUEST = "GENERATE_RESPONSE_REQUEST";
export const GENERATE_RESPONSE_SUCCESS = "GENERATE_RESPONSE_SUCCESS";
export const GENERATE_RESPONSE_FAILURE = "GENERATE_RESPONSE_FAILURE";


//action types
export const generateResponseRequest = () => ({
  type: GENERATE_RESPONSE_REQUEST,
});

export const generateResponseSuccess = (response) => {
  return {
    type: GENERATE_RESPONSE_SUCCESS,
    payload: response,
  };
};

export const generateResponseFailure = (error) => ({
  type: GENERATE_RESPONSE_FAILURE,
  payload: error,
});

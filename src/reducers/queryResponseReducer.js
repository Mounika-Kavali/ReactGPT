import {
  GENERATE_RESPONSE_REQUEST,
  GENERATE_RESPONSE_SUCCESS,
  GENERATE_RESPONSE_FAILURE,
} from "../actions/queryResponseAction";

const initialState = {
  loading: false,
  error: null,
  data: "",
};

const queryResponseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GENERATE_RESPONSE_REQUEST:
      return { ...state, loading: true, error: null };
    case GENERATE_RESPONSE_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case GENERATE_RESPONSE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default queryResponseReducer;

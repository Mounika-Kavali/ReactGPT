import {
  GET_UPLOADED_FILES_REQUEST,
  GET_UPLOADED_FILES_SUCCESS,
  GET_UPLOADED_FILES_FAILURE,
  UPLOAD_FILE_REQUEST,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAILURE,
  DELETE_UPLOADED_FILE_REQUEST,
  DELETE_UPLOADED_FILE_SUCCESS,
  DELETE_UPLOADED_FILE_FAILURE,
} from "../actions/fileActions";

const initialState = {
  loading: false,
  error: null,
  fileName: "",
  fileList: [],
};

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
    // GET
    case GET_UPLOADED_FILES_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_UPLOADED_FILES_SUCCESS:
      return { ...state, loading: false, fileList: action.payload };
    case GET_UPLOADED_FILES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // POST
    case UPLOAD_FILE_REQUEST:
      return { ...state, loading: true, error: null };
    case UPLOAD_FILE_SUCCESS:
      return { ...state, loading: false };
    case UPLOAD_FILE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // DELETE
    case DELETE_UPLOADED_FILE_REQUEST:
      return { ...state, loading: true, error: null };
    case DELETE_UPLOADED_FILE_SUCCESS:
      return { ...state, loading: false };
    case DELETE_UPLOADED_FILE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default fileReducer;

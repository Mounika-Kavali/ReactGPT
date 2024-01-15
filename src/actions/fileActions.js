//action types
// Action Types

// GET
export const GET_UPLOADED_FILES_REQUEST = "GET_UPLOADED_FILES_REQUEST";
export const GET_UPLOADED_FILES_SUCCESS = "GET_UPLOADED_FILES_SUCCESS";
export const GET_UPLOADED_FILES_FAILURE = "GET_UPLOADED_FILES_FAILURE";

// POST
export const UPLOAD_FILE_REQUEST = "UPLOAD_FILE_REQUEST";
export const UPLOAD_FILE_SUCCESS = "UPLOAD_FILE_SUCCESS";
export const UPLOAD_FILE_FAILURE = "UPLOAD_FILE_FAILURE";

// DELETE
export const DELETE_UPLOADED_FILE_REQUEST = "DELETE_UPLOADED_FILE_REQUEST";
export const DELETE_UPLOADED_FILE_SUCCESS = "DELETE_UPLOADED_FILE_SUCCESS";
export const DELETE_UPLOADED_FILE_FAILURE = "DELETE_UPLOADED_FILE_FAILURE";


//GET
export const getUploadedFileListRequest = () => ({
  type: GET_UPLOADED_FILES_REQUEST,
});

export const getUploadedFileListSuccess = () => {
  return {
    type: GET_UPLOADED_FILES_SUCCESS,
  };
};

export const getUploadedFileListFailure = (error) => ({
  type: GET_UPLOADED_FILES_FAILURE,
  payload: error,
});

//POST
export const uploadFileRequest = () => ({
    type: UPLOAD_FILE_REQUEST,
  });
  
  export const uploadFileSuccess = (fileName) => {
    return {
      type: UPLOAD_FILE_SUCCESS,
      payload: fileName,
    };
  };
  
  export const uploadFileFailure = (error) => ({
    type: UPLOAD_FILE_FAILURE,
    payload: error,
  });

//DELETE
export const removeUploadedFileRequest = () => ({
    type: DELETE_UPLOADED_FILE_REQUEST,
  });
  
  export const removeUploadedFileSuccess = (filename) => {
    return {
      type: DELETE_UPLOADED_FILE_SUCCESS,
      payload: filename,
    };
  };
  
  export const removeUploadedFileFailure = (error) => ({
    type: DELETE_UPLOADED_FILE_FAILURE,
    payload: error,
  });

//PUT
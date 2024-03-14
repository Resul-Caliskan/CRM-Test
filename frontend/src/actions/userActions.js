export const loginSuccess = (userData) => {
  return {
    type: 'LOGIN_SUCCESS',
    payload: userData
  };
};

export const loginFailure = (error) => {
  return {
    type: 'LOGIN_FAILURE',
    payload: error
  };
};
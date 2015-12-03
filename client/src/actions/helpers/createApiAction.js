import { apiClient } from '../../api/client';
import {createAction} from 'redux-actions';

const createApiAction = (type, apiMethod) => {
  return (...apiMethodArgs) => {
    return (dispatch, getState) => {
      const token = getState().authentication.authToken;
      const {endpoint, method, options} = apiMethod(...apiMethodArgs);
      options.authToken = token;
      const action = createAction(type, () => apiClient(endpoint, method, options))();
      return dispatch(action);
    };
  };
};

export default createApiAction;

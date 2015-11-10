import {createAction} from 'redux-actions';

export const pushExampleCollection = createAction('PUSH_EXAMPLE_COLLECTION', item => item);
export const popExampleCollection = createAction('POP_EXAMPLE_COLLECTION');

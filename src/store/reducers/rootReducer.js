import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore'; // syncing firestore
import { firebaseReducer } from 'react-redux-firebase';
import authReducer from './authReducer';
import wireFramerReducer from './wireFramerReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  wireFramer: wireFramerReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
});

export default rootReducer;
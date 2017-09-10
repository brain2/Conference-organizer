import firebase from 'firebase';
import {appName} from '../config';
import {Record} from 'immutable';
//import store from '../redux';
import {all, call, put, take} from 'redux-saga/effects';

const ReducerRecord = Record({ // schema
  user: null,
  error: null,
  loading: false
});

export const moduleName = 'auth';
export const SIGN_UP_REQUEST = `${appName}/${moduleName}/SIGN_UP_REQUEST`;
export const SIGN_UP_SUCCESS = `${appName}/${moduleName}/SIGN_UP_SUCCESS`;
export const SIGN_UP_ERROR = `${appName}/${moduleName}/SIGN_UP_ERROR`;
export const SIGN_IN_SUCCESS = `${appName}/${moduleName}/SIGN_IN_SUCCESS`;

export default function reducer(state = new ReducerRecord(), action) {
   const {type, payload, error} = action;
   
   switch (type) {
     case SIGN_UP_REQUEST:
       return state.set('loading', true);
       
     case SIGN_IN_SUCCESS:
       return state
         .set('loading', false)
         .set('user', payload.user)
         .set('error', null);
       
     case SIGN_UP_ERROR:
       return state
         .set('loading', false)
         .set('error', error);
       
     default:
       return state;
   }
}

export function signUp(email, password) {
  return {
    type: SIGN_UP_REQUEST,
    payload: {email, password}
  }
}

export const signUpSaga = function * () {
  const action = yield take(SIGN_UP_REQUEST);
  
  while (true) {
    const auth = firebase.auth();
  
    try {
      const user = yield call( // if this promise resolve, redux-saga will write its value in const user
        [auth, auth.createUserWithEmailAndPassword],
        action.payload.email, action.payload.password
      );
    
      yield put({
        type:SIGN_IN_SUCCESS,
        payload: {user}
      })
    } catch (error) {
      yield put({
        type: SIGN_UP_ERROR,
        error
      })
    }
  }
};

/*export function signUp(email, password) { // AC
  return (dispatch) => {
    dispatch({
      type: SIGN_UP_REQUEST
    });
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => dispatch({
        type: SIGN_UP_SUCCESS,
        payload: {user}
      }))
      .catch(error => dispatch({
      type: SIGN_UP_ERROR,
      error
    }))
  }
}*/

export const watchStateChange = function * () {
  const auth = firebase.auth();
  
  try {
    yield call([auth, auth.onAuthStateChanged]);
    
  } catch (user) {
    yield put({
      type: SIGN_IN_SUCCESS,
      payload: {user}
    })
  }
};

/*firebase.auth().onAuthStateChanged(user => {
  store.dispatch({
    type: SIGN_IN_SUCCESS,
    payload: {user}
  })
});*/

export const saga = function * () {
  yield all([
    signUpSaga(),
    watchStateChange()
  ])
};
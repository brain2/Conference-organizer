import {all, take, put, call} from 'redux-saga/effects';
import {appName} from '../config';
import {Record, OrderedMap} from 'immutable';
import firebase from 'firebase';

/**
 * Constans
 * */
export const moduleName = 'events';
const prefix = `${appName}/${moduleName}`;
export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`;


/**
 * Reducer
 * */
export const ReducerRecord = Record({ // schema
  entities: new OrderedMap(),
  loading: false,
  loaded: false
});

export default function reducer(state = new ReducerRecord(), action) {
  const {type, payload} = action;
  
  switch (type) {
    case FETCH_ALL_REQUEST:
      return state.set('loading', true);
      
    case FETCH_ALL_SUCCESS:
      return state
        .set('loading', false)
        .set('loaded', true)
        .set('entities', new OrderedMap(payload));
    
    default:
      return state;
  }
}

/**
 * Action Creators
 * */
export function fetchAll() {
  return {
    type: FETCH_ALL_REQUEST
  }
}

/**
 * Sagas
 * */
export const fetchAllSaga = function*() {
  while (true) {
    yield take(FETCH_ALL_REQUEST);
    
    const ref = firebase.database().ref('events');
    const data = yield call([ref, ref.once], 'value'); // get a data snapshot
    
    yield put({
      type: FETCH_ALL_SUCCESS,
      payload: data.val()  // to retrieve the data you must call val() method
    })
  }
};

export function* saga() {
  yield all([
    fetchAllSaga()
  ])
}
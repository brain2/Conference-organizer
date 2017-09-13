import {all, take, put, call} from 'redux-saga/effects';
import {appName} from '../config';
import {Record, OrderedMap, OrderedSet} from 'immutable';
import firebase from 'firebase';
import {createSelector} from 'reselect';
import {fbDatatoEntities} from './utils';

/**
 * Constans
 * */
export const moduleName = 'events';
const prefix = `${appName}/${moduleName}`;
export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`;
export const FETCH_ALL_ERROR = `${prefix}/FETCH_ALL_ERROR`;
export const SELECT_EVENT = `${prefix}/SELECT_EVENT`;


/**
 * Reducer
 * */
export const ReducerRecord = Record({ // schema
  entities: new OrderedMap({}),
  selected: new OrderedSet([]),
  loading: false,
  loaded: false,
  error: null
});

export const EventRecord = Record({
  uid: null,
  title: null,
  url: null,
  where: null,
  when: null,
  month: null,
  submissionDeadline: null
});

export default function reducer(state = new ReducerRecord(), action) {
  const {type, payload, error} = action;
  
  switch (type) {
    case FETCH_ALL_REQUEST:
      return state.set('loading', true);
      
    case FETCH_ALL_SUCCESS:
      return state
        .set('loading', false)
        .set('loaded', true)
        .set('entities', fbDatatoEntities(payload, EventRecord));
      
    case FETCH_ALL_ERROR:
      return state
        .set('loading', false)
        .set('error', error);
      
    case SELECT_EVENT:
      return state.selected.contains(payload.uid)
        ? state.update('selected', selected => selected.remove(payload.uid))
        : state.update('selected', selected => selected.add(payload.uid));
    
    default:
      return state;
  }
}

/**
 * Selectors
 * */
export const stateSelector = state => state[moduleName]; // из всего store достать только подстор (our duck)
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const eventListSelector = createSelector(entitiesSelector, entities => (
  entities.valueSeq().toArray() // в обычный массив, чтобы не заморачиваться с immutable.js структурами
));

/**
 * Action Creators
 * */
export function fetchAll() {
  return {
    type: FETCH_ALL_REQUEST
  }
}

export function selectEvent(uid) {
  return {
    type: SELECT_EVENT,
    payload: {uid}
  }
}

/**
 * Sagas
 * */
export const fetchAllSaga = function*() {
  while (true) {
    yield take(FETCH_ALL_REQUEST);
    
    try {
      const ref = firebase.database().ref('events');
      const data = yield call([ref, ref.once], 'value'); // get a data snapshot
  
      yield put({
        type: FETCH_ALL_SUCCESS,
        payload: data.val()  // to retrieve the data you must call val() method
      })
    } catch (error) {
      yield put({
        type: FETCH_ALL_ERROR,
        error
      })
    }
  }
};

export function* saga() {
  yield all([
    fetchAllSaga()
  ])
}
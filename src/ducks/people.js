import {Record, OrderedMap} from 'immutable';
import {appName} from '../config';
import {put, call, takeEvery, all, select, fork, spawn, cancel, cancelled, race} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {reset} from 'redux-form';
//import {generateId} from './utils';
import firebase from 'firebase';
import {createSelector} from 'reselect';
import {fbDatatoEntities} from './utils';

/**
 * Constans
 * */
export const moduleName = 'people';
const prefix = `${appName}/${moduleName}`;
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`;
export const ADD_PERSON_ERROR = `${prefix}/ADD_PERSON_ERROR`;
export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`;
export const FETCH_ALL_ERROR = `${prefix}/FETCH_ALL_ERROR`;
export const ADD_EVENT_REQUEST = `${prefix}/ADD_EVENT_REQUEST`;
export const ADD_EVENT_SUCCESS = `${prefix}/ADD_EVENT_SUCCESS`;
export const ADD_EVENT_ERROR = `${prefix}/ADD_EVENT_ERROR`;
export const REMOVE_EVENT_FROM_PEOPLE_REQUEST = `${prefix}/REMOVE_EVENT_FROM_PEOPLE_REQUEST`;
export const REMOVE_EVENT_FROM_PEOPLE_SUCCESS = `${prefix}/REMOVE_EVENT_FROM_PEOPLE_SUCCESS`;
export const REMOVE_EVENT_FROM_PEOPLE_ERROR = `${prefix}/REMOVE_EVENT_FROM_PEOPLE_ERROR`;

/**
 * Reducer
 * */
const ReducerState = Record({
  entities: new OrderedMap({}),
  loading: false
});

const PersonRecord = Record({
  uid: null,
  firstName: null,
  lastName: null,
  email: null,
  events: []
});

export default function reducer(state = new ReducerState(), action) {
  const {type, payload} = action;
  
  switch (type) {
    case FETCH_ALL_REQUEST:
    case ADD_PERSON_REQUEST:
      return state.set('loading', true);
      
    case ADD_PERSON_SUCCESS:
      return state
        .set('loading', false)
        .setIn(['entities', payload.uid], new PersonRecord(payload));
      
    case FETCH_ALL_SUCCESS:
      return state
        .set('loading', false)
        .set('entities', fbDatatoEntities(payload, PersonRecord));
      
    case ADD_EVENT_SUCCESS:
    case REMOVE_EVENT_FROM_PEOPLE_SUCCESS:
      return state.setIn(['entities', payload.personUid, 'events'], payload.events);
      
    default: return state;
  }
}

/**
 * Selectors
 * */
export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const idSelector = (_, props) => props.uid;
export const peopleListSelector = createSelector(entitiesSelector, entities => entities.valueSeq().toArray());
export const personSelector = createSelector(entitiesSelector, idSelector,
  (entities, id) => entities.get(id));

/**
 * Action Creators
 * */
export function addPerson(person) {
  return {
    type: ADD_PERSON_REQUEST,
    payload: person
  }
}

export function fetchAllPeople() {
  return {
    type: FETCH_ALL_REQUEST
  }
}

export function addEventToPerson(eventUid, personUid) {
  return {
    type: ADD_EVENT_REQUEST,
    payload: { eventUid, personUid }
  }
}

export function removeEventFromPeople(eventUid, personUid) {
  return {
    type: REMOVE_EVENT_FROM_PEOPLE_REQUEST,
    payload: { eventUid, personUid }
  }
}

/**
 * Sagas
 * */
export const addPersonSaga = function* (action) {
  const peopleRef = firebase.database().ref('people');
  
  try {
    const ref = yield call([peopleRef, peopleRef.push], action.payload);
    
    yield put({
      type: ADD_PERSON_SUCCESS,
      payload: {...action.payload, uid: ref.key}
    });
  
    yield put(reset('person'));
  } catch (error) {
    yield put({
      type: ADD_PERSON_ERROR,
      error
    })
  }
};

export const fetchAllSaga = function* () {
  const peopleRef = firebase.database().ref('people');
  
  try {
    const data = yield call([peopleRef, peopleRef.once], 'value');
    
    yield put({
      type: FETCH_ALL_SUCCESS,
      payload: data.val()
    })
  } catch (error) {
    yield put({
      type: FETCH_ALL_ERROR,
      error
    })
  }
};

/*export function addPerson(person) {
  return dispatch => {
    dispatch({
      type: ADD_PERSON,
      payload: {
        person: {id: Date.now(), ...person} // Date.now() - side-effect, therefor we have to use redux-thunk
      }                               // because action creator(AC) must be a pure function
    })
  }
  /!*return {  // вот так чистая ф-ция (without side-effects) - можно использовать обычный AC
    type: ADD_PERSON,
    payload: {person}
  }*!/
}*/

export const addEventSaga = function* (action) {
  const {eventUid, personUid} = action.payload;
  
  const eventsRef = firebase.database().ref(`people/${personUid}/events`);
  
  const state = yield select(stateSelector);
  const events = state.getIn(['entities', personUid, 'events']).concat(eventUid);
  
  try { // блок try catch нужен если не будет прав доступа к примеру
    yield call([eventsRef, eventsRef.set], events);
    
    yield put({
      type: ADD_EVENT_SUCCESS,
      payload: {personUid, events}
    })
  } catch (error) {
    yield put({
      type: ADD_EVENT_ERROR,
      error
    });
  }
  
};

export const removeEventFromPeopleSaga = function* (action) {
  const {eventUid, personUid} = action.payload;
  const state = yield select(stateSelector);
  
  const eventsRef = firebase.database().ref(`people/${personUid}/events`);
  
  const events = state.getIn(['entities', personUid, 'events'])
    .filter(event => event !== eventUid);
  
  try {
    yield call([eventsRef, eventsRef.set], events);
    
    yield put({
      type: REMOVE_EVENT_FROM_PEOPLE_SUCCESS,
      payload: {personUid, events}
    })
  } catch (error) {
    yield put({
      type: REMOVE_EVENT_FROM_PEOPLE_ERROR,
      error
    })
  }
};

export const backgroundSyncSaga = function* () {
  try {  // блок try чтобы среагировать на отмену
    while (true) {
      yield call(fetchAllSaga);
      yield delay(2000);
      //throw new Error;
    }
  } finally {
    if (yield cancelled()) {
      console.log('---', 'canceled sync saga');
    }
  }
};

export const cancellableSync = function* () {
  yield race({
    sync: backgroundSyncSaga(),
    delay: delay(6000)
  });
  
  /*const task = yield fork(backgroundSyncSaga);
  yield delay(6000);
  yield cancel(task);*/
};

export const saga = function * () {
  yield spawn(cancellableSync);
  
  yield all([
    takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
    takeEvery(FETCH_ALL_REQUEST, fetchAllSaga),
    takeEvery(ADD_EVENT_REQUEST, addEventSaga),
    takeEvery(REMOVE_EVENT_FROM_PEOPLE_REQUEST, removeEventFromPeopleSaga)
  ])
};
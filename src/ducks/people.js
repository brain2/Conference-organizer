import {Record, List} from 'immutable';
import {appName} from '../config';

const ReducerState = Record({
  entities: new List()
});

const PersonRecord = Record({
  id: null,
  firstName: null,
  lastName: null,
  email: null
});

export const moduleName = 'people';
const prefix = `${appName}/${moduleName}`;
export const ADD_PERSON = `${prefix}/ADD_PERSON`;


export default function reducer(state = new ReducerState(), action) {
  const {type, payload} = action;
  
  switch (type) {
    case ADD_PERSON:
      return state.update('entities', entities => entities.push(new PersonRecord(payload.person)));
      
    default: return state;
  }
}

export function addPerson(person) {
  return dispatch => {
    dispatch({
      type: ADD_PERSON,
      payload: {
        person: {id: Date.now(), ...person} // Date.now() - side-effect, therefor we have to use redux-thunk
      }                               // because action creator(AC) must be a pure function
    })
  }
  /*return {  // вот так чистая ф-ция (without side-effects) - можно использовать обычный AC
    type: ADD_PERSON,
    payload: {person}
  }*/
}
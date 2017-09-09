import {addPersonSaga, ADD_PERSON_REQUEST, ADD_PERSON} from './people';
import {call, put} from 'redux-saga/effects';
import {generateId} from './utils';

it('should dispatch person with id', () => {
  const person = {
    firstName: 'Roman',
    email: 'test@mail.ru'
  };
  
  const saga = addPersonSaga({
    type: ADD_PERSON_REQUEST,
    payload: person
  });
  
  expect(saga.next().value).toEqual(call(generateId)); // сравниваем 2 (?сериализуемых) плоских объекта
  const id = generateId();
  
  expect(saga.next(id).value).toEqual(put({
    type: ADD_PERSON,
    payload: {id, ...person}
  }))
});
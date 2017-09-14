import React from 'react';
import {mount} from 'enzyme';
import {PeopleTable} from './PeopleTable';

function generateList(length) {
  const arr = [];
  
  for (let i = 0; i < length; i++) {
    arr.push({
      firstName: Math.random().toString(),
      lastName: Math.random().toString(),
      email: Math.random().toString()
    })
  }
  return arr;
}

it('should render all items from short list', () => {
  const shortList = generateList(5);
  
  const container = mount(<PeopleTable people={shortList} />)
  const rows = container.find('.test--people-list_row');
  
  expect(rows.length).toEqual(shortList.length + 1); // потому что еще и title есть - тоже row
});

it('should render a part of long list', () => {
  const longList = generateList(200);
  
  const container = mount(<PeopleTable people={longList} />);
  const rows = container.find('.test--people-list_row');
  
  expect(rows.length).toEqual(12);
});

it('should render a part of long list', (done) => {
  mount(<PeopleTable people={[]} fetchAllPeople={done} />);
});
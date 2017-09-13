import React from 'react';
import {shallow, mount} from 'enzyme';
import events from '../../mocks/conferences';
import {EventList} from './TableEventList';
import Loader from '../common/Loader';
import {EventRecord} from '../../ducks/events';

const testEvents = events.map(event => new EventRecord({...event, uid: Math.random().toString()}));

it('should render loader', () => {
  const container = shallow(<EventList loading />);
  
  expect(container.contains(<Loader />));
});

it('should render event list', () => {
  const container = shallow(<EventList events = {testEvents} />);
  
  const rows = container.find('.test--event-list_row');
  
  expect(rows.length).toEqual(testEvents.length);
});

it('should request fetch data', (done) => {
  mount(<EventList events={[]} fetchAll={done} />)
});

it('should select event', () => {
  let selected = null;
  const selectEvent = (uid) => selected = uid;
  
  const container = mount(<EventList
    events={testEvents}
    fetchAll = {() => {}}
    selectEvent = {selectEvent}
  />);
  
  container.find('.test--event-list_row').first().simulate('click');
  
  expect(selected).toEqual(testEvents[0].uid);
});
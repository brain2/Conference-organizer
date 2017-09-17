import React, {Component} from 'react';
import {DropTarget, DragSource} from 'react-dnd';
import {connect} from 'react-redux';
import {addEventToPerson, peopleListSelector, removeEventFromPeople} from '../../ducks/people';
import {selectEvent} from '../../ducks/events';
import {getEmptyImage} from 'react-dnd-html5-backend';

class EventCard extends Component {
  componentDidMount() {
    this.props.connectPreview(getEmptyImage());
  }
  
  render() {
    const {connectDropTarget, hovered, canDrop, people, connectDragSource} = this.props;
    const {title, where, when} = this.props.event;
    
    const dropStyle = { // стилизация чтобы следить за состоянием перетаскивания
      border: `1px solid ${canDrop ? 'red' : 'black'}`,
      backgroundColor: hovered ? 'green' : 'white'
    };
    
    const peopleElement = people && (
      <p>
        {people.map(person => person.email).join(', ')}
      </p>
    );
    
    return connectDropTarget(connectDragSource(
      <div style={dropStyle}>
        <h3>{title}</h3>
        <p>{where}, {when}</p>
        {peopleElement}
      </div>
    ))
  }
}

const spec = {
  drop(props, monitor) {
    const personUid = monitor.getItem().uid;
    const eventUid = props.event.uid;
    
    props.addEventToPerson(eventUid, personUid);
    
    //console.log('--', 'drop', 'eventUid', eventUid, 'personUid', personUid);
    return {eventUid};
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop(),
  hovered: monitor.isOver()
});

const specDrag = {
  beginDrag(props) {
    return {
      uid: props.event.uid
    }
  },
  
  endDrag(props, monitor) {
    const dropResult = monitor.getDropResult();
    const eventUid = dropResult && dropResult.eventUid;
    
    if (eventUid && props.people) {
      props.people.forEach(person => props.removeEventFromPeople(eventUid, person.uid))
    }
    if (eventUid) props.selectEvent(eventUid);
  }
};

const collectDrag = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectPreview: connect.dragPreview()
});

export default connect((state, props) => ({
  people: peopleListSelector(state).filter(person => person.events.includes(props.event.uid))
}), {addEventToPerson, removeEventFromPeople, selectEvent})
(DropTarget(['person'], spec, collect)
(DragSource('selectedEvent', specDrag, collectDrag)(EventCard)));
// connect должен быть внешним декоратором, т.к. он передает props, которые должны быть доступны
// в DropTarget.spec.drop
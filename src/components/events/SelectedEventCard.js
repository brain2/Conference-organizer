import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import {connect} from 'react-redux';
import {addEventToPerson, peopleListSelector} from '../../ducks/people';

class EventCard extends Component {
  render() {
    const {connectDropTarget, hovered, canDrop, people} = this.props;
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
    
    return connectDropTarget(
      <div style={dropStyle}>
        <h3>{title}</h3>
        <p>{where}, {when}</p>
        {peopleElement}
      </div>
    )
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

export default connect((state, props) => ({
  people: peopleListSelector(state).filter(person => person.events.includes(props.event.uid))
}), {addEventToPerson})(DropTarget(['person'], spec, collect)(EventCard));
// connect должен быть внешним декоратором, т.к. он передает props, которые должны быть доступны
// в DropTarget.spec.drop
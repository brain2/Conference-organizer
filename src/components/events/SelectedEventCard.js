import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';

class EventCard extends Component {
  render() {
    const {connectDropTarget, hovered, canDrop} = this.props;
    const {title, where, when} = this.props.event;
    
    const dropStyle = { // стилизация чтобы следить за состоянием перетаскивания
      border: `1px solid ${canDrop ? 'red' : 'black'}`,
      backgroundColor: hovered ? 'green' : 'white'
    };
    
    return connectDropTarget(
      <div style={dropStyle}>
        <h3>{title}</h3>
        <p>{where}, {when}</p>
      </div>
    )
  }
}

const spec = {
  drop(props, monitor) {
    const personUid = monitor.getItem().uid;
    const eventUid = props.event.uid;
    
    console.log('--', 'eventUid', eventUid, 'personUid', personUid);
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop(),
  hovered: monitor.isOver()
});

export default DropTarget(['person'], spec, collect)(EventCard);
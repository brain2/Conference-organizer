import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import {connect} from 'react-redux';
import {stateSelector, selectEvent, deleteEvent} from '../../ducks/events';
import Loader from '../common/Loader';

const style = {
  position: 'fixed',
  top: 0, right: 0,
  width: '100px', height: '100px'
};

class Trash extends Component {
  render() {
    const {connectDropTarget, canDrop, isOver, loading} = this.props;
    const dropStyle = {
      border: `1px solid ${canDrop ? 'red' : 'grey'}`,
      backgroundColor: isOver ? 'green' : 'white'
    };
    
    return connectDropTarget(
      <div style={{...style, ...dropStyle}}>
        <h1>Trash</h1>
        {loading && <Loader />}
      </div>
    )
  }
}

const spec = {
 drop(props, monitor) {
   const item = monitor.getItem();
   const type = monitor.getItemType();
   
   if (type === 'event') {
     props.deleteEvent(item.uid);
   } else if (type === 'selectedEvent') {
     props.selectEvent(item.uid)
   }
   
   return {uid: item.uid};
 }
};
const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop(),
  isOver: monitor.isOver()
});

export default connect(state => ({
  loading: stateSelector(state).loading
}), {selectEvent, deleteEvent})(DropTarget(['event', 'selectedEvent'], spec, collect)(Trash));
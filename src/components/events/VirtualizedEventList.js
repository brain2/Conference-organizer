import React, {Component} from 'react';
import {connect} from 'react-redux';
import {moduleName, fetchAll, selectEvent, eventListSelector} from '../../ducks/events';
import Loader from '../common/Loader';
import {Table, Column} from 'react-virtualized';
import 'react-virtualized/styles.css';

export class EventList extends Component {
  componentDidMount() {
    this.props.fetchAll();
  }
  
  render() {
    const {events, loading} = this.props;
    if (loading) return <Loader />;
    
    return (
      <Table
        rowCount = {events.length}
        rowGetter = {this.rowGetter}
        rowHeight={20}
        headerHeight={40}
        overscanRowCount={5}
        width = {700}
        height = {300}
        onRowClick={this.handleRowClick}
      >
        <Column label="title" dataKey="title" width={250} />
        <Column label="where" dataKey="where" width={250} />
        <Column label="when" dataKey="month" width={250} />
      </Table>
    )
  }
  
  rowGetter = ({index}) => {
    return this.props.events[index];
  };
  
  handleRowClick = ({rowData}) => {
    const {selectEvent} = this.props;
    selectEvent && selectEvent(rowData.uid);
  }
}

export default connect(state => ({
  //events: state[moduleName].entities
  events: eventListSelector(state),
  loading: state[moduleName].loading
}), {fetchAll, selectEvent})(EventList);
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {moduleName, fetchLazy, selectEvent, eventListSelector} from '../../ducks/events';
//import Loader from '../common/Loader';
import {Table, Column, InfiniteLoader} from 'react-virtualized';
import 'react-virtualized/styles.css';

export class EventList extends Component {
  componentDidMount() {
    this.props.fetchLazy();
  }
  
  render() {
    const { loaded, events } = this.props;
    //if (loading) return <Loader />;
    
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        rowCount={loaded ? events.length : events.length + 1}
        loadMoreRows={this.loadMoreRows}
      >
        {({onRowsRendered, registerChild}) =>
          <Table
            ref={registerChild}
            rowCount = {events.length}
            rowGetter = {this.rowGetter}
            rowHeight={20}
            headerHeight={40}
            overscanRowCount={5}
            width = {700}
            height = {300}
            onRowClick={this.handleRowClick}
            onRowsRendered={onRowsRendered}
          >
            <Column label="title" dataKey="title" width={300} />
            <Column label="where" dataKey="where" width={250} />
            <Column label="when" dataKey="month" width={150} />
          </Table>
        }
      </InfiniteLoader>
    )
  }
  
  isRowLoaded = ({index}) => index < this.props.events.length;
  
  loadMoreRows = () => {
    console.log('---', 'load more');
    this.props.fetchLazy();
  };
  
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
  loading: state[moduleName].loading,
  loaded: state[moduleName].loaded
}), {fetchLazy, selectEvent})(EventList);
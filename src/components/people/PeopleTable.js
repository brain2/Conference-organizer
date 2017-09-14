import React, {Component} from 'react';
import {Table, Column} from 'react-virtualized';
import {connect} from 'react-redux';
import { peopleListSelector, fetchAllPeople } from '../../ducks/people';

export class PeopleTable extends Component {
  componentDidMount() {
    this.props.fetchAllPeople && this.props.fetchAllPeople();
  }
  
  render() {
    return (
      <div>
        <h1>Person list</h1>
        <Table
          width = {700}
          height = {300}
          rowHeight={30}
          headerHeight={40}
          rowGetter = {this.rowGetter}
          rowCount = {this.props.people.length}
          overscanRowCount={2}
          rowClassName="test--people-list_row"
        >
          <Column label="First Name" dataKey="firstName" width={200} />
          <Column label="Last Name" dataKey="lastName" width={200} />
          <Column label="Email" dataKey="email" width={200} />
        </Table>
      </div>
      
    )
  }
  
  rowGetter = ({index}) => this.props.people[index];
}

export default connect(state => ({
  people: peopleListSelector(state)
}), {fetchAllPeople})(PeopleTable);
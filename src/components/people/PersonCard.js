import React, {Component} from 'react';

class PersonCard extends Component {
  render() {
    const {person, style} = this.props;
    
    return (
      <div style={{width: 200, height: 100, ...style}} >
        <h2>{person.firstName}&nbsp;{person.lastName}</h2>
        <p>{person.email}</p>
      </div>
    )
  }
}

export default PersonCard;
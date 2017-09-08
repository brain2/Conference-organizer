import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class ProtectedRoute extends Component {
  render() {
    return (
      <h1>Unauthorized, please <Link to="/auth/signin">Sign In</Link></h1>
    )
  }
}

export default ProtectedRoute;
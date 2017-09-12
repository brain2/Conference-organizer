import {combineReducers} from 'redux';
import {routerReducer as router} from 'react-router-redux';
import {reducer as form} from 'redux-form';
import authReducer, {moduleName as authModule, SIGN_IN_SUCCESS} from '../ducks/auth';
import peopleReducer, {moduleName as peopleModule} from '../ducks/people';
import eventsReducer, {moduleName as eventsModule} from '../ducks/events';

export default combineReducers({
  router,
  form: form.plugin({
    [authModule]: (state, action) => {
      switch (action.type) {
        case SIGN_IN_SUCCESS: return undefined;
        default: return state;
      }
    }
  }),
  [authModule]: authReducer,
  [peopleModule]: peopleReducer,
  [eventsModule]: eventsReducer
})
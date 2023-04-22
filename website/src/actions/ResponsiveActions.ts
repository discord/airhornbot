import Constants from '../Constants';
import dispatcher from '../dispatcher';

export function resize() {
  dispatcher.dispatch({
    type: Constants.Event.RESPONSIVE_RESIZE,
  });
}

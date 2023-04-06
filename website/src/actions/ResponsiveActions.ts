import dispatcher from '../dispatcher';
import Constants from '../Constants';

export function resize() {
  dispatcher.dispatch({
    type: Constants.Event.RESPONSIVE_RESIZE,
  });
}

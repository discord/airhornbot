import dispatcher from '../dispatcher';
import Constants from '../Constants';

export function withFacebook() {
  dispatcher.dispatch({
    type: Constants.Event.SHARE_WITH_FACEBOOK,
  });
}

export function withTwitter() {
  dispatcher.dispatch({
    type: Constants.Event.SHARE_WITH_TWITTER,
  });
}

import Constants from '../Constants';
import dispatcher from '../dispatcher';

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

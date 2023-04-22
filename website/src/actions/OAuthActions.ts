import Constants from '../Constants';
import dispatcher from '../dispatcher';

export function start() {
  dispatcher.dispatch({
    type: Constants.Event.OAUTH_START,
  });
}

export function end() {
  dispatcher.dispatch({
    type: Constants.Event.OAUTH_END,
  });
}

export function playedVideo() {
  dispatcher.dispatch({
    type: Constants.Event.OAUTH_PLAYED_VIDEO,
  });
}

export function redirectedFromOAuth(addedBot: boolean) {
  dispatcher.dispatch({
    type: Constants.Event.OAUTH_REDIRECTED_FROM,
    addedBot: addedBot,
  });
}

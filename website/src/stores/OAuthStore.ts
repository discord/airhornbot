import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import queryString from 'query-string';
import Constants from '../Constants';

let shouldPlayVideo = false;
let onMessage;

class OAuthStore extends EventEmitter {
  constructor() {
    super();

    const keyToSuccess = queryString.parse(window.location.search).key_to_success;
    if (keyToSuccess == '1') {
      this.redirectedFromOAuth(true);
    } else if (keyToSuccess == '0') {
      this.redirectedFromOAuth(false);
    }
  }

  startOAuth() {
    shouldPlayVideo = false;
    window.removeEventListener('message', onMessage);
    window.open('/login', '', 'height=800, width=500');
    onMessage = this.onMessage.bind(this);
    window.addEventListener('message', onMessage);
    this.emit('change');
  }

  onMessage({ data }: { data: string }) {
    if (data == Constants.Message.OAUTH_ADDED) {
      this.endOAuth();
    }
  }

  endOAuth() {
    window.removeEventListener('message', onMessage);
    shouldPlayVideo = true;
    this.emit('change');
  }

  redirectedFromOAuth(addedBot: boolean) {
    if (addedBot && window.opener) {
      window.opener.postMessage(Constants.Message.OAUTH_ADDED, '*');
    }

    window.close();
  }

  playedVideo() {
    shouldPlayVideo = false;
    this.emit('change');
  }

  shouldPlayVideo(): boolean {
    return shouldPlayVideo;
  }

  handle({ type, addedBot }: { type: string; addedBot: boolean }) {
    switch (type) {
      case Constants.Event.OAUTH_START: {
        this.startOAuth();
        break;
      }
      case Constants.Event.OAUTH_END: {
        this.endOAuth();
        break;
      }
      case Constants.Event.OAUTH_PLAYED_VIDEO: {
        this.playedVideo();
        break;
      }
      case Constants.Event.OAUTH_REDIRECTED_FROM: {
        this.redirectedFromOAuth(addedBot);
        break;
      }
    }
  }
}

const oAuthStore = new OAuthStore();

dispatcher.subscribe(oAuthStore.handle.bind(oAuthStore));

export default oAuthStore;

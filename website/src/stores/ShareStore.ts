import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import Constants from '../Constants';

class ShareStore extends EventEmitter {
  shareWithFacebook() {
    this.open(Constants.Social.URL_FACEBOOK);
  }

  shareWithTwitter() {
    this.open(Constants.Social.URL_TWITTER);
  }

  open(url: string) {
    window.open(url, '', 'height=500, width=500');
  }

  handle({ type }) {
    switch (type) {
      case Constants.Event.SHARE_WITH_FACEBOOK: {
        this.shareWithFacebook();
        break;
      }
      case Constants.Event.SHARE_WITH_TWITTER: {
        this.shareWithTwitter();
        break;
      }
    }
  }
}

const shareStore = new ShareStore();

dispatcher.subscribe(shareStore.handle.bind(shareStore));

export default shareStore;

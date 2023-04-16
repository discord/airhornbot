import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import Constants from '../Constants';

class ShareStore extends EventEmitter {
  constructor() {
    super();
    this.shareWithFacebook = this.shareWithFacebook.bind(this);
    this.shareWithTwitter = this.shareWithTwitter.bind(this);
    this.open = this.open.bind(this);
  }

  shareWithFacebook() {
    this.open(Constants.Social.URL_FACEBOOK);
  }

  shareWithTwitter() {
    this.open(Constants.Social.URL_TWITTER);
  }

  open(url) {
    window.open(url, '', 'height=500, width=500');
  }

  handleAction(action) {
    switch (action.type) {
      case Constants.Event.SHARE_WITH_FACEBOOK:
        this.shareWithFacebook();
        break;
      case Constants.Event.SHARE_WITH_TWITTER:
        this.shareWithTwitter();
        break;
      default:
        break;
    }
  }
}

const shareStore = new ShareStore();
dispatcher.register(shareStore.handleAction.bind(shareStore));

export default shareStore;

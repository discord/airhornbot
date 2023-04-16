import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import queryString from 'query-string';
import Constants from '../Constants';

// Initialize variables
let shouldPlayVideo = false;
let onMessage;

class OAuthStore extends EventEmitter {
  constructor() {
    super();

    // Check if redirected from OAuth
    const keyToSuccess = queryString.parse(window.location.search).key_to_success;
    if (keyToSuccess == '1') {
      this.redirectedFromOAuth(true); // User successfully added bot
    } else if (keyToSuccess == '0') {
      this.redirectedFromOAuth(false); // User failed to add bot
    }
  }

  // Start OAuth process
  startOAuth() {
    shouldPlayVideo = false;
    window.removeEventListener('message', onMessage);
    window.open('/login', '', 'height=800, width=500'); // Open login page in new window
    onMessage = this.onMessage.bind(this);
    window.addEventListener('message', onMessage); // Listen for messages from login page
    this.emit('change'); // Emit change event
  }

  // Handle message from login page
  onMessage({ data }: { data: string }) {
    if (data == Constants.Message.OAUTH_ADDED) { // Bot added successfully
      this.endOAuth();
    }
  }

  // End OAuth process
  endOAuth() {
    window.removeEventListener('message', onMessage);
    shouldPlayVideo = true;
    this.emit('change'); // Emit change event
  }

  // Redirect from OAuth process
  redirectedFromOAuth(addedBot: boolean) {
    if (addedBot && window.opener) {
      window.opener.postMessage(Constants.Message.OAUTH_ADDED, '*'); // Send message to parent window
    }

    window.close(); // Close current window
  }

  // Video played
  playedVideo() {
    shouldPlayVideo = false;
    this.emit('change'); // Emit change event
  }

  // Check if video should play
  shouldPlayVideo(): boolean {
    return shouldPlayVideo;
  }

  // Handle actions
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

// Subscribe to dispatcher
dispatcher.subscribe(oAuthStore.handle.bind(oAuthStore));

export default oAuthStore;

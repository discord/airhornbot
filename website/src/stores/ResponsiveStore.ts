import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import * as ResponsiveActions from '../actions/ResponsiveActions';
import Constants from '../Constants';

class ResponsiveStore extends EventEmitter {
  constructor() {
    super();

    // Add event listener for window resize event
    window.addEventListener('resize', () => {
      ResponsiveActions.resize();
    });
  }

  /**
   * Emits a change event.
   */
  onResize() {
    this.emit('change');
  }

  /**
   * Determines whether the viewport is a mobile device.
   * @returns {boolean} Whether the viewport is a mobile device.
   */
  isMobile(): boolean {
    return window.matchMedia(`(max-width: ${Constants.MediaQuery.PHONE}px)`).matches;
  }

  /**
   * Handles the dispatched action.
   * @param {object} payload The dispatched action payload.
   */
  handle(payload: { type: string }) {
    switch (payload.type) {
      case Constants.Event.RESPONSIVE_RESIZE: {
        this.onResize();
        break;
      }
      default: {
        // Do nothing
      }
    }
  }
}

const responsiveStore = new ResponsiveStore();

// Bind the handle method to the store instance and subscribe to the dispatcher
dispatcher.subscribe(responsiveStore.handle.bind(responsiveStore));

// Export the store instance as the default export
export default responsiveStore;

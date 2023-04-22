import { EventEmitter } from 'events';
import Constants from '../Constants';
import * as ResponsiveActions from '../actions/ResponsiveActions';
import dispatcher from '../dispatcher';

class ResponsiveStore extends EventEmitter {
  constructor() {
    super();
    window.addEventListener('resize', ResponsiveActions.resize);
  }

  onResize() {
    this.emit('change');
  }

  isMobile(): boolean {
    return window.matchMedia(`(max-width: ${Constants.MediaQuery.PHONE}px)`).matches;
  }

  handle({ type }: { type: string }) {
    switch (type) {
      case Constants.Event.RESPONSIVE_RESIZE: {
        this.onResize();
        break;
      }
    }
  }
}

const responsiveStore = new ResponsiveStore();

dispatcher.subscribe(responsiveStore.handle.bind(responsiveStore));

export default responsiveStore;

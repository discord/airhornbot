/* This is a lightweight reimplementation of the dispatcher from Flux.
 *
 * Flux no longer works with the latest React versions.
 */
import { EventEmitter } from 'events';

class Dispatcher extends EventEmitter {
  subscribe(listener) {
    this.on('dispatched', listener);
  }

  dispatch(data: unknown) {
    this.emit('dispatched', data);
  }
}

export default new Dispatcher();

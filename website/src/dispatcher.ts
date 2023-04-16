/* This is a lightweight reimplementation of the dispatcher from Flux.
 *
 * Flux no longer works with the latest React versions.
 */
import { EventEmitter } from 'events';

class Dispatcher extends EventEmitter {
  constructor() {
    super();
    this.callbacks = [];
  }

  register(callback) {
    this.callbacks.push(callback);
    return this.callbacks.length - 1;
  }

  unregister(id) {
    this.callbacks.splice(id, 1);
  }

  dispatch(action) {
    this.callbacks.forEach((callback) => {
      callback(action);
    });
  }
}

export default new Dispatcher();

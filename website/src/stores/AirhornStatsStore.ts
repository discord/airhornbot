import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import Constants from '../Constants';
import { MessageEventData } from '../declarations/EventSource';

let count = 0;
let uniqueUsers = 0;
let uniqueGuilds = 0;
let uniqueChannels = 0;
let shouldShowStatsPanel = false;

class AirhornStatsStore extends EventEmitter {
  constructor() {
    super();

    if (EventSource) {
      let eventSource = new EventSource('/api/events');
      eventSource.onmessage = this.receivedMessage.bind(this);
    }
  }

  fakeData() {
    setInterval(() => {
      let countRnd = Math.random();
      let uniqueUsersRnd = Math.random();
      let uniqueGuildsRnd = Math.random();
      let uniqueChannelsRnd = Math.random();

      this.receivedMessage({
        data: JSON.stringify({
          total: countRnd > 0.001 ? count + 1 : count,

          unique_users: uniqueUsersRnd > 0.8 || uniqueUsers <= uniqueChannels ? Number.parseInt(`${uniqueUsers}`) + 1 : uniqueUsers,

          unique_guilds: uniqueGuildsRnd > 0.95 || uniqueGuilds == 0 ? Number.parseInt(`${uniqueGuilds}`) + 1 : uniqueGuilds,

          unique_channels:
            uniqueChannelsRnd > 0.9 || uniqueChannels == 0 || uniqueChannels <= uniqueGuilds
              ? Number.parseInt(`${uniqueChannels}`) + 1
              : uniqueChannels,
        }),
      });
    }, 1000);
  }

  receivedMessage(event) {
    let data: MessageEventData = JSON.parse(event.data);
    count = data.total || 0;
    uniqueUsers = data.unique_users || 0;
    uniqueGuilds = data.unique_guilds || 0;
    uniqueChannels = data.unique_channels || 0;
    this.emit('change');
  }

  showStatsPanel() {
    shouldShowStatsPanel = true;
    this.emit('change');
  }

  hideStatsPanel() {
    shouldShowStatsPanel = false;
    this.emit('change');
  }

  toggleStatusPanel() {
    shouldShowStatsPanel = !shouldShowStatsPanel;
    this.emit('change');
  }

  getCount(): number {
    return count;
  }

  getUniqueUsers(): number {
    return uniqueUsers;
  }

  getUniqueGuilds(): number {
    return uniqueGuilds;
  }

  getUniqueChannels(): number {
    return uniqueChannels;
  }

  shouldShowStatsPanel(): boolean {
    return shouldShowStatsPanel;
  }

  handle({ type }: { type: string }) {
    switch (type) {
      case Constants.Event.STATS_PANEL_SHOW: {
        this.showStatsPanel();
        break;
      }

      case Constants.Event.STATS_PANEL_HIDE: {
        this.hideStatsPanel();
        break;
      }

      case Constants.Event.STATS_PANEL_TOGGLE: {
        this.toggleStatusPanel();
        break;
      }
    }
  }
}

const airhornStatsStore = new AirhornStatsStore();

dispatcher.subscribe(airhornStatsStore.handle.bind(airhornStatsStore));

export default airhornStatsStore;

import Constants from '../Constants';
import dispatcher from '../dispatcher';

export function showStatsPanel() {
  dispatcher.dispatch({
    type: Constants.Event.STATS_PANEL_SHOW,
  });
}

export function hideStatsPanel() {
  dispatcher.dispatch({
    type: Constants.Event.STATS_PANEL_HIDE,
  });
}

export function toggleStatsPanel() {
  dispatcher.dispatch({
    type: Constants.Event.STATS_PANEL_TOGGLE,
  });
}

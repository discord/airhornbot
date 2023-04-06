import dispatcher from '../dispatcher';
import Constants from '../Constants';

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

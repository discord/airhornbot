import createReactClass from 'create-react-class';
import numeral from 'numeral';
import * as StatsActions from '../actions/StatsActions';
import * as ShareActions from '../actions/ShareActions';
import '../stores/ShareStore';
import Constants from '../Constants';

const Footer = createReactClass({
  render() {
    const { count, changeCount, showStatsPanel, statsHasBeenShown } = this.props;

    let statsBtnClasses = 'crossfade';

    if (statsHasBeenShown) {
      if (showStatsPanel) {
        statsBtnClasses += ' two';
      } else {
        statsBtnClasses += ' two-reverse';
      }
    }

    let statsBtn2Classes = 'crossfade';

    if (statsHasBeenShown) {
      if (showStatsPanel) {
        statsBtn2Classes += ' three';
      } else {
        statsBtn2Classes += ' three-reverse';
      }
    }

    let toolTip = 'Click for more Stats';
    if (showStatsPanel) {
      toolTip = '';
    }

    return (
      <div className="footer">
        <div className="airhorn-count">
          <div className="stats-toggler" onClick={StatsActions.toggleStatsPanel}>
            <div className="airhorn-count-content">
              <img src={Constants.Image.AIRHORN_COUNTER} />
              <div className="count-text">
                <div className={`count ${changeCount ? 'count-big' : ''}`}>{numeral(count).format('0,0')}</div>
                <div className="and-counting">and counting</div>
              </div>
            </div>
            <div className="stats-btn">
              <img src={Constants.Image.ICON_CLOSE} className={statsBtn2Classes} onClick={StatsActions.hideStatsPanel} />
              <img src={Constants.Image.ICON_ABOUT} className={statsBtnClasses} data-tip={toolTip} />
            </div>
          </div>
        </div>
        <div className="main-text">
          <span className="normal-text">Open sourced by the team at Discord. Contribute yourself on&nbsp;</span>
          <a href={Constants.GITHUB_URL}>GitHub</a>
          <a href={Constants.GITHUB_URL} className="arrow">
            &nbsp;➔
          </a>
        </div>
        <div className="social">
          <img src={Constants.Image.ICON_TWITTER} onClick={ShareActions.withTwitter} />
          <img src={Constants.Image.ICON_FACEBOOK} onClick={ShareActions.withFacebook} />
        </div>
      </div>
    );
  },
});

export default Footer;

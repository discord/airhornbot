import createReactClass from 'create-react-class';
import { BrowserInfo } from 'detect-browser';
import Parallax from 'parallax-js';
import ReactDOM from 'react-dom';
import { Tooltip } from 'react-tooltip';
import Constants from '../Constants';
import AirhornStatsStore from '../stores/AirhornStatsStore';
import '../style/style.styl';
import Cloud from './Cloud';
import Content from './Content';
import Footer from './Footer';
import StatsPanel from './StatsPanel';
import IslandDoubleTree from './islands/IslandDoubleTree';
import IslandForest from './islands/IslandForest';
import IslandLog from './islands/IslandLog';
import IslandPond from './islands/IslandPond';
import IslandShrooms from './islands/IslandShrooms';
import IslandSmall from './islands/IslandSmall';
import IslandTent from './islands/IslandTent';
import IslandTree from './islands/IslandTree';
import IslandTrees from './islands/IslandTrees';

const REF_PARALLAX = 'PARALLAX_REF';
const REF_SMALL_ISLANDS = 'SMALL_ISLANDS_REF';
const REF_LARGE_ISLANDS = 'LARGE_ISLANDS_REF';
const REF_FOOTER = 'FOOTER_REF';

type State = {
  count: number;
  uniqueUsers: number;
  uniqueGuilds: number;
  uniqueChannels: number;
  showStats: boolean;
  statsHasBeenShown: boolean;
  changeCount: boolean;
  pausedSmallIslands: Array<boolean>;
  pausedLargeIslands: Array<boolean>;
  footerHeight: number;
};

let changeCountTimeout: NodeJS.Timeout;

function isVisible(el): boolean {
  const rect = el.getBoundingClientRect();
  return (
    ((rect.top >= -20 && rect.top <= window.innerHeight) || (rect.bottom >= -20 && rect.bottom <= window.innerHeight)) &&
    ((rect.left >= -20 && rect.left <= window.innerWidth) || (rect.right >= -20 && rect.right <= window.innerWidth))
  );
}

const Layout = createReactClass({
  getInitialState(): State {
    const pausedLargeIslands = [false];
    const pausedSmallIslands = [];

    for (let i = 0; i < Constants.SMALL_ISLAND_COUNT; i++) {
      pausedSmallIslands.push(false);
    }

    for (let i = 0; i < Constants.LARGE_ISLAND_COUNT; i++) {
      pausedLargeIslands.push(false);
    }

    return {
      count: 0,
      uniqueUsers: 0,
      uniqueGuilds: 0,
      uniqueChannels: 0,
      showStats: false,
      statsHasBeenShown: false,
      changeCount: false,
      pausedLargeIslands,
      pausedSmallIslands,
      footerHeight: 80,
    };
  },

  componentWillMount() {
    AirhornStatsStore.on('change', this.updateStats);
    // fix issue where the stats panel will be partly under the footer - unknown as to why this happens, it didn't happen on the old site version
    AirhornStatsStore.on('change', this.resized);
    window.addEventListener('resize', this.resized);
  },

  componentDidMount() {
    new Parallax(this.refs[REF_PARALLAX]);
    setTimeout(() => this.resized(), 100);
  },

  resized() {
    const pausedSmallIslands = [];
    for (let i = 0; i < Constants.SMALL_ISLAND_COUNT; i++) {
      const visible = isVisible(this.refs[REF_SMALL_ISLANDS].children[i]);
      pausedSmallIslands.push(!visible);
    }

    const pausedLargeIslands = [];
    for (let i = 0; i < Constants.LARGE_ISLAND_COUNT; i++) {
      const visible = isVisible(this.refs[REF_LARGE_ISLANDS].children[i]);
      pausedLargeIslands.push(!visible);
    }

    const footerHeight = (ReactDOM.findDOMNode(this.refs[REF_FOOTER]) as Element).getBoundingClientRect().height;

    this.setState({
      pausedSmallIslands,
      pausedLargeIslands,
      footerHeight,
    });
  },

  updateStats() {
    this.setState({
      count: AirhornStatsStore.getCount(),
      uniqueUsers: AirhornStatsStore.getUniqueUsers(),
      uniqueGuilds: AirhornStatsStore.getUniqueGuilds(),
      uniqueChannels: AirhornStatsStore.getUniqueChannels(),
      showStats: AirhornStatsStore.shouldShowStatsPanel(),
      statsHasBeenShown: this.state.statsHasBeenShown || AirhornStatsStore.shouldShowStatsPanel(),
      changeCount: this.state.count != AirhornStatsStore.getCount(),
    });

    clearTimeout(changeCountTimeout);
    changeCountTimeout = setTimeout(this.finishChangeCountAnimation, Constants.Animation.COUNT_CHANGE_TIME);
  },

  finishChangeCountAnimation() {
    this.setState({
      changeCount: false,
    });
  },

  render() {
    const smallIslands = [];
    for (let i = 0; i < Constants.SMALL_ISLAND_COUNT; i++) {
      const type = i % Constants.UNIQUE_SMALL_ISLAND_COUNT;
      smallIslands.push(<IslandSmall number={i} type={type} key={i} paused={this.state.pausedSmallIslands[i]} />);
    }

    const clouds = [];
    for (let i = 0; i < Constants.CLOUD_COUNT; i++) {
      const type = i % Constants.UNIQUE_CLOUD_COUNT;
      clouds.push(<Cloud cloudNumber={i} cloudType={type} key={i} />);
    }

    let toolTip;
    if (!this.state.showStats) {
      toolTip = <Tooltip className="tool-tip" place="top" offset={-8} />;
    }

    return (
      <div className={`container ${BrowserInfo.name}`}>
        <Content />

        <div ref={REF_LARGE_ISLANDS}>
          <IslandPond paused={this.state.pausedLargeIslands[0]} />
          <IslandTree paused={this.state.pausedLargeIslands[1]} />
          <IslandTrees paused={this.state.pausedLargeIslands[2]} />
          <IslandTent paused={this.state.pausedLargeIslands[3]} />
          <IslandDoubleTree paused={this.state.pausedLargeIslands[4]} />
          <IslandForest paused={this.state.pausedLargeIslands[5]} number={0} />
          <IslandForest paused={this.state.pausedLargeIslands[6]} number={1} />
          <IslandLog paused={this.state.pausedLargeIslands[7]} />
          <IslandShrooms paused={this.state.pausedLargeIslands[8]} number={0} />
          <IslandShrooms paused={this.state.pausedLargeIslands[9]} number={1} />
        </div>

        <div ref={REF_SMALL_ISLANDS}>{smallIslands}</div>

        <div id="parallax" ref={REF_PARALLAX}>
          {clouds}
        </div>

        <StatsPanel
          show={this.state.showStats}
          count={this.state.count}
          uniqueUsers={this.state.uniqueUsers}
          uniqueGuilds={this.state.uniqueGuilds}
          uniqueChannels={this.state.uniqueChannels}
          hasBeenShown={this.state.statsHasBeenShown}
          bottom={this.state.footerHeight}
        />
        <Footer
          ref={REF_FOOTER}
          count={this.state.count}
          changeCount={this.state.changeCount}
          showStatsPanel={this.state.showStats}
          statsHasBeenShown={this.state.statsHasBeenShown}
        />
        {toolTip}
      </div>
    );
  },
});

export default Layout;

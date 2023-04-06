import createReactClass from 'create-react-class';
import OAuthStore from '../stores/OAuthStore';
import ResponsiveStore from '../stores/ResponsiveStore';
import * as OAuthActions from '../actions/OAuthActions';
import Constants from '../Constants';

type State = {
  isMobile: boolean;
  showVideo: boolean;
};

const Content = createReactClass({
  getInitialState(): State {
    return {
      isMobile: ResponsiveStore.isMobile(),
      showVideo: false,
    };
  },

  componentWillMount() {
    OAuthStore.on('change', this.checkToPlayVideo);
    ResponsiveStore.on('change', this.setSize);
  },

  checkToPlayVideo() {
    if (OAuthStore.shouldPlayVideo()) {
      this.playVideo();
    }
  },

  playVideo() {
    this.refs.video.currentTime = 0;
    this.refs.audio.currentTime = 0;
    this.refs.video.play();
    this.refs.audio.play();
    setTimeout(OAuthActions.playedVideo, Constants.VIDEO_LENGTH);
  },

  setSize() {
    this.setState({
      isMobile: ResponsiveStore.isMobile(),
    });
  },

  getCenter() {
    if (this.state.isMobile) {
      return <img className="video-airhorn" src={Constants.Image.ISLAND_AIRHORN_MOBILE} />;
    } else {
      return (
        <video preload="" className="video-airhorn" ref="video" onClick={this.playVideo}>
          <source src={Constants.Video.AIRHORN} type="video/mp4" />
          <source src={Constants.Video.AIRHORN_OGV} type="video/ogg; codecs=theora, vorbis" />
          <source src={Constants.Video.AIRHORN_WEBM} type="video/webm; codecs=vp8, vorbis" />
          <audio preload="" src={Constants.Audio.AIRHORN} ref="audio" />
        </video>
      );
    }
  },

  render() {
    return (
      <div className="content">
        <div className="shadow">
          <h1 className="title">/airhorn</h1>
          <p className="message">
            The only bot for <a href={Constants.DISCORD_URL}>Discord</a> you'll ever need
          </p>
        </div>
        {this.getCenter()}
        <a className="add-btn" href={Constants.DISCORD_OAUTH2_ADD_URL}>
          Add to Discord
        </a>
      </div>
    );
  },
});

export default Content;

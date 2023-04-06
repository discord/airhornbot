import Constants from '../Constants';

const ResizeableSVG = {
  checkMediaQuery(): boolean {
    return window.matchMedia(`(max-width: ${Constants.MediaQuery.PHONE}px)`).matches;
  },

  componentDidMount() {
    window.addEventListener('resize', this.update);
  },

  update() {
    this.forceUpdate();
  },

  getViewBox(width: number, height: number): string {
    if (this.checkMediaQuery()) {
      return `0 0 ${width * 2} ${height * 2}`;
    } else {
      return `0 0 ${width} ${height}`;
    }
  },
};

export default ResizeableSVG;

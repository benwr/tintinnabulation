var bell_sounds = require("./bell_sounds");
PlayBells = React.createClass({
  getInitialState: function () {
    return {
      index: 0,
      active: true,
      timeout: null,
    };
  },
  nextNote: function () {
    if (this.state.active) {
      bell_sounds.ring_bell(this.props.freqs[this.props.line[this.state.index]], 1500 / this.props.speed);
      console.log(" Would set");
      var timeout = setTimeout(this.nextNote, 4000 / this.props.speed);
      if (this.state.index === this.props.line.length - 1) this._advanceRow();
      this.setState({index: (this.state.index + 1) % this.props.line.length, timeout: timeout});
    }
  },
  getDefaultProps: function () {
    return {
      speed: 20,
      freqs: {
        "1": 440,    // A
        "2": 415.3,  // G#
        "3": 369.99, // F#
        "4": 329.63, // E
        "5": 293.66, // D
        "6": 277.18, // C#
        "7": 246.94, // B
        "8": 220,    // A
        "9": 207.65, // G#
        "0": 185, // F#
        "E": 164.81, // E
        "T": 146.83, // D
        "A": 138.59, // C#
        "B": 123.47, // B
        "C": 110, // A
        "D": 103.83, // G#
      },
      line: ["1", "2", "3", "4", "5", "6", "7", "8"],
    };
  },
  render: function () {
    if (this.state.timeout === null) {
      setTimeout(this.nextNote, 5 * 1000);
    }
    return <div />;
  },
});
module.exports = PlayBells;

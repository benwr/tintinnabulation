/* global require */
/* global module */

var React = require('react');
var BellIcon = require('./bell_icon');
var PlayBells = require('./play_bells');
var Places = require('./places');

var Bell = React.createClass({
  render: function () {
    return <BellIcon />;
  },
});

var Overlay = React.createClass({
  getDefaultProps: function () {
    return {
      bells: "12",
    };
  },

  getInitialState: function () {
    return {"locations" : {}};
  },

  render: function () {
    var overlay = this;

    var follows = this.props.bells.split("");

    var makeSegments = function (index) {
      var segments = [];
      if (!overlay.state.locations[index]) return [];
      var points = overlay.state.locations[index];
      var last = [];
      points.forEach(function (p, i) {
        if (i === 0) {
          last = p;
        } else {
          segments.push([last, p, index]);
          last = p;
        }
      });
      return segments;
    };

    var drawSegment = function (s, i) {
      var left = Math.min(s[0][0], s[1][0]);
      var top = Math.min(s[0][1], s[1][1]);
      var width = Math.max(s[0][0], s[1][0]) - left;
      var height = Math.max(s[0][1], s[1][1]) - top;
      var line_length = Math.sqrt(width * width + height * height) - 0.8;
      var deg = Math.atan2(height, width) * (180 / Math.PI) - 90;
      if (s[0][0] > s[1][0]) {
        deg = 360 - deg;
        left = left + width;
      }
      var color = Places.bell_colors[Places.inverse_bell_names[s[2]]];
      minilines.push(<div key={"" + s[0][0] + i} style={{
                                                        position: "absolute",
                                                        left: left,
                                                        top: top,
                                                        width: 0,
                                                        height: line_length,
                                                        transform: "rotate(" + deg + "deg)",
                                                        transformOrigin: "top left",
                                                        border: "0.05em solid " + color,
                                                        background: color,
                                                        }} />);
    };
    
    var minilines = [];
    follows.forEach(function (val) {
      makeSegments(val).forEach(drawSegment);
    });
    
    return <div style={{position: "static"}}>
    {minilines}
    </div>;
  },
});


var Diagram = React.createClass({
  getDefaultProps: function () {
    return {follow: "12"};
  },

  resize: function () {
    this.forceUpdate();
  },

  componentDidMount: function () {
    window.addEventListener("resize", this.resize);
  },

  componentWillUnmount: function () {
    window.removeEventListener("resize", this.resize);
  },

  render: function() {
    var diagram = this;
    diagram.locations = null;
    var changes = Places.lex_place_notation(this.props.method);

    var follows = this.props.follow.split("");


    var line_coords = {};
    follows.forEach(function (bell) {
      line_coords[bell] = [];
    });
    
    var bell_divs = [];
    var layout_row = function (row) {
      bell_divs.push([]);
      var bells = [];
      row.forEach(
        function (bell, i) {
          var ref = function (td) {
            if (follows.includes(bell) && td !== null) {
              line_coords[bell].push([td.offsetLeft + (td.offsetWidth / 2),
                                      td.offsetTop + (td.offsetHeight / 2)]);
            }
          };
          bells.push(<td style={{minWidth: "0.8em", border: "none", padding:"0", margin:"0"}} key={i} ref={ref}>{bell}</td>);
        }
      );
      return bells;
    };

    var current = this.props.row.split("");

    var rows_before = parseInt(this.props.rows_before);
    var rows_after = parseInt(this.props.rows_after);
    var rows = Places.method_segment(changes, current, rows_before, rows_after, this.props.index);

    var i;
    var result_rows = [];
    for (i = 0; i < rows_before; i++) {
      result_rows.push(<tr style={{color: "grey"}} key={i}>{layout_row(rows[i])}</tr>);
    }
    result_rows.push(<tr style={{backgroundColor: "#ccc", border: "none", padding: "0", margin:"0", borderCollapse: "collapse"}} key="special">{layout_row(rows[rows_before])}</tr>);
    for (i = 0; i < rows_after; i++) {
      result_rows.push(<tr key={i + rows_before + 1}>{layout_row(rows[i + rows_before + 1])}</tr>);
    }

    return (
      <div style={{width: "100%", textAlign: "center", fontSize: "1.4em", fontFamily: "Helvetica"}}>
        <div style={{margin: "0 auto", display: "inline-block",position: "relative", textAlign: "center"}}>
          <table style={{borderSpacing: "0"}}>
            <tbody>{result_rows}</tbody>
          </table>
          <Overlay bells={this.props.follow} ref={function (c) {if (c) c.setState({locations: line_coords});}} />
        </div>
      </div>
    );
  },
});


var Bells = React.createClass({
  getDefaultProps: function () {
    return {
      initial_num: 8,
    };
  },

  getInitialState: function () {
    var start_row = [];

    for (var i = 0; i < this.props.initial_num; i++) {
      start_row.push(Places.bell_names[i]);
    }
    return {method: "x18x18x18x18 le:12",
            attempted_method: "x18x18x18x18 le:12",
            follow: "12",
            num: this.props.initial_num,
            row: start_row,
            index: 0,
            attempted_num: "8",
            valid: true,
    };
  },

  handleMethodChange: function (event) {
    var changes = Places.lex_place_notation(event.target.value);
    if (Places.changes_valid(changes, parseInt(this.state.num))) {
      this.setState({
        attempted_method: event.target.value,
        method: event.target.value,
        num: this.state.attempted_num,
        valid: true,
      });
    } else {
      this.setState({
        attempted_method: event.target.value,
        valid: false,
      });
    }
  },

  handleFollowChange: function (event) {
    this.setState({follow: event.target.value});
  },

  handleNumChange: function (event) {
    var changes = Places.lex_place_notation(this.state.attempted_method);
    if (Places.changes_valid(changes, parseInt(event.target.value))) {
      this.setState({num: event.target.value,
                     attempted_num: event.target.value,
                     valid: true,
      });
    } else {
      this.setState({
        attempted_num: event.target.value,
        valid: false,
      });
    }
  },

  advanceRow: function () {
    var changes = Places.lex_place_notation(this.state.method);
    this.setState({
      row: Places.next_permutation(this.state.row, changes, this.state.index),
      index: this.state.index + 1,
    });
  },

  reset: function () {
    var start_row = [];
    for (var i = 0; i < this.state.num; i++) {
      start_row.push(Places.bell_names[i]);
    }
    this.setState({index: 0, row: start_row});
  },

  render: function () {
    var bells = this;
    var bell_list = [];
    /*
       for (var i = 0; i < this.props.number; i++) {
       bell_list.push(
       <li style={{listStyleType: "None"}} key={i} id={"bell_" + i}>
       <Bell />
       </li>
       );
       }
     */

    var method_background;
    if (this.state.valid) {
      method_background = "inherit";
    } else {
      method_background = "#f99";
    }


    return (
      <div id="bells" style={{textAlign: "center"}}>
        <div id="inputs" style={{display: "inline-block", textAlign: "right", margin: "0 auto"}}>
          <table style={{margin: "1em"}}>
            <tbody>
              <tr>
                <td style={{textAlign: "right"}}>Number of bells:</td>
                <td style={{textAlign: "left"}}><input style={{textAlign: "center",
                                                               width: "10em",
                                                               marginLeft: "0.5em",
                                                               border: "none",
                                                               borderBottom: "1px dashed black",
                                                               fontFamily: "inherit",
                                                               fontSize: "inherit",
                                                               background: "inherit"}}
                                                       type="text"
                                                       value={this.state.attempted_num}
                                                       onChange={this.handleNumChange} /></td>
              </tr>
              <tr>
                <td style={{textAlign: "right"}}>Place notation:</td>
                <td style={{textAlign: "left"}}><input style={{backgroundColor: method_background,
                                                               textAlign: "center",
                                                               width: "10em",
                                                               marginLeft: "0.5em",
                                                               border: "none",
                                                               borderBottom: "1px dashed black",
                                                               fontFamily: "inherit",
                                                               fontSize: "inherit"}}
                                                       type="text"
                                                       value={this.state.attempted_method}
                                                       onChange={this.handleMethodChange} /></td>
              </tr>
              <tr>
                <td style={{textAlign: "right"}}>Controlled bells:</td>
                <td style={{textAlign: "left"}}><input style={{textAlign: "center",
                                                               width: "10em",
                                                               marginLeft: "0.5em",
                                                               border: "none",
                                                               borderBottom: "1px dashed black",
                                                               fontFamily: "inherit",
                                                               fontSize: "inherit",
                                                               background: "inherit"}}
                                                       type="text"
                                                       value={this.state.follow}
                                                       onChange={this.handleFollowChange} /></td>
              </tr>
            </tbody>
          </table>
          <Diagram rows_before="2"
                   follow={this.state.follow.toUpperCase()}
                   rows_after="6"
                   row={this.state.row.join("").toUpperCase()}
                   index={this.state.index}
                   method={this.state.method} />
          <ul style={{padding: "0", margin: "0 0"}}>{bell_list}</ul>
          <PlayBells line={this.state.row}
                     speed={10}
                     ref={
                          function (c) {
                            if (c) {
                              c._advanceRow = bells.advanceRow;
                              c._reset = bells.reset;
                            }
                          }
                     } />
        </div>
      </div>
    );
  },
});

module.exports = [Bells, Diagram, Places];

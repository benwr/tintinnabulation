/* global require */
/* global module */

var React = require('react');
var BellIcon = require('./bell_icon');
var PlayBells = require('./play_bells');
var Places = require('./places');

Bell = React.createClass({
  render: function () {
    return <BellIcon />;
  }
});

Overlay = React.createClass({
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
      index = index;
      if (!overlay.state.locations[index]) return [];
      var points = overlay.state.locations[index];
      last = [];
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


Diagram = React.createClass({
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
    index = parseInt(this.props.index);

    follows = this.props.follow.split("");


    var line_coords = {};
    follows.forEach(function (bell) {
      line_coords[bell] = [];
    });
    
    var bell_divs = [];
    var layout_row = function (row) {
      bell_divs.push([]);
      var rownum = bell_divs.length - 1;
      var bells = [];
      row.forEach(
        function (bell, i) {
          var ref = function (td) {
            if (follows.includes(bell) && td !== null) {
              line_coords[bell].push([td.offsetLeft + (td.offsetWidth / 2),
                                      td.offsetTop + (td.offsetHeight / 2)]);
            }
          };
          bells.push(<td style={{border: "none", padding:"0", margin:"0"}} key={i} ref={ref}>{bell}</td>);
        }
      );
      return bells;
    };

    var current = this.props.row.split("");

    var rows_before = parseInt(this.props.rows_before);
    var rows_after = parseInt(this.props.rows_after);
    rows = Places.method_segment(changes, current, rows_before, rows_after);

    result_rows = [];
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


Bells = React.createClass({
  getInitialState: function () {
    return {method: "x18x18x18x18 le:12",
            attempted_method: "x18x18x18x18 le:12",
            follow: "12",
            num: "8",
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

  render: function () {
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

    var start_row = [];

    for (i = 0; i < this.state.num; i++) {
      start_row.push(Places.bell_names[i]);
    }

    if (this.state.valid) {
      method_background = "white";
    } else {
      method_background = "#f99";
    }


    return (
      <div id="bells" style={{textAlign: "center"}}>
        <div id="inputs" style={{display: "inline-block", textAlign: "center", margin: "0 auto"}}>
            Number of bells:<br />
            <input style={{width: 100}}  type="text" value={this.state.attempted_num} onChange={this.handleNumChange} /><br />
                Place notation:<br />
                <input style={{width: 100, backgroundColor: method_background}} type="text" value={this.state.attempted_method} onChange={this.handleMethodChange} /><br />
                Controlled bells:<br />
                <input style={{width: 100}} type="text" value={this.state.follow} onChange={this.handleFollowChange} /><br />
          <Diagram rows_before="2"
                   follow={this.state.follow.toUpperCase()}
                   rows_after="6" row={start_row.join("").toUpperCase()}
                   index="0"
                   method={this.state.method} />
          <ul style={{padding: "0", margin: "0 0"}}>{bell_list}</ul>
          <PlayBells />
        </div>
      </div>
    );
  }
});

module.exports = [Bells, Diagram, Places];

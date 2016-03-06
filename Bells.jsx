/* global require */
/* global module */

var React = require('react');
var BellIcon = require('./bell_icon');
var Places = require('./places');

Bell = React.createClass({
  render: function () {
    return <BellIcon />;
  }
});

Bells = React.createClass({
    render: function () {
      var bell_list = [];
      for (var i = 0; i < 6/*this.props.number*/; i++) {
        bell_list.push(<li style={{listStyleType: "None"}} key={i} id={"bell_" + i}><Bell /></li>);
      }
      return <ul>{bell_list}</ul>;
    }
});


Diagram = React.createClass({
  render: function() {
    var changes = Places.lex_place_notation(this.props.method);
    index = parseInt(this.props.index);
    
    var layout_row = function (row) {
      var bells = [];
      row.forEach(
        function (bell, i) {
          bells.push(<td key={i}>{bell}</td>);
        }
      );
      return bells;
    };

    var current = this.props.row.split("");

    var rows = [<tr style={{color: "green"}} key="special">{layout_row(current)}</tr>];

    for (var i = 0; i < parseInt(this.props.rows_before); i++) {
      current = Places.prev_permutation(current, changes, index - i);
      rows.unshift(<tr key={i}>{layout_row(current)}</tr>);
    }

    current = this.props.row.split("");

    for (i = 0; i < this.props.rows_after; i++) {
      current = Places.next_permutation(current, changes, index + i);
      rows.push(<tr key={i + this.props.rows_before}>{layout_row(current)}</tr>);
    }
    return (
      <table>
        <tbody>
        {rows}
        </tbody>
      </table>
    );
  },
});

module.exports = [Bells, Diagram, Places];

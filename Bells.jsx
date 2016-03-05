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
    displayName: 'Bells',
    render: function () {
      var bell_list = [];
      for (var i = 0; i < 6/*this.props.number*/; i++) {
        bell_list.push(<li style={{listStyleType: "None"}} key={i} id={"bell_" + i}><Bell /></li>);
      }
      return <ul>{bell_list}</ul>;
    }
});

module.exports = [Bells, Places];

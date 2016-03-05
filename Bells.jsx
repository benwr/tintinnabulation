/* global require */
/* global module */

(function () {
  'use strict';
}());

var React = require('react');
var BellIcon = require('./bell_icon');

Bell = React.createClass({
  render: function () {
    return <BellIcon />;
  }
});

module.exports = React.createClass({
    displayName: 'Bells',
    render: function () {
      var bell_list = [];
      for (var i = 0; i < 6/*this.props.number*/; i++) {
        bell_list.push(<li style={{listStyleType: "None"}} key={i} id={"bell_" + i}><Bell /></li>);
      }
      return <ul>{bell_list}</ul>;
    }
});

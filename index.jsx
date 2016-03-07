var ReactDOM = require('react-dom');
var things = require('./Bells');
Bells = things[0];
Diagram = things[1];
Places = things[2];


ReactDOM.render(<Bells />, document.getElementById('content'));

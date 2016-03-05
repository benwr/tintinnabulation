var ReactDOM = require('react-dom');
var things = require('./Bells');
Bells = things[0];
Places = things[1];

ReactDOM.render(<Bells />, document.getElementById('content'));

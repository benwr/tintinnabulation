var ReactDOM = require('react-dom');
var things = require('./Bells');
Bells = things[0];
Diagram = things[1];
Places = things[2];


ReactDOM.render(<Diagram rows_before="10" rows_after="10" row="123456" index="0" method="x16"/>, document.getElementById('content'));

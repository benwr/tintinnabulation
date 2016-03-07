var ReactDOM = require('react-dom');
var things = require('./Bells');
Bells = things[0];
Diagram = things[1];
Places = things[2];


ReactDOM.render(<Diagram rows_before="2" follow="12" rows_after="20" row="12345678" index="0" method="x18x18x18x18 le:12"/>, document.getElementById('content'));

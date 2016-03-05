var Places = function () {
    "use strict";
    var lex_place_notation = function (s) {
        var lead_end = '';
        var split = s.split("le");
        s = split[0];
        if (split.length == 2) {
            lead_end = split[1];
            lead_end.replace(/[ \t:]/, '')
        } else {
            lead_end = null;
        }

        var rows = [];
        var current_change = []
        s.toUpperCase().split('').forEach(function (c, i) {
            switch (c) {
            case "X":
                rows.push(current_change);
                current_change = [];
                if (i > 0) rows.push([]);
                break;
            case ".":
            case "-":
                rows.push(current_change);
                current_change = [];
            default:
                current_change.push(c);
            }
        });

        if (current_change.length > 0) rows.push(current_change);

        if (lead_end) {
            var reversed = rows.slice();
            reversed.reverse();
            rows = rows.concat(reversed.slice(0, -1));
            rows.push(lead_end.split(""));
        }

        return rows;
    };

    var bell_names = ["1", "2", "3", "4", "5", "6", "7", "8", "9",
                      "0", "E", "T", "A", "B", "C", "D"];
    var inverse_bell_names=  {};
    bell_names.forEach(function (val, index) {
        inverse_bell_names[val] = index + 1;
    });
            
    var method_from_place_notation = function (s, n) {
        var changes = lex_place_notation(s);
        var row = [];
        for (var i = 0; i < n; i++) row.push(bell_names[i]);
        var result = [row];

        changes.forEach(
            function (stationaries) {
                var next_row = [];
                var swap = "";
                result[result.length - 1].forEach(
                    function (bell, place) {
                        place = place + 1
                        if (stationaries.includes((place).toString())) {
                            next_row.push(bell);
                            swap = "";
                        } else if (swap != "") {
                            next_row.push(bell);
                            next_row.push(swap);
                            swap = "";
                        } else {
                            swap = bell;
                        }
                    }
                );
                result.push(next_row);
            }
        );
        return result;
    };

    return {
        lex_place_notation: lex_place_notation,
        method_from_place_notation: method_from_place_notation,
    };
}();

module.exports = Places

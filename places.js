var Places = function () {
    "use strict";
    var lex_place_notation = function (s) {
        var lead_end = '';
        var split = s.split("le");
        s = split[0].replace(" ", "");
        if (split.length == 2) {
            lead_end = split[1];
            lead_end = lead_end.replace(/[ :]/, '')
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
                break;
            default:
                current_change.push(c);
            }
        });

        if (current_change.length > 0) rows.push(current_change);

        if (lead_end) {
            var reversed = rows.slice();
            rows = rows.concat(reversed.slice(0, -1));
            rows.push(lead_end.split(""));
        }

        return rows;
    };

    var bell_names = ["1", "2", "3", "4", "5", "6", "7", "8", "9",
                      "0", "E", "T", "A", "B", "C", "D"];
    var inverse_bell_names=  {};
    bell_names.forEach(function (val, index) {
        inverse_bell_names[val] = index;
    });

    var bell_colors =  ["#00f", "#f00", "#0f0", "#ff0", "#0ff", "#f0f", "#000", "#999", "#009",
                      "#900", "#090", "#990", "#099", "#909", "#99f", "#f99"];
            
    var method_from_place_notation = function (s, n) {
        var changes = lex_place_notation(s);
        var row = [];
        for (var i = 0; i < n; i++) row.push(bell_names[i]);
        var result = [row];

        changes.forEach(
            function (stationaries, i) {
                row = next_permutation(row, changes, i);
                result.push(row);
            }
        );
        return result;
    };

    var mod = function(a, b) {
        return ((a % b) + b) % b;
    };

    var next_permutation = function (row, changes, index)  {
        var next_row = [];
        var swap = "";
        if (index >= changes.length || index < 0) {
            index = mod(index, changes.length);
        }

        row.forEach(
            function (bell, place) {
                place = bell_names[place];
                if (changes[index].includes((place).toString())) {
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
        return next_row
    };

    var prev_permutation = function (row, changes, index) {
        return next_permutation(row, changes, index - 1);
    };

    var method_segment = function (changes, current_row, start, end) {
        var rows = [current_row];
        var current = current_row;
        for (var i = 0; i < start; i++) {
            current = Places.prev_permutation(current, changes, index - i);
            rows.unshift(current);
        }
        current = current_row;
        for (i = 0; i < end; i++) {
            current = Places.next_permutation(current, changes, index + i);
            rows.push(current);
        }
        return rows;
    };

    return {
        lex_place_notation: lex_place_notation,
        next_permutation: next_permutation,
        prev_permutation: prev_permutation,
        method_from_place_notation: method_from_place_notation,
        method_segment: method_segment,
        inverse_bell_names: inverse_bell_names,
        bell_names: bell_names,
        bell_colors: bell_colors,
    };
}();

module.exports = Places

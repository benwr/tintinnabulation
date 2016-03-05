def lex_place_notation(s):
    rows = []
    current_change = []
    le = ''
    if 'le' in s:
        s, le = s.split('le')
        le = le.strip("\t: ")

    for i, char in enumerate(s):
        if char in ['x', 'X']:
            rows.append(''.join(current_change))
            current_change = []
            if i > 0:
                rows.append('')
        elif char in ['.', '-']:
            rows.append(''.join(current_change))
            current_change = []
        else:
            current_change.append(char)
    if current_change:
        rows.append(''.join(current_change))
    print rows
    return rows, le


def method_from_place_notation(s, n):
    rows, le = lex_place_notation(s)

    row = ''.join([str(i) for i in xrange(1, n+1)])
    result = [row]
    if le:
        rows = rows + list(reversed(rows))[:-1]
        rows.append(le)

    for stationaries in rows:
        next_row = []
        swap = ''
        for place, bell in enumerate(result[-1]):
            if str(place+1) in stationaries:
                next_row.append(bell)
                swap = ''
            elif swap:
                next_row.append(bell)
                next_row.append(swap)
                swap = ''
            else:
                swap = bell
        print stationaries
        print ''.join(next_row)
        result.append(''.join(next_row))

    return result

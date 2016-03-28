var bell_sounds = function () {
    var ctx = new AudioContext();
    var ring_bell = function (freq, length) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        gain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.01);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + length / 1000 * 4);
        var stop = function () {
            osc.stop(ctx.currentTime + length / 1000 * 4 + 0.02);
        };
        setTimeout(stop.bind(window), length);
    };

    return {
        ring_bell: ring_bell,
    };
}();

bell_sounds.ring_bell();

module.exports = bell_sounds;

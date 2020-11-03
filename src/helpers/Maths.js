const Maths = {
    getAngle: function (Cos = 0, Sin = 0) { return 0; }
};
Maths.getAngle = function (Cos, Sin) {
    const l = Math.sqrt(Math.pow(Cos, 2) + Math.pow(Sin, 2));

    Cos /= l;
    Sin /= l;

    var aX = Math.acos(Cos);
    var aY = Math.asin(Sin);

    return aY > 0 ? aX : Math.PI - aX;
};

module.exports = Maths;

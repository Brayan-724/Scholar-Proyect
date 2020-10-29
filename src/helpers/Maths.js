const Maths = {
    getAngle(Cos = 0, Sin = 0) {return 0}
};

Maths.getAngle = (Cos, Sin) => {
    let l = Math.sqrt(Cos ** 2, Sin ** 2);
    if(Math.abs(Cos) > 1) Cos /= l;
    if(Math.abs(Sin) > 1) Sin /= l;
    
    let aX = Math.acos(Cos);
    let aY = Math.asin(Sin);

    return aY > 0 ? aX : Math.PI - aX;
}

module.exports = Maths;
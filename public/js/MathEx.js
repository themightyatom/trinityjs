class MathEx {


    static feetToCm(feet, inches) {

        let totalInches = feet * 12 + inches;
        return Math.round(totalInches * 2.54);
    }
    static cmToFeet(value) {

        var realFeet = ((value * 0.393700) / 12);
        var feet = Math.floor(realFeet);
        var inches = (Math.round(((realFeet - feet) * 12) * 100))/100;
        return {feet:feet,inches:inches};
    }

}

export default MathEx
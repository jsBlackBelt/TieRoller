var _argObj;
var operatorSet = "+-*/^+-d";
var rollerModel = new RollerModel();

function RollerModel() {
    this.resRolls = [];
    this.rolls = [];
    this.rollStats = {};
    this.grandTotal = 0;
}

RollerModel.prototype.addRollSeries = function(dice, series) {
    if (this.rollStats['dice'] === null || this.rollStats['dice'] === undefined) {
        this.rollStats['dice'] = [];
    }
    if (this.rollStats['series'] === null || this.rollStats['series'] === undefined) {
        this.rollStats['series'] = [];
    }
     
    this.rollStats['dice'].push(dice);
    this.rollStats['series'].push(series);
};
 
function evaluate(str, argObj) {
    if (argObj === null) {
        argObj = {};
    }
    str = str.split(" ").join("");

    //trim off the space if any
    if (!str.length > 0)
    {
        return 0;
    }
     
    // search for  +,-,*,/,*    , skip string in parenthesis and cut into two pieces accordingly
    // after this step ,  only function, parenthesis, variable or number are  left
    var str2 = maskParenthesis(str);
    var start;
    for (var k = 0; k<operatorSet.length; k++) {
        // be careful, we should check from right to left, not left to right
        var op = operatorSet.charAt(k);
        start = str.length-1;
        var i = 0;
         
        while ((i=str2.lastIndexOf(op, start))>=0) {
            if ((k<=1) && operatorSet.indexOf(str2.charAt(i-1))>=0) {
                //something like 3*-4; 
                start = i-1;
                //################continue
                continue;
            }
             
            var lStr = str.substr(0, i);
            var rStr = str.substr(i+1, str.length-i-1);
            return handleOperator(op, lStr, rStr, argObj);
        }
    }
     
    // now we get only the parenthesis, function and pure number/variable here; now check function          while (_loc_4 < operatorSet.length)
    start = str.indexOf("(");
    if (start >= 0) {
        var functionName = (str.substr(0, start)).toLowerCase();
        var contentInParenthesis = str.substr(start+1, str.length-start-2);
        return handleFunction(functionName, contentInParenthesis, argObj);
    }
     
    // After those steps , only variable and pure number are left here, now check variable
    if (isNaN(Number(str))) {
        if( Math[str] !== undefined ){
            return Math[str];
             
        }else if(argObj[str] !== undefined && typeof argObj[str] === 'number'){
            return argObj[str];
        }
    }
     
    // variable are screened off, here is pure value
    return Number(str);
}
 
function handleOperator(operator, lStr, rStr, argObj) {
    var val;
    var num1 = evaluate(lStr, argObj);
    var num2 = evaluate(rStr, argObj);
     
    switch(operator) {
        case "+":
            val = num1+num2;
            rollerModel.resRolls.push(num1 + " + " + num2 + " = " + val);
            break;
         
        case "-":
            val =  num1-num2;
            rollerModel.resRolls.push(num1 + " - " + num2 + " = " + val);
            break;
         
        case "*":
            val =  num1*num2;
            rollerModel.resRolls.push(num1 + " * " + num2 + " = " + val);
            break;
         
        case "/":
            val =  num1/num2;
            rollerModel.resRolls.push(num1 + " / " + num2 + " = " + val);
            break;
         
        case "^":
            val = Math.pow(num1, num2);
            rollerModel.resRolls.push(num1 + " ^ " + num2 + " = " + val);
            break;
         
        case "d":
            val = rollDice(num1, num2);
            break;
         
        default:
            val = 0;
            break;
         
    }
    
    rollerModel.grandTotal = val; 
    return val;
}
 
function maskParenthesis( str ) {
    var parenthesisStack = 0;
    var temp = "";
     
    for( var i = 0; i < str.length; i++ ) {
        var char = str.substr(i, 1);
        if( char == "(" ){
            parenthesisStack++;
        }
         
        if( char == ")" ){
            parenthesisStack--;
        }
         
        temp += (parenthesisStack === 0 ? char : "(");
    }
     
    if( parenthesisStack !== 0 ){
        throw "The number of ( and ) does not match";
        return "";
    }
    return temp;
}
 
function handleFunction(functionName, contentInParenthesis, argObj) {
    if (!functionName.length>0) {
        // pure parenthesis
        return evaluate(contentInParenthesis, argObj);
    }
     
    // It is a function, now check how many parameters
    var str2 = maskParenthesis(contentInParenthesis);
    var str = contentInParenthesis;
    var params = [];
     
    if( str!=="" && str2 !==""){
        var i = -1;
        while ((i=str2.indexOf(","))>=0) {
            var lStr = str.substr(0, i);
            str2 = str2.substr(i+1, str2.length-i-1);
            str  = str.substr(i+1, str.length-i-1);
            params.push(evaluate(lStr, argObj));
        }
         
        params.push(evaluate(str, argObj));
    }
     
    var val;
     
    if(Math[functionName]!==undefined) {
        val = Math[functionName].apply(null, params);
         
    } else if(argObj[functionName]!==undefined) {
        val = argObj[functionName].apply(null, params);
         
    }
     
    return val;
}

function rollDice(numOfRolls, dieSides) {
    var roll;
    var totalRollsResult = 0;
    var rolls = [];
     
    dieSides = (dieSides === 0 ? 1 : dieSides);

    for (var i = 0; i < numOfRolls; i++) {
        roll = rollDie(dieSides);
        rollerModel.rolls.push("d" + dieSides + " rolled " + roll);
/*        if (roll >= Consts.SUCCESS_THRESHOLD) {
            RollerModel.getInstance().successes++;
        } else if (roll <= Consts.FAILURE_THRESHOLD) {
            RollerModel.getInstance().failures++;
        }
*/         
        rolls.push(roll);
        totalRollsResult += roll;
    }
     
    rollerModel.addRollSeries(dieSides, rolls);
    rollerModel.resRolls.push("Total d" + dieSides + " rolled = " + totalRollsResult);
    return totalRollsResult;
}
 
function rollDie(dieSides) {
    var rand = Math.random();
    var roll = Math.floor(rand * dieSides) + 1;
     
    return roll;
}

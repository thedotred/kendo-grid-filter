const sequenceModel = require('../models/Sequence/sequenceModel');

//sequence wise number generator function
async function generator(sequence_type, initial_number = 1, number_of_digits = 5, prefix = "", postfix="") {
    let isSequenceExists = await sequenceModel.findOne({sequence_type: sequence_type});

    if (isSequenceExists){
        let {sequence_number, sequence_digits, prefix, postfix} = isSequenceExists;
        let sequence = generateId(sequence_number, sequence_digits);
        await updateSequence(sequence, sequence_type);
        return prefix + sequence + postfix;
    } else {
        let { sequence_number } = await createSequence(sequence_type, prefix, initial_number, number_of_digits, postfix);
        return prefix + sequence_number + postfix;
    }
}

//create sequence wise number in sequence db
async function createSequence(sequence_type, prefix, initial_number, sequence_digits, postfix){
    let model = {
        sequence_number: fillZeros(initial_number, sequence_digits),
        sequence_type: sequence_type,
        sequence_digits: sequence_digits,
        prefix: prefix,
        postfix: postfix
    };
    await sequenceModel.create(model, (err)=>{
        if (err) {
            console.log(`err in creating new ${sequence_type} sequence`);
            console.log(err);
        }
        console.log(`Successfully created new ${sequence_type} sequence`);
    });
    return model;
}

//update sequence wise number in sequence db
async function updateSequence(sequence_number, sequence_type){
    let updatePromise = new Promise(function (resolved, reject) {
        sequenceModel.updateOne({sequence_type: sequence_type}, {$set: {sequence_number: sequence_number}},(err, result)=> {
            if(err) {
                reject(console.log(`err in updating ${sequence_type} sequence`));
                console.log(err);
            }
            resolved(console.log(`Successfully updated ${sequence_type} sequence`));
        })
    });

    return updatePromise;
}



//create sequence number {num arg is the initial value & numDigits arg is the digits of number}
function fillZeros(num, numDigits) {
    var number = num.toString();
    numDigits = numDigits - number.length;
    while(numDigits > 0) {
      number = number + "0";
      numDigits--;
    }
    return number;
}
//function is called when update function is calling {pre-incremental function}
function incrementNumber(num, _max) {
    return num === _max ? null : ++num;
}
//function is called when update function is calling {passing arg num & numDigits to fillZeros function}
function generateId(numbers, numNumbers) {
    let maxNumber = Math.pow(10, numNumbers) - 1;
    let nextNumber = incrementNumber(numbers, maxNumber);
    return fillZeros(nextNumber, numNumbers);
}

module.exports = {
    generator
};
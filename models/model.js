//Require Mongoose 
let mongoose = require('mongoose');

//Define schema
let Schema = mongoose.Schema;

//Define model
let expenseDataSchema = new Schema({
    property: {
        _id: {
            type: Schema.Types.ObjectId, 
            required: true, 
            ref: "propertyData"
        },
        property_name: {
            type: String, 
            required: true
        }
    },
    unit: {
        _id: {
            type: Schema.Types.ObjectId, 
            required: true, 
            ref: 'unitData'
        },
        unit_name: {
            type: String, 
            required: true
        }
    },
    tenant: {
        _id: {
            type: Schema.Types.ObjectId, 
            required: true, 
            ref: 'tenantData'
        },
        tenant_name: {
            type: String, 
            required: true
        }
    },
    ledger: {
        _id: {
            type: Schema.Types.ObjectId, 
            required: true, 
            ref: 'ledgerData'
        },
        ledger_name: {
            type: String, 
            required: true
        }
    },
    transaction_date: {
        type: Date,
        required: true,
    },
    transaction_amount: {
        type: Number,
        required: true
    },
    transaction_number: {
        type: String,
        required: true,
    },
    item_reference: {
        type: Schema.Types.ObjectId,
        ref: "transactionData"
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    posted_date: {
        type: Date,
        required: true,
    },
    posted_by: {
        type: Schema.Types.ObjectId,
    },
    posted_user: {
        type: String,
    },
    modified_date: {
        type: Date
    },
    modified_by: {
        type: Schema.Types.ObjectId,
    }
});


//Export function to create this model class
module.exports = mongoose.model('expenseData', expenseDataSchema, 'expenseData');
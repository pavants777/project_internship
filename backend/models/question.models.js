const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return v.length === 4;
            },
            message: props => `${props.value} does not have exactly 4 options`
        }
    },
    answer: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return ['A', 'B', 'C', 'D'].includes(v);
            },
            message: props => `${props.value} is not a valid answer. It must be one of 'A', 'B', 'C', or 'D'.`
        }
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;

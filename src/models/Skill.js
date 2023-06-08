
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
name: {
type: String,
required: true,
unique: true
},
description: {
type: String,
required: true
}
});

mongoose.model('Skill', skillSchema);


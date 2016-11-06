var oneUps = [{
    one_upper: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
}];

var availabilityTimes = {
    morning: {
        type: Boolean,
        default: true
    },
    day: {
        type: Boolean,
        default: true
    },
    night: {
        type: Boolean,
        default: true
    }
};

var comments = [{
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    one_ups: {
        type: oneUps
    },
    deleted: {
        type: Boolean,
        default: 0
    }
}];

var image = {
    name: {
        type: String
    },
    data: {
        type: String
    },
    size: {
        type: Number
    },
    uploaded: {
        type: Date,
        default: Date.now
    },
    one_ups: {
        type: oneUps
    },
    comments: {
        type: comments
    }
};

module.exports = {
    oneUps: oneUps,
    availabilityTimes: availabilityTimes,
    comments: comments,
    image: image
};

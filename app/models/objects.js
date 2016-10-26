var oneUps = [{
    oneUpper: {
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
        type: Boolean
    },
    day: {
        type: Boolean
    },
    night: {
        type: Boolean
    },
    never: {
        type: Boolean
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

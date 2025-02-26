    const fs = require('fs');

    function loadAuthorizedData() {
        return JSON.parse(fs.readFileSync('authorized.json', 'utf8'));
    }

    function isOwner(userId) {
        return userId === process.env.OWNER_ID;
    }

    function isAuthorized(userId) {
        const authorizedData = loadAuthorizedData();
        return authorizedData.users.includes(userId);
    }

    function isChannelAllowed(channelId) {
        const authorizedData = loadAuthorizedData();
        return authorizedData.channels.includes(channelId);
    }

    module.exports = { isOwner, isAuthorized, isChannelAllowed };
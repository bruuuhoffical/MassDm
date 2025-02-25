require('dotenv').config();
const fs = require('fs');

const authfile = './authorized.json';

// load authorized users, channels, and servers
function loadauthdata() {
    if (!fs.existssync(authfile)) {
        fs.writefilesync(authfile, json.stringify({ users: [], channels: [], servers: [] }, null, 2));
    }
    return json.parse(fs.readfilesync(authfile));
}

// check if a user is the bot owner
function isowner(userid) {
    return userid === process.env.owner_id;
}

// check if a user is authorized
function isauthorized(userid) {
    const data = loadauthdata();
    return isowner(userid) || data.users.includes(userid);
}

// check if a server is allowed
function isserverallowed(serverid) {
    const data = loadauthdata();
    return data.servers.includes(serverid);
}

// check if a channel is allowed
function ischannelallowed(channelid) {
    const data = loadauthdata();
    return data.channels.includes(channelid);
}

// add user, channel, or server
function addauthorized(type, id) {
    const data = loadauthdata();
    if (!data[type].includes(id)) {
        data[type].push(id);
        fs.writefilesync(authfile, json.stringify(data, null, 2));
    }
}

// remove user, channel, or server
function removeauthorized(type, id) {
    const data = loadauthdata();
    data[type] = data[type].filter(item => item !== id);
    fs.writefilesync(authfile, json.stringify(data, null, 2));
}

module.exports = {
    isowner,
    isauthorized,
    isserverallowed,
    ischannelallowed,
    addauthorized,
    removeauthorized
}; 
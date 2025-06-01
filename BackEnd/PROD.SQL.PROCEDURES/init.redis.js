'use strict';

const redis = require('redis'); 

let client = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnect',
    ERROR: 'error'
};

const handleRedisError = (error) => {
    console.error('Redis error:', error);
}

const handleEventConnection = ({
    connectionRedis
}) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`Redis connected - connection status: connected`); 
    });
    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`Redis disconnected - connection status: disconnected`); 
    });
    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`Redis reconnected - connection status: reconnecting`); 
    });
    connectionRedis.on(statusConnectRedis.ERROR, (error) => {
        console.error(`Redis error - connection status: ${error}`); 
    });
}

const initRedis = async () => {
    const instanceRedis = redis.createClient();
    client.instanceConnect = instanceRedis;
    handleEventConnection(instanceRedis);    
}

const getRedisClient = () => client;



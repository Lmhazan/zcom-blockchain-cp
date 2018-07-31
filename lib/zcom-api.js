const rp = require('request-promise');
const Promise = require('bluebird');
const helper = require('./helper');

const MAX_GAS_LIMIT = 4000000;

class ZcomApiClient {
    /**
     * Constructor
     * @param {string} apiRoot The root URL of the API
     */
    constructor(apiRoot) {
        this.apiRoot = apiRoot;
    }
    /**
     * Call confirm token
     * @param {string} authToken Authentication token
     * @returns {Promise}
     */
    confirmToken(authToken) {
        if (!helper.isValidToken(authToken)) {
            return Promise.reject(new Error('Invalid token'));
        }
        return rp.post({
            url: `${this.apiRoot}/check-token`,
            body: {
                authToken
            },
            json: true
        });
    }

    /**
     * Call register CNS Address api
     * @param {string} address CNS address
     * @param {string} authToken Authentication token
     * @returns {Promise}
     */
    registerCNSAddress(address, authToken) {
        if (!helper.isValidToken(authToken)) {
            return Promise.reject(new Error('Invalid token'));
        }

        if (!helper.isAddr(address)) {
            return Promise.reject(new Error('Invalid Address'));
        }

        return rp.post({
            url: `${this.apiRoot}/cns`,
            body: {
                address,
                authToken
            },
            json: true
        });
    }

    /**
     * Call API to add a new contract
     * @param {string} address Contract address
     * @param {string} abi The ABI of the contract
     * @param {number} gasLimit Gas limit value
     * @param {string} authToken Authentication token
     * @returns {Promise}
     */
    addContract(address, abi, gasLimit, authToken) {
        if (!helper.isValidToken(authToken)) {
            return Promise.reject(new Error('Invalid token'));
        }

        if (!helper.isAddr(address)) {
            return Promise.reject(new Error('Invalid Address'));
        }

        if (!helper.isAbi(abi)) {
            return Promise.reject(new Error('Invalid ABI'));
        }

        if (!Number.isInteger(gasLimit) || gasLimit <= 0 || gasLimit > MAX_GAS_LIMIT) {
            return Promise.reject(new Error('Invalid gas limit value'));
        }

        return rp.post({
            url: `${this.apiRoot}/contracts`,
            body: {
                address,
                abi,
                gasLimit,
                authToken
            },
            json: true
        });
    }

    /**
     * Call API to update a contract
     * @param {string} address Contract address
     * @param {string} abi The ABI of the contract
     * @param {number} gasLimit Gas limit value
     * @param {string} authToken Authentication token
     * @returns {Promise}
     */
    updateContract(address, abi, gasLimit, authToken) {
        if (!helper.isValidToken(authToken)) {
            return Promise.reject(new Error('Invalid token'));
        }

        if (!helper.isAddr(address)) {
            return Promise.reject(new Error('Invalid Address'));
        }

        if (!helper.isAbi(abi)) {
            return Promise.reject(new Error('Invalid ABI'));
        }

        if (!Number.isInteger(gasLimit) || gasLimit <= 0 || gasLimit > MAX_GAS_LIMIT) {
            return Promise.reject(new Error('Invalid gas limit value'));
        }

        return rp.put({
            url: `${this.apiRoot}/contracts/${address}`,
            body: {
                abi,
                gasLimit,
                authToken
            },
            json: true
        });
    }

    /**
     * Call API to provider ether to an address
     * @param {string} address Address of the receiver
     * @param {number} ether Amount to transfer
     * @param {string} authToken Authentication token
     * @returns {Promise}
     */
    provideEther(address, ether, authToken) {
        if (!helper.isValidToken(authToken)) {
            return Promise.reject(new Error('Invalid token'));
        }

        if (!helper.isAddr(address)) {
            return Promise.reject(new Error('Invalid Address'));
        }

        if (!Number.isInteger(ether) || ether <= 0) {
            return Promise.reject(new Error('Invalid ether amount'));
        }

        return rp.post({
            url: `${this.apiRoot}/provide-ether`,
            body: {
                address,
                ether,
                authToken
            },
            json: true
        });
    }
}

module.exports = ZcomApiClient;

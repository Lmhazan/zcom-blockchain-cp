const jsonminify = require('jsonminify');

module.exports = {
    /**
     * Check token string's validity
     * @param {string} token Token to check
     * @returns {boolean}
     */
    isValidToken(token) {
        if (token === undefined || token === null) { return false; }

        return token.match(/^[0-9a-zA-Z]{64}$/);
    },
    /**
     * Check Ethereum address' validity
     * @param {string} addr Ethereum address
     * @returns {boolean}
     */
    isAddr(addr) {
        if (addr === undefined || addr === null) { return false; }

        addr = addr.trim();
        return addr.match(/^(0x)?[0-9a-f]{40}$/);
    },
    /**
     * Check ABI string's validity
     * @param {string} abi Ethereum contract's ABI
     * @returns {boolean}
     */
    isAbi(abi) {
        if (abi === undefined || abi === null || typeof abi !== 'string') { return false; }

        abi = abi.trim();
        if (!abi.match(/^[0-9a-zA-Z-_"',\]\[\}\{: \t\r\n]+$/)) return false;
        try {
            abi = jsonminify(abi);
            if (abi.length > 65535) return false;
            return true;
        } catch (e) {
            console.warn(abi, e);
            return false;
        }
    }
};

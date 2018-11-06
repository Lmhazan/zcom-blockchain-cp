const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const readFileSync = require('fs').readFileSync;
const path = require('path');
const nj = require('nunjucks');
const ZcomApiClient = require('./lib/zcom-api');

const defaultConfDir = path.join(__dirname, '../../');
const defaultSecretFile = path.join(defaultConfDir, '.zcom-secret');
let outputDir = defaultConfDir;
let cnsFilePath = path.join(outputDir, 'zcom-cns.js');

let authToken = process.env.ZCOM_AUTH_TOKEN;
const apiRoot = process.env.ZCOM_API_URL || 'https://cp.blockchain.z.com/api/v1';
const apiClient = new ZcomApiClient(apiRoot);

// Nunjuck settings
nj.configure({ autoescape: true });

// Read token from default secret file if there is no env variable defined
if (!authToken) {
    try {
        authToken = readFileSync(defaultSecretFile, 'utf8').trim();
    } catch (err) {
        console.warn('There is no default config file set in project root folder!');
    }
}

/**
 * Save CNS content to file
 * @param {string} address Address of the cns
 * @returns {Promise}
 */
function saveCNSToFile(address) {
    const fileContent = `const CNS_ADDRESS = "${address}";`;
    return fs.writeFileAsync(cnsFilePath, fileContent)
        .then(() => console.info(`CNS address variable was saved in ${cnsFilePath}`));
}

module.exports = {
    /**
     * Set custom secret file location and update the authToken
     * @param {string} secretFile The location of custom secret file
     */
    setSecretFile(secretFile) {
        authToken = readFileSync(secretFile, 'utf8').trim();
    },
    /**
     * Set custom path to save output cns and contract file
     * @param {string} customPath The location to save output js file
     */
    setOutputPath(customPath) {
        outputDir = customPath;
        // Recreate cns file path
        cnsFilePath = path.join(outputDir, 'zcom-cns.js');
    },
    /**
    * Confirm Token is valid or not
    * @param {boolean} isForceExist Should the script be existed when there is an invalid token or not
    * @returns {Promise}
    */
    confirmToken(isForceExist = true) {
        let resPromise = apiClient.confirmToken(authToken)
            .then(resObj => {
                if (resObj.status === 0) {
                    console.info('Confirm token successfully! Ready to use the library');
                    return Promise.resolve(resObj);
                } else {
                    return Promise.reject(new Error(resObj.message));
                }
            });

        if (isForceExist) {
            resPromise = resPromise.catch(err => {
                console.error(`ERROR: ${err.message}`);
                process.exit(1);
            });
        }

        return resPromise;
    },
    /**
     * Register CNS address
     * @param {string} address CNS Ethereum's addresss
     * @param {boolean} saveFile Save address to variable in a js file or not
     * @returns {Promise}
     */
    registerCNS(address, saveFile = false) {
        return apiClient.registerCNSAddress(address, authToken)
            .then(resObj => {
                if (resObj.status === 0) {
                    console.info('CNS Address:');
                    console.info(address);

                    if (saveFile) return saveCNSToFile(address);
                } else {
                    return Promise.reject(new Error(resObj.message));
                }
            });
    },
    /**
     * Add contract information
     * @param {string} address Contract Ethereum's address
     * @param {string} abi Contract ABI
     * @param {number} gasLimit Contract gas limit
     * @param {boolean} saveFile Save address to variable in a js file or not
     * @param {contractName} contractName Name of the contract
     * @returns {Promise}
     */
    addContract(address, abi, gasLimit = 100000, saveFile = false, contractName = '') {
        return apiClient.addContract(address, abi, gasLimit, authToken)
            .then(resObj => {
                if (resObj.status === 0) {
                    console.info('Contract Address:');
                    console.info(address);
                    console.info('ABI:');
                    console.info(abi);

                    if (saveFile) {
                        if (contractName) return this.saveContractToFile(contractName, address, abi);
                        else console.error('Could not save contract! There is no contract name provided');
                    }
                } else {
                    return Promise.reject(new Error(resObj.message));
                }
            });
    },
    /**
     * Update contract information
     * @param {string} address Contract Ethereum's address
     * @param {string} abi Contract ABI
     * @param {number} gasLimit Contract gas limit
     * @param {boolean} saveFile Save address to variable in a js file or not
     * @param {contractName} contractName Name of the contract
     * @returns {Promise}
     */
    updateContract(address, abi, gasLimit = 100000, saveFile = false, contractName = '') {
        return apiClient.updateContract(address, abi, gasLimit, authToken)
            .then(resObj => {
                if (resObj.status === 0) {
                    console.info('Contract Address:');
                    console.info(address);
                    console.info('ABI:');
                    console.info(abi);

                    if (saveFile) {
                        if (contractName) return this.saveContractToFile(contractName, address, abi);
                        else console.error('Could not save contract! There is no contract name provided');
                    }
                } else {
                    return Promise.reject(new Error(resObj.message));
                }
            });
    },
    /**
     * Provide ether for an address
     * @param {string} address Address of the receiver
     * @param {number} ether Amount to transfer
     * @returns {Promise}
     */
    provideEther(address, ether) {
        return apiClient.provideEther(address, ether, authToken)
            .then(resObj => {
                if (resObj.status === 0) {
                    console.info(resObj.message);
                } else {
                    return Promise.reject(new Error(resObj.message));
                }
            });
    },
    /**
     * Save contract variable to file
     * @param {string} contractName Name of the contract
     * @param {string} address Contract address
     * @param {string} abi Contract abi
     * @returns {Promise}
     */
    saveContractToFile(contractName, address, abi) {
        const addressVar = `const ${contractName.toUpperCase()}_ADDRESS = "${address}";`;
        const abiVar = `const ${contractName.toUpperCase()}_ABI = ${abi};`;
        const fileContent = `${addressVar}\n${abiVar}`;
        const fileName = `zcom-${contractName.toLowerCase()}.js`;
        const filePath = path.join(outputDir, fileName);

        return fs.writeFileAsync(filePath, fileContent)
            .then(() => console.info(`Contract address and abi variable was saved in ${filePath}`));
    },
    /**
     * Read the contents of created js files that hold contract infos and save all of them in a compile js files
     * that can be import in both browser and nodejs
     * @param {boolean} deleteInputs delete all inputs js files that holde cns, contract variables or not
     */
    compileOutputFiles(deleteInputs = false, outputFileName = 'zcom-vars-compiled.js') {
        let zFiles;
        const compiledFilePath = path.join(outputDir, outputFileName);
        const templateStr = `
(function(exports) {
{%- for item in items %}
    {{ item | safe }}
{% endfor -%}
}(typeof exports === 'undefined' ? window : exports));
`;
        // Read file contents, get the variables and put it in a final files
        return fs.readdirAsync(outputDir)
            .then(files => {
                // Get file contents
                zFiles = files.filter(el => el.match(/^zcom-\w+\.js$/ig));
                const processes = zFiles.map(f => fs.readFileAsync(path.join(outputDir, f), 'utf8'));
                return Promise.all(processes);
            })
            .then(contents => {
                // Change variables definition so it can be used anywhere
                const allData = contents.reduce((acc, el) => acc.concat(el.split('\n')), []);
                const augmentedData = allData.map(el => `exports.${el.slice(6)}`);
                const tpl = nj.compile(templateStr);
                return fs.writeFileAsync(compiledFilePath, tpl.render({ items: augmentedData }));
            })
            .then(() => {
                console.info(`All cns and contract addresses and abi variables was saved in ${compiledFilePath}`);
                if (deleteInputs) {
                    console.warn(`All input files will be deleted!`);
                    const processes = zFiles.map(f => fs.unlinkAsync(path.join(outputDir, f)));
                    return Promise.all(processes);
                }

                return Promise.resolve();
            });
    }
};

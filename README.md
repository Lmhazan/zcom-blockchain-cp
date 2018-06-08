# ZCOM-API client

This library provides a programming interface to interact with the Z.com blockchain API.

Works with Node.js version >= 8.6.4

# Installation

In your project folder, use ```npm``` to install the library
```sh
$ npm install --save zcom-blockchain-cp
```

# Settings

To use the library, you must register a Z.com blockchain service account and have access to the control panel.
In the control panel, create your API token and save it in a ```.zcom-secret``` file in the root folder of your project
```sh
$ echo -n "your api token" > .zcom-secret
```

# Example Usages

This library is to use in conjunction with [Truffle](https://truffleframework.com/) when deploying your Ethereum contracts to the Z.com Blockchain

* Truffle migration file for deploying your CNS, register it in the Z.com control panel and generate a ```zcom-cns.js``` file that holds the CNS address in a variable
    ```javascript
    const ContractNameService = artifacts.require('solidity/contracts/ContractNameService.sol');
    const zcbc = require('zcom-blockchain-cp');

    module.exports = function(deployer, network, accounts) {
        deployer.deploy(ContractNameService).then(() => {
            zcbc.registerCNS(ContractNameService.address, true);
        });
    };
    ```



* Truffle migration file to deploy a contract, add it to the Z.com control panel, and generate a ```zcom-proxycontroller.js``` file that contains the contract's address and abis as Javascript variables
    ```javascript
    const ContractNameService = artifacts.require('./ContractNameService.sol'),
        ProxyController = artifacts.require('./ProxyController.sol'),
        ProxyControllerLogic_v1 = artifacts.require('./ProxyControllerLogic_v1.sol');
    const zcbc = require('zcom-blockchain-cp');

    module.exports = function(deployer) {
        deployer.deploy(ProxyControllerLogic_v1, ContractNameService.address).then(function() {
            return deployer.deploy(ProxyController, ContractNameService.address, ProxyControllerLogic_v1.address);
        }).then(function() {
            return ContractNameService.deployed();
        }).then(function(instance) {
            return instance.setContract('ProxyController', 1, ProxyController.address, ProxyControllerLogic_v1.address);
        }).then(function() {
            return zcbc.addContract(ProxyController.address, JSON.stringify(ProxyController.abi), 3500000, true, 'ProxyController');
        });
    };
    ```

* Just generate the Javascript files that hold contract's address and abi (in this example the file name will be ```zcom-history.js```)
    ```javascript
    const config = require('../truffle'),
        Organizations = artifacts.require('./Organizations.sol'),
        Histories = artifacts.require('./Histories.sol');
    const zcbc = require('zcom-blockchain-cp');

    module.exports = function(deployer, network) {
        deployer.deploy(Histories, config.networks[network].gmoCns, Organizations.address).then(() => {
            zcbc.saveContractToFile('History', Histories.address, JSON.stringify(Histories.abi));
        });
    };
    ```

* Ether can also be sent to an address using this library
    ```javascript
    const zcbc = require('zcom-blockchain-cp');
    zcbc.provideEther('<address>', 10)
    ```


// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import LicensedMediaStore_artifacts from '../../build/contracts/LicensedMediaStore.json'
console.log("hello world");
// MetaCoin is our usable abstraction, which we'll use through the code below.
var LicensedMediaStore = contract(LicensedMediaStore_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.

var accounts;
var account;

// window.App = {
//   start: function() {
//     var self = this;

//     // Bootstrap the MetaCoin abstraction for Use.
//     LicensedMediaStore.setProvider(web3.currentProvider);

//     // Get the initial account balance so it can be displayed.
//     web3.eth.getAccounts(function(err, accs) {
//       if (err != null) {
//         alert("There was an error fetching your accounts.");
//         return;
//       }

//       if (accs.length == 0) {
//         alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
//         return;
//       }

//       accounts = accs;
//       account = accounts[$("#account_id").val()];

//       self.refreshApp();
//     });
//   },

//   setStatus: function(message) {
//     var status = document.getElementById("status");
//     status.innerHTML = message;
//   },

//   refreshApp: function() {
//     var self = this;

//     LicensedMediaStore.deployed().then(function(instance) {
//       instance.getNumMedia.call()
//     }).then(function(numMedia) {
//       console.log("numMedia :" + numMedia);
//       var individual_price = [];
//       var company_price = [];
//       var description = [];
//       var media_id = [];
//       for (var i = 0; i < numMedia; i++){
//         instance.media_info.call(i)
//         .then(function(res){
//           console.log(res);
//           console.log(res[0]);
//           console.log(res[1]);
//           console.log(res[2]);
//           console.log(res[3]);
//         })
//       }

//     }).catch(function(e) {
//       console.log(e);
//       self.setStatus(e);
//     });
//   },

//   sendCoin: function() {
//     var self = this;

//     var amount = parseInt(document.getElementById("amount").value);
//     var receiver = document.getElementById("receiver").value;

//     this.setStatus("Initiating transaction... (please wait)");

//     var meta;
//     MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return meta.sendCoin(receiver, amount, {from: account});
//     }).then(function() {
//       self.setStatus("Transaction complete!");
//       self.refreshBalance();
//     }).catch(function(e) {
//       console.log(e);
//       self.setStatus("Error sending coin; see log.");
//     });
//   }
// };

// window.addEventListener('load', function() {
//   // Checking if Web3 has been injected by the browser (Mist/MetaMask)
//   if (typeof web3 !== 'undefined') {
//     console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
//     // Use Mist/MetaMask's provider
//     window.web3 = new Web3(web3.currentProvider);
//   } else {
//     console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
//     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
//     window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
//   }

//   App.start();
// });


function refreshApp() {
  var self = this;

  LicensedMediaStore.deployed().then(function(instance) {
    instance.getNumMedia.call().then(function(numMedia) {
      console.log("numMedia :" + numMedia);
      var individual_price = [];
      var company_price = [];
      var description = [];
      var media_id = [];
      for (var i = 0; i < numMedia; i++){
        instance.media_info.call(i)
        .then(function(res){
          console.log(res);
          console.log(res[0]);
          console.log(res[1]);
          console.log(res[2]);
          console.log(res[3]);
        })
      }
    });
  }).catch(function(e) {
    console.log(e);
    self.setStatus(e);
  });
}

$(document).ready(function() {
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  LicensedMediaStore.setProvider(web3.currentProvider);
  console.log('fhgjkl');
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[$("#account_id").val()];
    web3.eth.defaultAccount = web3.eth.accounts[0];
    refreshApp();
  });
});

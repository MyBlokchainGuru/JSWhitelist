const ethers = require("ethers");
const web3 = require("web3");
const fs = require("fs");
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: "MY_GITHUB_PERSONAL_ACCESS_TOKEN"
});

const contractAddress = "0x..."; // Address of deployed contract
const contractAbi = [...]; // ABI of contract
const provider = new ethers.providers.Web3Provider(web3.currentProvider);
const contract = new ethers.Contract(contractAddress, contractAbi, provider);

const whiteListFee = "0.1 ether";

function addToWhitelist() {
  contract.addToWhitelist({ value: whiteListFee })
    .then((transaction) => {
      // Check for success message
      if (transaction.events.SuccessfulTransaction) {
        // Read JSON file
        fs.readFile("whiteList.json", (err, data) => {
          if (err) throw err;
          let whiteList = JSON.parse(data);
          // Add new white listed wallet address to array
          whiteList.push(msg.sender);
          // Write updated array to JSON file
          fs.writeFile("whiteList.json", JSON.stringify(whiteList), (err) => {
            if (err) throw err;
            console.log("White listed wallet address added to JSON file");
            // Update JSON file on GitHub
            octokit.repos.createOrUpdateFile({
              owner: "MY_GITHUB_USERNAME",
              repo: "MY_REPO_NAME",
              path: "javascript/whiteList.json",
              message: "Update white list",
              content: Buffer.from(JSON.stringify(whiteList)).toString("base64")
            });
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

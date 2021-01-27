const Web3 = require("web3");
const infuraId = process.env.INFURA_TOKEN;
const web3 = new Web3(
    new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${infuraId}`)
);
const abi = require('./IVoting.json');
const contract = new web3.eth.Contract(abi, "0x24d840dbaa0c0c72589c8f8860063024d1c064db");

async function checkNewVote() {
    const currentDate = new Date();
    const currentTS = Date.now();
    console.log(`checking new vote at ${currentDate} - ${currentTS}`);
    const votesLen = await contract.methods.votesLength().call();
    const vote = await contract.methods.getVote(votesLen - 1).call();
    const gap = currentTS - (vote.startDate * 1000);
    // within 4 hours
    if (gap <= (3600 * 4 * 1000)) {
        console.log(vote);
        //TODO: send email here
    }
}

checkNewVote();

const Web3 = require("web3");
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

const infuraId = process.env.INFURA_TOKEN;
const emailAct = process.env.EMAIL_ACCOUNT;
const emailPwd = process.env.EMAIL_PASSWORD;

const web3 = new Web3(
    new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${infuraId}`)
);

const abi = require('./IVoting.json');
const contract = new web3.eth.Contract(abi, "0x24d840dbaa0c0c72589c8f8860063024d1c064db");

console.log(emailAct);
console.log(emailPwd);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailAct,
        pass: emailPwd
    }
});

const mailOptions = {
    from: emailAct,
    to: 'vang1ong7ang@outlook.com',
    subject: 'New Vote',
    text: 'new vote'
};

async function checkNewVote() {
    const currentDate = new Date();
    const currentTS = Date.now();
    console.log(`checking new vote at ${currentDate} - ${currentTS}`);
    const vote = await contract.methods.getVote(1).call();
    const gap = currentTS - (vote.startDate * 1000);
    // within 4 hours
    if (gap <= (3600 * 4)) {
        console.log(vote);

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

checkNewVote();
// check new vote every 4 hours
const job = new CronJob('0 0 */4 * * *', function() {
    checkNewVote();
});
job.start();

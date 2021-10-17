var request = require('request');

function doRequest(req) {
    return new Promise(function(resolve, reject) {
        request(req, function(error, res, body) {
            resolve({ error, res, body });
        });
    });
}

// Reset
ANSI_RESET = "\033[0m"; // Text Reset

// Regular Colors
ANSI_RED = "\033[0;31m"; // RED
ANSI_GREEN = "\033[0;32m"; // GREEN
ANSI_YELLOW = "\033[0;33m"; // YELLOW
ANSI_BLUE = "\033[0;34m"; // BLUE
ANSI_PURPLE = "\033[0;35m"; // PURPLE
ANSI_CYAN = "\033[0;36m"; // CYAN
ANSI_WHITE = "\033[0;37m"; // WHITE

//Tick actuel
var globalDate = new Date();

// import the `Kafka` instance from the kafkajs library
const { Kafka } = require("kafkajs")

// the client ID lets kafka know who's producing the messages
const clientId = "my-app"
    // we can define the list of brokers in the cluster
const brokers = ["localhost:9092"]
    // this is the topic to which we want to write messages

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer()
var topic = "production.raw.global"
    // we define an async function that writes a new message each second
const produce = async() => {
    await producer.connect()
    let i = 0

    // after the produce has connected, we start an interval timer
    setInterval(async() => {
        try {
            // send a message to the configured topic with
            // the key and value formed from the current value of `i`
            topic = "production.raw.global"
            await producer.send({
                topic,
                messages: [{
                    key: String(i),
                    value: JSON.stringify({
                        "id_producer": "" + i,
                        "productionDate": "2021-10-02T02:00",
                        "production": i * 2
                    }),
                }, ],
            })
            topic = "consumption.client"
            await producer.send({
                topic,
                messages: [{
                    key: String(i),
                    value: JSON.stringify({
                        "houseID": "houseID " + i,
                        "consumptionDate": "2021-10-02T02:00",
                        "consumption": i * 2
                    }),
                }, ],
            })
            topic = "consumption.raw.detailed"
            await producer.send({
                topic,
                messages: [{
                    key: String(i),
                    value: JSON.stringify({
                        "houseID": "houseID " + i,
                        "consumptionDate": "2021-10-02T02:00",
                        "object": [{ "objectName": "Object " + i, "consumption": (i * 2) }, { "objectName": "Object " + (i + 1), "consumption": (i * 2) + 1 }]
                    }),
                }, ],
            })


            var clientName = { clientName: "Jean-Paul_" + i };
            console.log("\nun nouveau client est ajouté (inscrits): ");
            response = await doRequest({ url: "http://registry-manager:3003/subscription/clientSubscribe", form: clientName, method: "POST" });
            console.log(ANSI_BLUE + "[service]:registry; [route]:subscription/clientSubscribe; [params]:" + JSON.stringify(clientName) + " => [return]:" + response.body + ANSI_RESET);
            var houseID = response.body;
            console.log("house ID " + houseID + " du client " + clientName.clientName)
                // if the message is written successfully, log it and increment `i`
            console.log("writes: ", i)
            i++
        } catch (err) {
            console.error("could not write message " + err)
        }

    }, 1000)
}

module.exports = produce

produce().catch((err) => {
    console.error("error in producer: ", err)
})
var request = require('request');
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'scenario2',
    brokers: ['kafka:9092'],
  })

// Reset
ANSI_RESET = "\033[0m";  // Text Reset

// Regular Colors
ANSI_RED = "\033[0;31m";     // RED
ANSI_GREEN = "\033[0;32m";   // GREEN
ANSI_YELLOW = "\033[0;33m";  // YELLOW
ANSI_BLUE = "\033[0;34m";    // BLUE
ANSI_PURPLE = "\033[0;35m";  // PURPLE
ANSI_CYAN = "\033[0;36m";    // CYAN
ANSI_WHITE = "\033[0;37m";   // WHITE



async function doRequest(req) {
    return await new Promise(function(resolve, reject) {
        request(req, function(error, res, body) {
            resolve({ error, res, body });
        });
    });
}

var globalDate = new Date();

async function main() {
    const consumer = kafka.consumer({ groupId: 'scenario2' })
    await consumer.connect()
    await consumer.subscribe({ topic: 'consumption.peak', })


    console.log(ANSI_GREEN+"Scénario 2 : pic dans une communauté");

    //await beforeStep();

    var scheduleStart = { dayDate: globalDate }
    doRequest({ url: "http://consumption-scheduler:3002/schedule", form: scheduleStart, method: "POST" });

    var response;
    console.log("On regarde les maisons actuellement inscrites : ");
    response = await doRequest({ url: "http://client-database:3004/client-registry/allHouses", method: "GET" });
    console.log(ANSI_BLUE+"[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:" + response.body+ANSI_RESET);
    console.log("Les maisons inscrites : " + response.body);

    console.log(ANSI_GREEN+"\n\n================= STEP 1 ================="+ANSI_RESET)
    console.log("On a des maisons dans une communauté et d'autres dans une autre communautés");
    // STEP 1
    var client1 = { client_name: "Jean-Paul" };
    var houseID1 = await addHouse(client1);

    var client2 = { client_name: "Jean-Pierre" };
    var houseID2 = await addHouse(client2);

    var client3 = { client_name: "Jean-Sylvestre" };
    var houseID3 = await addHouse(client3);

    var client4 = { client_name: "Jean-Baptiste" };
    var houseID4 = await addHouse(client4);

    console.log("On regarde les maisons qui sont inscrites : ");
    response = await doRequest({ url: "http://client-database:3004/client-registry/allHouses", method: "GET" });
    console.log(ANSI_BLUE+"[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:" + response.body+ANSI_RESET);
    console.log("Les maisons inscrites : " + response.body);

    console.log(ANSI_GREEN+"\n\n================= STEP 2 ================="+ANSI_RESET)
    console.log("On ajoute plein d’objets planifiables et non planifiables dans les maisons de la communauté");

    var mixeur = { object: { name: "Mixeur", maxConsumption: 500, enabled: true }, type: "BASIC" }

    console.log("On ajoute un objet non programmable à chaque maison");
    await addObject(houseID1, mixeur);
    await addObject(houseID2, mixeur);
    await addObject(houseID3, mixeur);
    await addObject(houseID4, mixeur);
    console.log("\n");


    var car = { object: { name: "Car", maxConsumption: 4000 }, type: "SCHEDULED" }

    console.log("On ajoute un objet programmable à chaque maison");
    await addObject(houseID1, car);
    await addObject(houseID2, car);
    await addObject(houseID3, car);
    await addObject(houseID4, car);
    console.log("\n");

    console.log("On regarde les objets des maisons : ");
    console.log("\n");
    console.log("Pour la maison 1 : ");
    await checkObject(houseID1);
    console.log("Pour la maison 2 : ");
    await checkObject(houseID2);
    console.log("Pour la maison 3 : ");
    await checkObject(houseID3);
    console.log("Pour la maison 4 : ");
    await checkObject(houseID4);

    console.log("On demande un planing pour les objets planifiables : ");
    await askSchedule(houseID1, "Car");
    await askSchedule(houseID2, "Car");
    await askSchedule(houseID3, "Car");
    await askSchedule(houseID4, "Car");

    await waitTick(1);

    await sleep(2000)
    console.log(ANSI_GREEN+"\n\n================= STEP 3 ================="+ANSI_RESET)

    console.log("On regarde la consommation totale de toutes les maisons");
    var response = await doRequest({ url: "http://request-manager:3007/total-consumption", qs: {date:globalDate}, method: "GET" });
    console.log(ANSI_BLUE+"[service]:request-manager; [route]:total-consumption; [params]: " + JSON.stringify({date:globalDate}) + " => [return]:" + JSON.parse(response.body)+ANSI_RESET);
    console.log("Actuellement, la consommation totale est : "+response.body+" W.");

    await sleep(2000)
    console.log(ANSI_GREEN+"\n\n================= STEP 4 ================="+ANSI_RESET);
    console.log("On regarde la consommation dans la communauté");

    var response = await doRequest({ url: "http://request-manager:3007/community-consumption", qs: {date:globalDate,communityID:1}, method: "GET" });
    console.log(ANSI_BLUE+"[service]:request-manager; [route]:community-consumption; [params]: " + JSON.stringify({date:globalDate,communityID:1}) + " => [return]:" + JSON.stringify(response.body)+ANSI_RESET);
    console.log("Actuellement, la consommation de la communauté '1' est : "+response.body+" W.");

    await sleep(2000)
    console.log(ANSI_GREEN+"\n\n================= STEP 5 ================="+ANSI_RESET);
    console.log("On détecte un pic de consommation dans cette communautée");

    var topicListener = consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log("on a un pic de consommation dans la communauté : ")
            console.log(message.value.toString())  
        }
      })
    await topicListener;
    await sleep(5000)
    consumer.stop();
    consumer.disconnect();

    await waitTick(2);
    await sleep(2000)

    console.log(ANSI_GREEN+"\n\n================= STEP 6 ================="+ANSI_RESET);
    console.log("On demande au object panifiable d'arrêter de charger")

    await checkCarCons(houseID1);
    await checkCarCons(houseID2);
    await checkCarCons(houseID3);
    await checkCarCons(houseID4);

    await sleep(2000)
    console.log(ANSI_GREEN+"\n\n================= STEP 7 ================="+ANSI_RESET);
    console.log("On remarque qu’il n’y a plus de pic")
    var response = await doRequest({ url: "http://request-manager:3007/community-consumption", qs: {date:globalDate,communityID:1}, method: "GET" });
    console.log(ANSI_BLUE+"[service]:request-manager; [route]:community-consumption; [params]: " + JSON.stringify({date:globalDate,communityID:1}) + " => [return]:" + JSON.stringify(response.body)+ANSI_RESET);
    console.log("Actuellement, la consommation de la communauté '1' est : "+response.body+" W.");
    
}

async function checkCarCons(houseID) {
    var detailedObject = {
        date: globalDate,
        houseID: houseID,
        objectName: "Car"
    }
    console.log("\nOn peut voir que l’objet consomme à la date " + globalDate + " depuis smartGrid");
    var response = await doRequest({url:"http://consumption-detailed:3008/get-detailed-consumption", qs:detailedObject, method:"GET"});
    console.log(ANSI_BLUE+"[service]:consumption-detailed; [route]:get-detailed-consumption; [params]: " + JSON.stringify(detailedObject) + " => [return]:" + response.body+ANSI_RESET);
    console.log("La consommation de l'objet " + detailedObject.objectName + " de la maison d'ID " + houseID + " à la date du " + globalDate + " est : " + response.body + " W.");
}

async function checkObject(houseID) {
    var response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/get_all_object", method: "GET" });
    console.log(ANSI_BLUE+"[service]:house; [route]:house-editor/house/" + houseID + "/get_all_object" + "; [params]:_ => [return]: " + response.body+ANSI_RESET);
    console.log("On constate qu'ils ont bien été ajoutés :" + response.body);
    console.log("");
}

async function askSchedule(houseID, objectName) {
    console.log("On demande un planning de consommation :");
    var response = await doRequest({ url: "http://house:3000/manage-schedul-object/" + houseID + "/scheduled-object/" + objectName + "/requestTimeSlot", method: "POST" });
    console.log(ANSI_BLUE+"[service]:house; [route]:manage-schedul-object/" + houseID + "/scheduled-object/" + objectName + "/requestTimeSlot" + "; [params]:_ => [return]: " + response.body+ANSI_RESET);
    console.log("On reçoit le planning suivant :" + response.body);
    console.log("");
}



async function addObject(houseID, nameObject) {
    console.log("\nUn object est branché");
    var response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/add-object", form: nameObject, method: "POST" });
    console.log(ANSI_BLUE+"[service]:house; [route]:house-editor/house/" + houseID + "/add-object" + "; [params]: " + JSON.stringify(nameObject) + " => [return]:_"+ANSI_RESET);
}

async function doTick() {
    globalDate = globalDate.setMinutes(globalDate.getMinutes() + 10);
    await doRequest({ url: "http://house:3000/tick/", form: { date: globalDate }, method: "POST" });
    await doRequest({ url: "http://producers:3005/tick/", form: { date: globalDate }, method: "POST" });
}

async function waitTick(iterationNumber) {
    for (var i = 0; i < iterationNumber; i++) {
        await doTick();
    }
}




async function addHouse(client) {
    console.log("Une nouvelle maison souhaite s'inscrire : ");
    var response = await doRequest({ url: "http://house:3000/house-editor/add-house", form: client, method: "POST" });
    console.log(ANSI_BLUE+"[service]:house; [route]:house-editor/add-house; [params]:" + JSON.stringify(client) + " => [return]:" + response.body+ANSI_RESET);
    console.log("\n");
    return response.body;
}

async function doTick(){
    globalDate = new Date(globalDate.getTime()+1*60*1000);
    //Envoyer le tick à ceux qui en ont besoin.
    response = await doRequest({url:"http://house:3000/tick", form:{date:globalDate}, method:"POST"});
    response = await doRequest({url:"http://producers:3005/tick", form:{date:globalDate}, method:"POST"});
    await sleep(200);    

    response = await doRequest({url:"http://electricity-frame:3015/clock/tick", form:{date:globalDate}, method:"POST"});

    //Wait que tout s'envoie bien
    await sleep(200);    
}

async function waitTick(iterationNumber) {
    for (var i = 0; i < iterationNumber; i++) {
        await doTick();
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

main();

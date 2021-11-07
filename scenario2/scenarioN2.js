var request = require('request');
const { randomInt } = require('crypto');
const { Kafka } = require('kafkajs')
const URL_CLIENT_DATABASE = "http://client-database:3004"
const kafka = new Kafka({
    clientId: 'scenario2',
    brokers: ['kafka:9092'],
})

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
var pickDetection = undefined;



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
    await consumer.subscribe({ topic: 'consumption.peak', fromBeginning:false})

    console.log(ANSI_GREEN + "Scénario 2 : Gestion de la consommation, pic et autarcie dans une communauté");

    // STEP 0
    console.log(ANSI_GREEN + "\n\n================= STEP 0 =================" + ANSI_RESET)

    var scheduleStart = { dayDate: globalDate }
    doRequest({ url: "http://consumption-scheduler:3002/schedule", form: scheduleStart, method: "POST" });

    var response;
    console.log("On regarde le nombre de maisons actuellement inscrites : ");
    response = await doRequest({ url: "http://client-database:3004/client-registry/allHouses", method: "GET" });
    var responseBody = JSON.parse(response.body)
    var initialHouseCount = responseBody.length
    console.log(ANSI_BLUE + "[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]: (length)" + initialHouseCount + ANSI_RESET);
    console.log("Nombre de maison inscrite: " + ANSI_YELLOW + initialHouseCount + ANSI_RESET);

    // STEP 1
    console.log(ANSI_GREEN + "\n\n================= STEP 1 =================" + ANSI_RESET)
    console.log(ANSI_GREEN +"On a des maisons dans une communauté et une autre dans une autre communauté\n"+ ANSI_RESET);

    var client1 = { client_name: "Jean-Paul" };
    var houseID1 = await addHouse(client1);
    var communityHouse1 = (await getClient(houseID1)).id_community

    var client2 = { client_name: "Jean-Pierre" };
    var houseID2 = await addHouse(client2);
    var communityHouse2 = (await getClient(houseID2)).id_community

    var client3 = { client_name: "Jean-Sylvestre" };
    var houseID3 = await addHouse(client3);
    var communityHouse3 = (await getClient(houseID3)).id_community

    var client4 = { client_name: "Jean-Baptiste" };
    var houseID4 = await addHouse(client4);
    var communityHouse4 = (await getClient(houseID4)).id_community

    console.log("On regarde les maisons qui sont inscrites (4 nouvelles pour le scenario) : ");
    response = await doRequest({ url: "http://client-database:3004/client-registry/allHouses", method: "GET" });
    responseBody = JSON.parse(response.body)
    var currentHouseCount = responseBody.length
    console.log(ANSI_BLUE + "[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:" +currentHouseCount + ANSI_RESET);

    console.log("On a bien 4 maison en plus (initialement "+ANSI_YELLOW + initialHouseCount+ ANSI_RESET +") : " + ANSI_YELLOW + currentHouseCount + ANSI_RESET);

    //STEP 2
    console.log(ANSI_GREEN + "\n\n================= STEP 2 =================" + ANSI_RESET)
    console.log(ANSI_GREEN +"On ajoute plein d’objets planifiables et non planifiables dans les maisons"+ ANSI_RESET);

    var mixeur = { object: { name: "Mixeur", maxConsumption: 500, enabled: true }, type: "BASIC" }

    console.log("\nOn ajoute un objet non programmable à chaque maison");
    await addObject(houseID1, mixeur);
    await addObject(houseID2, mixeur);
    await addObject(houseID3, mixeur);
    await addObject(houseID4, mixeur);
    console.log("\n");


    var car = { object: { name: "Car", maxConsumption: 1300 }, type: "SCHEDULED" }
    var supercar = { object: { name: "Car", maxConsumption: 9000 }, type: "SCHEDULED" }


    console.log("On ajoute un objet programmable à chaque maison");
    await addObject(houseID1, car);
    await addObject(houseID2, supercar);
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
    await askSchedule(houseID2, "Car");//Super car
    await askSchedule(houseID3, "Car");
    await askSchedule(houseID4, "Car");

    var topicListener = consumer.run({
        eachMessage: async({ topic, partition, message }) => {
            pickDetection = message.value.toString();
        }
    })
    await topicListener;

    await waitTick(1);

    await sleep(2000)

    console.log(ANSI_GREEN + "\n\n================= STEP 3 =================" + ANSI_RESET)
    console.log(ANSI_GREEN +"On regarde la consommation totale de toutes les maisons"+ ANSI_RESET);

    var response = await doRequest({ url: "http://consumption-api:2998/total-consumption", qs: { date: globalDate }, method: "GET" });
    console.log(ANSI_BLUE + "\n[service]:consumption-api; [route]:total-consumption; [params]: " + JSON.stringify({ date: globalDate }) + " => [return]:" + JSON.parse(response.body) + ANSI_RESET);
    console.log("Actuellement, la consommation totale est : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");

    await sleep(2000)

    console.log(ANSI_GREEN + "\n\n================= STEP 4 =================" + ANSI_RESET);
    console.log(ANSI_GREEN +"On regarde la consommation dans la communauté "+communityHouse2+ ANSI_RESET);

    var response = await doRequest({ url: "http://consumption-api:2998/community-consumption", qs: { date: globalDate, communityID: communityHouse2 }, method: "GET" });
    console.log(ANSI_BLUE + "\n[service]:consumption-api; [route]:community-consumption; [params]: " + JSON.stringify({ date: globalDate, communityID: communityHouse2 }) + " => [return]:" + JSON.stringify(response.body) + ANSI_RESET);
    console.log("Actuellement, la consommation de la communauté "+ANSI_YELLOW + communityHouse2+ ANSI_RESET +" est : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");

    await sleep(2000)
    console.log(ANSI_GREEN + "\n\n================= STEP 5 =================" + ANSI_RESET);
    console.log(ANSI_GREEN + "On détecte un pic de consommation dans cette communauté"+ ANSI_RESET);


    await waitTick(10);
    await sleep(5000)
    console.log("\non a un pic de consommation dans la communauté : ")
    console.log(ANSI_YELLOW+pickDetection+ANSI_YELLOW);

    consumer.stop();
    consumer.disconnect();

    console.log(ANSI_GREEN + "\n\n================= STEP 6 =================" + ANSI_RESET);
    console.log(ANSI_GREEN +"On demande aux objets panifiables d'arrêter de charger de la communauté "+ANSI_YELLOW + communityHouse2+ ANSI_RESET)

    await checkCarCons(houseID1);
    await checkCarCons(houseID2);
    await checkCarCons(houseID3);
    await checkCarCons(houseID4);

    await sleep(2000)
    console.log(ANSI_GREEN + "\n\n================= STEP 7 =================" + ANSI_RESET);
    console.log(ANSI_GREEN + "On remarque qu’il n’y a maintenant plus de pic"+ ANSI_RESET)
    var response = await doRequest({ url: "http://consumption-api:2998/community-consumption", qs: { date: globalDate, communityID: communityHouse2 }, method: "GET" });
    console.log(ANSI_BLUE + "\n[service]:consumption-api; [route]:community-consumption; [params]: " + JSON.stringify({ date: globalDate, communityID: communityHouse2 }) + " => [return]:" + JSON.stringify(response.body) + ANSI_RESET);
    console.log("Actuellement, la consommation de la communauté "+ANSI_YELLOW + communityHouse2+ ANSI_RESET +" est : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");


    console.log(ANSI_GREEN + "\n\n================= STEP 8 =================" + ANSI_RESET);
    console.log(ANSI_GREEN + "On regarde si la communauté est en autarcie et ce n'est pas le cas"+ ANSI_RESET)

    var autarkyQs = { date: globalDate, communityID:communityHouse2}
    response = await doRequest({ url: "http://autarky-api:3021/get-community-autarky", qs: autarkyQs, method: "GET" });
    var exceedConsumption = response.body;
    console.log(ANSI_BLUE + "\n[service]:autarky-api; [route]:get-community-autarky; [params]:" + JSON.stringify(autarkyQs) + " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit que la valeur (prod - cons) est négative : " + ANSI_YELLOW +exceedConsumption + ANSI_RESET + " W donc la communauté "+ANSI_YELLOW + communityHouse2+ ANSI_RESET+" n'est pas en autarcie");

    var reqCommuNotif = {communityID: communityHouse2 }
    response = await doRequest({ url: "http://client-notifier:3031/client-notifier/get-community-message", qs: reqCommuNotif, method: "GET" });
    console.log(ANSI_BLUE + "\n[service]:client-notifier; [route]:client-notifier/get-community-message; [params]:" + communityHouse2 + " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit qu'il n'y a pas de notification pour la communauté : ");
    console.log("Messages reçus pour la communauté d'ID " + ANSI_YELLOW + communityHouse2+" : "+ response.body+ ANSI_RESET);

    console.log(ANSI_GREEN + "\n\n================= STEP 9 =================" + ANSI_RESET);
    console.log(ANSI_GREEN + "On ajoute la production suffisante dans une des maisons de la communauté pour passer en autarcie"+ ANSI_RESET);

    var neededProd = -(+exceedConsumption - 200);//Marge
    var velo = { object: { name: "Vélo d'appartement", maxProduction: neededProd, enabled: true }, type: "BASIC" }
    //la maison devien producteur
    response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID2 + "/become-producer", method: "POST" });


    console.log("\nOn ajoute un objet qui produit à la maison "+ANSI_YELLOW +houseID2+ ANSI_RESET +" de la communauté "+ANSI_YELLOW +communityHouse2+ ANSI_RESET);
    await addObject(houseID2, velo);
    await checkObject(houseID2);

    await waitTick(20);
    await sleep(1000)
    
    console.log("On vérifie que la communauté est bien passée en autarcie")

    autarkyQs = { date: globalDate, communityID:communityHouse2}
    response = await doRequest({ url: "http://autarky-api:3021/get-community-autarky", qs: autarkyQs, method: "GET" });
    console.log(ANSI_BLUE + "[service]:autarky-api; [route]:get-community-autarky; [params]:" + JSON.stringify(autarkyQs) + " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit que la valeur (prod - cons) est positive : " + ANSI_YELLOW +response.body + ANSI_RESET + " W donc la communauté "+ANSI_YELLOW +communityHouse2+ ANSI_RESET +" est maintenant en autarcie");

    reqCommuNotif = {communityID: communityHouse2 }
    response = await doRequest({ url: "http://client-notifier:3031/client-notifier/get-community-message", qs: reqCommuNotif, method: "GET" });
    console.log(ANSI_BLUE + "\n[service]:client-notifier; [route]:client-notifier/get-community-message; [params]:" + communityHouse2 + " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit qu'il a une notification pour la communauté : ");
    console.log("Messages reçus pour la communauté d'ID " + ANSI_YELLOW + communityHouse2+" : "+ response.body+ ANSI_RESET);


    console.log(ANSI_GREEN + "\n\n================= STEP 10 =================" + ANSI_RESET);
    console.log(ANSI_GREEN + "On ajoute un nouveau partenaire avec des datapoints, il récupère les données de production des clients  "+ ANSI_RESET);

    console.log("\nUn nouveau partenaire s'inscrit");
    var partnerID = "partenaire-scénario";
    var reqPartnerSub = {partnerID:partnerID, datapoint:100, trustLevel:2}
    response = await doRequest({ url: "http://partner-api:3019/add-partner", form: reqPartnerSub, method: "POST" });
    console.log(ANSI_BLUE + "[service]:partner-api; [route]:add-partner; [params]:" + JSON.stringify(reqPartnerSub) + " => [return]:_"+ ANSI_RESET);

    console.log("\nOn voit qu'on peut récuperer ses informations");
    response = await doRequest({ url: "http://partner-api:3019/get-partner-info", qs: {partnerID}, method: "GET" });
    console.log(ANSI_BLUE + "[service]:partner-api; [route]:get-partner-info; [params]:" + partnerID + " => [return]:"+response.body+ ANSI_RESET);
    console.log("Informations du partenaire :"+ANSI_YELLOW +response.body+ ANSI_RESET);

    console.log("\nLe partenaire récupère les données de production des clients (coûte 70 datapoints)");
    var reqPartnerRequest = {partnerID:partnerID, date:globalDate}
    response = await doRequest({ url: "http://partner-api:3019/request-production", qs: reqPartnerRequest, method: "GET" });
    console.log(ANSI_BLUE + "[service]:partner-api; [route]:request-production; [params]:" + JSON.stringify(reqPartnerRequest) + " => [return]:"+response.body+ ANSI_RESET);
    console.log("Données de production du "+ANSI_YELLOW +globalDate+ ANSI_RESET+" récupérées par le partenaire :\n"+ANSI_YELLOW +response.body+ ANSI_RESET);

    console.log("\nSon nombre de datapoints est mis à jour");
    response = await doRequest({ url: "http://partner-api:3019/get-partner-info", qs: {partnerID}, method: "GET" });
    console.log(ANSI_BLUE + "[service]:partner-api; [route]:get-partner-info; [params]:" + partnerID + " => [return]:"+response.body+ ANSI_RESET);
    console.log("Informations du partenaire :"+ANSI_YELLOW +response.body+ ANSI_RESET);


    console.log(ANSI_GREEN + "\n\n================= STEP 11 =================" + ANSI_RESET);
    console.log(ANSI_GREEN + "Le partenaire reprend des datapoints et récupère les données de consommation détaillée des clients mais n'a pas le niveau de confiance requis  "+ ANSI_RESET);

    console.log("\nLe partenaire à payé en amont, des datapoints lui sont ajoutés");
    var reqPartnerAddPoint = {partnerID:partnerID, datapoint:100}
    response = await doRequest({ url: "http://partner-api:3019/add-datapoint", form: reqPartnerAddPoint, method: "POST" });
    console.log(ANSI_BLUE + "[service]:partner-api; [route]:add-datapoint; [params]:" + JSON.stringify(reqPartnerAddPoint) + " => [return]:_"+ ANSI_RESET);

    console.log("\nSon nombre de datapoints est mis à jour");
    response = await doRequest({ url: "http://partner-api:3019/get-partner-info", qs: {partnerID}, method: "GET" });
    console.log(ANSI_BLUE + "[service]:partner-api; [route]:get-partner-info; [params]:" + partnerID + " => [return]:"+response.body+ ANSI_RESET);
    console.log("Informations du partenaire :"+ANSI_YELLOW +response.body+ ANSI_RESET);

    console.log("\nLe partenaire essaye de récupéré les données de consommation détaillée des clients (coûte 100 datapoints)")
    reqPartnerRequest = {partnerID:partnerID, date:globalDate}
    response = await doRequest({ url: "http://partner-api:3019/request-detailed-consumption", qs: reqPartnerRequest, method: "GET" });
    console.log(ANSI_BLUE + "[service]:partner-api; [route]:request-detailed-consumption; [params]:" + JSON.stringify(reqPartnerRequest) + " => [return]:"+response.body+ ANSI_RESET);
    console.log("Données de consommation détaillée du "+ANSI_YELLOW +globalDate+ ANSI_RESET+" récupérées par le partenaire :"+ANSI_YELLOW +response.body+ ANSI_RESET);
    console.log("Il ne récupère rien car n'a pas le niveau de confiance requis (nécéssaire : 3), ses datapoints ne sont pas débités");

    response = await doRequest({ url: "http://partner-api:3019/get-partner-info", qs: {partnerID}, method: "GET" });
    console.log(ANSI_BLUE + "\n[service]:partner-api; [route]:get-partner-info; [params]:" + partnerID + " => [return]:"+response.body+ ANSI_RESET);
    console.log("Informations du partenaire :"+ANSI_YELLOW +response.body+ ANSI_RESET);
}

async function checkCarCons(houseID) {
    var detailedObject = {
        date: globalDate,
        houseID: houseID,
        objectName: "Car"
    }
    console.log("\nOn peut voir que l’objet consomme à la date " + ANSI_YELLOW + globalDate + ANSI_RESET + " depuis smartGrid");
    var response = await doRequest({ url: "http://consumption-detailed:3008/get-detailed-consumption", qs: detailedObject, method: "GET" });
    console.log(ANSI_BLUE + "[service]:consumption-detailed; [route]:get-detailed-consumption; [params]: " + JSON.stringify(detailedObject) + " => [return]:" + response.body + ANSI_RESET);
    console.log("La consommation de l'objet " + ANSI_YELLOW + detailedObject.objectName + ANSI_RESET + " de la maison d'ID " + ANSI_YELLOW + houseID + ANSI_RESET + " à la date du " + ANSI_YELLOW + globalDate + ANSI_RESET + " est : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");
}

async function checkObject(houseID) {
    var response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/get_all_object", method: "GET" });
    console.log(ANSI_BLUE + "\n[service]:house; [route]:house-editor/house/" + houseID + "/get_all_object" + "; [params]:_ => [return]: " + response.body + ANSI_RESET);
    console.log("On constate qu'il a bien été ajouté :");
    console.log(ANSI_YELLOW + response.body + ANSI_RESET);
    console.log("");
}

async function askSchedule(houseID, objectName) {
    console.log("On demande un planning de consommation :");
    var response = await doRequest({ url: "http://house:3000/manage-schedul-object/" + houseID + "/scheduled-object/" + objectName + "/requestTimeSlot", method: "POST" });
    console.log(ANSI_BLUE + "[service]:house; [route]:manage-schedul-object/" + houseID + "/scheduled-object/" + objectName + "/requestTimeSlot" + "; [params]:_ => [return]: " + response.body + ANSI_RESET);
    console.log("On reçoit le planning suivant :");
    console.log( ANSI_YELLOW + response.body + ANSI_RESET);
    console.log("");
}



async function addObject(houseID, nameObject) {
    console.log("\nUn object est branché : ");
    console.log(ANSI_YELLOW + JSON.stringify(nameObject)+ANSI_RESET);
    var response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/add-object", form: nameObject, method: "POST" });
    console.log(ANSI_BLUE + "[service]:house; [route]:house-editor/house/" + houseID + "/add-object" + "; [params]: " + JSON.stringify(nameObject) + " => [return]:_" + ANSI_RESET);
}



async function addHouse(client) {
    console.log("Une nouvelle maison souhaite s'inscrire : ");
    var response = await doRequest({ url: "http://house:3000/house-editor/add-house", form: client, method: "POST" });
    console.log(ANSI_BLUE + "[service]:house; [route]:house-editor/add-house; [params]:" + JSON.stringify(client) + " => [return]:" + response.body + ANSI_RESET);
    console.log("\n");
    return response.body;
}

async function doTick() {
    globalDate = new Date(globalDate.getTime() + 1 * 60 * 1000);
    //Envoyer le tick à ceux qui en ont besoin.
    response = await doRequest({ url: "http://house:3000/tick", form: { date: globalDate }, method: "POST" });
    response = await doRequest({ url: "http://producers:3005/tick", form: { date: globalDate }, method: "POST" });
    await sleep(500);

    response = await doRequest({ url: "http://electricity-frame:3015/clock/tick", form: { date: globalDate }, method: "POST" });
    response = await doRequest({ url: "http://real-energy-output:3030/realEnergyOutput/tick", form: { date: globalDate }, method: "POST" });


    //Wait que tout s'envoie bien
    await sleep(200);
}

async function waitTick(iterationNumber) {
    for (var i = 0; i < iterationNumber; i++) {
        await doTick();
    }
}


async function getClient(houseID){
    var client = await doRequest({ url: URL_CLIENT_DATABASE+"/client-registry/house", qs: { houseID: houseID }, method: "GET" }).then((value)=>JSON.parse(value.body));
    return client;
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

main();

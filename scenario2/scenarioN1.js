var request = require('request');
const {generateBill2LastYear} = require("./inject-data-to-db")

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

async function main() {

    console.log(ANSI_GREEN + "Scénario 1 : inscription, object paramétrable et adaptation de la production avec la consommation\n" + ANSI_RESET);

    await beforeStep();

    // STEP 0
    console.log(ANSI_GREEN + "\n\n================= STEP 0 =================" + ANSI_RESET)

    var response;
    console.log("On regarde les maisons actuellement inscrites : ");
    response = await doRequest({ url: "http://client-database:3004/client-registry/allHouses", method: "GET" });
    var responseBody = JSON.parse(response.body)
    var nbHouseInit = responseBody.length
    console.log(ANSI_BLUE + "[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]: nb inscrit:" + responseBody.length + ANSI_RESET);
    console.log("Il y a " + ANSI_YELLOW + nbHouseInit + ANSI_RESET + " maison inscrite");

    // STEP 1
    console.log(ANSI_GREEN + "\n\n================= STEP 1 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "\nUne nouvelle maison s'inscrit à SmartGrid : " + ANSI_RESET);

    var client = { client_name: "Jean-Paul" };
    var mixeur = { object: { name: "Mixeur", maxConsumption: 500, enabled: true }, type: "BASIC" }

    response = await doRequest({ url: "http://house:3000/house-editor/add-house", form: client, method: "POST" });
    console.log(ANSI_BLUE + "[service]:house; [route]:house-editor/add-house; [params]:" + JSON.stringify(client) + " => [return]:" + response.body + ANSI_RESET);
    var houseID = response.body;

    //ajout de l'object
    response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/add-object", form: mixeur, method: "POST" });

    console.log("\nLa maison est inscrite :");
    response = await doRequest({ url: "http://client-database:3004/client-registry/allHouses", method: "GET" });
    var responseBody = JSON.parse(response.body)
    console.log(ANSI_BLUE + "[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]: nb inscrit:" + responseBody.length + ANSI_RESET);
    console.log("Il y a bien une maison en plus (initialement " + ANSI_YELLOW + nbHouseInit +ANSI_RESET+ ") : " + ANSI_YELLOW + responseBody.length + ANSI_RESET);

    // STEP 2
    console.log(ANSI_GREEN + "\n\n================= STEP 2 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "SmartGrid attribue un ID à la maison" + ANSI_RESET)

    console.log("\nLa maison reçoit un ID : " + ANSI_YELLOW + houseID + ANSI_RESET);

    //STEP 3 
    await waitTick(1);
    console.log(ANSI_GREEN + "\n\n================= STEP 3 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "\nLe client peut voir sa consommation depuis son boitier" + ANSI_RESET)

    response = await doRequest({ url: "http://house:3000/consumption/global", qs: { houseID: houseID }, method: "GET" });
    console.log(ANSI_BLUE + "[service]:house; [route]:consumption/global; [params]:houseID:" + houseID + " => [return]:" + response.body + ANSI_RESET);
    console.log("La consommation globale de la maison : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");

    console.log("\nLe client peut voir sa consommation depuis le site web");
    response = await doRequest({ url: "http://client-consumption-api:2997/house-global-consumption", qs: { date: globalDate, houseID: houseID }, method: "GET" });
    console.log(ANSI_BLUE + "[service]:client-consumption; [route]:house-global-consumption; [params]:date:" + globalDate + " ,houseID:" + houseID + " => [return]:" + response.body + ANSI_RESET);
    console.log("La consommation globale de la maison : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");


    //STEP 4 
    console.log(ANSI_GREEN + "\n\n================= STEP 4 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "Un nouveau producteur s'inscrit à SmartGrid" + ANSI_RESET)

    console.log("\nOn regarde le nombres producteurs actuellement inscrits : ");
    response = await doRequest({ url: "http://producer-database:3010/producer-registry/allProducers", method: "GET" });
    var initialProducerArray = JSON.parse(response.body)
    var initialCountProducer = initialProducerArray.length
    console.log(ANSI_BLUE + "[service]:producer-database; [route]:producer-registry/allProducers; [params]:_ => [return]: (nb inscrit) " + initialCountProducer + ANSI_RESET);
    console.log("On a " + ANSI_YELLOW + initialCountProducer + ANSI_RESET + " producteurs inscrits");

    var producer = { producerName: "ENGIE", production: 1000 }

    console.log("\nUn nouveau producteur souhaite s'inscrire : ");
    response = await doRequest({ url: "http://producers:3005/add-supplier", form: producer, method: "POST" });
    console.log(ANSI_BLUE + "[service]:supplier; [route]:add-supplier; [params]:" + JSON.stringify(producer) + " => [return]:" + response.body + ANSI_RESET);
    var producerID = response.body;

    console.log("\nLe producteur est inscrit : ");
    response = await doRequest({ url: "http://producer-database:3010/producer-registry/allProducers", method: "GET" });
    var currentProducerArray = JSON.parse(response.body)
    var currentCountProducer = currentProducerArray.length
    console.log(ANSI_BLUE + "[service]:producer-database; [route]:producer-registry/allProducers; [params]:_ => [return]: (nombre)" + currentCountProducer + ANSI_RESET);
    console.log("Notre producteur est bien inscrit (initialement " + ANSI_YELLOW + initialCountProducer + ANSI_RESET + ") : " + ANSI_YELLOW +currentCountProducer + ANSI_RESET);

    //STEP 5
    console.log(ANSI_GREEN + "\n\n================= STEP 5 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "SmartGrid attribue un ID au producteur" + ANSI_RESET)

    console.log("\nLe producteur reçoit un ID : " + ANSI_YELLOW + producerID + ANSI_RESET);

    //STEP 6
    console.log(ANSI_GREEN + "\n\n================= STEP 6 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On vérifie que la consommation est égale à la production" + ANSI_RESET)

    await waitTick(6);

    await sleep(1000);
    var dateReq = { date: globalDate };

    console.log("\nOn vérifie la tension de la ligne à la date du " + ANSI_YELLOW + globalDate + ANSI_RESET);

    response = await doRequest({ url: "http://consumption-api:2998/total-consumption", qs: dateReq, method: "GET" });
    console.log(ANSI_BLUE + "[service]:consumption-api; [route]:total-consumption; [params]: " + JSON.stringify(dateReq) + " => [return]:" + response.body + ANSI_RESET);
    console.log("Consommation : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");

    response = await doRequest({ url: "http://production-api:2999/total-production", qs: dateReq, method: "GET" });
    console.log(ANSI_BLUE + "[service]:production-api; [route]:total-production; [params]: " + JSON.stringify(dateReq) + " => [return]:" + response.body + ANSI_RESET);
    console.log("Production : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");
    console.log("On voit que la consommation est égale à la production")

    //STEP 7 
    console.log(ANSI_GREEN + "\n\n================= STEP 7 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "Un objet paramètrable est branché" + ANSI_RESET);

    var objectName = "voiture";
    var voiture = { object: { name: objectName, maxConsumption: 2000 }, type: "SCHEDULED" }

    response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/add-object", form: voiture, method: "POST" });
    console.log(ANSI_BLUE + "[service]:house; [route]:house-editor/house/" + houseID + "/add-object" + "; [params]: " + JSON.stringify(voiture) + " => [return]:_" + ANSI_RESET);

    response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/get_all_object", method: "GET" });
    console.log(ANSI_BLUE + "[service]:house; [route]:house-editor/house/" + houseID + "/get_all_object" + "; [params]:_ => [return]: " + response.body + ANSI_RESET);
    console.log("On constate qu'il a bien été ajouté :");
    console.log(ANSI_YELLOW + response.body + ANSI_RESET);

    //STEP 8 
    console.log(ANSI_GREEN + "\n\n================= STEP 8 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On demande un planning de consommation pour cet objet" + ANSI_RESET)

    response = await doRequest({ url: "http://consumption-scheduler:3002/schedule", form: { dayDate: globalDate }, method: "POST" });

    response = await doRequest({ url: "http://house:3000/manage-schedul-object/" + houseID + "/scheduled-object/" + objectName + "/requestTimeSlot", method: "POST" });
    console.log(ANSI_BLUE + "[service]:house; [route]:manage-schedul-object/" + houseID + "/scheduled-object/" + objectName + "/requestTimeSlot" + "; [params]:_ => [return]: " + response.body + ANSI_RESET);
    console.log("On reçoit le planning suivant :");
    console.log(ANSI_YELLOW + response.body + ANSI_RESET);

    //STEP 9 
    console.log(ANSI_GREEN + "\n\n================= STEP 9 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On voit que l'objet consomme à son heure d'activité" + ANSI_RESET)

    await waitTick(1);
    await sleep(2000);

    var detailedObject = {
        date: globalDate,
        houseID: houseID,
        objectName: objectName
    }

    console.log("\nOn peut voir que l’objet consomme à la date " + ANSI_YELLOW + globalDate + ANSI_RESET + " depuis smartGrid");
    response = await doRequest({ url: "http://client-consumption-api:2997/house-detailed-consumption", qs: detailedObject, method: "GET" });
    console.log(ANSI_BLUE + "[service]:client-consumption-api; [route]:house-detailed-consumption; [params]: " + JSON.stringify(detailedObject) + " => [return]:" + response.body + ANSI_RESET);
    console.log("La consommation de l'objet " + ANSI_YELLOW + objectName + ANSI_RESET + " de la maison d'ID " + ANSI_YELLOW + houseID + ANSI_RESET + " à la date du " + ANSI_YELLOW + globalDate + ANSI_RESET + " est : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");

    //STEP 10
    console.log(ANSI_GREEN + "\n\n================= STEP 10 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On constate que la consommation n'est plus égale à la production" + ANSI_RESET)

    dateReq = { date: globalDate };
    console.log("\nLa tension sur la ligne n'est plus stable à la date du " + ANSI_YELLOW + globalDate + ANSI_RESET + ", on demande aux producteurs de s’adapter :");

    response = await doRequest({ url: "http://consumption-api:2998/total-consumption", qs: dateReq, method: "GET" });
    console.log(ANSI_BLUE + "[service]:consumption-api; [route]:total-consumption; [params]: " + JSON.stringify(dateReq) + " => [return]:" + response.body + ANSI_RESET);
    console.log("Consommation : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");

    response = await doRequest({ url: "http://production-api:2999/total-production", qs: dateReq, method: "GET" });
    console.log(ANSI_BLUE + "[service]:production-api; [route]:total-production; [params]: " + JSON.stringify(dateReq) + " => [return]:" + response.body + ANSI_RESET);
    console.log("Production : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");

    //STEP 11 
    console.log(ANSI_GREEN + "\n\n================= STEP 11 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On vérifie que la production s’est bien adaptée " + ANSI_RESET);

    await waitTick(1);
    await sleep(5000);

    dateReq = { date: globalDate };

    response = await doRequest({ url: "http://production-api:2999/total-production", qs: dateReq, method: "GET" });
    console.log(ANSI_BLUE + "[service]:production-api; [route]:total-production; [params]: " + JSON.stringify(dateReq) + " => [return]:" + response.body + ANSI_RESET);
    console.log("Production : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");

    //STEP 11 
    console.log(ANSI_GREEN + "\n\n================= STEP 12 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "Trois mois s'écoulent, le client veut voir sa facture du premier mois et du mois courant " + ANSI_RESET);

    var firstYear = globalDate.getFullYear();
    var firstMonth = globalDate.getMonth();
    //TODO : s'écouler 3 mois
    generateBill2LastYear(houseID);
    await sleep(2000)
    await waitTick(20);


    var firstMonthBillReq = {houseID:houseID, year:firstYear, month:firstMonth};   
    var currMonthBillReq = {houseID:houseID, year:globalDate.getFullYear(), month:globalDate.getMonth()+1};    

    response = await doRequest({ url: "http://bill-api:3016/bill/bill-for-house", qs: firstMonthBillReq, method: "GET" });
    console.log(ANSI_BLUE + "[service]:bill-api; [route]:bill/bill-for-house; [params]: " + JSON.stringify(firstMonthBillReq) + " => [return]:" + response.body + ANSI_RESET);
    console.log("Facture du premier mois ("+ANSI_YELLOW + firstMonth+"/"+firstYear + ANSI_RESET +") : ");
    console.log(ANSI_YELLOW + response.body + ANSI_RESET);

    response = await doRequest({ url: "http://bill-api:3016/bill/generate-temporary-bill", qs: currMonthBillReq, method: "GET" });
    console.log(ANSI_BLUE + "[service]:bill-api; [route]:bill/generate-temporary-bill; [params]: " + JSON.stringify(currMonthBillReq) + " => [return]:" + response.body + ANSI_RESET);
    console.log("Facture du mois courant ("+ANSI_YELLOW + (globalDate.getMonth()+1)+"/"+globalDate.getFullYear()+ ANSI_RESET +") : ");
    console.log(ANSI_YELLOW+ response.body+ANSI_RESET);
}

async function beforeStep() {
    //------ BEFORE STEPS ------

    var response;
    var mixeur = { object: { name: "Mixeur", maxConsumption: 500, enabled: true}, type: "BASIC" }
        //On inscrit des maisons et ajout des objets
    response = await doRequest({ url: "http://house:3000/house-editor/add-house", form: { client_name: "Jean" }, method: "POST" });
    var houseID1 = response.body;
    response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID1 + "/add-object", form: mixeur, method: "POST" });

    response = await doRequest({ url: "http://house:3000/house-editor/add-house", form: { client_name: "Paul" }, method: "POST" });
    var houseID2 = response.body;
    response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID2 + "/add-object", form: mixeur, method: "POST" });

    response = await doRequest({ url: "http://house:3000/house-editor/add-house", form: { client_name: "Jacque" }, method: "POST" });
    var houseID3 = response.body;
    response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID3 + "/add-object", form: mixeur, method: "POST" });

    //On inscrit un producteur et on fixe sa production
    var producer = { producerName: "EDF", production: 1000 }
    response = await doRequest({ url: "http://producers:3005/add-supplier", form: producer, method: "POST" });
    await sleep(1000);
    await waitTick(5); //premier tick pour commencer a avoir des données
}

async function doTick() {
    globalDate = new Date(globalDate.getTime() + 1 * 60 * 1000);
    //Envoyer le tick à ceux qui en ont besoin.
    response = await doRequest({ url: "http://house:3000/tick", form: { date: globalDate }, method: "POST" });
    response = await doRequest({ url: "http://producers:3005/tick", form: { date: globalDate }, method: "POST" });
    await sleep(600);

    response = await doRequest({ url: "http://electricity-frame:3015/clock/tick", form: { date: globalDate }, method: "POST" });
    response = await doRequest({ url: "http://real-energy-output:3030/realEnergyOutput/tick", form: { date: globalDate }, method: "POST" });


    //Wait que tout s'envoie bien
    await sleep(300);
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
var request = require('request');

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

function doRequest(req) {
    return new Promise(function(resolve, reject) {
        request(req, function(error, res, body) {
            resolve({ error, res, body });
        });
    });
}

var globalDate = new Date();

async function main(){
    console.log(ANSI_GREEN+"Scénario 3 : Production d'une maison et autarcie\n");

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
    console.log(ANSI_GREEN + "On inscrit une maison avec des objets consommant de l'éléctricité et on l'inscrit en tant que producteur" + ANSI_RESET)

    var client = { client_name: "Jean-Paul" };
    var mixeur = { object: { name: "Mixeur", maxConsumption: 500, enabled: true }, type: "BASIC" }

    console.log("\nOn inscrit une maison et on lui ajoute un objet qui consomme 500 W : ");
    var response = await doRequest({ url: "http://house:3000/house-editor/add-house", form: client, method: "POST" });
    console.log(ANSI_BLUE + "[service]:house; [route]:house-editor/add-house; [params]:" + JSON.stringify(client) + " => [return]:" + response.body + ANSI_RESET);
    var houseID = response.body;

    console.log("\nOn inscrit une maison en tant que producteur : ");
    response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/become-producer", method: "POST" });
    console.log(ANSI_BLUE + "[service]:house; [route]:house-editor/" + houseID + "/become-producer; [params]:_ => [return]:" + response.body + ANSI_RESET);
    var houseProdID = response.body;

    await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/add-object", form: mixeur, method: "POST" });

    console.log("\nLa maison est inscrite :");
    response = await doRequest({ url: "http://client-database:3004/client-registry/allHouses", method: "GET" });
    var responseBody = JSON.parse(response.body)
    console.log(ANSI_BLUE + "[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]: nb inscrit:" + responseBody.length + ANSI_RESET);
    console.log("Il y a bien une maison en plus (initialement " + ANSI_YELLOW + nbHouseInit + ANSI_RESET + ") : " + ANSI_YELLOW + responseBody.length+ ANSI_RESET );

    console.log("\nOn regarde les objets de la maison :");
    await checkObject(houseID);

    // STEP 2
    console.log(ANSI_GREEN + "\n\n================= STEP 2 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On ajoute à la maison un objet produisant de l'électricité et une batterie " + ANSI_RESET)

    var objProd = { object: { name: "Roue du hamster", maxConsumption: -300, enabled: true }, type: "BASIC" }

    console.log("\nOn ajoute à la maison " + ANSI_YELLOW +  houseID + ANSI_RESET + " l'objet de production : ");
    console.log(ANSI_YELLOW + JSON.stringify(objProd)+ ANSI_RESET);
    await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/add-object", form: objProd, method: "POST" });

    //TODO AJOUTER UNE BATTERIE DANS LA MAISON
    var batteryID;//= TODO

    console.log("\nOn regarde les objets de la maison :");
    await checkObject(houseID);

    await doTick(1);
    console.log("\nOn regarde depuis smartGrid si la batterie a bien été ajoutée");
    var batteryReq = {producerID:houseProdID,batteryID:batteryID}

    response = await doRequest({ url: "http://battery:3018/get-battery-info", qs: batteryReq, method: "GET" });
    console.log(ANSI_BLUE + "[service]:battery; [route]:get-battery-info; [params]:" + JSON.stringify(batteryReq)+ " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit qu'on a bien des informations sur la batterie : " + ANSI_YELLOW + response.body + ANSI_RESET);
    //SUR DEUX LIGNES ??????

    // STEP 3
    console.log(ANSI_GREEN + "\n\n================= STEP 3 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On remarque que la consommation est réduite mais toujours positive" + ANSI_RESET)

    console.log("\nOn vérifie que la maison" + houseID + " consomme toujours");
    var reqQs = { houseID: houseID };
    response = await doRequest({ url: "http://house:3000/consumption/global", qs: reqQs, method: "GET" });
    console.log(ANSI_BLUE + "[service]:house; [route]:consumption/global; [params]:" + houseID + " => [return]:" + response.body + ANSI_RESET);
    console.log("La consommation de la maison est positive : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");
    await sleep(2000);

    // STEP 4
    console.log(ANSI_GREEN + "\n\n================= STEP 4 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On regarde la production de la maison depuis SmartGrid, celle-ci est accessible mais pas suffisante" + ANSI_RESET)

    console.log("\nOn accède à la production de la maison depuis SmartGrid avec l'id de producteur et on vérifie qu'elle est accessible");
    await waitTick(4);
    await sleep(2000);
    reqQs = { date: globalDate, producerID: houseProdID };
    response = await doRequest({ url: "http://production-api:2999/detailed-production", qs: reqQs, method: "GET" });
    console.log(ANSI_BLUE + "[service]:request-manager; [route]:detailed-production; [params]:" + JSON.stringify(reqQs) + " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit qu'il y a une production pour cette maison (mais pas suffisante pour la consommation) :" + ANSI_YELLOW + response.body + ANSI_RESET + " W.");

    //STEP 5
    console.log(ANSI_GREEN + "\n\n================= STEP 5 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On voit que la maison n'est pas en autarcie " + ANSI_RESET)

    reqQs = { date: globalDate, clientID: houseID }
    response = await doRequest({ url: "http://realEnergyOutput:3030/realEnergyOutput/get-house-real-energy-output", qs: reqQs, method: "GET" });
    console.log(ANSI_BLUE + "[service]:real-energy-output; [route]:get-house-real-energy-output; [params]:" + JSON.stringify(reqQs) + " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit que la valeur (prod - cons) est negative : " + ANSI_YELLOW + response.body+ ANSI_RESET  + " W donc on est pas en autarcie");

    var batteryReqWithDate = {date:globalDate,producerID:houseProdID,batteryID:batteryID}

    response = await doRequest({ url: "http://battery:3018/get-battery-state", qs: batteryReqWithDate, method: "GET" });
    console.log(ANSI_BLUE + "[service]:battery; [route]:get-battery-state; [params]:" + JSON.stringify(batteryReq)+ " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit que la batterie n'a rien stocké : " + ANSI_YELLOW + response.body + ANSI_RESET);
    //SUR DEUX LIGNES ??????

    // STEP 6
    console.log(ANSI_GREEN + "\n\n================= STEP 6 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On ajoute un deuxième objet producteur dans la maison" + ANSI_RESET)

    var objProd = { object: { name: "Générateur nucléaire DIY", maxConsumption: -600, enabled: true }, type: "BASIC" }

    console.log("\nOn ajoute à la maison " + ANSI_YELLOW + houseID + ANSI_RESET + " l'objet de production : ");
    console.log(ANSI_YELLOW + JSON.stringify(objProd)+ ANSI_RESET );
    await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/add-object", form: objProd, method: "POST" });

    console.log("\nOn regarde les objets de la maison :");
    await checkObject(houseID);

    // STEP 7
    console.log(ANSI_GREEN + "\n\n================= STEP 7 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On remarque que la consommation est maintenant nulle" + ANSI_RESET)

    reqQs = { houseID: houseID };
    response = await doRequest({ url: "http://house:3000/consumption/global", qs: reqQs, method: "GET" });
    console.log(ANSI_BLUE + "[service]:house; [route]:consumption/global; [params]:" + houseID + " => [return]:" + response.body + ANSI_RESET);
    console.log("\nLa consommation de la maison est nulle : " + ANSI_YELLOW + response.body + " W.");

    // STEP 8
    console.log(ANSI_GREEN + "\n\n================= STEP 8 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On voit que la production est maintenant plus grande que la consommation" + ANSI_RESET)

    await waitTick(5);
    await sleep(1000);
    reqQs = { date: globalDate, producerID: houseProdID };
    response = await doRequest({ url: "http://production-api:2999/detailed-production", qs: reqQs, method: "GET" });
    console.log(ANSI_BLUE + "[service]:request-manager; [route]:detailed-production; [params]:" + JSON.stringify(reqQs) + " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit bien qu'il a une production pour cette maison : " + ANSI_YELLOW + response.body + ANSI_RESET + " W.");

    //STEP 9
    console.log(ANSI_GREEN + "\n\n================= STEP 9 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On voit maintenant que la maison est en autarcie " + ANSI_RESET)

    reqQs = { date: globalDate, clientID: houseID }
    response = await doRequest({ url: "http://realEnergyOutput:3030/realEnergyOutput/get-house-real-energy-output", qs: reqQs, method: "GET" });
    console.log(ANSI_BLUE + "[service]:real-energy-output; [route]:get-house-real-energy-output; [params]:" + JSON.stringify(reqQs) + " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit que la valeur (prod - cons) est positive : " + ANSI_YELLOW + response.body + ANSI_RESET + " W donc on est en autarcie");

    //STEP 10 
    console.log(ANSI_GREEN + "\n\n================= STEP 10 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On constate que la batterie a stockée le surplus d'énergie  " + ANSI_RESET)

    batteryReqWithDate = {date:globalDate,producerID:houseProdID,batteryID:batteryID}

    response = await doRequest({ url: "http://battery:3018/get-battery-state", qs: batteryReqWithDate, method: "GET" });
    console.log(ANSI_BLUE + "[service]:battery; [route]:get-battery-state; [params]:" + JSON.stringify(batteryReq)+ " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit que la batterie a stocké le surplus d'énergie : " + ANSI_YELLOW + response.body + ANSI_RESET);
    //SUR DEUX LIGNES ??????
}

async function doTick() {
    globalDate = new Date(globalDate.getTime() + 1 * 60 * 1000);
    //Envoyer le tick à ceux qui en ont besoin.
    response = await doRequest({ url: "http://house:3000/tick", form: { date: globalDate }, method: "POST" });
    response = await doRequest({ url: "http://producers:3005/tick", form: { date: globalDate }, method: "POST" });
    await sleep(600);

    response = await doRequest({ url: "http://electricity-frame:3015/clock/tick", form: { date: globalDate }, method: "POST" });

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

async function checkObject(houseID) {
    var response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/get_all_object", method: "GET" });
    console.log(ANSI_BLUE + "[service]:house; [route]:house-editor/house/" + houseID + "/get_all_object" + "; [params]:_ => [return]: " + response.body + ANSI_RESET);
    console.log("On a les objets suivants :");
    console.log(ANSI_YELLOW + response.body+ ANSI_RESET );
}

main()

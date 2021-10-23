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
    console.log("Il y a " + nbHouseInit + " maison inscrite");

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
    console.log("Il y a bien une maison en plus (initialement " + nbHouseInit + ") : " + responseBody.length);

    console.log("\nOn regarde les objets de la maison :");
    await checkObject(houseID);

    // STEP 2
    console.log(ANSI_GREEN + "\n\n================= STEP 2 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On ajoute à la maison un objet produisant de l'électricité " + ANSI_RESET)

    var objProd = { object: { name: "Roue du hamster", maxConsumption: -300, enabled: true }, type: "BASIC" }

    console.log("\nOn ajoute à la maison " + houseID + " l'objet de production : " + JSON.stringify(objProd));
    await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/add-object", form: objProd, method: "POST" });

    console.log("\nOn regarde les objets de la maison :");
    await checkObject(houseID);

    // STEP 3
    console.log(ANSI_GREEN + "\n\n================= STEP 3 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On remarque que la consommation est réduite mais toujours positive" + ANSI_RESET)

    console.log("\nOn vérifie que la maison" + houseID + " consomme toujours");
    var reqQs = { houseID: houseID };
    response = await doRequest({ url: "http://house:3000/consumption/global", qs: reqQs, method: "GET" });
    console.log(ANSI_BLUE + "[service]:house; [route]:consumption/global; [params]:" + houseID + " => [return]:" + response.body + ANSI_RESET);
    console.log("La consommation de la maison est positive : " + response.body + " W.");
    await sleep(2000);

    // STEP 4
    console.log(ANSI_GREEN + "\n\n================= STEP 4 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On regarde la production de la maison, celle-ci est accessible mais pas suffisante" + ANSI_RESET)

    console.log("\nOn accède à la production de la maison avec l'id de producteur et on vérifie qu'elle est accessible");
    await waitTick(5);
    await sleep(2000);
    reqQs = { date: globalDate, producerID: houseProdID };
    response = await doRequest({ url: "http://production-api:2999/detailed-production", qs: reqQs, method: "GET" });
    console.log(ANSI_BLUE + "[service]:request-manager; [route]:detailed-production; [params]:" + JSON.stringify(reqQs) + " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit bien qu'il y a une production pour cette maison (mais pas suffisante pour la consommation) :" + response.body + " W.");

    //STEP 5
    console.log(ANSI_GREEN + "\n\n================= STEP 5 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On voit que la maison n'est pas en autarcie " + ANSI_RESET)

    reqQs = { date: globalDate, clientID: houseID }
    response = await doRequest({ url: "http://autarky:3030/autarky/get-house-autarky", qs: reqQs, method: "GET" });
    console.log(ANSI_BLUE + "[service]:autarky; [route]:get-house-autarky; [params]:" + JSON.stringify(reqQs) + " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit que la valeur (prod - cons) est negative : " + response.body + " W donc on est pas en autarcie");

    // STEP 6
    console.log(ANSI_GREEN + "\n\n================= STEP 6 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On ajoute un deuxième objet producteur dans la maison" + ANSI_RESET)

    var objProd = { object: { name: "Générateur nucléaire DIY", maxConsumption: -600, enabled: true }, type: "BASIC" }

    console.log("\nOn ajoute à la maison " + houseID + " l'objet de production : " + JSON.stringify(objProd));
    await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/add-object", form: objProd, method: "POST" });

    console.log("\nOn regarde les objets de la maison :");
    await checkObject(houseID);

    // STEP 7
    console.log(ANSI_GREEN + "\n\n================= STEP 7 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On remarque que la consommation est maintenant négative" + ANSI_RESET)

    reqQs = { houseID: houseID };
    response = await doRequest({ url: "http://house:3000/consumption/global", qs: reqQs, method: "GET" });
    console.log(ANSI_BLUE + "[service]:house; [route]:consumption/global; [params]:" + houseID + " => [return]:" + response.body + ANSI_RESET);
    console.log("\nLa consommation de la maison n'est plus positive : " + response.body + " W.");

    // STEP 8
    console.log(ANSI_GREEN + "\n\n================= STEP 8 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On voit que la production est maintenant plus grande que la consommation" + ANSI_RESET)

    await waitTick(5);
    await sleep(1000);
    reqQs = { date: globalDate, producerID: houseProdID };
    response = await doRequest({ url: "http://production-api:2999/detailed-production", qs: reqQs, method: "GET" });
    console.log(ANSI_BLUE + "[service]:request-manager; [route]:detailed-production; [params]:" + JSON.stringify(reqQs) + " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit bien qu'il a une production pour cette maison : " + response.body + " W.");

    //STEP 9
    console.log(ANSI_GREEN + "\n\n================= STEP 9 =================" + ANSI_RESET)
    console.log(ANSI_GREEN + "On voit maintenant que la maison est en autarcie " + ANSI_RESET)

    reqQs = { date: globalDate, clientID: houseID }
    response = await doRequest({ url: "http://autarky:3030/autarky/get-house-autarky", qs: reqQs, method: "GET" });
    console.log(ANSI_BLUE + "[service]:autarky; [route]:get-house-autarky; [params]:" + JSON.stringify(reqQs) + " => [return]:" + response.body + ANSI_RESET);
    console.log("On voit que la valeur (prod - cons) est positive : " + response.body + " W donc on est en autarcie");
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
    console.log("On a les objets suivants :" + response.body);
}

main()
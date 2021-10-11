var request = require('request');

async function doRequest(req) {
    return await new Promise(function(resolve, reject) {
        request(req, function(error, res, body) {
            resolve({ error, res, body });
        });
    });
}

var globalDate = new Date();

async function main() {
    console.log("\n\n================= ================= SCENARIO2 ================= =================")
    console.log("\n");
    console.log("\n");
    console.log("Scénario 2 : pic dans une communauté");

    //await beforeStep();

    var scheduleStart = { dayDate: globalDate }
    doRequest({ url: "http://consumption-scheduler:3002/schedule", form: scheduleStart, method: "POST" });

    var response;
    console.log("On regarde les maisons actuellement inscrites : ");
    response = await doRequest({ url: "http://client-database:3004/client-registry/allHouses", method: "GET" });
    console.log("[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:" + response.body);
    console.log("Les maisons inscrites : " + response.body);
    console.log("\n");
    console.log("\n");

    // STEP 1
    var client1 = { client_name: "Jean-Paul" };
    var houseID1 = await addHouse(client1);
    sleep(1000);

    var client2 = { client_name: "Jean-Pierre" };
    var houseID2 = await addHouse(client2);
    sleep(1000);

    var client3 = { client_name: "Jean-Sylvestre" };
    var houseID3 = await addHouse(client3);
    sleep(1000);

    var client4 = { client_name: "Jean-Baptiste" };
    var houseID4 = await addHouse(client4);
    sleep(1000);

    var client5 = { client_name: "Jean-Charles" };
    var houseID5 = await addHouse(client5);
    sleep(1000);

    var client6 = { client_name: "Jean-Claude" };
    var houseID6 = await addHouse(client6);
    sleep(1000);

    var client7 = { client_name: "Jean-Eudes" };
    var houseID7 = await addHouse(client7);
    sleep(1000);

    var client8 = { client_name: "Jean-François" };
    var houseID8 = await addHouse(client8);
    sleep(1000);

    var client9 = { client_name: "Jean-Jacques" };
    var houseID9 = await addHouse(client9);
    sleep(1000);

    console.log("On regarde les maisons qui sont inscrites : ");
    response = await doRequest({ url: "http://client-database:3004/client-registry/allHouses", method: "GET" });
    console.log("[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:" + response.body);
    console.log("Les maisons inscrites : " + response.body);
    console.log("\n");
    console.log("\n");

    // STEP 2
    console.log("\n\n================= STEP 2 =================")
    console.log("\n");
    console.log("\n");
    var mixeur = { object: { name: "Mixeur", maxConsumption: 500, enabled: true }, type: "BASIC" }
    console.log("On ajoute un objet non programmable a chaque maison");
    await addObject(houseID1, mixeur);
    await addObject(houseID2, mixeur);
    await addObject(houseID3, mixeur);
    await addObject(houseID4, mixeur);
    await addObject(houseID5, mixeur);
    await addObject(houseID6, mixeur);
    await addObject(houseID7, mixeur);
    await addObject(houseID8, mixeur);
    await addObject(houseID9, mixeur);
    console.log("\n");


    var car = { object: { name: "Car", maxConsumption: 1050 }, type: "SCHEDULED" }

    console.log("On ajoute un objet programmable a chaque maison");
    await addObject(houseID1, car);
    await addObject(houseID2, car);
    await addObject(houseID3, car);
    await addObject(houseID4, car);
    await addObject(houseID5, car);
    await addObject(houseID6, car);
    await addObject(houseID7, car);
    await addObject(houseID8, car);
    await addObject(houseID9, car);
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
    console.log("Pour la maison 5 : ");
    await checkObject(houseID5);
    console.log("Pour la maison 6 : ");
    await checkObject(houseID6);
    console.log("Pour la maison 7 : ");
    await checkObject(houseID7);
    console.log("Pour la maison 8 : ");
    await checkObject(houseID8);
    console.log("Pour la maison 9 : ");
    await checkObject(houseID9);
    console.log("\n");



    console.log("On demande un schedule pour les objets planifiables : ");
    console.log("\n");
    await askSchedule(houseID1, "Car");
    await askSchedule(houseID2, "Car");
    await askSchedule(houseID3, "Car");
    await askSchedule(houseID4, "Car");
    await askSchedule(houseID5, "Car");
    await askSchedule(houseID6, "Car");
    await askSchedule(houseID7, "Car");
    await askSchedule(houseID8, "Car");
    await askSchedule(houseID9, "Car");
    console.log("\n");



    // STEP 3

    console.log("\n\n================= STEP 3 =================")
    console.log("\n");
    console.log("\n");
    var communityReq = { houseID: houseID1 };
    console.log("On regarde la communauté de la maison 1");
    reponse = await doRequest({ url: "http://client-database:3004/client-registry/house", qs: communityReq, method: "GET" });
    console.log("[service]:client-database; [route]:client-registry/house; [params]: " + JSON.stringify(communityReq) + " => [return]:" + response.body);
    var communityID = response.body.id_community;
    console.log("\n");
    console.log("\n");

    var peakReq = { date: globalDate, ID: communityID };
    console.log("On vérifie si il y a un pic dans la communauté " + communityID + " à la date du " + globalDate);
    reponse = await doRequest({ url: "http://consumption-verifier:3007/consumption-peak", qs: peakReq, method: "GET" });
    console.log("[service]:consumption-db; [route]:consumption-peak; [params]: " + JSON.stringify(peakReq) + " => [return]:" + response.body);
    console.log("Pic : " + response.body);
    console.log("\n");
    console.log("\n");

    // STEP 4

    console.log("\n\n================= STEP 4 =================")
    console.log("\n");
    console.log("\n");
    console.log("On vérifie que tous les objets planifiables ont été shutdown");
    console.log("\n");

    await checkCarCons(houseID1);
    await checkCarCons(houseID2);
    await checkCarCons(houseID3);
    await checkCarCons(houseID4);
    await checkCarCons(houseID5);
    await checkCarCons(houseID6);
    await checkCarCons(houseID7);
    await checkCarCons(houseID8);
    await checkCarCons(houseID9);

    // STEP 5
    console.log("\n\n================= STEP 5 =================")
    console.log("\n");
    console.log("\n");
    console.log("On vérifie si il y a un pic dans la communauté " + communityID + " à la date du " + globalDate);
    response = await doRequest({ url: "http://consumption-verifier:3007/consumption-peak", qs: peakReq, method: "GET" });
    console.log("[service]:consumption-db; [route]:consumption-peak; [params]: " + JSON.stringify(peakReq) + " => [return]:" + response.body);
    console.log("Pic : " + response.body);
    console.log("\n");
    console.log("\n");
}

async function checkCarCons(houseID) {
    var detailedObject = {
        date: globalDate,
        houseID: houseID,
        objectName: "Car"
    }
    console.log("\nOn peut voir que l’objet consomme à la date " + globalDate + " depuis smartGrid");
    response = await doRequest({ url: "http://consumption-manager:3008/get-detailed-consumption", qs: detailedObject, method: "GET" });
    sleep(2500);
    console.log("[service]:consumption-manager; [route]:get-detailed-consumption; [params]: " + JSON.stringify(detailedObject) + " => [return]:" + response.body);
    console.log("La consommation de l'objet " + detailedObject.objectName + " de la maison d'ID " + houseID + " à la date du " + globalDate + " est : " + response.body);

}

async function checkObject(houseID) {
    response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/get_all_object", method: "GET" });
    sleep(2000);
    console.log("[service]:house; [route]:house-editor/house/" + houseID + "/get_all_object" + "; [params]:_ => [return]: " + response.body);
    console.log("On constate qu'il a bien été ajouté :" + response.body);
    console.log("\n");
}

async function askSchedule(houseID, objectName) {
    console.log("On demande un planning de consommation :");
    var response = await doRequest({ url: "http://house:3000/manage-schedul-object/" + houseID + "/scheduled-object/" + objectName + "/requestTimeSlot", method: "POST" });
    console.log("[service]:house; [route]:manage-schedul-object/" + houseID + "/scheduled-object/" + objectName + "/requestTimeSlot" + "; [params]:_ => [return]: " + response.body);
    console.log("On reçoit le planning suivant :" + response.body);
    console.log("\n");
}



async function addObject(houseID, nameObject) {
    console.log("\nUn object paramètrable est branché");
    await sleep(2000);
    response = await doRequest({ url: "http://house:3000/house-editor/house/" + houseID + "/add-object", form: nameObject, method: "POST" });
    console.log("[service]:house; [route]:house-editor/house/" + houseID + "/add-object" + "; [params]: " + JSON.stringify(nameObject) + " => [return]:_");
}

async function doTick() {
    globalDate = globalDate.setMinutes(globalDate.getMinutes() + 10);
    await doRequest({ url: "http://house:3000/tick/", form: { date: globalDate }, method: "POST" });
    await doRequest({ url: "http://supplier:3005/tick/", form: { date: globalDate }, method: "POST" });
}

async function waitTick(iterationNumber) {
    for (var i = 0; i < iterationNumber; i++) {
        await doTick();
    }
}




async function addHouse(client) {
    console.log("Une nouvelle maison souhaite s'inscrire : ");
    var response = await doRequest({ url: "http://house:3000/house-editor/add-house", form: client, method: "POST" });
    console.log("[service]:house; [route]:house-editor/add-house; [params]:" + JSON.stringify(client) + " => [return]:" + response.body);
    console.log("\n");
    await sleep(1000);
    return response.body;
}
async function beforeStep() {
    var scheduleStart = { dayDate: globalDate }
    doRequest({ url: "http://consumption-scheduler:3002/schedule", form: scheduleStart, method: "POST" });
    var response;
    var mixeur = { object: { name: "Mixeur", maxConsumption: 500, enabled: true }, type: "BASIC" }
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
    response = await doRequest({ url: "http://supplier:3005/add-supplier", form: producer, method: "POST" });
    await sleep(2000)

    var producer = { producerName: "ENGIE", production: 1000 }

}
async function doTick() {
    globalDate = new Date(globalDate.setMinutes(globalDate.getMinutes() + 10));
    response = await doRequest({ url: "http://house:3000/tick", form: { date: globalDate }, method: "POST" });
    response = await doRequest({ url: "http://supplier:3005/tick", form: { date: globalDate }, method: "POST" });
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
}

main();
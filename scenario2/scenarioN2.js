
var request = require('request');

function doRequest(req) {
    return new Promise(function (resolve, reject) {
        request(req, function (error, res, body) {
            resolve({error, res, body});
        });
    });
}

var globalDate = new Date();

async function main() {
    console.log("Scénario 2 : pic dans une communauté");

    await beforeStep();

    var response;
    console.log("On regarde les maisons actuellement inscrites : ");
    response = await doRequest({url:"http://client-database:3004/client-registry/allHouses", method:"GET"});
    console.log("[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:"+response.body);
    console.log("Les maisons inscrites : "+response.body);
    console.log("\n");
    console.log("\n");

    // STEP 1
    var client1 = {client_name:"Jean-Paul"};
    var houseID1 = await addHouse(client1);

    var client2 = {client_name:"Jean-Pierre"};
    var houseID2 = await addHouse(client2);

    var client3 = {client_name:"Jean-Sylvestre"};
    var houseID3 = await addHouse(client3);

    var client4 = {client_name:"Jean-Baptiste"};
    var houseID4 = await addHouse(client4);

    var client5 = {client_name:"Jean-Charles"};
    var houseID5 = await addHouse(client5);

    var client6 = {client_name:"Jean-Claude"};
    var houseID6 = await addHouse(client6);

    var client7 = {client_name:"Jean-Eudes"};
    var houseID7 = await addHouse(client7);

    var client8 = {client_name:"Jean-François"};
    var houseID8 = await addHouse(client8);

    var client9 = {client_name:"Jean-Jacques"};
    var houseID9 = await addHouse(client9);

    console.log("Les maisons sont inscrite :");
    response = await doRequest({url:"http://client-database:3004/client-registry/allHouses", method:"GET"});
    console.log("[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:"+response.body);
    console.log("Les maisons inscrites : "+response.body);
    console.log("\n");console.log("\n");

    // STEP 2
    var mixeur = {object:{name:"Mixeur",maxConsumption:500,enabled:true}, type:"BASIC"}

    console.log("On ajoute un objet non programmable a chaque maison");
    await addObject(houseID1,mixeur);
    await addObject(houseID2,mixeur);
    await addObject(houseID3,mixeur);
    await addObject(houseID4,mixeur);
    await addObject(houseID5,mixeur);
    await addObject(houseID6,mixeur);
    await addObject(houseID7,mixeur);
    await addObject(houseID8,mixeur);
    await addObject(houseID9,mixeur);
    console.log("\n");


    var car = {object:{name:"Car",maxConsumption:1050,enabled:true}, type:"SCHEDULED"}

    console.log("On ajoute un objet programmable a chaque maison");
    await addObject(houseID1,car);
    await addObject(houseID2,car);
    await addObject(houseID3,car);
    await addObject(houseID4,car);
    await addObject(houseID5,car);
    await addObject(houseID6,car);
    await addObject(houseID7,car);
    await addObject(houseID8,car);
    await addObject(houseID9,car);
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


    var communityReq = {houseID:houseID1};
    console.log("On regarde la communauté de la maison 1");
    reponse = await doRequest({url:"http://client-database:3004/client-registry/house", qs:communityReq, method:"GET"});
    console.log("[service]:client-database; [route]:client-registry/house; [params]: "+JSON.stringify(communityReq)+" => [return]:"+response.body);
    var communityID = response.body.id_community;
    console.log("\n");console.log("\n");

    var peakReq = {date:globalDate,ID:communityID};
    console.log("On vérifie si il y a un pic dans la communauté "+communityID+ " à la date du "+globalDate);
    reponse = await doRequest({url:"http://consumption-verifier:3007/consumption-peak", qs:peakReq, method:"GET"});
    console.log("[service]:consumption-db; [route]:consumption-peak; [params]: "+JSON.stringify(peakReq)+" => [return]:"+response.body);
    console.log("Pic : "+response.body);
    console.log("\n");console.log("\n");

    // STEP 4
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

    var peakReq = {date:globalDate,ID:communityID};
    console.log("On vérifie si il y a un pic dans la communauté "+communityID+ " à la date du "+globalDate);
    reponse = await doRequest({url:"http://consumption-verifier:3007/consumption-peak", qs:peakReq, method:"GET"});
    console.log("[service]:consumption-db; [route]:consumption-peak; [params]: "+JSON.stringify(peakReq)+" => [return]:"+response.body);
    console.log("Pic : "+response.body);
    console.log("\n");console.log("\n");
}

async function checkCarCons(ID){
    var detailedObject = {
        date:globalDate,
        houseID:ID,
        objectName:"Car"
    }
    var response = await doRequest({url:"http://consumption-manager:3008/get-detailed-consumption", qs:detailedObject , method:"GET"});
    console.log("[service]:consumption-manager; [route]:get-detailed-consumption; [params]: "+JSON.stringify(detailedObject )+" => [return]:"+response.body);
    console.log("La consommation de l'objet Car de la maison d'ID "+ID+" à la date du "+globalDate+" est : "+response.body);
    console.log("\n");
}

async function checkObject(id){
    var response = await doRequest({url:"http://house:3000/house/"+id+"/get_all_object", method:"GET"});;
    console.log("[service]:house; [route]:house/"+id+"/get_all_object; => [return]:"+response.body);
    console.log("Les objets présents : "+response.body);
    console.log("\n");
}

async function askSchedule(houseID,objectName){
    console.log("On demande un planning de consommation :");
    response = await doRequest({url:"http://house:3000/manage-schedul-object/"+houseID+"/scheduled-object/"+objectName+"/requestTimeSlot", method:"POST"});
    console.log("[service]:house; [route]:manage-schedul-object/"+houseID+"/scheduled-object/"+objectName+"/requestTimeSlot"+"; [params]:_ => [return]: "+response.body);
    console.log("On reçoit le planning suivant :"+response.body);
    console.log("\n");
}

async function addHouse(client){
    console.log("Une nouvelle maison souhaite s'inscrire : ");
    var response = await doRequest({url:"http://house:3000/house-editor/add-house", form:client, method:"POST"});
    console.log("[service]:house; [route]:house-editor/add-house; [params]:"+JSON.stringify(client)+" => [return]:"+response.body);
    console.log("\n");
    return response.body;
}


async function addObject(id, object) {
    doRequest({url: "http://house:3000/house-editor/house/" + id + "/add-object", form: object, method: "POST"});
}

async function doTick(){
    globalDate = globalDate.setMinutes(globalDate.getMinutes()+10);
    response = await doRequest({url:"http://house:3000/tick/", form:{date:globalDate}, method:"POST"});
    response = await doRequest({url:"http://supplier:3000/tick/", form:{date:globalDate}, method:"POST"});
}

async function waitTick(iterationNumber){
    for(var i=0 ; i<iterationNumber; i++){
        await doTick();
    }
}

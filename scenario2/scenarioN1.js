
var request = require('request');

function doRequest(req) {
    return new Promise(function (resolve, reject) {
        request(req, function (error, res, body) {
            resolve({error, res, body});
        });
    });
}

var globalDate = new Date();

async function main(){

    console.log("Scénario 1 : inscription, object paramétrable et adaptation de la production avec la consommation\n");

    await beforeStep();

	var response;
    console.log("On regarde les maisons actuellement inscrites : ");
    response = await doRequest({url:"http://client-database:3004/client-registry/allHouses", method:"GET"});
    console.log("[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:"+response.body);
    console.log("Les maisons inscrites : "+response.body);
    
    // STEP 1
    var client = {client_name:"Jean-Paul"};
    var mixeur = {object:{name:"Mixeur",maxConsumption:500,enabled:true}, type:"BASIC"}

    console.log("\nUne nouvelle maison souhaite s'inscrire : ");
	response = await doRequest({url:"http://house:3000/house-editor/add-house", form:client, method:"POST"});
    console.log("[service]:house; [route]:house-editor/add-house; [params]:"+JSON.stringify(client)+" => [return]:"+response.body);
    var houseID = response.body;
    
    response = await doRequest({url:"http://house:3000/house-editor/house/"+houseID+"/add-object", form:mixeur, method:"POST"});

    console.log("\nLa maison est inscrite :");
    response = await doRequest({url:"http://client-database:3004/client-registry/allHouses", method:"GET"});
    console.log("[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:"+response.body);
    console.log("Les maisons inscrites : "+response.body);

    // STEP 2
    console.log("\nLa maison reçoit un ID : "+houseID);

    //STEP 3 
    console.log("\nLe client peut voir sa consommation");
    response = await doRequest({url:"http://house:3000/consumption/global", qs:{houseID:houseID}, method:"GET"});
    console.log("[service]:house; [route]:consumption/global; [params]:houseID:"+houseID+" => [return]:"+response.body);
    console.log("La consommation globale de la maison : "+response.body);
    
    //await waitTick(1);

    
    //STEP 4 
    console.log("\nOn regarde les producteurs actuellement inscrits : ");
    response = await doRequest({url:"http://producer-database:3010/producer-registry/allProducers", method:"GET"});
    console.log("[service]:producer-database; [route]:producer-registry/allProducers; [params]:_ => [return]:"+response.body);
    console.log("Les producteurs inscrits : "+response.body);

    var producer = {producerName:"ENGIE",production:1000}

    console.log("\nUn nouveau producteur souhaite s'inscrire : ");
    response = await doRequest({url:"http://supplier:3005/add-supplier", form:producer, method:"POST"});
    console.log("[service]:supplier; [route]:supplier-editor/add-supplier; [params]:"+JSON.stringify(producer)+ " => [return]:"+response.body);
    var producerID = response.body;

    console.log("\nLe producteur est inscrits : ");
    response = await doRequest({url:"http://producer-database:3010/producer-registry/allProducers", method:"GET"});
    console.log("[service]:producer-database; [route]:producer-registry/allProducers; [params]:_ => [return]:"+response.body);
    console.log("Les producteurs inscrits : "+response.body);

    
    //STEP 5
    console.log("\nLe producteur reçoit un ID : "+producerID);

    //STEP 6
    await waitTick(6);
    var dateReq = {date:globalDate};

    console.log("\nOn vérifie que la consommation est égale à la production à la date du "+globalDate);

    response = await doRequest({url:"http://consumption-db:3009/get-total-consumption", qs:dateReq, method:"GET"});
    console.log("[service]:consumption-db; [route]:get-total-consumption; [params]: "+JSON.stringify(dateReq)+" => [return]:"+response.body);
    console.log("Consommation : "+response.body);

    response = await doRequest({url:"http://production-db:3001/getproduction", qs:dateReq, method:"GET"});
    console.log("[service]:production-db; [route]:getproduction; [params]: "+JSON.stringify(dateReq)+" => [return]:"+response.body);
    console.log("Production : "+response.body);

    response = await doRequest({url:"http://registry-manager:3003/consumption-check", qs:dateReq, method:"GET"});
    console.log("[service]:registry-manager; [route]:consumption-check; [params]: "+JSON.stringify(dateReq)+" => [return]:"+response.body);
    console.log("La consommation est-elle égale à la production ? : "+response.body);

    //STEP 7 
    var objectName = "voiture";
    var voiture = {object:{name:objectName,maxConsumption:2000}, type:"SCHEDULED"}

    console.log("\nUn object paramètrable est branché");
    response = await doRequest({url:"http://house:3000/house-editor/house/"+houseID+"/add-object", form:voiture, method:"POST"});
    console.log("[service]:house; [route]:house-editor/house/"+houseID+"/add-object"+"; [params]: "+JSON.stringify(voiture)+" => [return]:_");

    response = await doRequest({url:"http://house:3000/house-editor/house/"+houseID+"/get_all_object", method:"GET"});
    console.log("[service]:house; [route]:house-editor/house/"+houseID+"/get_all_object"+"; [params]:_ => [return]: "+response.body);
    console.log("On constate qu'il a bien été ajouté :"+response.body);

    //STEP 8 
    console.log("On demande un planning de consommation :");
    response = await doRequest({url:"http://house:3000/manage-schedul-object/"+houseID+"/scheduled-object/"+objectName+"/requestTimeSlot", method:"POST"});
    console.log("[service]:house; [route]:manage-schedul-object/"+houseID+"/scheduled-object/"+objectName+"/requestTimeSlot"+"; [params]:_ => [return]: "+response.body);
    console.log("On reçoit le planning suivant :"+response.body);

    //STEP 9 
    waitTick(36);//6h (temps mini de début de conso)

    var detailedObject = {
        date:globalDate,
        houseID:houseID,
        objectName:objectName
    }

    console.log("On peut voir que l’objet consomme à la date "+globalDate+" depuis smartGrid");
    response = await doRequest({url:"http://consumption-manager:3008/get-detailed-consumption", qs:detailedObject, method:"GET"});
    console.log("[service]:consumption-manager; [route]:get-detailed-consumption; [params]: "+JSON.stringify(detailedObject)+" => [return]:"+response.body);
    console.log("La consommation de l'objet "+objectName+" de la maison d'ID "+houseID+" à la date du "+globalDate+" est : "+response.body);

    //STEP 10
    dateReq = {date:globalDate};

    console.log("On peut voir que la production n’est plus égale à la consommation a la date du "+globalDate+", on demande aux producteurs de s’adapter :");

    response = await doRequest({url:"http://consumption-db:3009/get-total-consumption", qs:dateReq, method:"GET"});
    console.log("[service]:consumption-db; [route]:get-total-consumption; [params]: "+JSON.stringify(dateReq)+" => [return]:"+response.body);
    console.log("Consommation : "+response.body);

    response = await doRequest({url:"http://production-db:3001/getproduction", qs:dateReq, method:"GET"});
    console.log("[service]:production-db; [route]:getproduction; [params]: "+JSON.stringify(dateReq)+" => [return]:"+response.body);
    console.log("Production : "+response.body);

    response = await doRequest({url:"http://registry-manager:3003/consumption-check", qs:dateReq, method:"GET"});
    console.log("[service]:registry-manager; [route]:consumption-check; [params]: "+JSON.stringify(dateReq)+" => [return]:"+response.body);
    console.log("La consommation est-elle égale à la production ? : "+response.body);

    //STEP 11 
    doTick();
    dateReq = {date:globalDate};

    console.log("On vérifie que la production s’est bien adaptée :");

    response = await doRequest({url:"http://production-db:3001/getproduction", qs:dateReq, method:"GET"});
    console.log("[service]:production-db; [route]:getproduction; [params]: "+JSON.stringify(dateReq)+" => [return]:"+response.body);
    console.log("Production : "+response.body);
    
}

async function beforeStep(){
    //------ BEFORE STEPS ------
    /*
    var response;
    var mixeur = {object:{name:"Mixeur",maxConsumption:500,enabled:true}, type:"BASIC"}
    //On inscrit des maisons et ajout des objets
    response = await doRequest({url:"http://house:3000/house-editor/add-house", form:{client_name:"Jean"}, method:"POST"});
    var houseID1 = response.body;
    response = await doRequest({url:"http://house:3000/house-editor/house/"+houseID1+"/add-object", form:mixeur, method:"POST"});
    
    response = await doRequest({url:"http://house:3000/house-editor/add-house", form:{client_name:"Paul"}, method:"POST"});
    var houseID2 = response.body;
    response = await doRequest({url:"http://house:3000/house-editor/house/"+houseID2+"/add-object", form:mixeur, method:"POST"});

    response = await doRequest({url:"http://house:3000/house-editor/add-house", form:{client_name:"Jacque"}, method:"POST"});
    var houseID3 = response.body;
    response = await doRequest({url:"http://house:3000/house-editor/house/"+houseID3+"/add-object", form:mixeur, method:"POST"});

    //On inscrit un producteur et on fixe sa production
    var producer = {producer_name:"EDF", production:1000};
    response = await doRequest({url:"http://supplier:3005/supplier-editor/add-supplier", form:producer, method:"POST"});
    */
}

async function doTick(){
    globalDate = new Date(globalDate.setMinutes(globalDate.getMinutes()+10));
    response = await doRequest({url:"http://house:3000/tick", form:{date:globalDate}, method:"POST"});
    response = await doRequest({url:"http://supplier:3005/tick", form:{date:globalDate}, method:"POST"});
}

async function waitTick(iterationNumber){
    for(var i=0 ; i<iterationNumber; i++){
        await doTick();
    }
}

main();
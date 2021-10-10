
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

    console.log("Scénario 1 : inscription, object paramétrable et adaptation de la production avec la consommation");

    await beforeStep();

	var response;
    console.log("On regarde les maisons actuellement inscrites : ");
    reponse = await doRequest({url:"http://client-database:3004/client-registry/allHouses", method:"GET"});
    console.log("[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:"+response.body);
    console.log("Les maisons inscrites : "+response.body);

    // STEP 1
    var client = {client_name:"Jean-Paul"};
    var mixeur = {object:{name:"Mixeur",maxConsumption:500,enabled:true}, type:"BASIC"}

    console.log("Une nouvelle maison souhaite s'inscrire : ");
	reponse = await doRequest({url:"http://house:3000/house-editor/add-house", form:client, method:"POST"});
    console.log("[service]:house; [route]:house-editor/add-house; [params]:"+JSON.stringify(client)+" => [return]:"+response.body);
    var houseID = response.body;
    
    reponse = await doRequest({url:"http://house:3000/house-editor/house/"+houseID+"/add-object", form:mixeur, method:"POST"});

    console.log("La maison est inscrite :");
    reponse = await doRequest({url:"http://client-database:3004/client-registry/allHouses", method:"GET"});
    console.log("[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:"+response.body);
    console.log("Les maisons inscrites : "+response.body);

    // STEP 2
    console.log("La maison reçoit un ID : "+houseID);

    //STEP 3 
    console.log("Le client peut voir sa consommation");
    reponse = await doRequest({url:"http://house:3000/consumption/global", qs:{houseID:houseID}, method:"GET"});
    console.log("[service]:house; [route]:consumption/global; [params]:houseID:"+houseID+" => [return]:"+response.body);
    console.log("La consommation globale de la maison : "+response.body);

    //STEP 4 
    console.log("On regarde les producteurs actuellement inscrits : ");
    reponse = await doRequest({url:"http://producer-database:3010/producer-registry/allProducers", method:"GET"});
    console.log("[service]:producer-database; [route]:producer-registry/allProducers; [params]:_ => [return]:"+response.body);
    console.log("Les producteurs inscrits : "+response.body);

    var production = {production:1000};
    var producer = {producer_name:"ENGIE"}

    console.log("On nouveau producteur souhaite s'inscrire : ");
    reponse = await doRequest({url:"http://supplier:3005/supplier-editor/add-supplier", form:producer, method:"POST"});
    console.log("[service]:supplier; [route]:supplier-editor/add-supplier; [params]:"+JSON.stringify(producer)+ " => [return]:"+response.body);
    var producerID = response.body;

    reponse = await doRequest({url:"http://supplier:3005/supplier-editor/supplier/"+producerID+"/set-production", form:production, method:"POST"});

    console.log("Le producteur est inscrits : ");
    reponse = await doRequest({url:"http://producer-database:3010/producer-registry/allProducers", method:"GET"});
    console.log("[service]:producer-database; [route]:producer-registry/allProducers; [params]:_ => [return]:"+response.body);
    console.log("Les producteurs inscrits : "+response.body);

    //STEP 5
    console.log("Le producteur reçoit un ID : "+producerID);

    //STEP 6
    waitTick(6);
    var dateReq = {date:globalDate};

    console.log("On vérifie que la consommation est égale à la production à la date du "+globalDate);

    reponse = await doRequest({url:"http://consumption-db:3009/get-total-consumption", qs:dateReq, method:"GET"});
    console.log("[service]:consumption-db; [route]:get-total-consumption; [params]: "+JSON.stringify(dateReq)+" => [return]:"+response.body);
    console.log("Consommation : "+response.body);

    reponse = await doRequest({url:"http://production-db:3001/getproduction", qs:dateReq, method:"GET"});
    console.log("[service]:production-db; [route]:getproduction; [params]: "+JSON.stringify(dateReq)+" => [return]:"+response.body);
    console.log("Production : "+response.body);

    reponse = await doRequest({url:"http://registry-manager:3003/consumption-check", qs:dateReq, method:"GET"});
    console.log("[service]:registry-manager; [route]:consumption-check; [params]: "+JSON.stringify(dateReq)+" => [return]:"+response.body);
    console.log("La consommation est-elle égale à la production ? : "+response.body);

    //STEP 7 

    //STEP 8 

    //STEP 9 
    waitTick(6);
    var objectName = "TODO";

    var detailedObject = {
        date:globalDate,
        houseID:houseID,
        objectName:objectName
    }

    console.log("On peut voir que l’objet consomme à l‘heure donnée depuis smartGrid");
    reponse = await doRequest({url:"http://consumption-manager:3008/get-detailed-consumption", qs:detailedObject, method:"GET"});
    console.log("[service]:consumption-manager; [route]:get-detailed-consumption; [params]: "+JSON.stringify(detailedObject)+" => [return]:"+response.body);
    console.log("La consommation de l'objet "+objectName+" de la maison d'ID "+houseID+" à la date du "+globalDate+" est : "+response.body);

    //STEP 10
}

async function beforeStep(){
    //------ BEFORE STEPS ------
    var response;
    var mixeur = {object:{name:"Mixeur",maxConsumption:500,enabled:true}, type:"BASIC"}
    //On inscrit des maisons et ajout des objets
    reponse = await doRequest({url:"http://house:3000/house-editor/add-house", form:{client_name:"Jean"}, method:"POST"});
    var houseID1 = response.body;
    reponse = await doRequest({url:"http://house:3000/house-editor/house/"+houseID1+"/add-object", form:mixeur, method:"POST"});
    
    reponse = await doRequest({url:"http://house:3000/house-editor/add-house", form:{client_name:"Paul"}, method:"POST"});
    var houseID2 = response.body;
    reponse = await doRequest({url:"http://house:3000/house-editor/house/"+houseID2+"/add-object", form:mixeur, method:"POST"});

    reponse = await doRequest({url:"http://house:3000/house-editor/add-house", form:{client_name:"Jacque"}, method:"POST"});
    var houseID3 = response.body;
    reponse = await doRequest({url:"http://house:3000/house-editor/house/"+houseID3+"/add-object", form:mixeur, method:"POST"});

    //On inscrit un producteur et on fixe sa production
    var production = {production:1000};

    reponse = await doRequest({url:"http://supplier:3005/supplier-editor/add-supplier", form:{producer_name:"EDF"}, method:"POST"});
    var producerID = response.body;
    reponse = await doRequest({url:"http://supplier:3005/supplier-editor/supplier/"+producerID+"/set-production", form:production, method:"POST"});
}

async function doTick(){
    globalDate = globalDate.setMinutes(globalDate.getMinutes()+10);
    reponse = await doRequest({url:"http://house:3000/tick/", form:{date:globalDate}, method:"POST"});
    reponse = await doRequest({url:"http://supplier:3000/tick/", form:{date:globalDate}, method:"POST"});
}

async function waitTick(iterationNumber){
    for(var i=0 ; i<iterationNumber; i++){
        await doTick();
    }
}

main();
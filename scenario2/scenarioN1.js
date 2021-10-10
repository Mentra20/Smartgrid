
var request = require('request');

function doRequest(req) {
    return new Promise(function (resolve, reject) {
        request(req, function (error, res, body) {
            resolve({error, res, body});
        });
    });
}

var date = new Date();

async function main(){

    console.log("Scénario 1 : inscription, object paramétrable et adaptation de la production avec la consommation");

    await beforeStep();

	var response;
    console.log("On regarde les maisons actuellement inscrites : ");
    reponse = await doRequest({url:"http://client-database:3004/client-registry/allHouses", method:"GET"});
    console.log("[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:"+response.body);
    console.log("Les clients inscrits : "+response.body);

    // STEP 1
    var client = {client_name:"Jean-Paul"};
    var mixeur = {object:{name:"Mixeur",maxConsumption:500,enabled:true}, type:"BASIC"}

    console.log("Une nouvelle maison souhaite s'inscrire : ");
	reponse = await doRequest({url:"http://house:3000/house-editor/add-house", form:client, method:"POST"});
    console.log("[service]:house; [route]:house-editor/add-house; [params]:"+JSON.stringify(client)+" => [return]:"+response.body);
    reponse = await doRequest({url:"http://house:3000/house-editor/house/"+houseID+"/add-object", form:mixeur, method:"POST"});

    console.log("La maison est inscrite :");
    reponse = await doRequest({url:"http://client-database:3004/client-registry/allHouses", method:"GET"});
    console.log("[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:"+response.body);
    console.log("Les clients inscrits : "+response.body);

    // STEP 2
    var houseID = response.body;
    console.log("La maison reçoit un ID : "+houseID);

    //STEP 3 
    console.log("Le client peut voir sa consommation");
    reponse = await doRequest({url:"http://house:3000/consumption/global", qs:{houseID:houseID}, method:"GET"});
    console.log("[service]:house; [route]:consumption/global; [params]:houseID:"+houseID+" => [return]:"+response.body);
    console.log("La consommation globale de la maison : "+response.body);

    //STEP 4 
    //....
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
}

async function doTick(){
    date = date.setMinutes(date.getMinutes()+10);
    reponse = await doRequest({url:"http://house:3000/tick/", form:{date:date}, method:"POST"});
}

async function waitTick(iterationNumber){
    for(var i=0 ; i<iterationNumber; i++){
        await doTick();
    }
}

main();
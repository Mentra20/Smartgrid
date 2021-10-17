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
    console.log("Scénario 3 : objets de production et utilisation des producteurs de l'électricité en trop\n");

    // STEP 1
    console.log("\n\n================= STEP 1 =================")

    var client = {client_name:"Jean-Paul"};
    var mixeur = {object:{name:"Mixeur",maxConsumption:500,enabled:true}, type:"BASIC"}

    console.log("\n On inscrit une maison et on lui ajoute un objet qui consomme 500 W : ");
    var response = await doRequest({url:"http://house:3000/house-editor/add-house", form:client, method:"POST"});
    console.log("[service]:house; [route]:house-editor/add-house; [params]:"+JSON.stringify(client)+" => [return]:"+response.body);
    var houseID = response.body;

    console.log("\n On inscrit une maison en tant que producteur : ");
    response = await doRequest({url:"http://house:3000/house-editor/house/"+houseID+"/become-producer", method:"POST"});
    console.log("[service]:house; [route]:house-editor/"+ houseID +"/become-producer; [params]:_ => [return]:"+response.body);
    var houseProdID = response.body;

    await doRequest({url:"http://house:3000/house-editor/house/"+houseID+"/add-object", form:mixeur, method:"POST"});

    console.log("\nLa maison est inscrite :");
    response = await doRequest({url:"http://client-database:3004/client-registry/allHouses", method:"GET"});
    console.log("[service]:client-database; [route]:client-registry/allHouses; [params]:_ => [return]:"+response.body);
    console.log("Les maisons inscrites : "+response.body);

    console.log("\nOn  regarde les objets de la maison :" );
    await checkObject(houseID);

    // STEP 2
    console.log("\n\n================= STEP 2 =================")

    var objProd = {object:{name:"Roue du hamster",maxConsumption:-300,enabled:true}, type:"BASIC"}

    console.log("\nOn ajoute à la maison "+ houseID +" l'objet de production : " + JSON.stringify(objProd) );
    await doRequest({url:"http://house:3000/house-editor/house/"+houseID+"/add-object", form:objProd, method:"POST"});

    console.log("\nOn  regarde les objets de la maison :" );
    await checkObject(houseID);

    // STEP 3
    console.log("\n\n================= STEP 3 =================")

    console.log("\nOn vérifie que la maison consomme toujours "+ houseID);
    var reqQs = {houseID:houseID};
    response = await doRequest({url:"http://house:3000/consumption/global", qs:reqQs , method:"GET"});
    console.log("[service]:house; [route]:consumption/global; [params]:"+houseID+" => [return]:"+response.body);
    console.log("La consommation de la maison est bien positive : "+response.body);

    // STEP 4
    console.log("\n\n================= STEP 4 =================")
    console.log("\n On accède à la db de production avec l'id de production de la maison et on vérifie que la production n'est pas accessible");
    await waitTick(5);
    await sleep(1000);
    reqQs = {date:globalDate,producerID:houseProdID};
    response = await doRequest({url:"http://global-production-database:3001/global-production/get-producer-production", qs:reqQs , method:"GET"});
    console.log("[service]:global-production-database; [route]:global-production/get-producer-production; [params]:"+JSON.stringify(reqQs)+" => [return]:"+response.body);
    console.log("On voit bien qu'il n'y a pas eu de production pour cette maison" + response.body);


    // STEP 5
    console.log("\n\n================= STEP 5 =================")

    var objProd = {object:{name:"Générateur nucléaire DIY",maxConsumption:-600,enabled:true}, type:"BASIC"}

    console.log("\nOn ajoute à la maison "+ houseID +" l'objet de production : " + JSON.stringify(objProd) );
    await doRequest({url:"http://house:3000/house-editor/house/"+houseID+"/add-object", form:objProd, method:"POST"});

    console.log("\nOn  regarde les objets de la maison :" );
    await checkObject(houseID);

    // STEP 6
    console.log("\n\n================= STEP 6 =================")
    reqQs = {houseID:houseID};
    console.log("\nOn vérifie que la maison à un excès de production "+ houseID);
    response = await doRequest({url:"http://house:3000/consumption/global", qs:reqQs , method:"GET"});
    console.log("[service]:house; [route]:consumption/global; [params]:"+houseID+" => [return]:"+response.body);
    console.log("La consommation de la maison n'est plus positive : "+response.body);

    // STEP 7
    console.log("\n\n================= STEP 7 =================")
    console.log("\n On accède à la db de production avec l'id de production de la maison et on vérifie que la production est en accès");
    await waitTick(5);
    await sleep(1000);
    reqQs = {date:globalDate,producerID:houseProdID};
    response = await doRequest({url:"http://global-production-database:3001/global-production/get-producer-production", qs:reqQs , method:"GET"});
    console.log("[service]:global-production-database; [route]:global-production/get-producer-production; [params]:"+JSON.stringify(reqQs)+" => [return]:"+response.body);
    console.log("On voit bien qu'il a une production pour cette maison : " + response.body);


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

async function waitTick(iterationNumber){
    for(var i=0 ; i<iterationNumber; i++){
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
    console.log("[service]:house; [route]:house-editor/house/" + houseID + "/get_all_object" + "; [params]:_ => [return]: " + response.body);
    console.log("On a les objet suivant :" + response.body);
}

main()
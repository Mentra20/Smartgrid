
var request = require('request');


function doRequest({url,qs,body}) {
    return new Promise(function (resolve, reject) {
        request({url,qs,body}, function (error, res, body) {
            resolve({error, res, body});
        });
    });
}

async function main(){
	var response;
	//------------ STEP 1
	console.log("\nOn monitore la consommation totale de la grille :");
	response = await doRequest({url:"http://consumption-manager:3008/total-consumption"})
	console.log("La consommation totale est : " + response.body);

	//------------ STEP 2
	console.log("\nOn compare la production et la consommation :");
	var date1 = { date:'2021-10-02T02:00'};

	response = await doRequest({url:"http://supplier:3005/get-production"})
	console.log("La production est : " + response.body);

	response = await doRequest({url:"http://consumption-verifier:3007/consumption-check", qs:date1})
	console.log("La production est-elle égale à la consommation ? : " + response.body);

	//------------ STEP 3
	console.log("\nUn objet est branché, la consommation augmente :");
	var IPclient = "";//TODO
	var newObject = {name:"Mixeur",consumption:200}
	response = await doRequest({url:"http://"+IPclient+"/object-editor/add-basic", qs:newObject})
	///LOG ???...

	response = await doRequest({url:"http://consumption-manager:3008/total-consumption"})
	console.log("La consommation totale est : " + response.body);

	//------------ STEP 4
	console.log("\nOn compare de nouveau la production et la consommation :");
	var date2 = { date:'2021-10-02T03:00'};
	response = await doRequest({url:"http://consumption-verifier:3007/consumption-check", qs:date2})
	console.log("La production est-elle égale à la consommation ? : " + response.body);

	//------------ STEP 5
	console.log("\nOn constate que la production s'est adaptée :");
	response = await doRequest({url:"http://supplier:3005/get-production"})
	console.log("La production est : " + response.body);
}

main();
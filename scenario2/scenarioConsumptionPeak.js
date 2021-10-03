
var request = require('request');

function doRequest({url,qs,body}) {
    return new Promise(function (resolve, reject) {
        request({url,qs,body}, function (error, res, body) {
            resolve({error, res, body});
        });
    });
}

function doRequestPost({url,qs,form, method}) {
    return new Promise(function (resolve, reject) {
        request({url,qs,form, method}, function (error, res, body) {
            resolve({error, res, body});
        });
    });
}

async function main(){
	var response;

    //------ BEFORE STEPS ------
    var IPclient = process.env.IP_PORT;

    //On ajout des objects pour un première consommation
    var mixeur = {
		name:'Mixeur', 
		consumptionTime:{
			timeSlots:[
			{start:"2021-10-02T01:00",end:"2021-10-02T05:00",consumption:200}]
		}
      };
	response = await doRequestPost({url:"http://"+IPclient+"/object-editor/add-basic", form:{houseObject:mixeur},  method:"POST"})

	//------------ STEP 1 --------------
	response = await doRequest({url:"http://"+IPclient+"/consumption/communityID"})
	var communityID = response.body;

    var date1 = '2021-10-02T02:00';
    var req1 = { date:date1, ID:communityID};

	console.log("\nOn monitore la consommation d'une communauté :");
	response = await doRequest({url:"http://consumption-manager:3008/community-consumption", qs:req1})
	console.log("La consommation de la communauté d'ID "+communityID+" le "+date1+" est : " + response.body);

	//------------ STEP 2 --------------
	console.log("\nOn regarde s'il n'y a pas de pic de consommation :");
	response = await doRequest({url:"http://consumption-verifier:3007/consumption-peak", qs:req1})
	console.log("Est ce que la communauté d'ID "+communityID+" a un pic de consommation le "+date1+" ? : " + response.body);

	//------------ STEP 3 --------------
	console.log("\nUn objet très gourmand en éléctricité est branché, la consommation augmente fortement :");
	var chauffage = {
		name:'Chauffage au sol', 
		consumptionTime:{
			timeSlots:[
			{start:"2021-10-02T03:00",end:"2021-10-02T05:00",consumption:5000}]
		}
      };

	response = await doRequestPost({url:"http://"+IPclient+"/object-editor/add-basic", form:{houseObject:chauffage},  method:"POST"})

    var date2 = '2021-10-02T04:00';
    var req2 = { date:date2, ID:communityID};

    response = await doRequest({url:"http://consumption-manager:3008/community-consumption", qs:req2})
	console.log("La consommation de la communauté d'ID "+communityID+" le "+date2+" est : " + response.body);

	//------------ STEP 4 --------------
	console.log("\nOn regarde de nouveau s'il y a un pic de consommation :");
	response = await doRequest({url:"http://consumption-verifier:3007/consumption-peak", qs:req2})
	console.log("Est ce que la communauté d'ID "+communityID+" a un pic de consommation le "+date2+" ? : " + response.body);
}

main();
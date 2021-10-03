var request = require('request');

function doRequest({ url, qs, body }) {
    return new Promise(function(resolve, reject) {
        request({ url, qs, body }, function(error, res, body) {
            resolve({ error, res, body });
        });
    });
}

function doRequestPost({ url, qs, form, method }) {
    return new Promise(function(resolve, reject) {
        request({ url, qs, form, method }, function(error, res, body) {
            resolve({ error, res, body });
        });
    });
}

async function main() {
    var IPClient = process.env.IP; //TODO
    //On ajout des objects pour un conso égale à la prod
    var mixeur = {
        name: 'Mixeur',
        consumptionTime: {
            timeSlots: [
                { start: "2021-10-02T01:00", end: "2021-10-02T05:00", consumption: 200 }
            ]
        }
    };
    response = await doRequestPost({ url: "http://" + IPClient + "/object-editor/add-basic", form: { houseObject: mixeur }, method: "POST" })
        //---------- STEP 1
    console.log("Ma maison est maintenant inscrite :");

    var response = await doRequest({ url: "http://dataservice:3006/fromregistry/getallhouseurl" })
    console.log("Maisons inscrites: " + response.body);

    //---------- STEP 2 
    console.log("\nOn constate que SmartGrid lui a attribué un ID et un ID de communauté :");


    var houseID = await doRequest({ url: "http://" + IPClient + "/consumption/houseID" })
    console.log("HouseID reçu depuis la maison: " + houseID.body);

    var communityID = await doRequest({ url: "http://" + IPClient + "/consumption/communityID" })
    console.log("CommunityID reçu de la maison: " + communityID.body);

    var date = '2021-10-02T03:00';

    var House = { ID: houseID.body };
    var Community = { ID: communityID.body };
    var Date = { date: date };

    response = await doRequest({ url: "http://dataservice:3006/fromregistry/gethouseurl", qs: House })
    console.log("HouseID reçu depuis dataservice " + House.ID + " : " + response.body);

    response = await doRequest({ url: "http://dataservice:3006/fromregistry/getcommunityurl", qs: Community })
    console.log("CommunityID reçu depuis dataservice " + Community.ID + " : " + response.body);

    //---------- STEP 3 
    console.log("\nJe peux maintenant consulter sa consommation en interne :");
    response = await doRequest({ url: "http://" + IPClient + "/consumption/global	", qs: Date })
    console.log("Consommation de la maison a la date " + date + " est : " + response.body);
}

main();
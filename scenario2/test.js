var request = require('request');

function doRequestPost({url,qs,form, method}) {
    return new Promise(function (resolve, reject) {
        request({url,qs,form, method}, function (error, res, body) {
            resolve({error, res, body});
        });
    });
}

async function main(){
    var object = {param:[
        {houseID:"lolo2",consumptionDate:"2021-10-02T02:00",objectName:"voiture",consumption:700}
    ]
    };
	response = await doRequestPost({url:"http://localhost:3008/add-detailed-consumption", form:object,  method:"POST"})
}

main();
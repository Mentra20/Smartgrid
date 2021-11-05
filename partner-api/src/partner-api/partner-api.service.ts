import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerInfo } from 'src/models/partner-info';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PartnerApiService {
    private URL_GET_ALL_HOUSES = "http://client-database:3004/client-registry/allHouses";
    private URL_GET_CLIENT_PRIVACY = "http://client-database:3004/client-registry/client-privacy-settings";
    private URL_CONSUMPTION_DETAILED = 'http://consumption-detailed:3008/get-all-detailed-consumption';
    private URL_GLOBAL_CONSUMPTION_MANAGER = 'http://global-consumption-database:3009/global-consumption/get-house-consumption';
    private URL_DETAILED_PRODUCTION_MANAGER = 'http://global-production-database:3001/global-production/get-producer-production';

    //DATAPOINT COST
    DETAILED_CONSUMPTION_COST = 100;
    GLOBAL_CONSUMPTION_COST = 50;
    PRODUCTION_COST = 70;

    DETAILED_TL = 3;
    PRODUCTION_TL = 2;
    GLOBAL_TL = 1;

    constructor(
        @Inject("PARTNER_API") private client:ClientKafka,
        @InjectRepository(PartnerInfo)
        private partnerInfoRepository: Repository<PartnerInfo>,
        private http:HttpService){}

    async onModuleInit() {
        await this.client.connect();

        console.log("partner-api connected on bus")
    }

    public addPartnerToDB(partnerID:string, datapoint:number, trustLevel:number){

        var partnerInfo = new PartnerInfo();
        partnerInfo.id_partner = partnerID;
        partnerInfo.dataPoint = datapoint;
        partnerInfo.trustLevel = trustLevel;

        this.partnerInfoRepository.save(partnerInfo);
        console.log("Add new partner to DB : "+partnerInfo);
    }

    public async addDatapointForPartner(partnerID:string, datapoint:number){
        var partnerInfo = await this.getPartnerInfo(partnerID);

        partnerInfo.dataPoint += datapoint;
        this.partnerInfoRepository.save(partnerInfo);

        console.log("Add datapoint, partner information is now : "+partnerInfo);
    }

    public async requestClientsDetailedConsumptionData(partnerID:string, date:Date){
        console.log("Partner "+partnerID+" request detailed consumption data of clients at date "+date);
        var partnerInfo = await this.getPartnerInfo(partnerID);
        var clientsData = [];

        if(partnerInfo.trustLevel < this.DETAILED_TL){
            console.log("Partner "+partnerID+" doesn't have suffisant trust level");
            console.log("trust level :"+partnerInfo.trustLevel+", needed :"+this.DETAILED_TL)
            return clientsData;
        }

        if(partnerInfo.dataPoint < this.DETAILED_CONSUMPTION_COST){
            console.log("Partner "+partnerID+" can't afford detailed consumption data");
            console.log("datapoint :"+partnerInfo.dataPoint+", needed :"+this.DETAILED_CONSUMPTION_COST)
            return clientsData;
        }

        var allClients = await this.getAllHouseID();

        for(let client of allClients){
            var clientID = client.id
            var getClientPrivacy = await this.getClientPrivacy(clientID);

            if(getClientPrivacy.privacyDetailedData){
                var detailedData = await this.getDetailedConsumptionData(clientID,date);
                clientsData.push(detailedData);
            }
        }
        console.log("get clients detailed consumption data : "+clientsData);

        //EMIT
        var message = {partnerID:partnerID, datatype:0, datapoint:this.DETAILED_CONSUMPTION_COST, requestedDate:date, sendDate:new Date()};//0 = detailed
        console.log("I emit partner request in bus : "+message);
        this.client.emit('sale.data.0',message);
        
        return clientsData;
    }

    public async requestClientsGlobalConsumptionData(partnerID:string, date:Date){
        console.log("Partner "+partnerID+" request global consumption data of clients at date "+date);
        var partnerInfo = await this.getPartnerInfo(partnerID);
        var clientsData = [];

        if(partnerInfo.trustLevel < this.GLOBAL_TL){
            console.log("Partner "+partnerID+" doesn't have suffisant trust level");
            console.log("trust level :"+partnerInfo.trustLevel+", needed :"+this.GLOBAL_TL)
            return clientsData;
        }

        if(partnerInfo.dataPoint < this.GLOBAL_CONSUMPTION_COST){
            console.log("Partner "+partnerID+" can't afford global consumption data");
            console.log("datapoint :"+partnerInfo.dataPoint+", needed :"+this.GLOBAL_CONSUMPTION_COST)
            return clientsData;//?? ou null Jsp..
        }

        var allClients = await this.getAllHouseID();

        for(let client of allClients){
            var clientID = client.id
            var getClientPrivacy = await this.getClientPrivacy(clientID);

            if(getClientPrivacy.privacyConsumptionData){
                var globalData = await this.getGlobalConsumptionData(clientID,date);
                clientsData.push(globalData);
            }
        }
        console.log("get clients global consumption data : "+clientsData);

        //EMIT
        var message = {partnerID:partnerID, datatype:1, datapoint:this.GLOBAL_CONSUMPTION_COST, requestedDate:date, sendDate:new Date()};//1 = global
        console.log("I emit partner request in bus : "+message);
        this.client.emit('sale.data.1',message);

        return clientsData;
    }

    public async requestClientsProductionData(partnerID:string, date:Date){
        console.log("Partner "+partnerID+" request production data of clients at date "+date);
        var partnerInfo = await this.getPartnerInfo(partnerID);
        var clientsData = [];

        if(partnerInfo.trustLevel < this.PRODUCTION_TL){
            console.log("Partner "+partnerID+" doesn't have suffisant trust level");
            console.log("trust level :"+partnerInfo.trustLevel+", needed :"+this.PRODUCTION_TL)
            return clientsData;
        }

        if(partnerInfo.dataPoint < this.PRODUCTION_COST){
            console.log("Partner "+partnerID+" can't afford production data");
            console.log("datapoint :"+partnerInfo.dataPoint+", needed :"+this.PRODUCTION_COST)
            return clientsData;//?? ou null Jsp..
        }

        var allClients = await this.getAllHouseID();

        for(let client of allClients){
            var clientID = client.id
            var getClientPrivacy = await this.getClientPrivacy(clientID);

            if(getClientPrivacy.privacyProductionData){
                var producerID = client.id_producer;

                if(producerID){
                    var productionData = await this.getProductionData(producerID,date);
                    clientsData.push(productionData);
                }
            }
        }
        console.log("get clients production data : "+clientsData);

        //EMIT
        var message = {partnerID:partnerID, datatype:2, datapoint:this.PRODUCTION_COST, requestedDate:date, sendDate:new Date()};//1 = global
        console.log("I emit partner request in bus : "+message);
        this.client.emit('sale.data.2',message);

        return clientsData;
    }

    public getPartnerInfo(partnerID:string){
        return this.partnerInfoRepository.findOne({where:{id_partner:partnerID}});
    }

    public async getClientPrivacy(clientID:string){
        return (await firstValueFrom(this.http.get(this.URL_GET_CLIENT_PRIVACY,{params:clientID}))).data;
    }

    public async getAllHouseID(){
        return (await firstValueFrom(this.http.get(this.URL_GET_ALL_HOUSES))).data;
    }

    public async getProducerID(){
        return (await firstValueFrom(this.http.get(this.URL_GET_ALL_HOUSES))).data;
    }

    public async getDetailedConsumptionData(houseID:string,date:Date){
        return (await firstValueFrom(this.http.get(this.URL_CONSUMPTION_DETAILED,{params:{date:date,houseID:houseID}}))).data;
    }

    public async getGlobalConsumptionData(houseID:string,date:Date){
        return (await firstValueFrom(this.http.get(this.URL_GLOBAL_CONSUMPTION_MANAGER,{params:{date:date,houseID:houseID}}))).data;
    }

    public async getProductionData(producerID:string,date:Date){
        return (await firstValueFrom(this.http.get(this.URL_DETAILED_PRODUCTION_MANAGER,{params:{date:date,producerID:producerID}}))).data;
    }
}

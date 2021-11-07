export class Producer {
    producerID:string
    producerName:string
    maxProduction:number
    currentProduction:number

    constructor(producerName:string,  currentProduction:number,maxProduction=10000){
        this.producerName = producerName
        this.currentProduction=currentProduction
        this.maxProduction=maxProduction
    }

    changeProduction(value:number){
        var newProduction = this.currentProduction+value
        if(newProduction<0 || newProduction>this.maxProduction){
            throw new Error("[changeProduction] production non valide : "+newProduction)
        }
        this.currentProduction=newProduction;
    }

    changeProductionLimit(value:number){
        if(value<0 ){
            throw new Error("[changeProductionLimit] production limite non valide : "+value)
        }
        this.maxProduction=value;
        if(this.currentProduction>this.maxProduction){
            this.currentProduction = value
        }
    }
}

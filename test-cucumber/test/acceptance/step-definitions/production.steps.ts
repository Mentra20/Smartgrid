import { binding, then, when, before} from 'cucumber-tsflow';
import { assert } from 'chai';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import {HttpModule} from "@nestjs/common";
import {HttpService} from "@nestjs/common";
import {Observable} from "rxjs";
import {AxiosResponse} from "axios";
import {response} from "express";

class Context {
    public app;
    public response;
}

// tslint:disable-next-line:max-classes-per-file
@binding([Context])
export class ProductionSteps {
    constructor(protected context: Context) {}
    private httpService : HttpService;
    private production: Promise<AxiosResponse<number>>;
    private totalConsumption: Promise<AxiosResponse<number>>;

    @before()
    public async before(): Promise<void> {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, HttpModule],
            providers: []
        }).compile();
        this.httpService = moduleFixture.get<HttpService>(HttpService)
        this.context.app = moduleFixture.createNestApplication();
        await this.context.app.init();
    }

    @when(/I ask the supplier for production at "([^"]*)" and the total-consumption at "([^"]*)"/)
    public callToAPI(urlProd: string, urlTotCons: string) {
         this.production = this.httpCall(urlProd).toPromise();
         this.totalConsumption = this.httpCall(urlTotCons).toPromise();
    }

    @then(/the production and the total-consumption should be equal/)
    public dataResponse() {
        this.production.then((x)=>{
                    this.totalConsumption.then((y)=>{
                        assert.equal(y.data,x.data);
                    });
                });
    }

    httpCall(url): Observable<AxiosResponse<number>> {
        return this.httpService.get(url);
    }

}

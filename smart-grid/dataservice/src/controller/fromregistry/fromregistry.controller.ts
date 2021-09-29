import { Controller,Get,Query } from '@nestjs/common';
import { GethouseurlService } from 'src/services/gethouseurl/gethouseurl.service';
import { GetcommunityurlService } from 'src/services/getcommunityurl/getcommunityurl.service';
import { GetallhouseurlService } from 'src/services/getallhouseurl/getallhouseurl.service';



@Controller('fromregistry')
export class FromregistryController {
    constructor(private readonly getHouseUrlService :GethouseurlService,private readonly getCommunityUrlService :GetcommunityurlService,private readonly getAllHouseUrlService:GetallhouseurlService) {}

    @Get('getallhouseurl')
    getAllhousesUrl(): string[] {
        return this.getAllHouseUrlService.getAllhousesURL();
    }
    @Get('gethouseurl')
    getHouseUrl(@Query('ID') ID:number): string {
        return this.getHouseUrlService.getHouseURL(ID);
    }
    @Get('getcommunityurl')
    getHouseConsumption(@Query('ID') ID:number): string[] {
        return this.getCommunityUrlService.getCommunityURL(ID);
    }
    @Get()
    register(@Query('ID_Community') ID_Community:number, @Query('URL_Community') URL_Community:string,
    @Query('ID_House') ID_House:number, @Query('URL_House') URL_House:string): void {
        this.getCommunityUrlService.addCommunityURL(ID_Community,URL_Community);
        this.getAllHouseUrlService.addHouseURL(ID_House,URL_House);
        this.getHouseUrlService.addHouseURL(ID_House,URL_House);
    }
}

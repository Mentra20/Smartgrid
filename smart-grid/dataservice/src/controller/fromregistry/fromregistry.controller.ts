import { Controller,Get,Query } from '@nestjs/common';
import { GethouseurlService } from 'src/services/gethouseurl/gethouseurl.service';
import { GetcommunityurlService } from 'src/services/getcommunityurl/getcommunityurl.service';
import { GetallhouseurlService } from 'src/services/getallhouseurl/getallhouseurl.service';


var getHouseUrlService :GethouseurlService
var getCommunityUrlService :GetcommunityurlService
var getAllHouseUrlService:GetallhouseurlService

@Controller('fromregistry')
export class FromregistryController {

    @Get()
    getHouseUrl(@Query('ID_Community') ID_Community:number, @Query('URL_Community') URL_Community:string,
    @Query('ID_House') ID_House:number, @Query('URL_House') URL_House:string): void {
        getCommunityUrlService.addCommunityURL(ID_Community,URL_Community);
        getAllHouseUrlService.addHouseURL(ID_House,URL_House);
        getHouseUrlService.addHouseURL(ID_House,URL_House);
    }
}

@Controller('getallhouseurl')
export class GetallhouseurlController {

    @Get()
    getAllhousesUrl(): string[] {
        return getAllHouseUrlService.getAllhousesURL();
    }
}
@Controller('gethouseurl')
export class GethouseurlController {
    @Get()
    getHouseUrl(@Query('ID') ID:number): string {
        return getHouseUrlService.getHouseURL(ID);
    }
}
@Controller('getcommunityurl')
export class GetcommunityurlController {
        @Get()
        getHouseConsumption(@Query('ID') ID:number): string[] {
            return getCommunityUrlService.getCommunityURL(ID);
        }
    }
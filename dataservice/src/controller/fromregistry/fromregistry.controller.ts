import { Controller,Get,Query,Post,Body} from '@nestjs/common';
import { GethouseurlService } from 'src/services/gethouseurl/gethouseurl.service';
import { GetallhouseurlService } from 'src/services/getallhouseurl/getallhouseurl.service';


@Controller('fromregistry')
export class FromregistryController {
    constructor(private readonly getHouseUrlService :GethouseurlService,
        private readonly getAllHouseUrlService:GetallhouseurlService,
        ) {}

    @Get('getallhouseurl')
    getAllhousesUrl(): string[] {
        var allHousesURL = this.getAllHouseUrlService.getAllhousesURL();
        console.log("Return all houses URL : "+allHousesURL);
        return allHousesURL;
    }

    @Get('gethouseurl')
    getHouseUrl(@Query('ID') ID:number): string {
        var houseURL = this.getHouseUrlService.getHouseURL(ID);
        console.log("[fromregistry/gethouseurl][getHouseUrl] urlGet houseID : "+ID+" and return URL : "+houseURL);
        return houseURL;
    }

    @Get('getcommunityurl')
    getHouseConsumption(@Query('ID') ID:number): string[] {
        var communityHousesURL = this.getAllHouseUrlService.getAllhousesURLFromCommunityId(ID);
        console.log("[fromregistry/getcommunityurl][getHouseConsumption] Get community ID : "+ID+" and return URL list : "+communityHousesURL);
        return communityHousesURL;
    }
    @Post()
    register(@Body('ID_Community') ID_Community:number,@Body('ID_House') ID_House:number, @Body('URL_House') URL_House:string): void {
        console.log("[fromregistry][register] ID_Community:number ; ID_House:number ; URL_House:string => void")
        console.log("new registry: ")
        console.log("ID_Community: "+ID_Community)
        console.log("ID_House: "+ID_House)
        console.log("URL_House: "+URL_House)
        this.getAllHouseUrlService.addHouseURL(ID_House,ID_Community,URL_House);
        this.getHouseUrlService.addHouseURL(ID_House,URL_House);
    }
}

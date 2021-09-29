import { Controller,Get,Query,Post} from '@nestjs/common';
import { GethouseurlService } from 'src/services/gethouseurl/gethouseurl.service';
import { GetallhouseurlService } from 'src/services/getallhouseurl/getallhouseurl.service';


@Controller('fromregistry')
export class FromregistryController {
    constructor(private readonly getHouseUrlService :GethouseurlService,
        private readonly getAllHouseUrlService:GetallhouseurlService,
        ) {}

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
        return this.getAllHouseUrlService.getAllhousesURLFromCommunityId(ID);
    }
    @Post()
    register(@Query('ID_Community') ID_Community:number,@Query('ID_House') ID_House:number, @Query('URL_House') URL_House:string): void {
        this.getAllHouseUrlService.addHouseURL(ID_House,ID_Community,URL_House);
        this.getHouseUrlService.addHouseURL(ID_House,URL_House);
    }
}

import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DashboardDataService } from "./dashboard.service";
import { ChekcAbilities } from "src/core/decorators/abilities.decorator";
import { Action, ReportPeriod } from "src/core/types/global.types";

@ApiTags("dashboard")
@Controller("dashboard")
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardDataService
    ) { }

    @Get()
    @ChekcAbilities({ subject: 'all', action: Action.READ })
    async get(@Query('period') period: ReportPeriod) {
        return await this.dashboardService.get(period);
    }
}

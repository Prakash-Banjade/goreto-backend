import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderStatus, ReportPeriod } from "src/core/types/global.types";
import { Order } from "src/orders/entities/order.entity";
import { Repository } from "typeorm";

@Injectable()
export class DashboardDataService {

    constructor(
        @InjectRepository(Order) private readonly ordersRepo: Repository<Order>
    ) { }

    async get(period: ReportPeriod = ReportPeriod.WEEK) {
        const querybuilder = this.ordersRepo.createQueryBuilder('order')

        const defaultCount = {}
        let startDate = new Date().toISOString(), endDate = new Date().toISOString();

        switch (period) {
            case ReportPeriod.DAY:
                startDate = new Date().toISOString()
                endDate = new Date().toISOString()
                break
            case ReportPeriod.WEEK:
                startDate = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
                endDate = new Date().toISOString()
                break
            case ReportPeriod.MONTH:
                startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()
                endDate = new Date().toISOString()
                break
            case ReportPeriod.YEAR:
                startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString()
                console.log(startDate)
                endDate = new Date().toISOString()
                break
        }

        const adjustedEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1));

        for (const status of Object.values(OrderStatus)) {
            const count = await querybuilder
                .where({ status })
                .andWhere('createdAt BETWEEN :startDate AND :endDate', { startDate, endDate: adjustedEndDate })
                .getCount()

            defaultCount[status] = count
        }

        return defaultCount
    }
}
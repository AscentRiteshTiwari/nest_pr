import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create_report.dtos';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { currentUser } from 'src/users/decorator/current-user.decorator';
import { User } from 'src/users/user.entity';
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto, @currentUser() user:User) {
    return this.reportsService.create(body, user);
  }
}

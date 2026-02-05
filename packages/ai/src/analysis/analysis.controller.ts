import { Controller, Get, Post, Body } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  async getAnalysis(): Promise<any> {
    return this.analysisService.getAnalysis();
  }

  @Post()
  async analyze(@Body() data: any): Promise<any> {
    return this.analysisService.analyze(data);
  }

  @Post('session')
  async analyzeSession(@Body() sessionData: any): Promise<any> {
    return this.analysisService.analyzeSession(sessionData);
  }
}

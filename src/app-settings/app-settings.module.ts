import { Module } from '@nestjs/common';
import { GeneralSettingService } from './general-settings/general-settings.service';
import { GeneralSettingController } from './general-settings/general-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralSetting } from './entities/general-setting.entity';
import { SeoSetting } from './entities/seo-settings.entity';
import { CompanyInfoSetting } from './entities/companyInfo-entity';
import { CompanyInfoSettingController } from './companyInfo-settings/companyInfo-settings.controller';
import { SeoSettingController } from './seo-settings/seo-settings.controller';
import { CompanyInfoSettingService } from './companyInfo-settings/companyInfo-settings.service';
import { SeoSettingService } from './seo-settings/seo-settings.service';
import { Faq } from './entities/faq.entity';
import { FaqController } from './faq/faq.controller';
import { FaqService } from './faq/faq.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GeneralSetting,
      SeoSetting,
      CompanyInfoSetting,
      Faq,
    ])
  ],
  controllers: [
    GeneralSettingController,
    CompanyInfoSettingController,
    SeoSettingController,
    FaqController
  ],
  providers: [
    GeneralSettingService,
    CompanyInfoSettingService,
    SeoSettingService,
    FaqService
  ],
})
export class AppSettingsModule { }

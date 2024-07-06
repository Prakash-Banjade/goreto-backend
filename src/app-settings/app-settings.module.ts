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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GeneralSetting,
      SeoSetting,
      CompanyInfoSetting,
    ])
  ],
  controllers: [
    GeneralSettingController,
    CompanyInfoSettingController,
    SeoSettingController,
  ],
  providers: [
    GeneralSettingService,
    CompanyInfoSettingService,
    SeoSettingService,
  ],
})
export class AppSettingsModule { }

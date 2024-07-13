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
import { LocationSetting } from './entities/location-setting.entity';
import { Location } from './entities/location.entity';
import { LocationSettingController } from './location-settings/location-settings.controller';
import { LocationSettingService } from './location-settings/location-settings.service';
import { LocationController } from './location-settings/location.controller';
import { LocationService } from './location-settings/location.service';
import { HomePageSetting } from './entities/homePage-setting.entity';
import { HeroCarouselItem } from './entities/hero-carousel-item.entity';
import { HomePageSettingController } from './homePage-settings/homePage-settings.controller';
import { HomePageSettingService } from './homePage-settings/homePage-settings.service';
import { HeroCarouselItemController } from './homePage-settings/hero-carousel-item.controller';
import { HeroCarouselItemService } from './homePage-settings/hero-carousel-item.service';
import { Newsletter } from './newsletter/entity/newsletter.entity';
import { NewsletterController } from './newsletter/newsletter.controller';
import { NewsletterService } from './newsletter/newsletter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GeneralSetting,
      SeoSetting,
      CompanyInfoSetting,
      Faq,
      LocationSetting,
      Location,
      HomePageSetting,
      HeroCarouselItem,
      Newsletter,
    ])
  ],
  controllers: [
    GeneralSettingController,
    CompanyInfoSettingController,
    SeoSettingController,
    FaqController,
    LocationSettingController,
    LocationController,
    HomePageSettingController,
    HeroCarouselItemController,
    NewsletterController,
  ],
  providers: [
    GeneralSettingService,
    CompanyInfoSettingService,
    SeoSettingService,
    FaqService,
    LocationSettingService,
    LocationService,
    HomePageSettingService,
    HeroCarouselItemService,
    NewsletterService,
  ],
})
export class AppSettingsModule { }

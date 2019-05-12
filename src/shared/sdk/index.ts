import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CategoryApi, DonationApi, ItemApi, PrizePoolApi, UserApi, WishlistApi } from './services';

@NgModule({
  imports:      [ CommonModule, HttpClientModule ],
  declarations: [ ],
  exports:      [ ],
  providers:    [ ]
})
export class SDKBrowserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule  : SDKBrowserModule,
      providers : [
        CategoryApi,
        DonationApi,
        ItemApi,
        PrizePoolApi,
        UserApi,
        WishlistApi
      ]
    };
  }
}
  
export * from './models/index';
export * from './services/index';
export * from './sails.config';
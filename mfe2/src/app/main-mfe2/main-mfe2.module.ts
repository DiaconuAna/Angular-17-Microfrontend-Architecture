import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericComponent } from './generic/generic.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    GenericComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: GenericComponent },
    ]),
  ]
})
export class MainMfe2Module { }

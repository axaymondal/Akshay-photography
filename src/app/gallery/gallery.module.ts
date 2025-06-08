import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './gallery.component';
import { LightboxComponent } from './lightbox/lightbox.component';
import { PreventRightClickDirective } from './lightbox/prevent-right-click.directive';

const routes: Routes = [
  {
    path: '',
    component: GalleryComponent
  }
];

@NgModule({
  declarations: [
    GalleryComponent,
    LightboxComponent,
    PreventRightClickDirective
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    GalleryComponent
  ]
})
export class GalleryModule { } 
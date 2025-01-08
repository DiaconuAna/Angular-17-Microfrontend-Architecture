import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {loadRemoteModule} from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path:'main-mfe1',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './MainMfe1Module',
        type: 'module',
      })
        .then((m) => m.MainMfe1Module)
        .catch((err) => {
          console.error('Error loading MainMfe1Module:', err);
        }),
  },
  {
    path:'main-mfe2',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './MainMfe2Module',
        type: 'module',
      })
        .then((m) => m.MainMfe2Module)
        .catch((err) => {
          console.error('Error loading MainMfe2Module:', err);
        }),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

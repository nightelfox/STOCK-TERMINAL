import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './Screens/login/login.component';
import { RegistrationComponent } from './Screens/registration/registration.component';
import { MainAppComponent } from './Screens/main-app/main-app.component';
import { SideBarList9Component } from './SideBar/side-bar-list9/side-bar-list9.component';
import { SideBarWatchlistComponent } from './SideBar/side-bar-watchlist/side-bar-watchlist.component';
import {SideBarListItemComponent} from './SideBar/side-bar-list-item/side-bar-list-item.component';

const routes: Routes = [
  {
    path: 'app',
    component: MainAppComponent,
    children: [
      {
        path: 'all-stocks',
        component: SideBarList9Component,
        children: [
          {
            path: 'stock/:id',
            component: SideBarListItemComponent,
          },
        ],
      },
      {
        path: 'my-stocks',
        component: SideBarWatchlistComponent,
        children: [
          {
            path: 'stock/:id',
            component: SideBarListItemComponent,
          },
        ],
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

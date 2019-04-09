import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './Screens/login/login.component';
import { MainAppComponent } from './Screens/main-app/main-app.component';
import { SideBarList9Component } from './SideBar/side-bar-list9/side-bar-list9.component';
import { SideBarWatchlistComponent } from './SideBar/side-bar-watchlist/side-bar-watchlist.component';

const routes: Routes = [
  {path: 'app', component: MainAppComponent,
    children: [
      {
        path: 'allStocks',
        component: SideBarList9Component
      },
      {
        path: 'myStocks',
        component: SideBarWatchlistComponent
      }
    ]},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { SigninComponent } from './components/signin/signin.component';
import { AboutComponent } from './components/about/about.component';
import { MyrecipesComponent } from './components/myrecipes/myrecipes.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'myrecipes', component: MyrecipesComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'about', component: AboutComponent},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: '/dashboard', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

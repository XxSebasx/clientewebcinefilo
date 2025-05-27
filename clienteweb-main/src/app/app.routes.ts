import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AdminMovieComponent } from './admin-movie/admin-movie.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { CatalogComponent } from './catalog/catalog.component';
import { MovieComponent } from './movie/movie.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportsComponent } from './reports/reports.component';
import { ErrorComponent } from './error/error.component';
import { AdminMovieAddComponent } from './admin-movie-add/admin-movie-add.component';
import { AdminMovieUpdateComponent } from './admin-movie-update/admin-movie-update.component';
import { AboutComponent } from './about/about.component';
import { AdminGuard } from './guards/admin.guard';
import { ContactComponent } from './contact/contact.component';
import { MessagesComponent } from './messages/messages.component';
import { WarningComponent } from './warning/warning.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
    { path: 'admin-movie', component: AdminMovieComponent, canActivate: [AdminGuard] },
    { path: 'admin-user', component: AdminUserComponent, canActivate: [AdminGuard] },
    { path: 'catalog', component: CatalogComponent },
    { path: 'movie/:id', component: MovieComponent },
    { path: 'profile/:nombre', component: ProfileComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'reports', component: ReportsComponent, canActivate: [AdminGuard] },
    { path: 'error', component: ErrorComponent },
    {path: 'contact', component: ContactComponent},
    { path: 'admin-movie-add', component: AdminMovieAddComponent, canActivate: [AdminGuard] },
    { path: 'admin-movie-update', component: AdminMovieUpdateComponent, canActivate: [AdminGuard] },
    { path: 'about', component: AboutComponent },
    {path: 'messages', component: MessagesComponent, canActivate: [AdminGuard]},
    {path: 'warning', component: WarningComponent},
    { path: '**', redirectTo: 'error' }
];
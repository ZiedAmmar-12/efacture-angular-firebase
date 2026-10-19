import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule, Routes } from '@angular/router';


import { environment } from 'src/environments/environment.development';
import { AngularFireModule } from '@angular/fire/compat';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';



import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';

import * as firebase from 'firebase/compat';

import { HeaderComponent } from './header/header.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { ClientsService } from './services/clients.service';
import { SocietesService } from './services/societes.service';

import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PasswordforgetComponent } from './auth/passwordforget/passwordforget.component';

import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-list/user-form/user-form.component';
import { SingleUserComponent } from './user-list/single-user/single-user.component';
import { UserEditComponent } from './user-list/user-edit/user-edit.component';

import { ClientListComponent } from './client-list/client-list.component';
import { ClientFormComponent } from './client-list/client-form/client-form.component';
import { SingleClientComponent } from './client-list/single-client/single-client.component';
import { ClientEditComponent } from './client-list/client-edit/client-edit.component';

import { SocieteListComponent } from './societe-list/societe-list.component';
import { SocieteFormComponent } from './societe-list/societe-form/societe-form.component';
import { SingleSocieteComponent } from './societe-list/single-societe/single-societe.component';
import { SocieteEditComponent } from './societe-list/societe-edit/societe-edit.component';

import { FactureListComponent } from './facture-list/facture-list.component';
import { FactureFormComponent } from './facture-list/facture-form/facture-form.component';
import { FactureEditComponent } from './facture-list/facture-edit/facture-edit.component';
import { SingleFactureComponent } from './facture-list/single-facture/single-facture.component';
import { FacturesService } from './services/factures.service';
import { BlockPageComponent } from './block-page/block-page.component';
import { NavComponent } from './nav/nav.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DevisListComponent } from './devis-list/devis-list.component';
import { DevisFormComponent } from './devis-list/devis-form/devis-form.component';
import { DevisEditComponent } from './devis-list/devis-edit/devis-edit.component';
import { SingleDevisComponent } from './devis-list/single-devis/single-devis.component';
import { DevisService } from './services/devis.service';
import { CategorieListComponent } from './categorie-list/categorie-list.component';
import { CategorieEditComponent } from './categorie-list/categorie-edit/categorie-edit.component';
import { CategorieFormComponent } from './categorie-list/categorie-form/categorie-form.component';
import { SingleCategorieComponent } from './categorie-list/single-categorie/single-categorie.component';
import { CategoriesService } from './services/categories.service';
import { DevisListHorsSocieteComponent } from './devis-list-hors-societe/devis-list-hors-societe.component';
import { DevisEditHorsSocieteComponent } from './devis-list-hors-societe/devis-edit-hors-societe/devis-edit-hors-societe.component';
import { DevisFormHorsSocieteComponent } from './devis-list-hors-societe/devis-form-hors-societe/devis-form-hors-societe.component';
import { SingleDevisHorsSocieteComponent } from './devis-list-hors-societe/single-devis-hors-societe/single-devis-hors-societe.component';
import { FileUploadService } from './services/file-upload.service';
import { UploadListComponent } from './upload-list/upload-list.component';
import { PrespectiveListComponent } from './prespective-list/prespective-list.component';
import { PrespectiveEditComponent } from './prespective-list/prespective-edit/prespective-edit.component';
import { PrespectiveFormComponent } from './prespective-list/prespective-form/prespective-form.component';
import { SinglePrespectiveComponent } from './prespective-list/single-prespective/single-prespective.component';
import { PrestationListComponent } from './prestation-list/prestation-list.component';
import { PrestationFormComponent } from './prestation-list/prestation-form/prestation-form.component';
import { PrestationEditComponent } from './prestation-list/prestation-edit/prestation-edit.component';
import { SinglePrestationComponent } from './prestation-list/single-prestation/single-prestation.component';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { TestComponent } from './test/test.component';
import { DynamicComponent } from './dynamic/dynamic.component';






export function HttpLoaderFactory(http:HttpClient):TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

const appRoutes: Routes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'auth/passwordforget', component: PasswordforgetComponent },
  
  { path: 'users', canActivate:[AuthGuardService], component: UserListComponent},
  { path: 'users/new', canActivate:[AuthGuardService], component: UserFormComponent},
  { path: 'users/view/:id', canActivate:[AuthGuardService], component: SingleUserComponent},
  { path: 'users', canActivate:[AuthGuardService], component: UserEditComponent},

  { path: 'clients', canActivate:[AuthGuardService], component: ClientListComponent},
  { path: 'clients/new', canActivate:[AuthGuardService], component: ClientFormComponent},
  { path: 'clients/view/:id', canActivate:[AuthGuardService], component: SingleClientComponent},
  { path: 'clients', canActivate:[AuthGuardService], component: ClientEditComponent},

  { path: 'societes', canActivate:[AuthGuardService], component: SocieteListComponent},
  { path: 'societes/new', canActivate:[AuthGuardService], component: SocieteFormComponent},
  { path: 'societes/view/:id', canActivate:[AuthGuardService], component: SingleSocieteComponent},
  { path: 'societes', canActivate:[AuthGuardService], component: SocieteEditComponent},

  { path: 'factures', canActivate:[AuthGuardService], component: FactureListComponent},
  { path: 'factures/new', canActivate:[AuthGuardService], component: FactureFormComponent},
  { path: 'factures/view/:id', canActivate:[AuthGuardService], component: SingleFactureComponent},
  { path: 'factures', canActivate:[AuthGuardService], component: FactureEditComponent},

  { path: 'devis', canActivate:[AuthGuardService], component:DevisListComponent},
  { path: 'devis/new', canActivate:[AuthGuardService], component:DevisFormComponent},
  { path: 'devis/view/:id', canActivate:[AuthGuardService], component:SingleDevisComponent},
  { path: 'devis', canActivate:[AuthGuardService], component:DevisEditComponent},

  { path: 'devish', canActivate:[AuthGuardService], component:DevisListHorsSocieteComponent},
  { path: 'devish/new', canActivate:[AuthGuardService], component:DevisFormHorsSocieteComponent},
  { path: 'devish/view/:id', canActivate:[AuthGuardService], component:SingleDevisHorsSocieteComponent},
  { path: 'devish', canActivate:[AuthGuardService], component:DevisEditHorsSocieteComponent},

  { path: 'categories', canActivate:[AuthGuardService], component: CategorieListComponent},
  { path: 'categories/new', canActivate:[AuthGuardService], component: CategorieFormComponent},
  { path: 'categories/view/:id', canActivate:[AuthGuardService], component: SingleCategorieComponent},
  { path: 'categories', canActivate:[AuthGuardService], component: CategorieEditComponent},
  
  { path: 'prespectives', canActivate:[AuthGuardService], component: PrespectiveListComponent},
  { path: 'prespectives/new', canActivate:[AuthGuardService], component: PrespectiveFormComponent},
  { path: 'prespectives/view/:id', canActivate:[AuthGuardService], component: SinglePrespectiveComponent},
  { path: 'prespectives', canActivate:[AuthGuardService], component: PrespectiveEditComponent},

 
  { path: 'prestations', canActivate:[AuthGuardService], component: PrestationListComponent},
  { path: 'prestations/new', canActivate:[AuthGuardService], component: PrestationFormComponent},
  { path: 'prestations/view/:id', canActivate:[AuthGuardService], component: SinglePrestationComponent},
  { path: 'prestations', canActivate:[AuthGuardService], component: PrestationEditComponent},
  


  { path: '', redirectTo:'users', pathMatch:'full' },
  { path: '**', redirectTo:'users'},

];


@NgModule({
  declarations: [
    AppComponent,

    SigninComponent,
    SignupComponent,
    PasswordforgetComponent,

    HeaderComponent,

    UserListComponent,
    UserFormComponent,
    SingleUserComponent,
    UserEditComponent,

    ClientListComponent,
    ClientFormComponent,
    SingleClientComponent,
    ClientEditComponent,
    
    SocieteListComponent,
    SocieteFormComponent,
    SingleSocieteComponent,
    SocieteEditComponent,

    FactureListComponent,
    FactureFormComponent,
    FactureEditComponent,
    SingleFactureComponent,
    BlockPageComponent,
    NavComponent,

    DevisListComponent,
    DevisFormComponent,
    DevisEditComponent,
    SingleDevisComponent,
    
    CategorieListComponent,
    CategorieEditComponent,
    CategorieFormComponent,
    SingleCategorieComponent,

    DevisListHorsSocieteComponent,
    DevisEditHorsSocieteComponent,
    DevisFormHorsSocieteComponent,
    SingleDevisHorsSocieteComponent,
    UploadListComponent,
    
    PrespectiveListComponent,
    PrespectiveEditComponent,
    PrespectiveFormComponent,
    SinglePrespectiveComponent,
    PrestationListComponent,
    PrestationFormComponent,
    PrestationEditComponent,
    SinglePrestationComponent,
    FormulaireComponent,
    TestComponent,
    DynamicComponent,
 
    
 

   
  

 
    
    
  ],
  imports: [
    
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    NgxBootstrapIconsModule.pick(allIcons),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFireMessagingModule,
    AngularFireFunctionsModule,
    HttpClientModule,
    TranslateModule.forRoot(
      {
      loader:{
        provide:TranslateLoader,
        useFactory:HttpLoaderFactory,
        deps:[HttpClient]
      }
    }
    ),
    // provide modular style for AppCheck, see app.browser/server
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    
  ],
  providers: [

    AuthGuardService,
    AuthService,
    UsersService,
    ClientsService,
    CategoriesService,
    SocietesService,
    FacturesService,
    DevisService,
    FileUploadService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
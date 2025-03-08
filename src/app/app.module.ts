import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { MaterialModules } from './material.modules';

import { MAT_DATE_LOCALE } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FiltroSexoBiologicoPipe } from './pipes/filtro-sexo-biologico.pipe';
import { FiltroEstratoPipe } from './pipes/filtro-estrato.pipe';
import { FiltroMunicipioPipe } from './pipes/filtro-municipio.pipe';
import {
  PersonaComponent,
  ModalFormularioPersona,
} from './components/persona/persona.component';
import {
  InstitucionComponent,
  ModalFormularioInstitucion,
  ModalVistaInstitucion,
} from './components/institucion/institucion.component';
import { FiltroCampoAmplioPipe } from './pipes/filtro-campo-amplio.pipe';
import { FiltroCampoDetalladoPipe } from './pipes/filtro-campo-detallado.pipe';
import { FiltroCampoEspecificoPipe } from './pipes/filtro-campo-especifico.pipe';
import { FiltroEntidadPipe } from './pipes/filtro-entidad.pipe';
import { FiltroCuerpoColegiadoPipe } from './pipes/filtro-cuerpo-colegiado.pipe';
import { FiltroEntidadExternaPipe } from './pipes/filtro-entidad-externa.pipe';
import { FiltroMedioPipe } from './pipes/filtro-medio.pipe';
import { FiltroDerogaPipe } from './pipes/filtro-deroga.pipe';
import { FiltroEntidadInternaPipe } from './pipes/filtro-entidad-interna.pipe';
import { FiltroNormaTipoPipe } from './pipes/filtro-norma-tipo.pipe';
import { FiltroEstadoSniesPipe } from './pipes/filtro-estado-snies.pipe';
import { FiltroNivelAcademicoPipe } from './pipes/filtro-nivel-academico.pipe';
import { FiltroNivelFormacionPipe } from './pipes/filtro-nivel-formacion.pipe';
import { FiltroModalidadPipe } from './pipes/filtro-modalidad.pipe';
import { FiltroAreaConocimientoPipe } from './pipes/filtro-area-conocimiento.pipe';
import { FiltroSedePipe } from './pipes/filtro-sede.pipe';
import { EmailHidePipe } from './pipes/email-hide.pipe';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { NgxPrintModule } from 'ngx-print';

// Importa el idioma español de date-fns
import { es } from 'date-fns/locale';

// Registra el idioma español para Angular
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    NavbarComponent,
    FiltroSexoBiologicoPipe,
    FiltroEstratoPipe,
    FiltroMunicipioPipe,
    PersonaComponent,
    ModalFormularioPersona,
    ModalFormularioInstitucion,
    ModalVistaInstitucion,
    InstitucionComponent,
    FiltroCampoAmplioPipe,
    FiltroCampoDetalladoPipe,
    FiltroCampoEspecificoPipe,
    FiltroEntidadPipe,
    FiltroCuerpoColegiadoPipe,
    FiltroEntidadExternaPipe,
    FiltroMedioPipe,
    FiltroDerogaPipe,
    FiltroEntidadInternaPipe,
    FiltroNormaTipoPipe,
    FiltroEstadoSniesPipe,
    FiltroNivelAcademicoPipe,
    FiltroNivelFormacionPipe,
    FiltroModalidadPipe,
    FiltroAreaConocimientoPipe,
    FiltroSedePipe,
    EmailHidePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModules,
    NgxPrintModule,
  ],
  entryComponents: [
    ModalFormularioPersona,
    ModalFormularioInstitucion,
    ModalVistaInstitucion,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: LOCALE_ID, useValue: 'es' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

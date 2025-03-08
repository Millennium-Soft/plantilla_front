import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { PersonaComponent } from './components/persona/persona.component';
import { InstitucionComponent } from './components/institucion/institucion.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  //COMPONENTES DEL SISTEMA
  { path: 'login', component: LoginComponent },

  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },

  { path: 'institucion', component: InstitucionComponent, canActivate: [AuthGuard] },

  { path: 'persona', component: PersonaComponent, canActivate: [AuthGuard] },

  //REDIRECCIONAMIENTO COMOPONENTE POR DEFECTO PARA RUTAS INEXISTENTES EN EL NAVEGADOR
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: '**', pathMatch: 'full', redirectTo: '/login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

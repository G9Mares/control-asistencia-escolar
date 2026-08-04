import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatosMockService } from '../../core/services/datos-mock.service';
import { SesionDemoService } from '../../core/services/sesion-demo.service';
import { UsuarioDemo } from '../../core/models/escolar.models';

@Component({
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly router = inject(Router);
  private readonly datosMock = inject(DatosMockService);
  private readonly sesion = inject(SesionDemoService);

  readonly usuarios = this.datosMock.usuarios;

  acceder(usuario: UsuarioDemo): void {
    this.sesion.iniciarSesion(usuario);
    void this.router.navigateByUrl(usuario.rol === 'direccion' ? '/dashboard' : '/asistencias');
  }
}

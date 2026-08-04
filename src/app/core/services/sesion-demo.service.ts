import { Injectable, signal } from '@angular/core';
import { UsuarioDemo } from '../models/escolar.models';

const CLAVE_SESION = 'control-asistencia-escolar.sesion-demo';

@Injectable({ providedIn: 'root' })
export class SesionDemoService {
  readonly usuarioActual = signal<UsuarioDemo | null>(this.recuperarSesion());

  iniciarSesion(usuario: UsuarioDemo): void {
    this.usuarioActual.set(usuario);
    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
  }

  cerrarSesion(): void {
    this.usuarioActual.set(null);
    localStorage.removeItem(CLAVE_SESION);
  }

  private recuperarSesion(): UsuarioDemo | null {
    if (typeof localStorage === 'undefined') return null;

    try {
      return JSON.parse(localStorage.getItem(CLAVE_SESION) ?? 'null') as UsuarioDemo | null;
    } catch {
      localStorage.removeItem(CLAVE_SESION);
      return null;
    }
  }
}

import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SesionDemoService } from '../../core/services/sesion-demo.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  readonly titulo = input.required<string>();
  readonly menuAbierto = signal(false);
  readonly usuario = inject(SesionDemoService).usuarioActual;

  private readonly sesion = inject(SesionDemoService);
  private readonly router = inject(Router);

  alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  salir(): void {
    this.sesion.cerrarSesion();
    this.cerrarMenu();
    void this.router.navigateByUrl('/login');
  }
}

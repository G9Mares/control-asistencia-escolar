import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadoAsistencia, Estudiante, Grupo, Incidencia, Justificante, RegistroAsistencia } from '../../core/models/escolar.models';
import { DatosMockService } from '../../core/services/datos-mock.service';
import { SesionDemoService } from '../../core/services/sesion-demo.service';
import { AdminLayoutComponent } from '../../shared/layout/admin-layout.component';

interface FormularioIncidencia {
  tipo: 'entrada_tardia' | 'salida_anticipada';
  hora: string;
  motivo: string;
  descripcion: string;
}

interface FormularioJustificante {
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
  descripcion: string;
}

interface RegistroVista {
  estudiante: Estudiante;
  grupo: Grupo;
  registro?: RegistroAsistencia;
  estado: EstadoAsistencia;
  incidencia?: Incidencia;
  justificante?: Justificante;
}

@Component({
  imports: [AdminLayoutComponent, FormsModule],
  templateUrl: './asistencias.page.html',
  styleUrl: './asistencias.page.scss',
})
export class AsistenciasPage {
  private readonly datos = inject(DatosMockService);
  readonly usuario = inject(SesionDemoService).usuarioActual;
  readonly fechaMaxima = new Date().toISOString().slice(0, 10);
  readonly grupoSeleccionado = signal('todos');
  readonly fechaSeleccionada = signal(this.fechaMaxima);
  readonly grupos = this.datos.grupos;
  readonly esAsistenteDireccion = computed(() => this.usuario()?.rol === 'asistente_direccion');
  readonly esTrabajoSocial = computed(() => this.usuario()?.rol === 'trabajo_social');
  readonly estudianteSeleccionadoId = signal<string | null>(null);
  readonly accionAbierta = signal<'incidencia' | 'justificante' | null>(null);
  readonly mensajeConfirmacion = signal<string | null>(null);
  readonly errorFormulario = signal<string | null>(null);
  formularioIncidencia: FormularioIncidencia = this.crearFormularioIncidencia();
  formularioJustificante: FormularioJustificante = this.crearFormularioJustificante();
  nombreComprobante = '';

  readonly registrosFiltrados = computed<RegistroVista[]>(() => {
    const grupoSeleccionado = this.grupoSeleccionado();
    const fecha = this.fechaSeleccionada();
    const asistencias = this.datos.asistencias();
    const incidencias = this.datos.incidencias();
    const justificantes = this.datos.justificantes();

    return this.datos.estudiantes()
      .filter((estudiante) => grupoSeleccionado === 'todos' || estudiante.grupoId === grupoSeleccionado)
      .map((estudiante) => {
        const registro = asistencias.find((item) => item.estudianteId === estudiante.id && item.fecha === fecha);
        return {
          estudiante,
          grupo: this.datos.grupos().find((item) => item.id === estudiante.grupoId)!,
          registro,
          estado: registro?.estado ?? 'ausente',
          incidencia: registro?.incidenciaId ? incidencias.find((item) => item.id === registro.incidenciaId) : undefined,
          justificante: registro?.justificanteId ? justificantes.find((item) => item.id === registro.justificanteId) : undefined,
        };
      });
  });

  readonly estudianteSeleccionado = computed(() =>
    this.registrosFiltrados().find((item) => item.estudiante.id === this.estudianteSeleccionadoId()) ?? null,
  );

  actualizarGrupo(grupoId: string): void {
    this.grupoSeleccionado.set(grupoId);
    this.limpiarSeleccion();
  }

  actualizarFecha(fecha: string): void {
    this.fechaSeleccionada.set(fecha);
    this.limpiarSeleccion();
  }

  marcarAsistencia(item: RegistroVista): void {
    this.datos.marcarPresente(item.estudiante.id, this.fechaSeleccionada(), this.usuario()?.nombre ?? 'Asistente de dirección');
  }

  quitarAsistencia(item: RegistroVista): void {
    this.datos.quitarAsistencia(item.estudiante.id, this.fechaSeleccionada(), this.usuario()?.nombre ?? 'Asistente de dirección');
  }

  puedeMarcar(item: RegistroVista): boolean {
    return !item.justificante && item.estado === 'ausente';
  }

  seleccionarEstudiante(item: RegistroVista): void {
    this.estudianteSeleccionadoId.set(item.estudiante.id);
  }

  abrirAccion(accion: 'incidencia' | 'justificante'): void {
    if (!this.estudianteSeleccionado()) return;
    this.errorFormulario.set(null);
    this.formularioIncidencia = this.crearFormularioIncidencia();
    this.formularioJustificante = this.crearFormularioJustificante();
    this.nombreComprobante = '';
    this.accionAbierta.set(accion);
  }

  cerrarAccion(): void { this.accionAbierta.set(null); }

  esEstudianteSeleccionado(item: RegistroVista): boolean {
    return item.estudiante.id === this.estudianteSeleccionadoId();
  }

  seleccionarComprobante(evento: Event): void {
    this.nombreComprobante = (evento.target as HTMLInputElement).files?.[0]?.name ?? '';
  }

  guardarIncidencia(): void {
    const estudiante = this.estudianteSeleccionado();
    const formulario = this.formularioIncidencia;
    if (!estudiante || !formulario.hora || !formulario.motivo.trim() || !formulario.descripcion.trim()) {
      this.errorFormulario.set('Completa el tipo, la hora, el motivo y la descripción.');
      return;
    }

    const auditoria = this.datos.registrarIncidencia({
      estudianteId: estudiante.estudiante.id,
      fecha: this.fechaSeleccionada(),
      tipo: formulario.tipo,
      hora: formulario.hora,
      motivo: formulario.motivo.trim(),
      descripcion: formulario.descripcion.trim(),
      responsable: this.usuario()?.nombre ?? 'Trabajo social',
    });
    this.confirmar('Incidencia registrada', auditoria.referencia, auditoria.responsable, auditoria.hora);
  }

  guardarJustificante(): void {
    const estudiante = this.estudianteSeleccionado();
    const formulario = this.formularioJustificante;
    if (!estudiante || !formulario.tipo.trim() || !formulario.fechaInicio || !formulario.fechaFin || !formulario.motivo.trim() || !formulario.descripcion.trim()) {
      this.errorFormulario.set('Completa todos los campos obligatorios del justificante.');
      return;
    }
    if (formulario.fechaFin < formulario.fechaInicio) {
      this.errorFormulario.set('La fecha de fin debe ser igual o posterior a la fecha de inicio.');
      return;
    }

    const auditoria = this.datos.generarJustificante({
      estudianteId: estudiante.estudiante.id,
      tipo: formulario.tipo.trim(),
      fechaInicio: formulario.fechaInicio,
      fechaFin: formulario.fechaFin,
      motivo: formulario.motivo.trim(),
      descripcion: formulario.descripcion.trim(),
      comprobanteNombre: this.nombreComprobante || undefined,
      responsable: this.usuario()?.nombre ?? 'Trabajo social',
    }, this.fechaSeleccionada());
    this.confirmar('Justificante generado', auditoria.referencia, auditoria.responsable, auditoria.hora);
  }

  private confirmar(accion: string, referencia: string, responsable: string, hora: string): void {
    this.cerrarAccion();
    this.mensajeConfirmacion.set(`${accion}. Auditoría ficticia ${referencia} · ${responsable} · ${hora}.`);
    window.setTimeout(() => this.mensajeConfirmacion.set(null), 5000);
  }

  private crearFormularioIncidencia(): FormularioIncidencia {
    return { tipo: 'entrada_tardia', hora: '', motivo: '', descripcion: '' };
  }

  private crearFormularioJustificante(): FormularioJustificante {
    return { tipo: 'Médico', fechaInicio: this.fechaSeleccionada(), fechaFin: this.fechaSeleccionada(), motivo: '', descripcion: '' };
  }

  private limpiarSeleccion(): void {
    this.estudianteSeleccionadoId.set(null);
    this.cerrarAccion();
  }

  leyenda(item: RegistroVista): string | null {
    if (item.justificante) return `Justificante aplicado: ${item.justificante.tipo}.`;
    if (item.incidencia?.tipo === 'entrada_tardia') return `Entrada tardía a las ${item.incidencia.hora}: ${item.incidencia.motivo}.`;
    if (item.incidencia?.tipo === 'salida_anticipada') return `Salida anticipada a las ${item.incidencia.hora}: ${item.incidencia.motivo}.`;
    return null;
  }

  textoEstado(estado: EstadoAsistencia): string {
    return ({
      presente: 'Presente y a tiempo',
      retardo: 'Retardo',
      salida_anticipada: 'Salida anticipada',
      justificada: 'Ausencia justificada',
      ausente: 'Ausencia sin justificar',
    })[estado];
  }
}

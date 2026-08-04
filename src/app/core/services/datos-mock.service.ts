import { Injectable, signal } from '@angular/core';
import { Auditoria, Incidencia, Justificante, RegistroAsistencia } from '../models/escolar.models';
import { ASISTENCIAS, AUDITORIAS, ESTUDIANTES, GRUPOS, INCIDENCIAS, JUSTIFICANTES, METRICAS_MENSUALES, USUARIOS_DEMO } from './mock-data';

@Injectable({ providedIn: 'root' })
export class DatosMockService {
  readonly usuarios = signal(USUARIOS_DEMO);
  readonly grupos = signal(GRUPOS);
  readonly estudiantes = signal(ESTUDIANTES);
  readonly asistencias = signal(ASISTENCIAS);
  readonly incidencias = signal(INCIDENCIAS);
  readonly justificantes = signal(JUSTIFICANTES);
  readonly metricasMensuales = signal(METRICAS_MENSUALES);
  readonly auditorias = signal(AUDITORIAS);

  marcarPresente(estudianteId: string, fecha: string, responsable: string): void {
    const ahora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const existente = this.asistencias().find((registro) => registro.estudianteId === estudianteId && registro.fecha === fecha);

    if (existente?.justificanteId) return;

    if (existente) {
      this.asistencias.update((registros) => registros.map((registro) =>
        registro.id === existente.id
          ? { ...registro, estado: 'presente', actualizadoPor: responsable, actualizadoEn: ahora, incidenciaId: undefined }
          : registro,
      ));
      return;
    }

    const nuevoRegistro: RegistroAsistencia = {
      id: `a-${Date.now()}`,
      estudianteId,
      fecha,
      estado: 'presente',
      actualizadoPor: responsable,
      actualizadoEn: ahora,
    };
    this.asistencias.update((registros) => [...registros, nuevoRegistro]);
  }

  quitarAsistencia(estudianteId: string, fecha: string, responsable: string): void {
    const ahora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    this.asistencias.update((registros) => registros.map((registro) =>
      registro.estudianteId === estudianteId && registro.fecha === fecha && !registro.justificanteId
        ? { ...registro, estado: 'ausente', actualizadoPor: responsable, actualizadoEn: ahora }
        : registro,
    ));
  }

  registrarIncidencia(datos: Omit<Incidencia, 'id' | 'creadaEn'>): Auditoria {
    const horaRegistro = this.horaActual();
    const incidencia: Incidencia = { ...datos, id: `i-${Date.now()}`, creadaEn: horaRegistro };
    this.incidencias.update((incidencias) => [...incidencias, incidencia]);

    const estado = incidencia.tipo === 'entrada_tardia' ? 'retardo' : 'salida_anticipada';
    const registroExistente = this.asistencias().find((registro) => registro.estudianteId === incidencia.estudianteId && registro.fecha === incidencia.fecha);
    if (registroExistente) {
      this.asistencias.update((registros) => registros.map((registro) =>
        registro.id === registroExistente.id
          ? { ...registro, estado, incidenciaId: incidencia.id, actualizadoPor: incidencia.responsable, actualizadoEn: horaRegistro }
          : registro,
      ));
    } else {
      this.asistencias.update((registros) => [...registros, {
        id: `a-${Date.now()}`,
        estudianteId: incidencia.estudianteId,
        fecha: incidencia.fecha,
        estado,
        incidenciaId: incidencia.id,
        actualizadoPor: incidencia.responsable,
        actualizadoEn: horaRegistro,
      }]);
    }

    return this.agregarAuditoria('Incidencia registrada', incidencia.estudianteId, incidencia.responsable, horaRegistro);
  }

  generarJustificante(datos: Omit<Justificante, 'id' | 'creadaEn'>, fechaVisible: string): Auditoria {
    const horaRegistro = this.horaActual();
    const justificante: Justificante = { ...datos, id: `j-${Date.now()}`, creadaEn: horaRegistro };
    this.justificantes.update((justificantes) => [...justificantes, justificante]);

    const registroExistente = this.asistencias().find((registro) => registro.estudianteId === justificante.estudianteId && registro.fecha === fechaVisible);
    if (registroExistente) {
      this.asistencias.update((registros) => registros.map((registro) =>
        registro.id === registroExistente.id
          ? { ...registro, estado: 'justificada', justificanteId: justificante.id, actualizadoPor: justificante.responsable, actualizadoEn: horaRegistro }
          : registro,
      ));
    } else {
      this.asistencias.update((registros) => [...registros, {
        id: `a-${Date.now()}`,
        estudianteId: justificante.estudianteId,
        fecha: fechaVisible,
        estado: 'justificada',
        justificanteId: justificante.id,
        actualizadoPor: justificante.responsable,
        actualizadoEn: horaRegistro,
      }]);
    }

    return this.agregarAuditoria('Justificante generado', justificante.estudianteId, justificante.responsable, horaRegistro);
  }

  private agregarAuditoria(accion: string, estudianteId: string, responsable: string, hora: string): Auditoria {
    const referencia = `AUD-${Date.now().toString().slice(-8)}`;
    const auditoria: Auditoria = { id: `au-${Date.now()}`, referencia, accion, estudianteId, responsable, hora };
    this.auditorias.update((auditorias) => [...auditorias, auditoria]);
    return auditoria;
  }

  private horaActual(): string {
    return new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }
}

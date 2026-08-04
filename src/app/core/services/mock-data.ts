import {
  Estudiante,
  Grupo,
  Incidencia,
  Justificante,
  MetricaGrupo,
  RegistroAsistencia,
  UsuarioDemo,
  Auditoria,
} from '../models/escolar.models';

export const USUARIOS_DEMO: UsuarioDemo[] = [
  { id: 'u-1', nombre: 'María Torres', rol: 'asistente_direccion', nombreRol: 'Asistente de dirección' },
  { id: 'u-2', nombre: 'Daniela Cruz', rol: 'trabajo_social', nombreRol: 'Trabajo social' },
  { id: 'u-3', nombre: 'Arturo Mendoza', rol: 'direccion', nombreRol: 'Dirección' },
];

export const GRUPOS: Grupo[] = [
  { id: 'g-1', nombre: '1° A', grado: 'Primero', turno: 'Matutino' },
  { id: 'g-2', nombre: '2° B', grado: 'Segundo', turno: 'Matutino' },
  { id: 'g-3', nombre: '3° A', grado: 'Tercero', turno: 'Matutino' },
];

export const ESTUDIANTES: Estudiante[] = [
  { id: 'e-1', nombre: 'Sofía Ramírez', grupoId: 'g-1', porcentajeMensual: 96 },
  { id: 'e-2', nombre: 'Mateo Hernández', grupoId: 'g-1', porcentajeMensual: 78 },
  { id: 'e-3', nombre: 'Valentina López', grupoId: 'g-2', porcentajeMensual: 89 },
  { id: 'e-4', nombre: 'Diego Martínez', grupoId: 'g-2', porcentajeMensual: 74 },
  { id: 'e-5', nombre: 'Camila González', grupoId: 'g-3', porcentajeMensual: 93 },
  { id: 'e-6', nombre: 'Emiliano Pérez', grupoId: 'g-3', porcentajeMensual: 81 },
];

export const ASISTENCIAS: RegistroAsistencia[] = [
  { id: 'a-1', estudianteId: 'e-1', fecha: '2026-08-04', estado: 'presente', actualizadoPor: 'María Torres', actualizadoEn: '07:56' },
  { id: 'a-2', estudianteId: 'e-2', fecha: '2026-08-04', estado: 'ausente', actualizadoPor: 'María Torres', actualizadoEn: '08:10' },
  { id: 'a-3', estudianteId: 'e-3', fecha: '2026-08-04', estado: 'retardo', incidenciaId: 'i-1', actualizadoPor: 'Daniela Cruz', actualizadoEn: '08:25' },
  { id: 'a-4', estudianteId: 'e-4', fecha: '2026-08-04', estado: 'justificada', justificanteId: 'j-1', actualizadoPor: 'Daniela Cruz', actualizadoEn: '08:05' },
  { id: 'a-5', estudianteId: 'e-5', fecha: '2026-08-04', estado: 'presente', actualizadoPor: 'María Torres', actualizadoEn: '07:58' },
  { id: 'a-6', estudianteId: 'e-6', fecha: '2026-08-04', estado: 'salida_anticipada', incidenciaId: 'i-2', actualizadoPor: 'Daniela Cruz', actualizadoEn: '12:40' },
];

export const INCIDENCIAS: Incidencia[] = [
  { id: 'i-1', estudianteId: 'e-3', fecha: '2026-08-04', tipo: 'entrada_tardia', hora: '08:22', motivo: 'Transporte', descripcion: 'Llegó después del horario de entrada.', responsable: 'Daniela Cruz', creadaEn: '08:25' },
  { id: 'i-2', estudianteId: 'e-6', fecha: '2026-08-04', tipo: 'salida_anticipada', hora: '12:35', motivo: 'Cita médica', descripcion: 'Salida autorizada por tutor.', responsable: 'Daniela Cruz', creadaEn: '12:40' },
];

export const JUSTIFICANTES: Justificante[] = [
  { id: 'j-1', estudianteId: 'e-4', tipo: 'Médico', fechaInicio: '2026-08-04', fechaFin: '2026-08-04', motivo: 'Consulta médica', descripcion: 'Justificante recibido por trabajo social.', comprobanteNombre: 'constancia-medica.pdf', responsable: 'Daniela Cruz', creadaEn: '08:05' },
];

export const METRICAS_MENSUALES: MetricaGrupo[] = [
  { grupoId: 'g-1', asistencia: 87, faltasSinJustificar: 5, justificantes: 2 },
  { grupoId: 'g-2', asistencia: 82, faltasSinJustificar: 8, justificantes: 4 },
  { grupoId: 'g-3', asistencia: 91, faltasSinJustificar: 3, justificantes: 1 },
];

export const AUDITORIAS: Auditoria[] = [
  { id: 'au-1', referencia: 'AUD-20260804-001', accion: 'Justificante generado', estudianteId: 'e-4', responsable: 'Daniela Cruz', hora: '08:05' },
];

export type RolUsuario = 'asistente_direccion' | 'trabajo_social' | 'direccion';
export type EstadoAsistencia = 'presente' | 'retardo' | 'salida_anticipada' | 'justificada' | 'ausente';
export type TipoIncidencia = 'entrada_tardia' | 'salida_anticipada';

export interface UsuarioDemo {
  id: string;
  nombre: string;
  rol: RolUsuario;
  nombreRol: string;
}

export interface Grupo {
  id: string;
  nombre: string;
  grado: string;
  turno: 'Matutino' | 'Vespertino';
}

export interface Estudiante {
  id: string;
  nombre: string;
  grupoId: string;
  porcentajeMensual: number;
}

export interface RegistroAsistencia {
  id: string;
  estudianteId: string;
  fecha: string;
  estado: EstadoAsistencia;
  actualizadoPor?: string;
  actualizadoEn?: string;
  incidenciaId?: string;
  justificanteId?: string;
}

export interface Incidencia {
  id: string;
  estudianteId: string;
  fecha: string;
  tipo: TipoIncidencia;
  hora: string;
  motivo: string;
  descripcion: string;
  responsable: string;
  creadaEn: string;
}

export interface Justificante {
  id: string;
  estudianteId: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
  descripcion: string;
  comprobanteNombre?: string;
  responsable: string;
  creadaEn: string;
}

export interface MetricaGrupo {
  grupoId: string;
  asistencia: number;
  faltasSinJustificar: number;
  justificantes: number;
}

export interface Auditoria {
  id: string;
  referencia: string;
  accion: string;
  estudianteId: string;
  responsable: string;
  hora: string;
}

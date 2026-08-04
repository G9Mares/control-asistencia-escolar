import { Component, input } from '@angular/core';
import { EstadoAsistencia } from '../../core/models/escolar.models';

@Component({
  selector: 'app-estado-asistencia',
  template: '<span [attr.data-estado]="estado()">{{ etiqueta() }}</span>',
})
export class EstadoAsistenciaComponent {
  readonly estado = input.required<EstadoAsistencia>();

  etiqueta(): string {
    return ({ presente: 'Presente', retardo: 'Retardo', salida_anticipada: 'Salida anticipada', justificada: 'Ausencia justificada', ausente: 'Ausente sin justificar' })[this.estado()];
  }
}

import { Component, computed, inject } from '@angular/core';
import { Estudiante, Grupo, MetricaGrupo } from '../../core/models/escolar.models';
import { DatosMockService } from '../../core/services/datos-mock.service';
import { SesionDemoService } from '../../core/services/sesion-demo.service';
import { AdminLayoutComponent } from '../../shared/layout/admin-layout.component';

interface ResumenGrupo {
  grupo: Grupo;
  metrica: MetricaGrupo;
}

interface RankingEstudiante {
  estudiante: Estudiante;
  grupo: string;
  cantidad: number;
}

@Component({
  imports: [AdminLayoutComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  private readonly datos = inject(DatosMockService);
  readonly usuario = inject(SesionDemoService).usuarioActual;
  readonly esDireccion = computed(() => this.usuario()?.rol === 'direccion');
  readonly mesActual = new Date().toISOString().slice(0, 7);
  readonly etiquetaMes = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(new Date());

  readonly resumenPorGrupo = computed<ResumenGrupo[]>(() =>
    this.datos.metricasMensuales().map((metrica) => ({
      metrica,
      grupo: this.datos.grupos().find((grupo) => grupo.id === metrica.grupoId)!,
    })),
  );

  readonly asistenciaGeneral = computed(() => {
    const metricas = this.datos.metricasMensuales();
    return metricas.length ? Math.round(metricas.reduce((total, metrica) => total + metrica.asistencia, 0) / metricas.length) : 0;
  });

  readonly rankingFaltas = computed<RankingEstudiante[]>(() =>
    this.datos.estudiantes().map((estudiante) => ({
      estudiante,
      grupo: this.nombreGrupo(estudiante.grupoId),
      cantidad: this.datos.asistencias().filter((registro) =>
        registro.estudianteId === estudiante.id && registro.fecha.startsWith(this.mesActual) && registro.estado === 'ausente',
      ).length,
    })).sort((a, b) => b.cantidad - a.cantidad || a.estudiante.nombre.localeCompare(b.estudiante.nombre)).slice(0, 5),
  );

  readonly rankingJustificantes = computed<RankingEstudiante[]>(() =>
    this.datos.estudiantes().map((estudiante) => ({
      estudiante,
      grupo: this.nombreGrupo(estudiante.grupoId),
      cantidad: this.datos.justificantes().filter((justificante) =>
        justificante.estudianteId === estudiante.id && justificante.fechaInicio.startsWith(this.mesActual),
      ).length,
    })).sort((a, b) => b.cantidad - a.cantidad || a.estudiante.nombre.localeCompare(b.estudiante.nombre)).slice(0, 5),
  );

  readonly alertasBajo80 = computed(() => this.datos.estudiantes().filter((estudiante) => estudiante.porcentajeMensual < 80));

  private nombreGrupo(grupoId: string): string {
    return this.datos.grupos().find((grupo) => grupo.id === grupoId)?.nombre ?? 'Sin grupo';
  }
}

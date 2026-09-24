import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActividadesService } from '../actividades';

@Component({
  selector: 'app-detalle-actividad',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './detalle-actividad.html',
  styleUrls: ['./detalle-actividad.css'], 
})
export class DetalleActividad {
  private readonly servicio = inject(ActividadesService);

  readonly id = input.required<string>();

  protected readonly actividad = computed(() =>
    this.servicio.buscarPorId(Number(this.id()))
  );

  // Método para eliminar la actividad
  protected eliminar(): void {
    const id = Number(this.id());
    this.servicio.eliminar(id);
  }
}



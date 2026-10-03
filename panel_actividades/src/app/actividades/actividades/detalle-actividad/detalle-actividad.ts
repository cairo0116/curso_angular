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

  protected readonly idNumerica = computed(() => Number(this.id()));

  protected readonly invalida = computed(() => {
    const valor = this.id().trim();
    const reservada = ['nueva', 'editar'].includes(valor.toLowerCase());
    return valor !== '' && (reservada || !/^\d+$/.test(valor));
  });

  protected readonly actividad = computed(() => {
    const valor = this.idNumerica();
    if (!Number.isInteger(valor) || this.invalida()) {
      return undefined;
    }
    return this.servicio.buscarPorId(valor);
  });

  protected eliminar(): void {
    const id = this.idNumerica();
    if (Number.isInteger(id)) {
      this.servicio.eliminar(id);
    }
  }
}



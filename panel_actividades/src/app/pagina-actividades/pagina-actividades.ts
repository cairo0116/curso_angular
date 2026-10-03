import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { ActividadesApi } from '../actividades/api/actividades-api';
import { ActividadesService } from '../actividades/actividades/actividades';
import { mensajeDe } from '../actividades/api/mensajes';
import { Actividad, EstadoActividad, FiltroEstado, FiltroPrioridad, Prioridad } from '../modelos/actividad';
import { ResumenActividades } from '../actividades/resumen-actividades/resumen-actividades';
import { ListaActividades } from '../actividades/lista-actividades/lista-actividades';
import { PanelSeccion } from '../compartido/panel/panel-seccion';
import { FiltrosActividades } from '../actividades/filtros-actividades/filtros-actividades';

@Component({
  selector: 'app-pagina-actividades',
  standalone: true,
  imports: [ResumenActividades, FiltrosActividades, ListaActividades, PanelSeccion, RouterLink],
  templateUrl: './pagina-actividades.html',
  styleUrl: './pagina-actividades.css',
})
export class PaginaActividades {
  private readonly servicio = inject(ActividadesService);
  private readonly api = inject(ActividadesApi);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  protected readonly actividades = this.servicio.actividades;
  protected readonly cargando = this.servicio.cargando;
  protected readonly errorCarga = this.servicio.error;

  private readonly orden: Record<Prioridad, number> = { alta: 0, media: 1, baja: 2 };
  readonly buscar = input<string | undefined>('');
  readonly estado = input<FiltroEstado | undefined>('todas');
  readonly prioridad = input<FiltroPrioridad | undefined>('todas');

  protected readonly termino = computed(() => this.buscar() ?? '');
  protected readonly filtroEstado = computed(() => this.estado() ?? 'todas');
  protected readonly filtroPrioridad = computed(() => this.prioridad() ?? 'todas');
  protected readonly seleccionadaId = signal<number | null>(null);
  protected readonly resultados = signal<Actividad[] | null>(null);
  protected readonly errorBusqueda = signal('');

  constructor() {
    toObservable(this.termino)
      .pipe(
        debounceTime(300),
        switchMap((t) => {
          this.resultados.set(null);
          this.errorBusqueda.set('');

          return t.trim() === ''
            ? of(null)
            : this.api.buscar(t).pipe(
                catchError((error: unknown) => {
                  this.errorBusqueda.set(mensajeDe(error));
                  return of(null);
                }),
              );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((r) => this.resultados.set(r));
  }

  protected readonly visibles = computed(() => {
    const termino = this.termino().trim().toLocaleLowerCase('es');
    const estado = this.filtroEstado();
    const prioridad = this.filtroPrioridad();
    const base = termino === '' ? this.actividades() : (this.resultados() ?? this.actividades());

    return base
      .filter((a) => termino === '' || a.titulo.toLocaleLowerCase('es').includes(termino))
      .filter((a) => estado === 'todas' || a.estado === estado)
      .filter((a) => prioridad === 'todas' || a.prioridad === prioridad)
      .sort((primera, segunda) => this.orden[primera.prioridad] - this.orden[segunda.prioridad]);
  });

  protected readonly total = this.servicio.total;
  protected readonly mostradas = computed(() => this.visibles().length);
  protected readonly pendientes = this.servicio.pendientes;
  protected readonly enProgreso = this.servicio.enProgreso;
  protected readonly completadas = this.servicio.completadas;
  protected readonly porcentaje = this.servicio.porcentaje;
  protected readonly hayFiltros = computed(
    () =>
      this.termino().trim() !== '' ||
      this.filtroEstado() !== 'todas' ||
      this.filtroPrioridad() !== 'todas',
  );
  protected readonly mensajeVacio = computed(() =>
    this.total() === 0
      ? 'Todavía no hay actividades. Crea la primera para empezar.'
      : 'Ninguna actividad coincide con los filtros aplicados.',
  );
  protected readonly seleccionada = computed(
    () => this.actividades().find((a) => a.id === this.seleccionadaId()) ?? null,
  );

  protected alternarDestacada(id: number): void {
    this.servicio.alternarDestacada(id);
  }

  protected avanzarEstado(id: number): void {
    this.servicio.avanzarEstado(id);
  }

  protected eliminar(id: number): void {
    this.servicio.eliminar(id);
    this.seleccionadaId.update((actual) => (actual === id ? null : actual));
  }

  protected seleccionar(id: number): void {
    this.seleccionadaId.update((actual) => (actual === id ? null : id));
  }

  protected cambiarBuscar(valor: string): void {
    this.actualizarFiltros({ buscar: valor || null });
  }

  protected cambiarEstado(valor: FiltroEstado): void {
    this.actualizarFiltros({ estado: valor === 'todas' ? null : valor });
  }

  protected cambiarPrioridad(valor: FiltroPrioridad): void {
    this.actualizarFiltros({ prioridad: valor === 'todas' ? null : valor });
  }

  protected limpiarFiltros(): void {
    this.actualizarFiltros({ buscar: null, estado: null, prioridad: null });
  }

  protected recargar(): void {
    this.servicio.cargar();
  }

  private actualizarFiltros(queryParams: {
    buscar?: string | null;
    estado?: FiltroEstado | null;
    prioridad?: FiltroPrioridad | null;
  }): void {
    void this.router.navigate([], {
      relativeTo: this.ruta,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}



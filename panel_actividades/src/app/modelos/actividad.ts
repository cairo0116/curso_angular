export type EstadoActividad = 'pendiente' | 'en_progreso' | 'completada';

export type Prioridad = 'baja' | 'media' | 'alta';

export interface Actividad {
  id: number;
  titulo: string;
  estado: EstadoActividad;
  prioridad: Prioridad;
  creadaEn: string;
  destacada: boolean;
}

export type FiltroEstado = EstadoActividad | 'todas';
export type FiltroPrioridad = Prioridad | 'todas';

export const ETIQUETAS: Record<EstadoActividad, string> = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
};

export function esColeccionActividades(valor: unknown): valor is Actividad[] {
  return Array.isArray(valor) && valor.every((item) => {
    if (typeof item !== 'object' || item === null) {
      return false;
    }

    const actividad = item as Partial<Actividad>;

    return (
      typeof actividad.id === 'number' &&
      typeof actividad.titulo === 'string' &&
      typeof actividad.creadaEn === 'string' &&
      typeof actividad.destacada === 'boolean' &&
      (actividad.estado === 'pendiente' ||
        actividad.estado === 'en_progreso' ||
        actividad.estado === 'completada') &&
      (actividad.prioridad === 'baja' ||
        actividad.prioridad === 'media' ||
        actividad.prioridad === 'alta')
    );
  });
}
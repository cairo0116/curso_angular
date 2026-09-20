import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PaginaActividades } from './pagina-actividades/pagina-actividades';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PaginaActividades],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

import { IComida } from "./icomida";

export interface DiasSemana {
    id: number;
    //nombre?: string;
    titulo: string;
    pic: string;
    comidas: IComida[];
    ejercicios: any[];
  }

import { DiasSemana } from "./dias-semana";
import { IProducto } from "./iproducto";

export interface IComida {
    id: number;
    titulo: string;
    pic: string;
    kcal: number;
    proteinas: number;
    gramos: number;
    carbohidratos: number;
    diaSemana: DiasSemana;
    productos: IProducto[];
}

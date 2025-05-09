import { IProducto } from "./iproducto";
import { UserDto } from "./user-dto";


export interface IIngesta {
  id: number;
  fecha: string;
  comidaNombre: string;
  productos: IProducto[];
  user: UserDto;
}

export interface IIngestaDTO {
  comidaNombre: string;
  fecha: string;
  productoIds: number[];
  userId: number; // Add this field
}

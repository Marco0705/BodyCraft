export interface IProducto {
  id?: number;
  titulo: string;
  tipoComida: string;
  marca: string;
  cantGramos: number;
  kcal: number;
  grasas: number;
  carbohidratos: number;
  proteinas: number;
  urlimagen?: string;
}

export interface ICreateProductoDTO {
  titulo: string;
  tipoComida: string;
  marca: string;
  cantGramos: number;
  kcal: number;
  proteinas: number;
  grasas: number;
  carbohidratos: number;
  urlimagen?: string;
}

export interface IIngestaDiaria {
  fecha: string; // ej: '2025-04-25'
  comidas: IComidaDelDia[];
}

export interface IComidaDelDia {
  tipo: 'Desayuno' | 'Media Mañana' | 'Comida' | 'Merienda' | 'Cena';
  productos: IProductoIngestado[];
}

export interface IProductoIngestado {
  productoId: number;
  titulo: string;
  cantidad: number; // gramos
  kcal: number; // se calcula multiplicando por cada 100g
}
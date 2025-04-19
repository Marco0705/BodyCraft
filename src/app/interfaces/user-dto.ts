import { DiasSemana } from "./dias-semana";
import { Role } from "./role";

export interface UserDto {
    id: number;
    username: string;
    password: string;
    name: string;
    email: string;
    diasquevoy: number;
    comidas: number;
    peso: number;
    genero: string;
    age: number;
    image: string;
    creationDate: string;
    lastLogin: string | null;
    active: boolean;
    roles: Role[];
    diasSemana: DiasSemana[];
    enabled: boolean;
    credentialsNonExpired: boolean;
    accountNonExpired: boolean;
    authorities: { authority: string }[];
    accountNonLocked: boolean;
  }
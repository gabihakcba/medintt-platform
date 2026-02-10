export class PacienteResponse {
  Nombre: string;
  Apellido: string;
  NroDocumento: string;
  FechaNacimiento: Date;
  Direccion: string;
  Genero: string;
  Barrio?: string;
  Id_Localidad?: number;
  Celular?: string;
  Telefono?: string;
  Email?: string;
  firma?: string | null;
  firmaUrl?: string;
}

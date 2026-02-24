export class UserPermissionsUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly empresaId: string, // Guardaremos empresaName aquí si no está en DB, o pasaremos nombreEmpresa explícitamente.
    public readonly nombreEmpresa: string,
    public readonly nombreCompleto: string,
    public readonly permissions: string[],
    // Datos específicos de paciente (opcionales)
    public readonly isPatient?: boolean,
    public readonly nombre?: string,
    public readonly apellido?: string,
    public readonly dni?: string,
    public readonly action?: 'registered' | 'created' | 'updated' | 'deleted',
    public readonly roleId?: string,
    public readonly roleCode?: string,
    public readonly projectId?: string,
    public readonly projectCode?: string,
    public readonly organizationCode?: string,
  ) {}
}

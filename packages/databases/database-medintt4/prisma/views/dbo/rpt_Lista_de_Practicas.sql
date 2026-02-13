SELECT
  dbo.Practicas.Id,
  dbo.Practicas.Fecha_Turno AS Fecha,
  dbo.Practicas.Hora_Turno AS Hora,
  dbo.Practicas.Es_Urgencia AS Urgencia,
  UPPER(dbo.Usuarios.Usuario) AS Tecnico,
  dbo.Profesionales.Codigo AS Profesional,
  dbo.Practicas.Status,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre + ' - ' + dbo.Pacientes.TipoDocumento + ' ' + dbo.Pacientes.NroDocumento AS Paciente,
  dbo.Codigos_Valorizacion.Descripcion AS Practica,
  dbo.Practicas.Cantidad,
  dbo.Prestatarias.Abreviacion AS Empresa,
  dbo.Afiliacion_Pacientes.TipoAfiliado,
  dbo.Afiliacion_Pacientes.Numero_Afiliado,
  dbo.Planes_ObrasSociales.[Plan],
  dbo.Practicas.Es_ObraSocial,
  dbo.Prestatarias.Tipo,
  CASE
    dbo.Practicas.Recepcionado
    WHEN -1 THEN 'SI'
    ELSE 'NO'
  END AS Recepcionado,
  dbo.Practicas.Id_Usuario_Responsable,
  dbo.Practicas.Id_Profesional_Informante,
  dbo.Practicas.Honorarios_Profesional_Informante,
  dbo.Practicas.Pagado,
  dbo.Practicas.Saldo,
  dbo.Practicas.Id_Profesional_Firmante,
  dbo.Practicas.Id_Paciente,
  dbo.Afiliacion_Pacientes.Id_Prestataria
FROM
  dbo.Pacientes
  RIGHT JOIN dbo.Practicas
  LEFT JOIN dbo.Profesionales ON dbo.Practicas.Id_Profesional_Informante = dbo.Profesionales.Id;
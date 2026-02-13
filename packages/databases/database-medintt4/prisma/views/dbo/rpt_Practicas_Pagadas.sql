SELECT
  dbo.Practicas.Id,
  dbo.Practicas.Fecha_Practica,
  dbo.Codigos_Valorizacion.Codigo,
  dbo.Codigos_Valorizacion.Descripcion,
  dbo.Usuarios.NombreCompleto AS Tecnico,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre AS Profesional,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre + ' - DNI ' + dbo.Pacientes.NroDocumento AS Paciente,
  dbo.Prestatarias.Nombre AS Prestataria,
  dbo.Practicas.Status,
  dbo.Practicas.Cantidad,
  dbo.Practicas.Honorarios_Profesional_Informante AS Honorarios,
  dbo.Practicas.Pagado,
  dbo.Practicas.Saldo,
  dbo.Practicas.Id_Codigo_Valorizacion
FROM
  dbo.Prestatarias
  RIGHT JOIN dbo.Afiliacion_Pacientes ON dbo.Prestatarias.Id = dbo.Afiliacion_Pacientes.Id_Prestataria
  RIGHT JOIN dbo.Practicas ON dbo.Afiliacion_Pacientes.Id = dbo.Practicas.Id_Afiliacion
  LEFT JOIN dbo.Pacientes ON dbo.Practicas.Id_Paciente = dbo.Pacientes.Id
  LEFT JOIN dbo.Profesionales ON dbo.Practicas.Id_Profesional_Informante = dbo.Profesionales.Id
  LEFT JOIN dbo.Usuarios ON dbo.Practicas.Id_Usuario_Responsable = dbo.Usuarios.Id
  LEFT JOIN dbo.Codigos_Valorizacion ON dbo.Practicas.Id_Codigo_Valorizacion = dbo.Codigos_Valorizacion.Id;
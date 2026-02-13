SELECT
  dbo.Turnos.Id,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre AS Profesional,
  CONVERT(varchar, dbo.Turnos.FechaTurno, 103) AS Fecha,
  dbo.Turnos.HoraTurno,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre AS Paciente,
  dbo.Turnos.Notas,
  dbo.Usuarios.Usuario,
  dbo.Afiliacion_Pacientes.TipoAfiliado,
  dbo.Prestatarias.Tipo AS Tipo_Prest,
  dbo.Prestatarias.Abreviacion AS Prestataria,
  dbo.Afiliacion_Pacientes.Numero_Afiliado,
  dbo.Planes_ObrasSociales.[Plan],
  dbo.Turnos.Status,
  dbo.Turnos.Tipo,
  dbo.Profesionales.Id AS Id_Profesional,
  dbo.Pacientes.Id AS Id_Paciente,
  dbo.Turnos.Recepcionado,
  dbo.Turnos.Autorizacion_Obra_Social
FROM
  dbo.Usuarios
  RIGHT JOIN dbo.Profesionales
  RIGHT JOIN dbo.Afiliacion_Pacientes
  LEFT JOIN dbo.Prestatarias ON dbo.Afiliacion_Pacientes.Id_Prestataria = dbo.Prestatarias.Id
  LEFT JOIN dbo.Planes_ObrasSociales ON dbo.Afiliacion_Pacientes.Id_PlanObraSocial = dbo.Planes_ObrasSociales.Id
  RIGHT JOIN dbo.Turnos
  JOIN dbo.Pacientes ON dbo.Turnos.Id_Paciente = dbo.Pacientes.Id;
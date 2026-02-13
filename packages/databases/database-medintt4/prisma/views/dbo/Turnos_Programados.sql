SELECT
  dbo.Turnos.Id,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre AS Profesional,
  CONVERT(varchar, dbo.Turnos.FechaTurno, 103) AS Fecha,
  dbo.Turnos.HoraTurno,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre AS Paciente,
  dbo.Turnos.Tipo,
  dbo.Prestatarias.Nombre AS Prestataria,
  dbo.Turnos.Notas,
  dbo.Turnos.Status,
  dbo.Profesionales.Id AS Id_Profesional,
  dbo.Pacientes.Id AS Id_Paciente
FROM
  dbo.Prestatarias
  RIGHT JOIN dbo.Pacientes
  RIGHT JOIN dbo.Turnos
  LEFT JOIN dbo.Afiliacion_Pacientes ON dbo.Turnos.Id_AfiliacionPaciente = dbo.Afiliacion_Pacientes.Id
  LEFT JOIN dbo.Profesionales ON dbo.Turnos.Id_Medico = dbo.Profesionales.Id;
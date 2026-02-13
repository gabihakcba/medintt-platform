SELECT
  dbo.HistoriasClinicas.id,
  dbo.Profesionales.Codigo AS Profesional,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre AS Paciente,
  CONVERT(varchar, dbo.HistoriasClinicas.Fecha, 103) AS Fecha,
  dbo.HistoriasClinicas.Tipo,
  dbo.HistoriasClinicas.Notas
FROM
  dbo.HistoriasClinicas
  JOIN dbo.Pacientes ON dbo.HistoriasClinicas.Id_Paciente = dbo.Pacientes.Id
  JOIN dbo.Profesionales ON dbo.HistoriasClinicas.Id_Profesional = dbo.Profesionales.Id;
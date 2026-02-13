SELECT
  dbo.HistoriasClinicas.id,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre AS Profesional,
  CONVERT(varchar, dbo.HistoriasClinicas.Fecha, 103) AS Fecha,
  dbo.HistoriasClinicas.Notas,
  dbo.HistoriasClinicas.Tipo,
  dbo.HistoriasClinicas.Id_Paciente,
  dbo.Afiliacion_Pacientes.Id_Prestataria,
  dbo.Prestatarias.Nombre AS Prestataria
FROM
  dbo.Prestatarias
  RIGHT JOIN dbo.Afiliacion_Pacientes ON dbo.Prestatarias.Id = dbo.Afiliacion_Pacientes.Id_Prestataria
  RIGHT JOIN dbo.HistoriasClinicas
  JOIN dbo.Profesionales ON dbo.HistoriasClinicas.Id_Profesional = dbo.Profesionales.Id;
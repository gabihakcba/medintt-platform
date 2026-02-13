SELECT
  dbo.HistoriasClinicas.id,
  dbo.HistoriasClinicas.Fecha,
  dbo.Profesionales.Codigo AS Profesional,
  dbo.Pacientes.Apellido + '. ' + dbo.Pacientes.Nombre AS Paciente,
  dbo.HistoriasClinicas.Tipo,
  dbo.HistoriasClinicas.Id_Profesional
FROM
  dbo.HistoriasClinicas
  JOIN dbo.Pacientes ON dbo.HistoriasClinicas.Id_Paciente = dbo.Pacientes.Id
  JOIN dbo.Profesionales ON dbo.HistoriasClinicas.Id_Profesional = dbo.Profesionales.Id
  LEFT JOIN dbo.Afiliacion_Pacientes ON dbo.HistoriasClinicas.Id_Afiliacion_Paciente = dbo.Afiliacion_Pacientes.Id
  LEFT JOIN dbo.Prestatarias ON dbo.Afiliacion_Pacientes.Id_Prestataria = dbo.Prestatarias.Id
WHERE
  (dbo.HistoriasClinicas.Auditada <> N'')
  AND (dbo.HistoriasClinicas.Profesional_Pagado = 0)
  AND (dbo.Prestatarias.Tipo <> N'OBRA SOCIAL')
  AND (dbo.Profesionales.SueldoFijo = 0);
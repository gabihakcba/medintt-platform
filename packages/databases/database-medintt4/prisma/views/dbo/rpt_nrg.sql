SELECT
  TOP (100) PERCENT dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre AS paciente,
  dbo.Pacientes.NroDocumento,
  dbo.Prestatarias.Nombre AS Empresa,
  dbo.Examenes_Laborales_Pacientes.Fecha_Alta,
  dbo.Examenes_Laborales_Pacientes.Fecha_Conclusion,
  dbo.Examenes_Laborales_Pacientes.Status,
  dbo.Examenes.Codigo AS Modulo,
  dbo.Examenes_Laborales.Id AS Id_HR,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre AS Profesional_Responsable,
  dbo.Examenes_Laborales_Pacientes.Status_Interrogatorio_Evaluacion_Fisica,
  dbo.Examenes_Laborales_Pacientes.Fecha_Turno_Profesional_Laboral,
  dbo.Examenes_Laborales_Pacientes.NotasConclusion,
  dbo.Examenes_Laborales_Pacientes.Conclusion_Examen,
  dbo.Examenes_Laborales.Total,
  dbo.Examenes_Laborales.Cobrado,
  dbo.Examenes_Laborales.Saldo,
  dbo.Examenes_Laborales.Id_Factura
FROM
  dbo.Examenes_Laborales
  JOIN dbo.Examenes_Laborales_Pacientes ON dbo.Examenes_Laborales.Id = dbo.Examenes_Laborales_Pacientes.Id_Examen_Laboral
  JOIN dbo.Prestatarias ON dbo.Examenes_Laborales.Id_Prestataria = dbo.Prestatarias.Id
  LEFT JOIN dbo.Profesionales ON dbo.Examenes_Laborales_Pacientes.Id_Profesional_Responsable = dbo.Profesionales.Id
  LEFT JOIN dbo.Examenes ON dbo.Examenes_Laborales.Id_Examen = dbo.Examenes.Id
  LEFT JOIN dbo.Pacientes ON dbo.Examenes_Laborales_Pacientes.Id_Paciente = dbo.Pacientes.Id
WHERE
  (
    dbo.Examenes_Laborales.Id_Prestataria IN (11, 2192, 2193, 2194, 2195)
  )
ORDER BY
  dbo.Examenes_Laborales_Pacientes.Fecha_Alta,
  dbo.Examenes_Laborales_Pacientes.Fecha_Conclusion,
  dbo.Examenes_Laborales.Id_Prestataria;
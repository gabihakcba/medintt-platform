SELECT
  TOP (100) PERCENT dbo.Interrogatorio.Id,
  dbo.Prestatarias.Abreviacion,
  dbo.Pacientes.Apellido,
  dbo.Pacientes.Nombre,
  dbo.Pacientes.NroDocumento,
  dbo.Interrogatorio.Fecha,
  dbo.Interrogatorio.HTA,
  dbo.Interrogatorio.Diabetes,
  dbo.Interrogatorio.Dislipemia,
  dbo.Interrogatorio.Asma,
  dbo.Interrogatorio.Varices,
  dbo.Interrogatorio.Tabaquismo,
  dbo.Interrogatorio.Consume_Marihuana,
  dbo.Interrogatorio.Consume_Cocaina,
  dbo.Interrogatorio.Cirugias,
  dbo.Interrogatorio.DosisCovid,
  dbo.Interrogatorio.Status,
  dbo.Interrogatorio.Semaforo,
  dbo.Interrogatorio.Notas,
  dbo.Pacientes.Id AS Id_Paciente
FROM
  dbo.Interrogatorio
  LEFT JOIN dbo.Pacientes ON dbo.Interrogatorio.Id_Paciente = dbo.Pacientes.Id
  LEFT JOIN dbo.Afiliacion_Pacientes ON dbo.Pacientes.Id = dbo.Afiliacion_Pacientes.Id_Paciente
  LEFT JOIN dbo.Prestatarias ON dbo.Afiliacion_Pacientes.Id_Prestataria = dbo.Prestatarias.Id
WHERE
  (
    dbo.Prestatarias.Id IN (11, 2192, 2193, 2194, 2195)
  )
  AND (dbo.Interrogatorio.Semaforo <> N'VERDE');
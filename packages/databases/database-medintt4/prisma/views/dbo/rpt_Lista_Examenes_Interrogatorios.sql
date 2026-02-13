SELECT
  DISTINCT dbo.Examenes_Laborales_Pacientes.Id AS Id_Examenes_Laborales_Pacientes,
  dbo.Examenes_Laborales_Pacientes.Id_Profesional_Laboral,
  dbo.Examenes_Laborales_Pacientes.Fecha_Turno_Profesional_Laboral AS Fecha,
  dbo.Examenes_Laborales_Pacientes.Hora_Turno_Profesional_Laboral AS Hora,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre AS Paciente,
  dbo.Examenes_Laborales_Pacientes.Status_Interrogatorio_Evaluacion_Fisica AS STATUS,
  dbo.Prestatarias.Abreviacion AS Empresa,
  dbo.Practicas.Recepcionado,
  dbo.Evaluacion_Fisica.Status AS Eval_Fis_Status,
  dbo.Interrogatorio.Status AS Interr_Status
FROM
  dbo.Examenes_Laborales_Pacientes
  JOIN dbo.Examenes_Laborales ON dbo.Examenes_Laborales_Pacientes.Id_Examen_Laboral = dbo.Examenes_Laborales.Id
  JOIN dbo.Prestatarias ON dbo.Examenes_Laborales.Id_Prestataria = dbo.Prestatarias.Id
  JOIN dbo.Evaluacion_Fisica ON dbo.Examenes_Laborales_Pacientes.Id_Evaluacion_Fisica = dbo.Evaluacion_Fisica.Id
  JOIN dbo.Interrogatorio ON dbo.Examenes_Laborales_Pacientes.Id_Interrogatorio = dbo.Interrogatorio.Id
  LEFT JOIN dbo.Pacientes ON dbo.Examenes_Laborales_Pacientes.Id_Paciente = dbo.Pacientes.Id
  LEFT JOIN dbo.Examenes_Laborales_PacientesxPracticas ON dbo.Examenes_Laborales_Pacientes.Id = dbo.Examenes_Laborales_PacientesxPracticas.Id_Examen_Laboral_Paciente
  LEFT JOIN dbo.Practicas ON dbo.Examenes_Laborales_PacientesxPracticas.Id_Practica = dbo.Practicas.Id
WHERE
  (
    dbo.Examenes_Laborales_Pacientes.Status_Interrogatorio_Evaluacion_Fisica <> N'TERMINADO'
  )
  AND (dbo.Practicas.Recepcionado = -1);
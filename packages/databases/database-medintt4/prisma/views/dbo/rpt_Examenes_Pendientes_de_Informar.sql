SELECT
  dbo.Examenes_Laborales_Pacientes.Id,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre + ' - ' + dbo.Pacientes.TipoDocumento + ' - ' + dbo.Pacientes.NroDocumento AS Paciente,
  dbo.Examenes.Codigo AS Examen,
  dbo.Prestatarias.Abreviacion AS Empresa,
  dbo.Examenes_Laborales.Id AS Hoja_Ruta
FROM
  dbo.Examenes_Laborales_Pacientes
  JOIN dbo.Examenes_Laborales ON dbo.Examenes_Laborales_Pacientes.Id_Examen_Laboral = dbo.Examenes_Laborales.Id
  JOIN dbo.Prestatarias ON dbo.Examenes_Laborales.Id_Prestataria = dbo.Prestatarias.Id
  JOIN dbo.Examenes ON dbo.Examenes_Laborales.Id_Examen = dbo.Examenes.Id
  LEFT JOIN dbo.Pacientes ON dbo.Examenes_Laborales_Pacientes.Id_Paciente = dbo.Pacientes.Id
WHERE
  (
    dbo.Examenes_Laborales_Pacientes.Status_Interrogatorio_Evaluacion_Fisica = N'TERMINADO'
  )
  AND (
    dbo.Examenes_Laborales_Pacientes.Status = N'TERMINADO'
  );
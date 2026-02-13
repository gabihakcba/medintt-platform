SELECT
  dbo.Examenes_Laborales.Id,
  dbo.Examenes.Codigo AS Examen,
  dbo.Prestatarias.Abreviacion AS Prestataria,
  dbo.Examenes_Laborales.Fecha_Alta,
  dbo.Examenes_Laborales.Status,
  dbo.Examenes_Laborales.Cantidad_Pacientes AS Pacientes,
  dbo.Examenes_Laborales.Total,
  dbo.Examenes_Laborales.Cobrado,
  dbo.Examenes_Laborales.Saldo
FROM
  dbo.Examenes_Laborales
  JOIN dbo.Examenes ON dbo.Examenes_Laborales.Id_Examen = dbo.Examenes.Id
  LEFT JOIN dbo.Prestatarias ON dbo.Examenes_Laborales.Id_Prestataria = dbo.Prestatarias.Id
WHERE
  (dbo.Prestatarias.Atendida = -1);
SELECT
  dbo.Examenes_Laborales.Id,
  dbo.Prestatarias.Abreviacion AS Prestataria,
  dbo.Examenes.Codigo AS Examen,
  dbo.Examenes_Laborales.Status,
  dbo.Examenes_Laborales.Fecha_Alta AS Fecha,
  dbo.Examenes_Laborales.Total,
  dbo.Examenes_Laborales.Cobrado,
  dbo.Examenes_Laborales.Saldo,
  dbo.Prestatarias.Id AS Id_Prestataria,
  dbo.Examenes_Laborales.Id_Factura
FROM
  dbo.Examenes_Laborales
  JOIN dbo.Examenes ON dbo.Examenes_Laborales.Id_Examen = dbo.Examenes.Id
  JOIN dbo.Prestatarias ON dbo.Examenes_Laborales.Id_Prestataria = dbo.Prestatarias.Id
WHERE
  (dbo.Examenes_Laborales.Saldo > 0)
  AND (dbo.Examenes_Laborales.Id_Factura = 0);
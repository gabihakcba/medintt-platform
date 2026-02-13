SELECT
  dbo.Facturas.Id,
  CONVERT(varchar, dbo.Facturas.Fecha, 103) AS Fecha,
  dbo.Facturas.Clase,
  dbo.Prestatarias.Nombre AS Prestataria,
  dbo.Prestatarias.Tipo,
  dbo.Emisores_Fiscales.Nombre AS Emisor,
  dbo.Facturas.Total,
  dbo.Facturas.Id_Prestataria
FROM
  dbo.Facturas
  JOIN dbo.Emisores_Fiscales ON dbo.Facturas.Id_Emisor = dbo.Emisores_Fiscales.Id
  LEFT JOIN dbo.Prestatarias ON dbo.Facturas.Id_Prestataria = dbo.Prestatarias.Id
WHERE
  (dbo.Facturas.Status = N'PENDIENTE');
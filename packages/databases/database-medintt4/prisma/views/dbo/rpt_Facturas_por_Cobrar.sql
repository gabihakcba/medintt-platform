SELECT
  dbo.Facturas.Id,
  dbo.Facturas.Fecha,
  dbo.Facturas.Clase,
  dbo.Emisores_Fiscales.Nombre AS Emisor,
  dbo.Prestatarias.Abreviacion AS Prestataria,
  dbo.Facturas.Tipo,
  dbo.Facturas.Serie,
  dbo.Facturas.Numero,
  dbo.Facturas.Total,
  dbo.Facturas.Cobrado,
  dbo.Facturas.Saldo,
  dbo.Facturas.Id_Prestataria
FROM
  dbo.Facturas
  LEFT JOIN dbo.Emisores_Fiscales ON dbo.Facturas.Id_Emisor = dbo.Emisores_Fiscales.Id
  LEFT JOIN dbo.Prestatarias ON dbo.Facturas.Id_Prestataria = dbo.Prestatarias.Id
WHERE
  (dbo.Facturas.Status = N'EN CURSO')
  AND (ABS(dbo.Facturas.Saldo) > 0.50)
  AND (dbo.Prestatarias.Atendida = -1);
SELECT
  dbo.Facturas.Id,
  dbo.Facturas.Fecha,
  dbo.Facturas.Tipo,
  dbo.Facturas.Serie,
  dbo.Facturas.Numero,
  dbo.Facturas.AlicuotaIVA,
  dbo.Facturas.SubTotal,
  dbo.Facturas.IVA,
  dbo.Facturas.Total,
  dbo.Facturas.Cobrado,
  dbo.Facturas.Saldo,
  dbo.Facturas.Status,
  dbo.Facturas.Clase,
  dbo.Prestatarias.Abreviacion,
  dbo.Prestatarias.Cuit,
  dbo.Prestatarias.SituacionIVA,
  dbo.Emisores_Fiscales.Nombre AS Emisor
FROM
  dbo.Facturas
  JOIN dbo.Prestatarias ON dbo.Facturas.Id_Prestataria = dbo.Prestatarias.Id
  JOIN dbo.Emisores_Fiscales ON dbo.Facturas.Id_Emisor = dbo.Emisores_Fiscales.Id
WHERE
  (dbo.Facturas.Status = N'COBRADA');
SELECT
  dbo.CM_Envios.Id,
  CONVERT(varchar, dbo.CM_Envios.Fecha, 103) AS Fecha,
  dbo.CM_Envios.Clase,
  dbo.Prestatarias.Nombre AS Prestataria,
  dbo.Emisores_Fiscales.Nombre AS Emisor,
  dbo.Profesionales.Codigo AS Profesional,
  dbo.CM_Envios.Total,
  dbo.CM_Envios.Cobrado,
  dbo.CM_Envios.Saldo
FROM
  dbo.CM_Envios
  JOIN dbo.Emisores_Fiscales ON dbo.CM_Envios.Id_Emisor = dbo.Emisores_Fiscales.Id
  LEFT JOIN dbo.Prestatarias ON dbo.CM_Envios.Id_Prestataria = dbo.Prestatarias.Id
  LEFT JOIN dbo.Profesionales ON dbo.CM_Envios.Id_Profesional = dbo.Profesionales.Id
WHERE
  (dbo.CM_Envios.Status = N'PENDIENTE');
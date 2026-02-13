SELECT
  dbo.Pagos_a_Profesionales.Id,
  dbo.Pagos_a_Profesionales.Clase,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre AS Profesional,
  dbo.Pagos_a_Profesionales.Fecha,
  'DEL ' + CONVERT(NVARCHAR, dbo.Pagos_a_Profesionales.Desde, 103) + ' AL ' + CONVERT(NVARCHAR, dbo.Pagos_a_Profesionales.Hasta, 103) AS Intervalo,
  dbo.Pagos_a_Profesionales.Total
FROM
  dbo.Pagos_a_Profesionales
  JOIN dbo.Profesionales ON dbo.Pagos_a_Profesionales.Id_Profesional = dbo.Profesionales.Id
WHERE
  (dbo.Pagos_a_Profesionales.Status = N'PENDIENTE');
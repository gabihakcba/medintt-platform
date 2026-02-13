SELECT
  dbo.Pagos_a_Profesionales.Id,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre AS Profesional,
  dbo.Pagos_a_Profesionales.Fecha AS Fecha_OrdenDePago,
  dbo.Pagos_a_Profesionales.Clase,
  dbo.Pagos_a_Profesionales.Sub_Total,
  dbo.Pagos_a_Profesionales.IVA,
  dbo.Pagos_a_Profesionales.Total,
  dbo.Pagos_a_Profesionales.Tipo_Factura + '-' + dbo.Pagos_a_Profesionales.Num_Factura AS Factura,
  dbo.Pagos_a_Profesionales.FechaFactura,
  dbo.Pagos_a_Profesionales.Pagado,
  dbo.Pagos_a_Profesionales.Saldo
FROM
  dbo.Pagos_a_Profesionales
  JOIN dbo.Profesionales ON dbo.Pagos_a_Profesionales.Id_Profesional = dbo.Profesionales.Id
WHERE
  (dbo.Pagos_a_Profesionales.Status = N'EN CURSO');
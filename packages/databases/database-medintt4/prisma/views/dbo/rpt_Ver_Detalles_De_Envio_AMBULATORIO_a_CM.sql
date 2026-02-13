SELECT
  dbo.CM_Envios.Id AS Id_CM_Envios,
  dbo.CM_Envios_Detalles.Id AS Id_CM_Envios_Detalles,
  dbo.HistoriasClinicas.Fecha,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre + ' - CUIT N° ' + dbo.Profesionales.Cuit AS Profesional,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre + ' ' + dbo.Pacientes.TipoDocumento + ' ' + dbo.Pacientes.NroDocumento AS Paciente,
  dbo.CM_Envios_Detalles.Codigo_Autorizacion AS Autorizacion,
  'Afil. N° ' + dbo.Afiliacion_Pacientes.Numero_Afiliado + ' - Tipo: ' + dbo.Afiliacion_Pacientes.TipoAfiliado + ' - PLAN: ' + dbo.Planes_ObrasSociales.[Plan] AS Afiliacion,
  dbo.CM_Envios_Detalles.Codigo + ' - ' + dbo.CM_Envios_Detalles.Descripcion AS Concepto,
  dbo.CM_Envios_Detalles.ValorUnitario,
  dbo.CM_Envios_Detalles.Cantidad,
  dbo.CM_Envios_Detalles.Total
FROM
  dbo.Pacientes
  RIGHT JOIN dbo.HistoriasClinicas ON dbo.Pacientes.Id = dbo.HistoriasClinicas.Id_Paciente FULL
  JOIN dbo.Afiliacion_Pacientes
  JOIN dbo.Planes_ObrasSociales ON dbo.Afiliacion_Pacientes.Id_PlanObraSocial = dbo.Planes_ObrasSociales.Id;
SELECT
  dbo.CM_Envios_Detalles.Id_CM_Envios,
  dbo.CM_Envios_Detalles.Id AS Id_CM_Envios_Detalles,
  dbo.Cirugias.FechaEstimada AS Fecha,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre + ' - CUIT N° ' + dbo.Profesionales.Cuit AS Profesional,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre + ' ' + dbo.Pacientes.TipoDocumento + ' ' + dbo.Pacientes.NroDocumento AS Paciente,
  dbo.Cirugias.Autorizacion_ObraSocial AS Autorizacion,
  'Afil. N° ' + dbo.Afiliacion_Pacientes.Numero_Afiliado + ' - Tipo: ' + dbo.Afiliacion_Pacientes.TipoAfiliado + ' - PLAN: ' + dbo.Planes_ObrasSociales.[Plan] AS Afiliacion,
  dbo.CM_Envios_Detalles.Codigo + ' - ' + dbo.CM_Envios_Detalles.Descripcion AS Concepto,
  dbo.CM_Envios_Detalles.Cantidad,
  dbo.CM_Envios_Detalles.ValorUnitario,
  dbo.CM_Envios_Detalles.Total
FROM
  dbo.Planes_ObrasSociales
  RIGHT JOIN dbo.Afiliacion_Pacientes ON dbo.Planes_ObrasSociales.Id = dbo.Afiliacion_Pacientes.Id_PlanObraSocial
  RIGHT JOIN dbo.Pacientes
  RIGHT JOIN dbo.Cirugias ON dbo.Pacientes.Id = dbo.Cirugias.Id_Paciente;
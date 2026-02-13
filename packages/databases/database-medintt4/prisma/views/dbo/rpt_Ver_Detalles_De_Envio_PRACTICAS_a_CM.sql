SELECT
  dbo.CM_Envios.Id AS Id_CM_Envios,
  dbo.CM_Envios_Detalles.Id AS Id_CM_Envios_Detalles,
  dbo.Practicas.Fecha_Practica AS Fecha,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre + ' - Cuit N°: ' + dbo.Profesionales.Cuit AS Profesional,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre + ' ' + dbo.Pacientes.TipoDocumento + ' ' + dbo.Pacientes.NroDocumento AS Paciente,
  dbo.Practicas.Autorizacion,
  'Afil. N° ' + dbo.Afiliacion_Pacientes.Numero_Afiliado + ' - Tipo: ' + dbo.Afiliacion_Pacientes.TipoAfiliado + ' - PLAN: ' + dbo.Planes_ObrasSociales.[Plan] AS Afiliacion,
  dbo.CM_Envios_Detalles.Codigo + ' ' + dbo.CM_Envios_Detalles.Descripcion AS Concepto,
  dbo.CM_Envios_Detalles.Cantidad,
  dbo.CM_Envios_Detalles.ValorUnitario,
  dbo.CM_Envios_Detalles.Total
FROM
  dbo.Afiliacion_Pacientes
  LEFT JOIN dbo.Planes_ObrasSociales ON dbo.Afiliacion_Pacientes.Id_PlanObraSocial = dbo.Planes_ObrasSociales.Id
  RIGHT JOIN dbo.Practicas ON dbo.Afiliacion_Pacientes.Id = dbo.Practicas.Id_Afiliacion
  LEFT JOIN dbo.Pacientes ON dbo.Practicas.Id_Paciente = dbo.Pacientes.Id
  RIGHT JOIN dbo.CM_Envios
  LEFT JOIN dbo.CM_Envios_Detalles ON dbo.CM_Envios.Id = dbo.CM_Envios_Detalles.Id_CM_Envios
  LEFT JOIN dbo.Profesionales ON dbo.CM_Envios.Id_Profesional = dbo.Profesionales.Id;
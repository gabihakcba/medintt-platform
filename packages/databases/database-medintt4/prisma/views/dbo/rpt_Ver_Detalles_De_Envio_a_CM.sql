SELECT
  dbo.CM_Envios_Detalles.Id,
  CONVERT(varchar, dbo.HistoriasClinicas.Fecha, 103) AS Fecha,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre AS Profesional,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre AS Paciente,
  dbo.CM_Envios_Detalles.Codigo,
  dbo.CM_Envios_Detalles.Descripcion,
  dbo.CM_Envios_Detalles.Cantidad,
  dbo.CM_Envios_Detalles.ValorUnitario,
  dbo.CM_Envios_Detalles.Total,
  dbo.CM_Envios_Detalles.Id_CM_Envios,
  dbo.Planes_ObrasSociales.[Plan],
  dbo.Afiliacion_Pacientes.Numero_Afiliado,
  dbo.Afiliacion_Pacientes.TipoAfiliado
FROM
  dbo.Afiliacion_Pacientes
  LEFT JOIN dbo.Planes_ObrasSociales ON dbo.Afiliacion_Pacientes.Id_PlanObraSocial = dbo.Planes_ObrasSociales.Id
  RIGHT JOIN dbo.HistoriasClinicas ON dbo.Afiliacion_Pacientes.Id = dbo.HistoriasClinicas.Id_Afiliacion_Paciente
  LEFT JOIN dbo.Pacientes ON dbo.HistoriasClinicas.Id_Paciente = dbo.Pacientes.Id
  LEFT JOIN dbo.Profesionales ON dbo.HistoriasClinicas.Id_Profesional = dbo.Profesionales.Id
  RIGHT JOIN dbo.CM_Envios_Detalles ON dbo.HistoriasClinicas.id = dbo.CM_Envios_Detalles.Id_Historia_Clinica;
SELECT
  dbo.Practicas.Id,
  dbo.Afiliacion_Pacientes.Id_Prestataria,
  dbo.Practicas.Id_Codigo_Valorizacion,
  dbo.Practicas.Id_Paciente,
  dbo.Practicas.Fecha_Practica AS Fecha,
  dbo.Profesionales.Codigo AS Profesional,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre + ' - ' + dbo.Pacientes.TipoDocumento + ' ' + dbo.Pacientes.NroDocumento AS Paciente,
  dbo.Practicas.Autorizacion,
  dbo.Codigos_Valorizacion.Codigo,
  dbo.Codigos_Valorizacion.Descripcion AS Practica,
  dbo.Prestatarias.Abreviacion AS Prestataria,
  dbo.Prestatarias.Tipo,
  dbo.Afiliacion_Pacientes.TipoAfiliado,
  dbo.Afiliacion_Pacientes.Numero_Afiliado,
  dbo.Planes_ObrasSociales.[Plan],
  dbo.Valorizacion_Prestatarias.Valor,
  ISNULL(dbo.Practicas.Cantidad, 1) AS Cantidad,
  dbo.Valorizacion_Prestatarias.Valor * ISNULL(dbo.Practicas.Cantidad, 1) AS Total,
  dbo.Practicas.Id_Profesional_Informante
FROM
  dbo.Planes_ObrasSociales
  RIGHT JOIN dbo.Profesionales
  RIGHT JOIN dbo.Afiliacion_Pacientes
  JOIN dbo.Prestatarias ON dbo.Afiliacion_Pacientes.Id_Prestataria = dbo.Prestatarias.Id
  RIGHT JOIN dbo.Practicas ON dbo.Afiliacion_Pacientes.Id = dbo.Practicas.Id_Afiliacion;
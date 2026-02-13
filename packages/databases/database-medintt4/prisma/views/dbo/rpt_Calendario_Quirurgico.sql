SELECT
  dbo.Cirugias.Id,
  dbo.Profesionales.Codigo AS Profesional,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre AS Paciente,
  dbo.Prestatarias.Abreviacion AS Prestataria,
  dbo.Prestatarias.Tipo,
  dbo.Planes_ObrasSociales.[Plan],
  dbo.Afiliacion_Pacientes.Numero_Afiliado,
  dbo.Afiliacion_Pacientes.TipoAfiliado,
  dbo.Cirugias.Complejidad,
  CONVERT(varchar, dbo.Cirugias.FechaEstimada, 103) AS FechaEstimada,
  SUBSTRING(
    dbo.Cirugias.Hora
    FROM
      1 FOR 5
  ) AS Hora,
  dbo.Proveedores_Quirofanos.Proveedor AS Quirofano,
  dbo.Cirugias.Requiere_Material,
  dbo.Cirugias.Status,
  dbo.Cirugias.Cirugia_a_Realizar,
  dbo.Cirugias.Dignostico,
  dbo.Cirugias.Resumen_HC,
  dbo.Cirugias.Status_SolicitudQuirofano,
  dbo.Cirugias.Status_PedidoQuiurgico,
  dbo.Cirugias.Status_Gastos,
  dbo.Cirugias.Status_Honorarios,
  dbo.Cirugias.Status_Autorizacion,
  dbo.Cirugias.Status_ProtocoloQuirurgico,
  dbo.Cirugias.Status_Materiales,
  dbo.Proveedores_Quirofanos.Id AS Id_Proveedor_Quirofano,
  dbo.Cirugias.Status_Turno_Pre_Quirurgico,
  dbo.Cirugias.Duracion
FROM
  dbo.Pacientes
  RIGHT JOIN dbo.Cirugias
  JOIN dbo.Proveedores_Quirofanos ON dbo.Cirugias.Id_Proveedor_Quirofano = dbo.Proveedores_Quirofanos.Id
  LEFT JOIN dbo.Profesionales ON dbo.Cirugias.Id_Profesional = dbo.Profesionales.Id;
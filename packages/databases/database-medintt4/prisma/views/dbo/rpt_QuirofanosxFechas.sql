SELECT
  dbo.Cirugias.Id,
  CONVERT(varchar, dbo.Cirugias.FechaEstimada, 103) AS Fecha,
  SUBSTRING(
    dbo.Cirugias.Hora
    FROM
      1 FOR 5
  ) AS Hora,
  dbo.Cirugias.Duracion,
  dbo.Cirugias.Cirugia_a_Realizar AS Cirugia,
  CASE
    WHEN dbo.Cirugias.Requiere_Material = 0 THEN 'SI'
    ELSE 'NO'
  END AS Req_Material,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre AS Profesional,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre AS Paciente,
  dbo.Prestatarias.Nombre AS Prestataria,
  dbo.Prestatarias.Tipo,
  dbo.Planes_ObrasSociales.[Plan],
  dbo.Afiliacion_Pacientes.Numero_Afiliado,
  dbo.Afiliacion_Pacientes.TipoAfiliado,
  dbo.Cirugias.Id_Proveedor_Quirofano,
  dbo.Cirugias.FechaEstimada
FROM
  dbo.Pacientes
  RIGHT JOIN dbo.Cirugias
  LEFT JOIN dbo.Profesionales ON dbo.Cirugias.Id_Profesional = dbo.Profesionales.Id;
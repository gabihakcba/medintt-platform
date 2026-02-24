SELECT
  h.id AS Id,
  h.Fecha,
  'CONSULTA AMBULATORIA' AS Clase,
  ISNULL(pa.Apellido, '') + ', ' + ISNULL(pa.Nombre, '') AS Paciente,
  ISNULL(pa.NroDocumento, '') AS DNI,
  ISNULL(pr.Apellido, '') + ', ' + ISNULL(pr.Nombre, '') AS Profesional,
  h.Notas,
  af.Id_Prestataria
FROM
  dbo.HistoriasClinicas AS h
  JOIN dbo.Afiliacion_Pacientes AS af ON af.Id = h.Id_Afiliacion_Paciente
  JOIN dbo.Profesionales AS pr ON h.Id_Profesional = pr.Id
  LEFT JOIN dbo.Pacientes AS pa ON h.Id_Paciente = pa.Id
WHERE
  (h.Tipo = N'LABORAL');
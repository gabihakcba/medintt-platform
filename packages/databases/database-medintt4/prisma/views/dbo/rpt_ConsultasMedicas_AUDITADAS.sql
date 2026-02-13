SELECT
  dbo.HistoriasClinicas.id AS Id_HC,
  CONVERT(varchar, dbo.HistoriasClinicas.Fecha, 103) AS Fecha,
  dbo.Prestatarias.Abreviacion AS Prestataria,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre AS Profesional,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre AS Paciente,
  dbo.HistoriasClinicas.Autorizacion_Obra_Social,
  dbo.Planes_ObrasSociales.[Plan],
  dbo.Afiliacion_Pacientes.TipoAfiliado,
  dbo.Afiliacion_Pacientes.Numero_Afiliado,
  SUM(dbo.HC_Auditadas.Total) AS Total,
  dbo.HistoriasClinicas.Id_Profesional,
  dbo.Afiliacion_Pacientes.Id_Prestataria,
  dbo.HistoriasClinicas.Id_Paciente
FROM
  dbo.Afiliacion_Pacientes
  LEFT JOIN dbo.Planes_ObrasSociales ON dbo.Afiliacion_Pacientes.Id_PlanObraSocial = dbo.Planes_ObrasSociales.Id
  LEFT JOIN dbo.Prestatarias ON dbo.Afiliacion_Pacientes.Id_Prestataria = dbo.Prestatarias.Id
  RIGHT JOIN dbo.HistoriasClinicas
  LEFT JOIN dbo.HC_Auditadas ON dbo.HistoriasClinicas.id = dbo.HC_Auditadas.Id_HC
  LEFT JOIN dbo.Pacientes ON dbo.HistoriasClinicas.Id_Paciente = dbo.Pacientes.Id
  LEFT JOIN dbo.Profesionales ON dbo.HistoriasClinicas.Id_Profesional = dbo.Profesionales.Id;
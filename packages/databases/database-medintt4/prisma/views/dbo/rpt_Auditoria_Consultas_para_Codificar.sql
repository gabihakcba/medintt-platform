SELECT
  dbo.HistoriasClinicas.id,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre AS Paciente,
  dbo.Profesionales.Codigo AS Profesional,
  dbo.HistoriasClinicas.Fecha,
  dbo.Prestatarias.Tipo,
  dbo.Prestatarias.Abreviacion AS Prestataria,
  dbo.Afiliacion_Pacientes.TipoAfiliado,
  dbo.Planes_ObrasSociales.[Plan],
  dbo.Planes_ObrasSociales.Codigo AS CodigoPlan,
  dbo.Afiliacion_Pacientes.Numero_Afiliado,
  dbo.HistoriasClinicas.Tipo AS TipoPrestacion,
  dbo.HistoriasClinicas.Auditada,
  dbo.HistoriasClinicas.Facturada,
  dbo.HistoriasClinicas.Cant_Codigos,
  dbo.HistoriasClinicas.Id_Paciente,
  dbo.HistoriasClinicas.Id_Profesional,
  dbo.Afiliacion_Pacientes.Id_Prestataria
FROM
  dbo.Afiliacion_Pacientes
  LEFT JOIN dbo.Planes_ObrasSociales ON dbo.Afiliacion_Pacientes.Id_PlanObraSocial = dbo.Planes_ObrasSociales.Id
  LEFT JOIN dbo.Prestatarias ON dbo.Afiliacion_Pacientes.Id_Prestataria = dbo.Prestatarias.Id
  RIGHT JOIN dbo.HistoriasClinicas ON dbo.Afiliacion_Pacientes.Id = dbo.HistoriasClinicas.Id_Afiliacion_Paciente
  LEFT JOIN dbo.Profesionales ON dbo.HistoriasClinicas.Id_Profesional = dbo.Profesionales.Id
  LEFT JOIN dbo.Pacientes ON dbo.HistoriasClinicas.Id_Paciente = dbo.Pacientes.Id;
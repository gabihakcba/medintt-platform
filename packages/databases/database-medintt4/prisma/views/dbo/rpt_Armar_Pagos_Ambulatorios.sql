SELECT
  dbo.HistoriasClinicas.id AS Id_HC,
  dbo.HC_Auditadas.Id AS Id_HC_Auditada,
  dbo.HistoriasClinicas.Id_Profesional,
  dbo.HistoriasClinicas.Fecha,
  dbo.HC_Auditadas.Codigo,
  dbo.HC_Auditadas.Descripci;
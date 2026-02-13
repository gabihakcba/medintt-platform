SELECT
  dbo.Cirugias.Id,
  CONVERT(varchar, dbo.Cirugias.FechaEstimada, 103) AS Fecha,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre AS Profesional,
  dbo.Pacientes.Apellido + ', ' + dbo.Pacientes.Nombre AS Paciente,
  dbo.Cirugias.Cirugia_a_Realizar AS Cirug;
SELECT
  dbo.ResumenDeCMxProfesional.Id,
  dbo.Profesionales.Apellido + ', ' + dbo.Profesionales.Nombre AS Profesional,
  dbo.ResumenDeCMxProfesional.Fecha,
  dbo.ResumenDeCMxProfesional.Clase,
  dbo.Prestatarias.Nombre AS Prestataria,
  dbo.ResumenDeCMxProfesional.Total,
  dbo.ResumenDeCMxProfesional.Id_Profesional,
  dbo.ResumenDeCMxProfesional.Id_Prestataria
FROM
  dbo.ResumenDeCMxProfesional
  JOIN dbo.Prestatarias ON dbo.ResumenDeCMxProfesional.Id_Prestataria = dbo.Prestatarias.Id
  LEFT JOIN dbo.Profesionales ON dbo.ResumenDeCMxProfesional.Id_Profesional = dbo.Profesionales.Id;
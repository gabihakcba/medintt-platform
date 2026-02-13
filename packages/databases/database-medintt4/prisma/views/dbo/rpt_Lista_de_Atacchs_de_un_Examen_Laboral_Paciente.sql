SELECT
  dbo.Practicas_Attachs.Id AS Id_Practicas_Attachs,
  dbo.Codigos_Valorizacion.Descripcion + ' (' + dbo.Codigos_Valorizacion.Codigo + ')' AS Practica,
  dbo.Practicas_Attachs.Descripcion + ' ' + dbo.Practicas_Attachs.Observaciones AS Descripcion,
  dbo.Practicas_Attachs.FileName,
  dbo.Practicas_Attachs.FileSize,
  dbo.Practicas_Attachs.Extension,
  dbo.Examenes_Laborales_PacientesxPracticas.Id_Examen_Laboral_Paciente
FROM
  dbo.Examenes_Laborales_PacientesxPracticas
  JOIN dbo.Practicas_Attachs ON dbo.Examenes_Laborales_PacientesxPracticas.Id_Practica = dbo.Practicas_Attachs.Id_Practica
  JOIN dbo.Practicas ON dbo.Practicas_Attachs.Id_Practica = dbo.Practicas.Id
  JOIN dbo.Codigos_Valorizacion ON dbo.Practicas.Id_Codigo_Valorizacion = dbo.Codigos_Valorizacion.Id;
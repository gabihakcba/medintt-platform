SELECT
  dbo.Ayudantes_Honorarios.Id,
  dbo.Cirugias.Id AS Id_Cirugia,
  CONVERT(nvarchar, dbo.Cirugias.FechaEstimada, 103) AS Fecha,
  dbo.Profesionales.Codigo AS Cirujano,
  dbo.Cirugias_Honorarios.Codigo,
  dbo.Cirugias_Honorarios.Descripcion,
  dbo.Cirugias_Honorarios.Complejidad,
  CASE
    WHEN dbo.Cirugias_Honorarios.NumAyudantes = 0
    OR dbo.Cirugias_Honorarios.NumAyudantes IS NULL THEN 0
    ELSE dbo.Cirugias_Honorarios.TotalAyudantes / dbo.Cirugias_Honorarios.NumAyudantes
  END AS Honorarios,
  CASE
    WHEN Profesionales_1.Codigo IS NULL THEN 'NO ASIGNADO'
    ELSE Profesionales_1.Codigo
  END AS Ayudante
FROM
  dbo.Ayudantes_Honorarios
  LEFT JOIN dbo.Cirugias_Honorarios ON dbo.Ayudantes_Honorarios.Id_Cirugia_Honorarios = dbo.Cirugias_Honorarios.Id
  LEFT JOIN dbo.Cirugias ON dbo.Cirugias_Honorarios.Id_Cirugia = dbo.Cirugias.Id
  LEFT JOIN dbo.Profesionales ON dbo.Cirugias.Id_Profesional = dbo.Profesionales.Id
  LEFT JOIN dbo.Profesionales AS Profesionales_1 ON dbo.Ayudantes_Honorarios.Id_Profesional_Ayudante = Profesionales_1.Id;
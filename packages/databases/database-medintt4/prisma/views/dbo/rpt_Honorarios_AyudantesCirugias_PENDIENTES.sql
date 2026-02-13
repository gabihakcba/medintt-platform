SELECT
  dbo.Ayudantes_Honorarios.Id AS Id_Ayudantes_Honorarios,
  dbo.Cirugias.FechaEstimada AS Fecha,
  Profesionales_1.Apellido + ', ' + Profesionales_1.Nombre AS Profesional,
  dbo.Ayudantes_Honorarios.Saldo,
  dbo.Cirugias.Cirugia_a_Realizar AS Cirugia,
  dbo.Profesionales.Codigo AS Cirujano,
  dbo.Ayudantes_Honorarios.Id_Profesional_Ayudante AS Id_Profesional,
  dbo.Prestatarias.Tipo,
  dbo.Prestatarias.Abreviacion AS Prestataria,
  dbo.Afiliacion_Pacientes.Id_Prestataria,
  dbo.Cirugias_Honorarios.Id_Cirugia
FROM
  dbo.Prestatarias
  RIGHT JOIN dbo.Afiliacion_Pacientes ON dbo.Prestatarias.Id = dbo.Afiliacion_Pacientes.Id_Prestataria
  RIGHT JOIN dbo.Ayudantes_Honorarios
  JOIN dbo.Cirugias_Honorarios ON dbo.Ayudantes_Honorarios.Id_Cirugia_Honorarios = dbo.Cirugias_Honorarios.Id
  JOIN dbo.Cirugias ON dbo.Cirugias_Honorarios.Id_Cirugia = dbo.Cirugias.Id
  JOIN dbo.Profesionales ON dbo.Cirugias.Id_Profesional = dbo.Profesionales.Id;
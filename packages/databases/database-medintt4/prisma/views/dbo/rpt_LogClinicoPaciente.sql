(
  SELECT
    Fecha,
    id_paciente,
    Id AS Id_Evaluacion_Fisica,
    0 AS Id_interrogatorio,
    0 AS id_practica,
    0 AS id_cirugia,
    0 AS id_hc
  FROM
    Evaluacion_Fisica
)
UNION
(
  SELECT
    fecha,
    id_paciente,
    0 AS Id_Evaluacion_Fisica,
    id AS Id_Interrogatorio,
    0 AS id_practica,
    0 AS id_cirugia,
    0 AS id_hc
  FROM
    Interrogatorio
)
UNION
(
  SELECT
    Fecha_Practica AS fecha,
    id_paciente,
    0 AS Id_Valuacion_Fisica,
    0 AS Id_Interrogatorio,
    id AS id_practica,
    0 AS id_cirugia,
    0 AS id_hc
  FROM
    practicas
)
UNION
(
  SELECT
    fechaestimada AS fecha,
    id_paciente,
    0 AS Id_Evaluacion_Fisica,
    0 AS Id_interrogatorio,
    0 AS id_practica,
    id AS id_cirugia,
    0 AS id_hc
  FROM
    Cirugias
)
UNION
(
  SELECT
    fecha,
    id_paciente,
    0 AS Id_Evaluacion_Fisica,
    0 AS Id_interrogatorio,
    0 AS id_practica,
    0 AS id_cirugia,
    id AS id_HC
  FROM
    HistoriasClinicas
);
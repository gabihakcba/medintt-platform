SELECT
  Fecha,
  sum(importe) AS Pagos,
  0 AS Cobros
FROM
  pagos
WHERE
  STATUS = 'ACTIVO'
GROUP BY
  fecha
UNION
SELECT
  Fecha,
  0 AS Pagos,
  sum(importe) AS Cobros
FROM
  cobros
WHERE
  STATUS = 'ACTIVO'
GROUP BY
  fecha;
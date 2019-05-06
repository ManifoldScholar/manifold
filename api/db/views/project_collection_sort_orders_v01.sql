WITH allowed_columns AS (
  SELECT * FROM (
    VALUES ('created_at'), ('updated_at'), ('publication_date'), ('title')
  ) AS t(column_name)
), allowed_directions AS (
  SELECT * FROM (
    VALUES ('asc'), ('desc')
  ) AS t(direction)
), allowed_sort_orders AS (
  SELECT column_name, direction AS direction,
  CONCAT(column_name, '_', direction) AS sort_order,
  direction = 'asc' AS ascending,
  direction = 'desc' AS descending
  FROM allowed_columns, allowed_directions
) SELECT * FROM allowed_sort_orders
;


CREATE OR ALTER PROCEDURE dbo.usp_Top3ProductsBestCity
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH SalesByProdCity AS (
        SELECT
            p.product_name                    AS productName,
            c.city                            AS city,
            SUM(oi.quantity)                  AS salesCount
        FROM sales.orders        AS o
        JOIN sales.order_items   AS oi ON oi.order_id   = o.order_id
        JOIN production.products AS p  ON p.product_id  = oi.product_id
        JOIN sales.customers     AS c  ON c.customer_id = o.customer_id
        GROUP BY p.product_name, c.city
    ),
    Ranked AS (
                SELECT *,
               ROW_NUMBER() OVER(PARTITION BY productName ORDER BY salesCount DESC, city ASC) AS rn
        FROM SalesByProdCity
    ),
    BestCityPerProduct AS (
        SELECT productName, city, salesCount
        FROM Ranked
        WHERE rn = 1
    )
    SELECT TOP (3)
        productName, city, salesCount
    FROM BestCityPerProduct
    ORDER BY salesCount DESC, productName ASC;
END
GO

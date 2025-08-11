CREATE OR ALTER PROCEDURE dbo.usp_GetOrdersDeliveryStatus
    @kind  NVARCHAR(10) = N'late',   -- 'early' / 'late'
    @limit INT = 10
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Base TABLE
    (
        id                     INT,
        orderDate              DATETIME,
        requestedDeliveryDate  DATETIME,
        shippedDate            DATETIME,
        diffMinutes            INT
    );

    INSERT INTO @Base (id, orderDate, requestedDeliveryDate, shippedDate, diffMinutes)
    SELECT
        o.order_id,
        o.order_date,
        o.required_date,
        o.shipped_date,
        DATEDIFF(DAY, o.required_date, o.shipped_date)
    FROM sales.orders AS o
    WHERE o.shipped_date IS NOT NULL;

    IF LOWER(@kind) = N'late'
    BEGIN
        ;WITH R AS (
            SELECT
                id, orderDate, requestedDeliveryDate, shippedDate, diffMinutes,
                CAST(ROW_NUMBER() OVER (ORDER BY diffMinutes DESC) AS INT) AS severityRank
            FROM @Base
            WHERE diffMinutes > 0
        )
        SELECT TOP (@limit)
            id, orderDate, requestedDeliveryDate, shippedDate, diffMinutes, severityRank
        FROM R
        ORDER BY severityRank;
        RETURN;
    END

    ;WITH R AS (
        SELECT
            id, orderDate, requestedDeliveryDate, shippedDate, diffMinutes,
            CAST(ROW_NUMBER() OVER (ORDER BY diffMinutes ASC) AS INT) AS severityRank
        FROM @Base
        WHERE diffMinutes < 0
    )
    SELECT TOP (@limit)
        id, orderDate, requestedDeliveryDate, shippedDate, diffMinutes, severityRank
    FROM R
    ORDER BY severityRank;
END
GO

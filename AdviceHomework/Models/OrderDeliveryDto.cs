namespace AdviceHomework.Models;

public record OrderDeliveryDto(
    int Id,
    DateTime? OrderDate,
    DateTime? RequestedDeliveryDate,
    DateTime? ShippedDate,
    int DiffMinutes,
    int SeverityRank
);

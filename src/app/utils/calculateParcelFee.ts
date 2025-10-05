import { ParcelType } from "../modules/Booking/booking.interface";

export const calculateParcelFee = (
  parcelType: ParcelType,
  weight: number
): number => {
  const baseFees = {
    [ParcelType.Document]: 120,
    [ParcelType.Package]: 150,
    [ParcelType.Fragile]: 200,
  };

  const additionalFeeRates = {
    [ParcelType.Document]: 0.1, // 10%
    [ParcelType.Package]: 0.2, // 20%
    [ParcelType.Fragile]: 0.3, // 30%
  };

  const baseFee = baseFees[parcelType];
  const additionalFeeRate = additionalFeeRates[parcelType];

  // For weight below 1kg, use base price
  if (weight <= 1) {
    return baseFee;
  }

  // For additional kg, calculate additional fee
  const additionalWeight = weight - 1;
  const additionalFee = additionalWeight * baseFee * additionalFeeRate;

  return baseFee + additionalFee;
};

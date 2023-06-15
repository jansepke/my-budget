// https://stackoverflow.com/a/53107408/1453662
export const parseGoogleSheetsDate = (value: number) => new Date(value * 86400000 - 2209132800000);

const numberFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
export const formatCurrency = (value: number) => numberFormat.format(value);

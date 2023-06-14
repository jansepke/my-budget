// https://stackoverflow.com/a/53107408/1453662
export const parseGoogleSheetsDate = (value: number) => new Date(value * 86400000 - 2209132800000);

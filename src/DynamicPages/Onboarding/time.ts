export const fmtTime = (d: Date) => d.toTimeString().slice(0, 5); // HH:MM
export const fmtINR = (n: number) =>
    new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(n);
export const maskName = (name: string) => {
  if (!name) return "";
  return name.split(" ").map(w => {
    if (w.length <= 1) return w;
    return w[0] + "*".repeat(Math.min(w.length - 1, 4));
  }).join(" ");
};

export const maskAmount = (_amount: number | string) => {
  return "₹****";
};

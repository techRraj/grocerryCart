export const seedCoupons = [
  { code:"FRESH50", type:"fixed",   value:50,  minCart:499,  maxDiscount:50,  active:true, expiry:"2026-12-31", usageLimit:1000 },
  { code:"SAVE10",  type:"percent", value:10,  minCart:999,  maxDiscount:200, active:true, expiry:"2026-12-31", usageLimit:500 },
  { code:"NEW20",   type:"percent", value:20,  minCart:1499, maxDiscount:300, active:true, expiry:"2026-12-31", usageLimit:200 },
];
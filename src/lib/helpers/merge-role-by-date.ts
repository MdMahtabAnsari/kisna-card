export function mergeRoleDataByDate(
  admin: { date: string; count: number }[],
  shopOwner: { date: string; count: number }[],
  user: { date: string; count: number }[]
) {
  const allDates = Array.from(
    new Set([
      ...admin.map(d => d.date),
      ...shopOwner.map(d => d.date),
      ...user.map(d => d.date),
    ])
  ).sort();

  const adminMap = Object.fromEntries(admin.map(d => [d.date, d.count]));
  const shopOwnerMap = Object.fromEntries(shopOwner.map(d => [d.date, d.count]));
  const userMap = Object.fromEntries(user.map(d => [d.date, d.count]));

  return allDates.map(date => ({
    date,
    admin: adminMap[date] || 0,
    shop_owner: shopOwnerMap[date] || 0,
    user: userMap[date] || 0,
  }));
}
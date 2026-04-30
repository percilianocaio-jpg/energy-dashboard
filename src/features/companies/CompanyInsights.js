export function getCompanyInsights(data) {
  if (!data || data.length === 0) return null;

  const totalUsuarios = data.reduce((acc, e) => acc + e.total, 0);

  const totalConsumo = data.reduce((acc, e) => acc + (e.consumoTotal || 0), 0);

  const topEmpresaUsuarios = data.reduce((max, e) =>
    e.total > max.total ? e : max,
  );

  const topEmpresaConsumo = data.reduce((max, e) =>
    (e.consumoTotal || 0) > (max.consumoTotal || 0) ? e : max,
  );

  const mediaUsuarios = totalUsuarios / data.length;
  const mediaConsumo = totalConsumo / data.length;

  return {
    totalUsuarios,
    totalConsumo,
    topEmpresaUsuarios,
    topEmpresaConsumo,
    mediaUsuarios: Number(mediaUsuarios.toFixed(1)),
    mediaConsumo: Number(mediaConsumo.toFixed(1)),
  };
}

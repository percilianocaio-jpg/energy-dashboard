export function agruparUsuariosPorEmpresa(usuarios) {
  const empresas = {};

  usuarios.forEach((usuario) => {
    const nome = usuario.company?.name || "Desconhecida";

    if (!empresas[nome]) {
      empresas[nome] = {
        empresa: nome,
        total: 0,
        consumoTotal: 0,
        eficiencia: 0,
      };
    }

    empresas[nome].total += 1;
    empresas[nome].consumoTotal += usuario.consumo || 0;
  });

  Object.values(empresas).forEach((empresa) => {
    empresa.eficiencia = Number(
      (empresa.consumoTotal / empresa.total).toFixed(1),
    );
  });

  return Object.values(empresas);
}

export function ordenarEmpresas(data, tipo = "desc") {
  return [...data].sort((a, b) =>
    tipo === "desc"
      ? b.consumoTotal - a.consumoTotal
      : a.consumoTotal - b.consumoTotal,
  );
}

export function enrichUsers(usuarios) {
  const empresasBase = {
    "Romaguera-Crona": 400,
    "Deckow-Crist": 300,
    "Robel-Corkery": 500,
    "Keebler LLC": 350,
    "Abernathy Group": 280,
  };

  return usuarios.map((usuario) => {
    const empresa = usuario.company?.name || "Desconhecida";

    const base = empresasBase[empresa] || 250;

    // 🔥 histórico de consumo (últimos 7 dias)
    const historico = [];

    for (let i = 0; i < 7; i++) {
      const variacao = Math.random() * 100 - 50;
      const valor = Math.max(50, Math.round(base + variacao));

      const data = new Date();
      data.setDate(data.getDate() - i);

      historico.push({
        data: data.toISOString().split("T")[0],
        consumo: valor,
      });
    }

    // 📊 consumo atual = último dia
    const consumoAtual = historico[0].consumo;

    // 📈 tendência (comparando hoje vs ontem)
    const ontem = historico[1]?.consumo || consumoAtual;
    const tendencia =
      consumoAtual > ontem
        ? "subindo"
        : consumoAtual < ontem
          ? "descendo"
          : "estavel";

    // status baseado no consumo atual
    const status = consumoAtual > base ? "ativo" : "inativo";

    return {
      ...usuario,
      consumo: consumoAtual,
      historico,
      tendencia,
      status,
    };
  });
}

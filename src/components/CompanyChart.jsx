import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Gera siglas únicas considerando colisões entre nomes
function gerarSiglas(empresas) {
  const siglas = {};
  const contagem = {};

  // 1ª passagem: sigla base (inicial de cada palavra)
  empresas.forEach(({ empresa }) => {
    const partes = empresa.split(/[\s-]+/);
    const sigla = partes.map((p) => p[0].toUpperCase()).join("");
    contagem[sigla] = (contagem[sigla] || 0) + 1;
    siglas[empresa] = { sigla, partes };
  });

  // 2ª passagem: diferencia colisões com 3 letras da 1ª palavra + iniciais das demais
  const resultado = {};

  empresas.forEach(({ empresa }) => {
    const { sigla, partes } = siglas[empresa];

    if (contagem[sigla] === 1) {
      resultado[empresa] = sigla;
    } else {
      resultado[empresa] =
        partes[0].slice(0, 3) +
        partes
          .slice(1)
          .map((p) => p[0].toUpperCase())
          .join("");
    }
  });

  return resultado;
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const info = payload[0]?.payload;
  if (!info) return null;

  return (
    <div
      style={{
        background: "#1a1d27",
        border: "1px solid #2a2d3e",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 12,
        lineHeight: 1.8,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <p
        style={{
          color: "#8b8fa8",
          marginBottom: 4,
          fontWeight: 600,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {info.empresa}
      </p>
      <p style={{ color: "#e8eaf0" }}>
        Usuários: <strong>{info.total}</strong>
      </p>
      <p style={{ color: "#e8eaf0" }}>
        Consumo:{" "}
        <strong>{info.consumoTotal?.toLocaleString("pt-BR")} kWh</strong>
      </p>
      <p style={{ color: "#e8eaf0" }}>
        Eficiência: <strong>{info.eficiencia} kWh/u</strong>
      </p>
    </div>
  );
};

function CompanyChart({
  data,
  metricasAtivas,
  onSelectEmpresa,
  empresaSelecionada,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-wrapper">
        <p style={{ textAlign: "center", padding: "40px 0", color: "#555870" }}>
          Nenhum dado para exibir
        </p>
      </div>
    );
  }

  const melhor = [...data].sort((a, b) => b.consumoTotal - a.consumoTotal)[0];
  const pior = [...data].sort((a, b) => a.consumoTotal - b.consumoTotal)[0];

  const siglaMap = gerarSiglas(data);

  return (
    <div className="chart-wrapper">
      <div className="chart-header">
        <h2>Comparação por empresa</h2>
        <div className="chart-legend">
          {metricasAtivas.usuarios && (
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#8b5cf6" }} />
              Usuários
            </span>
          )}
          {metricasAtivas.consumo && (
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#3b82f6" }} />
              Consumo
            </span>
          )}
          {metricasAtivas.eficiencia && (
            <span className="legend-item">
              <span
                className="legend-dot"
                style={{ background: "#f59e0b", borderRadius: 50 }}
              />
              Eficiência
            </span>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
        >
          <XAxis
            dataKey="empresa"
            tick={{ fill: "#555870", fontSize: 11 }}
            axisLine={{ stroke: "#2a2d3e" }}
            tickLine={false}
            interval={0}
            tickFormatter={(empresa) => siglaMap[empresa] ?? empresa}
          />
          <YAxis
            yAxisId="usuarios"
            tick={{ fill: "#555870", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="consumo"
            orientation="right"
            tick={{ fill: "#555870", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis yAxisId="eficiencia" hide />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />

          {metricasAtivas.usuarios && (
            <Bar
              yAxisId="usuarios"
              dataKey="total"
              fill="#8b5cf6"
              name="Usuários"
              radius={[4, 4, 0, 0]}
            />
          )}

          {metricasAtivas.consumo && (
            <Bar
              yAxisId="consumo"
              dataKey="consumoTotal"
              name="Consumo"
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => {
                const isSelected = empresaSelecionada === entry.empresa;
                let color = "#3b82f6";
                if (entry.empresa === melhor?.empresa) color = "#00d4aa";
                if (entry.empresa === pior?.empresa) color = "#ef4444";

                return (
                  <Cell
                    key={index}
                    fill={isSelected ? "#facc15" : color}
                    style={{
                      cursor: "pointer",
                      opacity: isSelected || !empresaSelecionada ? 1 : 0.35,
                      transition: "opacity 0.2s",
                    }}
                    onClick={() => onSelectEmpresa?.(entry.empresa)}
                  />
                );
              })}
            </Bar>
          )}

          {metricasAtivas.eficiencia && data.length > 1 && (
            <Line
              yAxisId="eficiencia"
              type="monotone"
              dataKey="eficiencia"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#f59e0b", strokeWidth: 0 }}
              name="Eficiência"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CompanyChart;

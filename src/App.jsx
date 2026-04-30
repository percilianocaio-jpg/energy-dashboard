import { useState, useEffect, useMemo } from "react";
import {
  Zap,
  Users,
  Building2,
  X,
  BarChart3,
  Activity,
  TrendingUp,
} from "lucide-react";

import useUsers from "./hooks/useUsers";
import UserAccordion from "./components/UserAccordion";
import SearchBar from "./components/SearchBar";
import CompanyChart from "./components/CompanyChart";

const METRICAS = [
  {
    key: "usuarios",
    label: "Usuários",
    icon: Users,
    colorClass: "active-green",
  },
  { key: "consumo", label: "Consumo", icon: Zap, colorClass: "active-blue" },
  {
    key: "eficiencia",
    label: "Eficiência",
    icon: Activity,
    colorClass: "active-yellow",
  },
];

function App() {
  const { empresas, insights, loading, error, buscarUsuarios, usuarios } =
    useUsers();

  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [empresaManual, setEmpresaManual] = useState(false);

  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");

  const [metricasAtivas, setMetricasAtivas] = useState({
    usuarios: true,
    consumo: true,
    eficiencia: true,
  });

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilter(filter), 300);
    return () => clearTimeout(timer);
  }, [filter]);

  // fetch inicial
  useEffect(() => {
    buscarUsuarios();
  }, []);

  // EMPRESA DERIVADA (core)
  const empresaDerivada = useMemo(() => {
    if (!debouncedFilter) return null;

    const termo = debouncedFilter.toLowerCase();

    // match empresa
    const empresaMatch = (empresas || []).find((emp) =>
      emp.empresa.toLowerCase().includes(termo),
    );
    if (empresaMatch) return empresaMatch.empresa;

    // match usuário
    const userMatch = (usuarios || []).find((user) =>
      user.name.toLowerCase().includes(termo),
    );
    if (userMatch) return userMatch.company?.name;

    return null;
  }, [debouncedFilter, empresas, usuarios]);

  // empresa final
  const empresaAtiva = empresaManual ? empresaSelecionada : empresaDerivada;

  // clique no gráfico
  const handleSelectEmpresa = (empresa) => {
    setEmpresaManual(true);
    setEmpresaSelecionada((prev) => (prev === empresa ? null : empresa));
  };

  const limparFiltros = () => {
    setFilter("");
    setDebouncedFilter("");
    setEmpresaSelecionada(null);
    setEmpresaManual(false);
  };

  const toggleMetrica = (key) =>
    setMetricasAtivas((prev) => ({ ...prev, [key]: !prev[key] }));

  // gráfico (NÃO depende da busca diretamente)
  const empresasFiltradas = useMemo(() => {
    if (!empresaAtiva) return empresas || [];

    return (empresas || []).filter(
      (empresa) => empresa.empresa === empresaAtiva,
    );
  }, [empresas, empresaAtiva]);

  // lista inteligente
  const usuariosFiltrados = useMemo(() => {
    if (!usuarios) return [];

    const termo = debouncedFilter.toLowerCase();

    return usuarios.filter((usuario) => {
      const nomeMatch = usuario.name?.toLowerCase().includes(termo);

      const empresaMatch = usuario.company?.name === empresaAtiva;

      // busca por empresa → mostra todos usuários dela
      if (empresaDerivada && !nomeMatch) {
        return empresaMatch;
      }

      // busca por usuário
      return nomeMatch && (!empresaAtiva || empresaMatch);
    });
  }, [usuarios, debouncedFilter, empresaAtiva, empresaDerivada]);

  const totalUsuarios = insights?.totalUsuarios || 0;
  const totalEmpresas = empresas?.length || 0;

  return (
    <div className="app-layout">
      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <div className="header-logo">
            <Zap size={16} strokeWidth={2.5} />
          </div>
          <div className="header-titles">
            <h1>Energy Dashboard</h1>
            <span className="subtitle">
              Monitoramento de consumo por empresa
            </span>
          </div>
        </div>
        <div className="header-badge">
          <span className="dot" />
          Ao vivo
        </div>
      </header>

      <main className="main-content">
        {/* STAT CARDS */}
        <div className="stats">
          <div className="card">
            <div className="card-icon green">
              <Users size={16} strokeWidth={2} />
            </div>
            <div className="card-info">
              <span className="card-value">{totalUsuarios}</span>
              <span className="card-label">Total de usuários</span>
            </div>
          </div>

          <div className="card">
            <div className="card-icon blue">
              <Building2 size={16} strokeWidth={2} />
            </div>
            <div className="card-info">
              <span className="card-value">{totalEmpresas}</span>
              <span className="card-label">Empresas</span>
            </div>
          </div>

          <div className="card">
            <div className="card-icon purple">
              <Zap size={16} strokeWidth={2} />
            </div>
            <div className="card-info">
              <span className="card-value">
                {insights?.totalConsumo?.toLocaleString("pt-BR") || "—"}
              </span>
              <span className="card-label">kWh total</span>
            </div>
          </div>
        </div>

        {/* INSIGHTS */}
        {insights && (
          <div className="insights">
            <div className="insight-item">
              <div className="insight-icon green">
                <TrendingUp size={14} strokeWidth={2} />
              </div>
              <div className="insight-text">
                <span className="insight-label">Maior consumo</span>
                <span className="insight-value">
                  {insights.topEmpresaConsumo?.empresa}
                </span>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon blue">
                <Zap size={14} strokeWidth={2} />
              </div>
              <div className="insight-text">
                <span className="insight-label">Consumo total</span>
                <span className="insight-value">
                  {insights.totalConsumo?.toLocaleString("pt-BR")} kWh
                </span>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon yellow">
                <BarChart3 size={14} strokeWidth={2} />
              </div>
              <div className="insight-text">
                <span className="insight-label">Média por empresa</span>
                <span className="insight-value">
                  {insights.mediaConsumo} kWh
                </span>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon purple">
                <Users size={14} strokeWidth={2} />
              </div>
              <div className="insight-text">
                <span className="insight-label">Média de usuários</span>
                <span className="insight-value">
                  {insights.mediaUsuarios} por empresa
                </span>
              </div>
            </div>
          </div>
        )}

        {/* METRIC TOGGLES */}
        <div className="metric-toggle">
          {METRICAS.map(({ key, label, icon: Icon, colorClass }) => (
            <button
              key={key}
              className={`metric-btn ${metricasAtivas[key] ? colorClass : ""}`}
              onClick={() => toggleMetrica(key)}
            >
              <Icon size={13} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>

        {/* FILTRO ATIVO */}
        {empresaAtiva ? (
          <div className="filtro-ativo">
            <Building2 size={12} strokeWidth={2} />
            {empresaAtiva}
            <button
              onClick={limparFiltros}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "inherit",
                padding: 0,
                display: "flex",
                margin: 0,
              }}
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <span className="filtro-hint">
            Clique em uma barra do gráfico para filtrar por empresa
          </span>
        )}

        {/* GRÁFICO */}
        <CompanyChart
          data={empresasFiltradas}
          metricasAtivas={metricasAtivas}
          onSelectEmpresa={handleSelectEmpresa}
          empresaSelecionada={empresaAtiva}
        />

        {/* BUSCA */}
        <SearchBar
          setFiltro={setFilter}
          onClear={limparFiltros}
          valor={filter}
        />

        {/* ACCORDION */}
        <UserAccordion
          usuarios={usuariosFiltrados}
          empresaSelecionada={empresaAtiva}
          loading={loading}
          error={error}
          termoBusca={debouncedFilter}
        />
      </main>
    </div>
  );
}

export default App;

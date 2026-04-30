import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, Zap, Activity, ChevronDown } from "lucide-react";

function agruparPorEmpresa(usuarios) {
  const grupos = {};
  usuarios.forEach((u) => {
    const nome = u.company?.name || "Desconhecida";
    if (!grupos[nome]) grupos[nome] = [];
    grupos[nome].push(u);
  });
  return grupos;
}

function getIniciais(nome) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function UserAccordion({
  usuarios,
  empresaSelecionada,
  loading,
  error,
  termoBusca,
}) {
  const [abertos, setAbertos] = useState([]);
  const highlightedRef = useRef(null);

  // abre automaticamente empresa selecionada
  useEffect(() => {
    if (empresaSelecionada) {
      setAbertos((prev) =>
        prev.includes(empresaSelecionada)
          ? prev
          : [...prev, empresaSelecionada],
      );
    }
  }, [empresaSelecionada]);

  const toggleEmpresa = (empresa) => {
    setAbertos((prev) =>
      prev.includes(empresa)
        ? prev.filter((e) => e !== empresa)
        : [...prev, empresa],
    );
  };

  // encontra usuário que bate com busca
  const usuarioMatch = useMemo(() => {
    if (!termoBusca) return null;

    return usuarios.find((u) =>
      u.name.toLowerCase().includes(termoBusca.toLowerCase()),
    );
  }, [usuarios, termoBusca]);

  // scroll automático (UMA vez só)
  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [usuarioMatch]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="accordion-item skeleton"
            style={{ height: 56, borderRadius: 10 }}
          >
            <div
              className="skeleton-line title"
              style={{ margin: "20px 18px", width: "30%" }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>Erro ao carregar</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!usuarios || usuarios.length === 0) {
    return (
      <div className="empty-state">
        <h3>Nenhum resultado</h3>
        <p>Tente ajustar sua busca ou limpar os filtros</p>
      </div>
    );
  }

  const grupos = agruparPorEmpresa(usuarios);

  return (
    <div className="accordion-wrapper">
      {Object.entries(grupos).map(([empresa, membros]) => {
        const isAberto = abertos.includes(empresa);
        const isSelecionada = empresaSelecionada === empresa;

        const totalConsumo = membros.reduce(
          (acc, u) => acc + (u.consumo || 0),
          0,
        );

        const eficienciaMedia =
          membros.length > 0 ? (totalConsumo / membros.length).toFixed(1) : "—";

        return (
          <div
            key={empresa}
            className={`accordion-item ${isSelecionada ? "selected" : ""}`}
          >
            {/* HEADER */}
            <button
              className="accordion-header"
              onClick={() => toggleEmpresa(empresa)}
            >
              <div className="accordion-header-left">
                <div className="accordion-company-icon">
                  <Building2 size={14} strokeWidth={2} />
                </div>
                <span className="accordion-company-name">{empresa}</span>
              </div>

              <div className="accordion-meta">
                <span className="accordion-stat">
                  <Users size={12} strokeWidth={2} />
                  <strong>{membros.length}</strong>
                </span>
                <span className="accordion-stat">
                  <Zap size={12} strokeWidth={2} />
                  <strong>{totalConsumo.toLocaleString("pt-BR")}</strong> kWh
                </span>
                <span className="accordion-stat">
                  <Activity size={12} strokeWidth={2} />
                  <strong>{eficienciaMedia}</strong> kWh/u
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={`accordion-chevron ${isAberto ? "open" : ""}`}
                />
              </div>
            </button>

            {/* BODY */}
            <AnimatePresence initial={false}>
              {isAberto && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="accordion-body">
                    {membros.map((usuario) => {
                      const isMatch =
                        usuarioMatch && usuario.id === usuarioMatch.id;

                      return (
                        <motion.div
                          ref={isMatch ? highlightedRef : null}
                          key={usuario.id}
                          className={`user-card ${isMatch ? "highlight" : ""}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.16 }}
                        >
                          <div className="user-card-header">
                            <div className="user-avatar">
                              {getIniciais(usuario.name)}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <h3>{usuario.name}</h3>
                              <p>{usuario.email}</p>
                            </div>
                          </div>

                          <div className="user-card-divider" />

                          <div className="user-card-metrics">
                            <div className="user-metric">
                              <span className="user-metric-label">
                                <Zap size={11} strokeWidth={2} />
                                Consumo
                              </span>
                              <span className="user-metric-value">
                                {usuario.consumo != null
                                  ? `${usuario.consumo} kWh`
                                  : "—"}
                              </span>
                            </div>

                            <div className="user-metric">
                              <span className="user-metric-label">
                                <Activity size={11} strokeWidth={2} />
                                Eficiência
                              </span>
                              <span className="user-metric-value">
                                {usuario.consumo != null
                                  ? `${usuario.consumo.toFixed(1)} kWh/u`
                                  : "—"}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default UserAccordion;

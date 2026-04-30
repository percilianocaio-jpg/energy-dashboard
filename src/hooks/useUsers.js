import { useState } from "react";

// ambiente
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// helper: fetch com timeout
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

function useUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function buscarUsuarios() {
    try {
      setLoading(true);
      setError(null);

      const [resInsights, resUsers] = await Promise.all([
        fetchWithTimeout(`${API_URL}/insights`),
        fetchWithTimeout(`${API_URL}/users`),
      ]);

      if (!resInsights.ok) {
        throw new Error(`Erro insights: ${resInsights.status}`);
      }

      if (!resUsers.ok) {
        throw new Error(`Erro users: ${resUsers.status}`);
      }

      const insightsData = await resInsights.json();
      const usersData = await resUsers.json();

      // validação básica (evita quebrar UI)
      if (!insightsData || !usersData) {
        throw new Error("Dados inválidos recebidos da API");
      }

      setInsights(insightsData);
      setEmpresas(insightsData.empresas || []);
      setUsuarios(usersData || []);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);

      if (err.name === "AbortError") {
        setError("Tempo de resposta excedido. Tente novamente.");
      } else {
        setError("Erro ao carregar dados. Verifique o servidor.");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    usuarios,
    empresas,
    insights,
    loading,
    error,
    buscarUsuarios,
  };
}

export default useUsers;

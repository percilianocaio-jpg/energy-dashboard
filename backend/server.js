try { require("dotenv").config() } catch (e) {}

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const seedrandom = require("seedrandom")

const app = express()

/* =========================
    RANDOM DETERMINÍSTICO
========================= */

// 👇 seed fixa (NUNCA MUDE se quiser dados estáveis)
const rng = seedrandom("energy-dashboard")

const random = () => rng()

/* =========================
    SEGURANÇA
========================= */

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Muitas requisições, tente novamente depois.",
})
app.use(limiter)

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

/* =========================
   🌍 CORS
========================= */

const allowedOrigins = process.env.FRONT_URL?.split(",") || []

const allowedOrigins = process.env.FRONT_URL?.split(",") || []

app.use(cors())

/* =========================
   🔥 DADOS BASE
========================= */

const firstNames = [
  "Lucas", "Mateus", "Pedro", "Ana", "Julia",
  "Mariana", "Carlos", "Fernanda", "Rafael", "Bruna",
  "Thiago", "Camila", "Gabriel", "Larissa", "Eduardo",
  "Beatriz", "Felipe", "Aline", "Gustavo", "Renata",
]

const lastNames = [
  "Silva", "Souza", "Oliveira", "Santos", "Pereira",
  "Costa", "Rodrigues", "Almeida", "Nascimento", "Lima",
]

const empresasBase = {
  "Romaguera-Crona": 400,
  "Deckow-Crist": 300,
  "Robel-Corkery": 500,
  "Keebler LLC": 350,
  "Abernathy Group": 280,
}

const FALLBACK_COMPANIES = [
  { id: 1, company: { name: "Romaguera-Crona" } },
  { id: 2, company: { name: "Deckow-Crist" } },
  { id: 3, company: { name: "Robel-Corkery" } },
  { id: 4, company: { name: "Keebler LLC" } },
  { id: 5, company: { name: "Abernathy Group" } },
]

const randomFrom = (arr) => arr[Math.floor(random() * arr.length)]
const gerarNome = () => `${randomFrom(firstNames)} ${randomFrom(lastNames)}`

/* =========================
    GERAÇÃO DE USUÁRIOS
========================= */

async function gerarUsuarios() {
  let baseUsers

  try {
    const BASE_URL =
      process.env.PLACEHOLDER_API_URL ||
      "https://jsonplaceholder.typicode.com"

    const response = await fetch(`${BASE_URL}/users`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    baseUsers = await response.json()
  } catch (err) {
    console.warn("[warn] API externa indisponível:", err.message)
    baseUsers = FALLBACK_COMPANIES
  }

  const usuarios = []

  baseUsers.forEach((user) => {
    const quantidade = Math.floor(random() * 10) + 8

    for (let i = 0; i < quantidade; i++) {
      const nome = gerarNome()
      const base = empresasBase[user.company?.name] || 250
      const variacao = random() * 120 - 60
      const consumo = Math.max(80, Math.round(base + variacao))

      usuarios.push({
        id: `${user.id}-${i}`,
        name: nome,
        username: nome.toLowerCase().replace(" ", "."),
        email: `${nome.toLowerCase().replace(" ", ".")}@empresa.com`,
        company: user.company,
        consumo,
      })
    }
  })

  return usuarios
}

/* =========================
    CACHE
========================= */

let cachedUsuarios = null

async function getUsuarios() {
  if (!cachedUsuarios) {
    cachedUsuarios = await gerarUsuarios()
  }
  return cachedUsuarios
}

/* =========================
    ROTAS
========================= */

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Energy Dashboard API 🚀" })
})

app.get("/users", async (req, res) => {
  try {
    const usuarios = await getUsuarios()
    res.json(usuarios)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erro ao gerar usuários" })
  }
})

app.get("/insights", async (req, res) => {
  try {
    const users = await getUsuarios()
    const empresas = {}

    users.forEach((u) => {
      const nome = u.company?.name || "Desconhecida"

      if (!empresas[nome]) {
        empresas[nome] = {
          empresa: nome,
          total: 0,
          consumoTotal: 0,
        }
      }

      empresas[nome].total++
      empresas[nome].consumoTotal += u.consumo || 0
    })

    const lista = Object.values(empresas).map((e) => ({
      ...e,
      eficiencia: Number((e.consumoTotal / e.total).toFixed(1)),
    }))

    const totalUsuarios = lista.reduce((acc, e) => acc + e.total, 0)
    const totalConsumo = lista.reduce(
      (acc, e) => acc + e.consumoTotal,
      0
    )

    const topEmpresaConsumo = lista.reduce((max, e) =>
      e.consumoTotal > max.consumoTotal ? e : max
    )

    const mediaUsuarios = Number(
      (totalUsuarios / lista.length).toFixed(1)
    )

    const mediaConsumo = Number(
      (totalConsumo / lista.length).toFixed(1)
    )

    res.json({
      totalUsuarios,
      totalConsumo,
      mediaUsuarios,
      mediaConsumo,
      topEmpresaConsumo,
      empresas: lista,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erro ao gerar insights" })
  }
})

app.post("/reset", (req, res) => {
  cachedUsuarios = null
  res.json({
    ok: true,
    message: "Cache limpo. Novos dados serão gerados.",
  })
})

/* =========================
   ▶ START
========================= */

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`)
})
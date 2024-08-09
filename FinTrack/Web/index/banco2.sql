generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id            Int              @id @default(autoincrement())
  nome          String
  email         String           @unique
  senha         String
  transacoes    Transacao[]
  orcamentos    Orcamento[]
  relatorios    Relatorio[]
  relatoriosJson RelatorioJson[]
}

model Transacao {
  id         Int           @id @default(autoincrement())
  usuarioId  Int
  data       DateTime
  descricao  String
  categoria  CategoriaEnum
  valor      Float
  tags       String?
  usuario    Usuario       @relation(fields: [usuarioId], references: [id])
}

model Categoria {
  id            Int              @id @default(autoincrement())
  nome          String           @unique
  tipo          TipoCategoriaEnum
  subcategorias Subcategoria[]
  orcamentos    Orcamento[]
}

model Subcategoria {
  id          Int       @id @default(autoincrement())
  categoriaId Int
  nome        String
  categoria   Categoria @relation(fields: [categoriaId], references: [id])
}

model Orcamento {
  id               Int              @id @default(autoincrement())
  usuarioId        Int
  categoriaId      Int
  valor            Float
  dataInicio       DateTime
  dataFim          DateTime
  usuario          Usuario          @relation(fields: [usuarioId], references: [id])
  categoria        Categoria        @relation(fields: [categoriaId], references: [id])
  historicoOrcamentos HistoricoOrcamento[]
}

model HistoricoOrcamento {
  id           Int          @id @default(autoincrement())
  orcamentoId  Int
  data         DateTime
  valor        Float
  status       StatusEnum
  tipoAjuste   TipoAjusteEnum
  orcamento    Orcamento    @relation(fields: [orcamentoId], references: [id])
}

model Relatorio {
  id           Int           @id @default(autoincrement())
  usuarioId    Int
  tipo         TipoRelatorioEnum
  dataInicio   DateTime
  dataFim      DateTime
  relatorio    String
  formato      String?
  usuario      Usuario       @relation(fields: [usuarioId], references: [id])
}

model RelatorioJson {
  id           Int           @id @default(autoincrement())
  usuarioId    Int
  tipo         TipoRelatorioJsonEnum
  dataInicio   DateTime
  dataFim      DateTime
  dados        Json
  usuario      Usuario       @relation(fields: [usuarioId], references: [id])
}

enum CategoriaEnum {
  RENDA
  ALIMENTACAO
  TRANSPORTE
  UTILIDADES
  ENTRETENIMENTO
  SAUDE
  EDUCACAO
  LAZER
  VESTUARIO
  HABITACAO
}

enum TipoCategoriaEnum {
  RENDA
  DESPESA
}

enum StatusEnum {
  DENTRO_DO_ORCAMENTO
  ACIMA_DO_ORCAMENTO
}

enum TipoAjusteEnum {
  PLANEJADO
  REAL
}

enum TipoRelatorioEnum {
  MENSAL
  ANUAL
  PERSONALIZADO
}

enum TipoRelatorioJsonEnum {
  INCOME_EXPENSE
  CATEGORY_BREAKDOWN
  BUDGET_COMPARISON
  SAVINGS
}
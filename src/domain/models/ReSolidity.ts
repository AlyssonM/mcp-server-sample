export type MTR = {
  id: string;
  referencia?: string;
  observacao?: string;
  geradorId: string;
  transportadorId: string;
  destinadorId: string;
  atId?: string;
  placaVeiculo: string;
  dataTransporte: Date;
  dataEmissao: Date;
  itens: MTRItem[];
};

export type MTRItem = {
  id: string;
  residuoId: string;
  quantidade: number;
  unidadeMedida: string;
  classe: string;
  tecnologia: string;
  estadoFisico: string;
  numeroONU?: string;
  classeDeRisco?: string;
  densidade?: number;
  densidadeUnidade?: string;
  codigoInternoGerador?: string;
  codigoInternoDestinador?: string;
};

export type AlteracaoInfo = {
  quantidade: number;
  tecnologia: number;
};

export type ResiduoInfo = {
  id: string;
  quantidade: number;
};

export type MTRInfo = {
  id: string;
  gerador: string;
  transportador: string;
  destinador: string;
  armazenador?: string;
  itens: ResiduoInfo[];
};

export type MTRComplementarInfo = {
  id: string;
  originais: string[];
  novoTransportador: string;
  novoDestinador: string;
};

export type MTRComplementarPayload = {
  originais: string[];
  novoTransportador: string;
  novoDestinador: string;
};


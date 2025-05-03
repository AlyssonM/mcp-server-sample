import { ReSolidityApiService } from "../../infrastructure/services/ReSolidityApiService.js";
import { MTR, AlteracaoInfo, ResiduoInfo, MTRComplementarInfo } from "../../domain/models/ReSolidity.js";

export class ReSolidityService {
  private apiService: ReSolidityApiService;
  constructor(apiService: ReSolidityApiService) {
    this.apiService = apiService;
  }

  public async isReSolidityAvailable(): Promise<string> {
    return "ReSolidity is available";
  }
  public async getMTR(mtrId: string): Promise<MTR | null> {
    const result = await this.apiService.getMTR(mtrId) as MTR | null;
    if (!result) {
 return null;
    }
 return result;
  }
  public async emitirMTR(
    geradorSigner: string,
    transportador: string,
    destinador: string,
    armazenador: string,
    residuos: any[]
  ): Promise<{ message: string; txHash: string; } | null> {
    const result = await this.apiService.emitirMTR( 
 geradorSigner,
 transportador,
 destinador,
 armazenador,
 residuos
    ) as { message: string; txHash: string } | null;
    return result ? { message: result.message, txHash: result.txHash } : null;
  }
  public async listarMTRsDoGerador(gerador: string): Promise<string[] | null> {
    const result = await this.apiService.listarMTRsDoGerador(gerador) as string[] | null;
    if (!result) {
      return null;
    }
 return result.map(String);
  }

  public async receberNoAT(
    armazenadorSigner: string,
    numero: number,
    motorista: string,
    placa: string
  ): Promise<{ message: string; txHash: string } | null> {
 const result = await this.apiService.receberNoAT(armazenadorSigner, numero, motorista, placa);
    if (!result) {
 return null;
    }
 return result;
  }
  public async emitirMTRComplementar(
    armazenadorSigner: string,
    originais: number[],
    novoTransportador: string,
    novoDestinador: string
  ): Promise<{ message: string; txHash: string } | null> {
 const result = await this.apiService.emitirMTRComplementar(armazenadorSigner, originais, novoTransportador, novoDestinador);
    if (!result) {
 return null;
    }
    return result ? { message: result.message, txHash: result.txHash } : null;
  }
  public async receberMTR(
    destinadorSigner: string,
    numero: number,
    infos: any[]
  ): Promise<void | null> {
    await this.apiService.receberMTR(destinadorSigner, numero, infos);
  }

  public async solicitarAlteracao(
    destinadorSigner: string,
    numero: number,
    alteracoes: AlteracaoInfo[]
  ): Promise<{ message: string; txHash: string } | null> {
 const result = await this.apiService.solicitarAlteracao(destinadorSigner, numero, alteracoes);
    if (!result) {
      return null;
    }
    return result ? { message: result.message, txHash: result.txHash } : null;
  }

  public async validarAlteracao(
    geradorSigner: string,
    numero: number,
    aceite: boolean
  ): Promise<{ message: string; txHash: string } | null> {
 const result = await this.apiService.validarAlteracao(geradorSigner, numero, aceite);
    if (!result) {
      return null;
    }
 return { message: result.message, txHash: result.txHash };
  }

  public async cancelarMTR(
    geradorSigner: string,
    numero: number,
    justificativa: string
  ): Promise<void | null> {
 const result = await this.apiService.cancelarMTR(geradorSigner, numero, justificativa);
    if (!result) {
      return null;
    }
}

  public async listarItens(numero: number): Promise<ResiduoInfo[] | null> {
    const result = await this.apiService.listarItens(numero);
    if (!result) {
 return null;
    }
 return result;
  }
}

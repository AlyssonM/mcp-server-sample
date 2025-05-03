import { SignJWT, importJWK } from 'jose';

const PRIVATE_JWK = {
  crv: "Ed25519",
  d: "iKHObNbfi1TwzHs4Cm9t4m32Mu4XSurk2X70XXATMAU",
  x: "JwLRv-k7K6PCNvXywT5IGaRGSqBnuNAmpt0sXBtcfAI",
  kty: "OKP"
};

async function gerarJwtTeste(): Promise<string> {
  const privateKey = await importJWK(PRIVATE_JWK, 'EdDSA');
  return await new SignJWT({ user: 'e2e-test' })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(privateKey);
}

export class ReSolidityApiService {
  constructor() {}

  private async makeRequest<T>(
    endpoint: string,
    method: string = "GET",
    body?: object
  ): Promise<T | null> {
    const url = `http://localhost:3000/api/mtr/${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
    };

    // TODO: Get JWT dynamically, not hardcoded.
    // This is a temporary hardcoded JWT for testing purposes.
    const jwt = await gerarJwtTeste();
    console.log("Token jwt", jwt);
    try {
      const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: { ...headers, 'Authorization': `Bearer ${jwt}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }


      // Assuming all successful responses return JSON
      return (await response.json()) as T;
    } catch (error) {
      console.error(`Error making ReSolidity API request to ${endpoint}:`, error);
      return null;
    }
  }

  public async getMTR(mtrId: string): Promise<any | null> {
    return this.makeRequest<any>(`${mtrId}`);
  }

  public async emitirMTR(
    geradorSigner: string,
    transportador: string,
    destinador: string,
    armazenador: string,
    residuos: any[]
  ): Promise<{ message: string; txHash: string } | null> {
    return this.makeRequest<{ message: string; txHash: string }>(
      "criar",
      "POST",
      {
        gerador: geradorSigner,
        transportador,
        destinador,
        armazenador,
        residuos,
      }
    );
  }

  public async listarMTRsDoGerador(gerador: string): Promise<string[] | null> {
    return this.makeRequest<string[]>(`listar/${gerador}`);
  }

  public async receberNoAT(
    armazenadorSigner: string,
    numero: number,
    motorista: string,
    placa: string
  ): Promise<{ message: string; txHash: string } | null> {
    return this.makeRequest<{ message: string; txHash: string }>(
      "receber-at",
      "POST",
      {
        armazenadorSigner,
        numero,
        motorista,
        placa,
      }
    );
  }

  public async emitirMTRComplementar(
    armazenadorSigner: string,
    originais: number[],
    novoTransportador: string,
    novoDestinador: string
  ): Promise<{ message: string; txHash: string } | null> {
    return this.makeRequest<{ message: string; txHash: string }>(
      "emitir-complementar",
      "POST",
      {
        armazenadorSigner,
        originais,
        novoTransportador,
        novoDestinador,
      }
    );
  }

  public async receberMTR(
    destinadorSigner: string,
    numero: number,
    infos: { quantidade: number; tecnologia: number }[]
  ): Promise<{ message: string; txHash: string } | null> {
    return this.makeRequest<{ message: string; txHash: string }>(
      "receber-mtr",
      "POST",
      {
        destinadorSigner,
        numero,
        infos,
      }
    );
  }

  public async solicitarAlteracao(
    destinadorSigner: string,
    numero: number,
    alteracoes: any[]
  ): Promise<{ message: string; txHash: string } | null> {
    return this.makeRequest<{ message: string; txHash: string }>(
      "solicitar-alteracao",
      "POST",
      {
        destinadorSigner,
        numero,
        alteracoes,
      }
    );
  }

  public async validarAlteracao(
    geradorSigner: string,
    numero: number,
    aceite: boolean
  ): Promise<{ message: string; txHash: string } | null> {
    return this.makeRequest<{ message: string; txHash: string }>(
      "validar-alteracao",
      "POST",
      {
        geradorSigner,
        numero,
        aceite,
      }
    );
  }

  public async cancelarMTR(
    geradorSigner: string,
    numero: number,
    justificativa: string
  ): Promise<{ message: string; txHash: string } | null> {
    return this.makeRequest<{ message: string; txHash: string }>(
      "cancelar",
      "POST",
      {
        geradorSigner,
        numero,
        justificativa,
      }
    );
  }

  public async listarItens(numero: number): Promise<any[] | null> {
    return this.makeRequest<any[]>(`itens/${numero}`);
  }
}
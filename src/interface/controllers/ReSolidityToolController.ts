import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ReSolidityService } from "../../application/services/ReSolidityService.js";
import { z } from "zod";

export class ReSolidityToolController {
  constructor(
    private server: McpServer,
    private resolidityService: ReSolidityService,
  ) {
    this.registerTools();
  }
  private registerTools(): void {
    this.registerCheckReSolidityToolHandler();
    this.registerGetMTRToolHandler();
    this.registerEmitirMTRToolHandler();
    this.registerReceberNoATToolHandler();
 this.registerListarItensMTRToolHandler();
    this.registerEmitirMTRComplementarToolHandler();
    this.registerReceberMTRToolHandler();
    this.registerSolicitarAlteracaoToolHandler();
    this.registerValidarAlteracaoToolHandler();
    this.registerCancelarMTRToolHandler();
    this.registerListarMTRsDoGeradorToolHandler();
  }
  private registerCheckReSolidityToolHandler(): void {
 this.server.tool(
      "check-re-solidity",
      "Check if ReSolidity is available",
 // Use async since isReSolidityAvailable is an async function
      async () => {
        const message = await this.resolidityService.isReSolidityAvailable();
        return {
          content: [{ type: "text", text: message }],
        };
      },
    );
  }

 private registerGetMTRToolHandler(): void {
    this.server.tool(
      "get-mtr",
      "Get MTR by ID",
      {
        mtrId: z
          .string()
          .describe("The ID of the MTR to retrieve"),
      },
      async ({ mtrId }) => {
        const mtr = await this.resolidityService.getMTR(mtrId);
 if (!mtr) {
 return {
 content: [{type: 'text', text: 'Error getting MTR data'}]
 }
 }

        return {
          content: [
            { type: "text", text: JSON.stringify(mtr, null, 2) },
          ],
        };
      });
  }

  private registerEmitirMTRToolHandler(): void {
    this.server.tool(
      "emitir-mtr",
      "Emit a new MTR",
      {
        geradorSigner: z.string().describe("Signer do Gerador autorizado."),
        transportador: z.string().describe("Endereço do transportador."),
        destinador: z.string().describe("Endereço do destinador."),
        armazenador: z.string().describe("Endereço do Armazenador Temporário (opcional)."),
        residuos: z.object({
          codigoIbama: z.string().optional(),
          quantidade: z.number(),
          unidade: z.number(),
          tecnologia: z.number(),
          densidade: z.number().optional(),
          estadoFisico: z.number(),
          classe: z.number(),
          numeroOnu: z.number().optional(),
          classeRisco: z.number().optional()
          
          }).array().describe("Lista de resíduos a serem transportados."), // Changed from z.string() to z.object({})
                },
      async ({ geradorSigner, transportador, destinador, armazenador, residuos }) => {
        const result = await this.resolidityService.emitirMTR(
          geradorSigner,
          transportador,
          destinador,
          armazenador,
          residuos
        );

 if (!result) {
 return {
 content: [{type: 'text', text: 'Error creating MTR'}]
 }
 }

 return {
          content: [{ type: "text", text: `MTR emitted with number: ${result.numero}` }],
        };
      });
  }

  private registerReceberNoATToolHandler(): void {
    this.server.tool(
      "receber-no-at",
      "Receive MTR at Temporary Storage",
      {
        numero: z.number().describe("Number of the MTR"),
        armazenador: z.string().describe("Signer of the temporary storage"),
        motorista: z.string().describe("Driver's name"),
        placa: z.string().describe("Vehicle license plate"),
      },
      async ({ numero, armazenador, motorista, placa }) => {
        const result = await this.resolidityService.receberNoAT(
          armazenador,
          numero,
          motorista,
          placa,
        );
        if (!result) {
          return {
            content: [{type: 'text', text: 'Error calling the function'}]
          }
        }
        return {
          content: [{ type: "text", text: "MTR received at Temporary Storage successfully." }],
        };
      },
    );
  }

  private registerEmitirMTRComplementarToolHandler(): void {
    this.server.tool(
      "emitir-mtr-complementar",
      "Emit a new complementary MTR",
      {
        originais: z.array(z.number()).describe("Array of original MTR numbers"),
        armazenador: z.string().describe("Signer of the temporary storage"),
        novoTransportador: z.string().describe("New transporter address"),
        novoDestinador: z.string().describe("New destinator address"),
      },
      async ({ originais, armazenador, novoTransportador, novoDestinador }) => {
        const result = await this.resolidityService.emitirMTRComplementar(
          armazenador,
          originais,
          novoTransportador,
          novoDestinador,
        );
         if (!result) {
          return {
            content: [{type: 'text', text: 'Error calling the function'}]
          }
        }
        return {
          content: [{ type: "text", text: `Complementary MTR emitted with number: ${result.message}` }],
        };
      },
    );
  }

  private registerReceberMTRToolHandler(): void {
    this.server.tool(
      "receber-mtr",
      "Destinator receives the MTR",
      {
        numero: z.number().describe("Number of the MTR"),
        destinador: z.string().describe("Signer of the destinator"),
        infos: z.array(z.object({ quantidade: z.number(), tecnologia: z.number() })).describe("List of quantities and applied technologies"),
      },
      async ({ destinador, numero, infos }) => {
        const result = await this.resolidityService.receberMTR(destinador, numero, infos);
        if (!result) {
          return {
            content: [{type: 'text', text: 'Error calling the function'}]
          }
        }
        return {
          content: [{ type: "text", text: "MTR received by destinator successfully." }],
        };
      },
    );
  }

  private registerSolicitarAlteracaoToolHandler(): void {
    this.server.tool(
      "solicitar-alteracao",
      "Destinator requests changes to received residues",
      {
        numero: z.number().describe("Number of the MTR"),
        destinador: z.string().describe("Signer of the destinator"),
        alteracoes: z.array(z.any()).describe("List of proposed changes"), // Use z.any() or define a specific schema if known
      },
      async ({ destinador, numero, alteracoes }) => {
        const result = await this.resolidityService.solicitarAlteracao(destinador, numero, alteracoes);
         if (!result) {
          return {
            content: [{type: 'text', text: 'Error calling the function'}]
          }
        }
        return {
          content: [{ type: "text", text: "Alteration requested successfully." }],
        };
      },
    );
  }

  private registerValidarAlteracaoToolHandler(): void {
    this.server.tool(
      "validar-alteracao",
      "Generator validates or rejects requested alterations",
      {
        numero: z.number().describe("Number of the MTR"),
        gerador: z.string().describe("Signer of the generator"),
        aceite: z.boolean().describe("Accept (true) or reject (false) the alterations"),
      },
      async ({ gerador, numero, aceite }) => {
        const result = await this.resolidityService.validarAlteracao(gerador, numero, aceite);
         if (!result) {
          return {
            content: [{type: 'text', text: 'Error calling the function'}]
          }
        }
        return {
          content: [{ type: "text", text: "Alteration validated successfully." }],
        };
      },
    );
  }

  private registerCancelarMTRToolHandler(): void {
    this.server.tool(
      "cancelar-mtr",
      "Generator cancels the MTR",
      {
        numero: z.number().describe("Number of the MTR"),
        gerador: z.string().describe("Signer of the generator"),
        justificativa: z.string().describe("Textual justification for cancellation"),
      },
      async ({ gerador, numero, justificativa }) => {
        const result = await this.resolidityService.cancelarMTR(gerador, numero, justificativa);
        if (!result) {
          return {
            content: [{type: 'text', text: 'Error calling the function'}]
          }
        }
        return {
          content: [{ type: "text", text: "MTR canceled successfully." }],
        };
      },
    );
  }

  private registerListarMTRsDoGeradorToolHandler(): void {
    this.server.tool(
      "listar-mtrs-do-gerador",
      "List all MTRs emitted by a generator",
      {
        gerador: z.string().describe("Address of the generator"),
      },
      async ({ gerador }) => {
        const mtrs = await this.resolidityService.listarMTRsDoGerador(gerador);
        if (!mtrs) {
          return {
            content: [{type: 'text', text: 'Error calling the function'}]
          }
        }
        return {
          content: [{ type: "text", text: JSON.stringify(mtrs, null, 2) }],
        };
      },
    );
  }

  private registerListarItensMTRToolHandler(): void {
    this.server.tool(
      "listar-itens-mtr",
      "List items of a specific MTR",
      {
        numero: z.number().describe("Number of the MTR"),
      },
      async ({ numero }) => {
        const itens = await this.resolidityService.listarItens(numero);
        if (!itens) {
          return {
            content: [{type: 'text', text: 'Error calling the function'}]
          }
        }
        return {
          content: [{ type: "text", text: JSON.stringify(itens, null, 2) }],
        };
      },
    );
  }
}
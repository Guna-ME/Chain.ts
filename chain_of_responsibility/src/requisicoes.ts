interface Handler {
    setNext(handler: Handler): Handler;
    handle(request: HttpRequest): HttpResponse;
  }
  
  abstract class BaseHandler implements Handler {
    private nextHandler: Handler | null = null;
  
    setNext(handler: Handler): Handler {
      this.nextHandler = handler;
      return handler;
    }
  
    handle(request: HttpRequest): HttpResponse {
      if (this.nextHandler) {
        return this.nextHandler.handle(request);
      }
      return this.createResponse(200, "Requisição processada com sucesso.");
    }
  
    protected abstract createResponse(status: number, message: string): HttpResponse;
  }
  
  interface HttpRequest {
    headers: Record<string, string>;
    body: string;
  }
  
  interface HttpResponse {
    status: number;
    body: string;
  }
  
  class AuthenticationHandler extends BaseHandler {
    protected createResponse(status: number, message: string): HttpResponse {
      const token = "Authorization"; 
  
      if (!this.request.headers[token] || this.request.headers[token] !== "valid-token") {
        return { status: 401, body: "Autenticação falhou!" };
      }
      return super.handle(this.request);
    }
  }
  
  class CacheHandler extends BaseHandler {
    protected createResponse(status: number, message: string): HttpResponse {
      if (this.request.headers["Cache"] === "hit") {
        return { status: 200, body: "Cache encontrado, retornando resposta." };
      }
      return super.handle(this.request);
    }
  }
  
  class CompressionHandler extends BaseHandler {
    protected createResponse(status: number, message: string): HttpResponse {
      if (this.request.headers["Accept-Encoding"] === "gzip") {
        return super.handle(this.request);
      } else {
        return super.handle(this.request);
      }
    }
  }
  
  class LoggingHandler extends BaseHandler {
    protected createResponse(status: number, message: string): HttpResponse {
      console.log(`Log: Requisição recebida com status ${status}. Mensagem: ${message}`);
      return super.handle(this.request);
    }
  }
  
  const authenticationHandler = new AuthenticationHandler();
  const cacheHandler = new CacheHandler();
  const compressionHandler = new CompressionHandler();
  const loggingHandler = new LoggingHandler();
  
  loggingHandler.setNext(authenticationHandler)
                .setNext(cacheHandler)
                .setNext(compressionHandler);
  
  
  const request: HttpRequest = {
    headers: {
      "Authorization": "valid-token", 
      "Cache": "miss", 
      "Accept-Encoding": "gzip" 
    },
    body: "Dados da requisição"
  };
  
 
  console.log("Processando requisição...");
  const response = loggingHandler.handle(request);
  console.log(`Status: ${response.status}, Mensagem: ${response.body}`);
  
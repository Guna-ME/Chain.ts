interface Approver {
  setNext(approver: Approver): Approver;
  approve(amount: number): void;
}

abstract class BaseApprover implements Approver {
  private nextApprover: Approver | null = null;

  setNext(approver: Approver): Approver {
    this.nextApprover = approver;
    return approver;
  }

  approve(amount: number): void {
    if (this.canApprove(amount)) {
      console.log(`${this.role()} aprovou a despesa de R$ ${amount.toFixed(2)}.`);
    } else if (this.nextApprover) {
      this.nextApprover.approve(amount);
    } else {
      console.log(`Nenhum aprovador disponível para R$ ${amount.toFixed(2)}.`);
    }
  }

  protected abstract canApprove(amount: number): boolean;
  protected abstract role(): string;
}


class Manager extends BaseApprover {
  protected canApprove(amount: number): boolean {
    return amount <= 1000;
  }

  protected role(): string {
    return "Gerente";
  }
}

class Director extends BaseApprover {
  protected canApprove(amount: number): boolean {
    return amount <= 5000;
  }

  protected role(): string {
    return "Diretor";
  }
}

class VicePresident extends BaseApprover {
  protected canApprove(amount: number): boolean {
    return amount <= 20000;
  }

  protected role(): string {
    return "Vice-presidente";
  }
}

class President extends BaseApprover {
  protected canApprove(amount: number): boolean {
    return true; 
  }

  protected role(): string {
    return "Presidente";
  }
}

const gerente = new Manager();
const diretor = new Director();
const vp = new VicePresident();
const presidente = new President();

gerente.setNext(diretor).setNext(vp).setNext(presidente);

const despesas = [500, 2000, 7000, 19000, 50000];

for (const valor of despesas) {
  console.log(`\nSolicitando aprovação para R$ ${valor.toFixed(2)}:`);
  gerente.approve(valor);
}

interface Validator {
    setNext(validator: Validator): Validator;
    validate(data: any): boolean;
  }
  
  abstract class BaseValidator implements Validator {
    private nextValidator: Validator | null = null;
  
    setNext(validator: Validator): Validator {
      this.nextValidator = validator;
      return validator;
    }
  
    validate(data: any): boolean {
      if (this.isValid(data)) {
        if (this.nextValidator) {
          return this.nextValidator.validate(data);
        }
        return true; 
      }
      return false; 
    }
  
    protected abstract isValid(data: any): boolean;
    protected abstract errorMessage(): string;
  }
  
  class PasswordLengthValidator extends BaseValidator {
    private minLength: number;
  
    constructor(minLength: number) {
      super();
      this.minLength = minLength;
    }
  
    protected isValid(data: any): boolean {
      if (data.password && data.password.length >= this.minLength) {
        return true;
      }
      console.log(this.errorMessage());
      return false;
    }
  
    protected errorMessage(): string {
      return "A senha deve ter pelo menos 8 caracteres.";
    }
  }
  
  class EmailFormatValidator extends BaseValidator {
    protected isValid(data: any): boolean {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (data.email && emailRegex.test(data.email)) {
        return true;
      }
      console.log(this.errorMessage());
      return false;
    }
  
    protected errorMessage(): string {
      return "O formato do e-mail é inválido.";
    }
  }
  
  class RequiredFieldValidator extends BaseValidator {
    private field: string;
  
    constructor(field: string) {
      super();
      this.field = field;
    }
  
    protected isValid(data: any): boolean {
      if (data[this.field] && data[this.field].trim() !== "") {
        return true;
      }
      console.log(this.errorMessage());
      return false;
    }
  
    protected errorMessage(): string {
      return `O campo ${this.field} é obrigatório.`;
    }
  }
  
  
  const passwordValidator = new PasswordLengthValidator(8);
  const emailValidator = new EmailFormatValidator();
  const nameValidator = new RequiredFieldValidator("name");
  const emailFieldValidator = new RequiredFieldValidator("email");
  
  nameValidator.setNext(emailFieldValidator).setNext(passwordValidator).setNext(emailValidator);
  
  const formData = {
    name: "João Silva",  
    email: "joao.silva@email.com",
    password: "12345678"
  };
  
  console.log("\nIniciando validação do formulário...");
  const isValid = nameValidator.validate(formData);
  
  if (isValid) {
    console.log("\nFormulário validado com sucesso!");
  } else {
    console.log("\nFalha na validação do formulário.");
  }
  
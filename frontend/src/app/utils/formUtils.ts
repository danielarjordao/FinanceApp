import { FormGroup } from '@angular/forms';

// Função utilitária para validar se um campo de formulário é inválido
export const checkFieldInvalid = (form: FormGroup, fieldName: string): boolean => {
  const field = form.get(fieldName);
  return field ? field.invalid && (field.dirty || field.touched) : false;
};

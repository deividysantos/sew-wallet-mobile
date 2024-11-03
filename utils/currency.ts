export function formatCurrency(value: number|undefined, currency: 'BRL' | 'USD'): string {

  if (!value) {
    value = 0;
  }

    // Validação para garantir que o valor tenha no máximo duas casas decimais
    if (typeof value !== 'number' || isNaN(value) || Math.abs(value) > 999999999999.99) {
      throw new Error('O valor deve ser um número válido com até duas casas decimais.');
    }
  
    // Formatação do valor
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency === 'BRL' ? 'BRL' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
  
    // Retorna o valor formatado
    return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', options).format(value);
  }
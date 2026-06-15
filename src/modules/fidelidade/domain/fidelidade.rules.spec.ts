import { calcularDescontoConceitual, calcularPontosPedido, podeResgatar } from './fidelidade.rules';

describe('regras de fidelidade', () => {
  it('gera 1 ponto por real inteiro pago', () => {
    expect(calcularPontosPedido(25.9)).toBe(25);
  });

  it('calcula desconto conceitual a cada 100 pontos', () => {
    expect(calcularDescontoConceitual(250)).toBe(20);
  });

  it('bloqueia resgate acima do saldo', () => {
    expect(podeResgatar(50, 100)).toBe(false);
  });
});

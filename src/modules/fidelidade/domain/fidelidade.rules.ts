export function calcularPontosPedido(total: number): number {
  return Math.floor(total);
}

export function calcularDescontoConceitual(pontos: number): number {
  return Math.floor(pontos / 100) * 10;
}

export function podeResgatar(saldoAtual: number, pontos: number): boolean {
  return pontos > 0 && saldoAtual >= pontos;
}

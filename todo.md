- fix: compensar diferença de posição ao detectar eventos nos elementos enquanto a `setupViewport` não for concluido.
  ao arrastar o mapa e imediatamente clicar e arrastar novamente, a `Position` dos markers elementos podem não terem sido recalculadas ainda. Precisa existir uma verificação para este caso e então compensar a diferença ao passar a `Position` do cursor para o método `isUnderPoint`
- fix: `defaultIsUnderPoint` realizar verificação através do `path` em vez de `bounds`
  - precisa vazer a verificação utilizando o path desenhado no canvas, atualmente ele verifica atraves do `bounds` do marker
- feat: pre-renderizar conteudo proximo à borda
  - setar o tamanho do canvas como o dobro do tamanho do mapa
  - centralizar o canvas no viewport
  - renderizar viewport
  - renderizar `overBorders`
- feat: agrupar pontos das rotas no `setupViewport`
  - pontos muito proximos(comum em visualização com pouco zoom) podem ser filtrados para otimização na renderização e detecção de eventos

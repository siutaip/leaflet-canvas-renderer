## O que testar

### Canvas Overlay

methods:

**onAdd**

- deve salvar a instancia do mapa no objeto
  - `overlay._map`
- deve criar dois canvas e adiciona-los ao DOM
  - `overlay._canvas`
  - `overlay._secondaryCanvas`
  - call: `map._panes.overlayPane.appendChild` with arg: `overlay._canvas`
  - call: `map._panes.overlayPane.appendChild` with arg: `overlay._secondaryCanvas`
- o zIndex do canvas secundário deve ser igual o zIndex do canvas principal +1
  - `overlay._secondaryCanvas.style.zIndex === overlay._canvas.style.zIndex + 1`
- deve adicionar os listeners corretamente
  - movestart
    - deve setar corretamente o valor de `map.isDragging`
  - moveend
    - deve atualizar o viewport
    - deve renderizar tudo novamente
    - deve setar corretamente o valor de `map.isDragging`
  - resize
    - deve redimensionar os canvas corretamente
    - deve atualizar o viewport
    - deve renderizar novamente

**onRemove**

- deve remover os canvas do DOM
  - call `map.getPanes().overlayPane.removeChild` with arg: `overlay._canvas`
  - call `map.getPanes().overlayPane.removeChild` with arg: `overlay._secondaryCanvas`
- deve remover os canvas da memoria
  - `overlay._canvas = null;`
  - `overlay._secondaryCanvas = null;`
- deve remover os listeners correntamente
  - movestart
  - moveend
  - resize
- deve executar o metodo onRemove
- deve remover os "dados dinâmicos"
  - `state.viewport`
  - `state.paths`
  - `state.hovering`
  - `state.dragging`
- deve manter os dados para re-inicialização
  - `state.list`

**setState**

**add**

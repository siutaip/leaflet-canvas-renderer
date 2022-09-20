import * as L from 'leaflet';

const CanvasOverlay = L.Layer.extend({
  initialize(context, props) {
    this.state = context.state || {};
    this.props = props;
    this._context = context;
  },

  setState(newState) {
    Object.keys(newState).forEach((key) => {
      if (this.state.hasOwnProperty(key)) {
        this.state[key] = newState[key];
      }
    });
  },

  add(marker) {
    const list = [
      ...this.state.list,
      ...(Array.isArray(marker) ? marker : [marker]),
    ].sort((a, b) => {
      if (a.order > b.order) {
        return -1;
      }
      if (a.order < b.order) {
        return -1;
      }

      return 0;
    });

    this.setState({ list });
    this._context.setupViewport.call(this);
    this.redraw();
  },

  drawing(userDrawFunc) {
    this._userDrawFunc = userDrawFunc;
    return this;
  },

  canvas() {
    return this._canvas;
  },

  secondaryCanvas() {
    return this._secondaryCanvas;
  },

  redraw() {
    if (!this._frame) {
      this._frame = L.Util.requestAnimFrame(this._redraw, this);
    }
    return this;
  },

  onAdd(map) {
    this._map = map;

    if (!this._map._data) {
      this._map._data = {};
    }

    this._canvas = this._createCanvasElement(
      'primary-canvas',
      this._context.zIndex,
    );
    this._secondaryCanvas = this._createCanvasElement(
      'secondary-canvas',
      this._context.zIndex + 1,
    );

    map.on('movestart', () => {
      map.isDragging = true;
    });

    map.on(
      'moveend',
      () => {
        map.isDragging = false;
        this._reset();
      },
      this,
    );
    map.on('resize', this._resize, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }

    if (typeof this._context.onAdd === 'function') {
      this._context.onAdd.call(this);
    }

    this._reset();
  },

  _createCanvasElement(className, zIndex) {
    const animated = this._map.options.zoomAnimation && L.Browser.any3d;
    const size = this._map.getSize();
    const element = L.DomUtil.create(
      'canvas',
      `leaflet-heatmap-layer ${className}`,
    );
    element.style.position = 'absolute';
    if (zIndex) {
      element.style.zIndex = zIndex;
    }
    element.width = size.x;
    element.height = size.y;

    L.DomUtil.addClass(
      element,
      'leaflet-zoom-' + (animated ? 'animated' : 'hide'),
    );

    this._map._panes.overlayPane.appendChild(element);

    return element;
  },

  onRemove(map) {
    map.getPanes().overlayPane.removeChild(this._canvas);
    map.getPanes().overlayPane.removeChild(this._secondaryCanvas);

    map.off('moveend', this._reset, this);
    map.off('resize', this._resize, this);

    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._animateZoom, this);
    }
    this._canvas = null;
    this._secondaryCanvas = null;
  },

  addTo(map) {
    map.addLayer(this);
    return this;
  },

  _resize(resizeEvent) {
    this._canvas.width = resizeEvent.newSize.x;
    this._canvas.height = resizeEvent.newSize.y;

    this._secondaryCanvas.width = resizeEvent.newSize.x;
    this._secondaryCanvas.height = resizeEvent.newSize.y;
  },
  _reset() {
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._canvas, topLeft);
    L.DomUtil.setPosition(this._secondaryCanvas, topLeft);

    if (typeof this._context.setupViewport === 'function') {
      this._context.setupViewport.call(this);
    }

    this._redraw();
  },

  _redraw() {
    const size = this._map.getSize();
    const bounds = this._map.getBounds();
    const zoomScale =
      (size.x * 180) / (20037508.34 * (bounds.getEast() - bounds.getWest())); // resolution = 1/zoomScale
    const zoom = this._map.getZoom();

    // console.time('process');

    this._context.drawPrimary.call(this);
    this._context.drawSecondary.call(this);

    // console.timeEnd('process');

    this._frame = null;
  },

  _animateZoom(e) {
    const scale = this._map.getZoomScale(e.zoom),
      offset = this._map
        ._getCenterOffset(e.center)
        ._multiplyBy(-scale)
        .subtract(this._map._getMapPanePos());

    L.DomUtil.setTransform(this._canvas, offset, scale);
    L.DomUtil.setTransform(this._secondaryCanvas, offset, scale);
  },
});

export const canvasOverlay = function (context, props) {
  return new CanvasOverlay(context, props);
};

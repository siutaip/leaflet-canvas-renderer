import * as L from 'leaflet';

const CanvasOverlay = L.Layer.extend({
  initialize: function (props, options) {
    this.props = props;
    L.setOptions(this, options);
  },

  drawing: function (userDrawFunc) {
    this._userDrawFunc = userDrawFunc;
    return this;
  },

  params: function (options) {
    L.setOptions(this, options);
    return this;
  },

  canvas: function () {
    return this._canvas;
  },

  secondaryCanvas: function () {
    return this._secondaryCanvas;
  },

  redraw: function () {
    if (!this._frame) {
      this._frame = L.Util.requestAnimFrame(this._redraw, this);
    }
    return this;
  },

  onAdd: function (map) {
    this._map = map;

    const size = this._map.getSize();
    const animated = this._map.options.zoomAnimation && L.Browser.any3d;

    // create main canvas element
    this._canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer');
    this._canvas.style.position = 'absolute';
    this._canvas.style.zIndex = this.props.zIndex;

    this._canvas.width = size.x;
    this._canvas.height = size.y;

    L.DomUtil.addClass(
      this._canvas,
      'leaflet-zoom-' + (animated ? 'animated' : 'hide'),
    );
    map._panes.overlayPane.appendChild(this._canvas);

    // create secondary canvas element
    this._secondaryCanvas = L.DomUtil.create(
      'canvas',
      'leaflet-heatmap-layer secondary',
    );
    this._secondaryCanvas.style.position = 'absolute';
    this._secondaryCanvas.style.zIndex = this.props.zIndex + 1;

    this._secondaryCanvas.width = size.x;
    this._secondaryCanvas.height = size.y;

    L.DomUtil.addClass(
      this._secondaryCanvas,
      'leaflet-zoom-' + (animated ? 'animated' : 'hide'),
    );
    map._panes.overlayPane.appendChild(this._secondaryCanvas);

    map.on('moveend', this._reset, this);
    map.on('resize', this._resize, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }

    this._reset();
  },

  onRemove: function (map) {
    map.getPanes().overlayPane.removeChild(this._canvas);
    map.getPanes().overlayPane.removeChild(this._secondaryCanvas);

    map.off('moveend', this._reset, this);
    map.off('resize', this._resize, this);

    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._animateZoom, this);
    }
    this._secondaryCanvas = null;
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  _resize: function (resizeEvent) {
    this._canvas.width = resizeEvent.newSize.x;
    this._canvas.height = resizeEvent.newSize.y;

    this._secondaryCanvas.width = resizeEvent.newSize.x;
    this._secondaryCanvas.height = resizeEvent.newSize.y;
  },
  _reset: function () {
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._canvas, topLeft);
    L.DomUtil.setPosition(this._secondaryCanvas, topLeft);
    this._redraw();
  },

  _redraw: function () {
    const size = this._map.getSize();
    const bounds = this._map.getBounds();
    const zoomScale =
      (size.x * 180) / (20037508.34 * (bounds.getEast() - bounds.getWest())); // resolution = 1/zoomScale
    const zoom = this._map.getZoom();

    // console.time('process');

    if (this._userDrawFunc) {
      this._userDrawFunc(this, {
        canvas: this._canvas,
        secondaryCanvas: this._secondaryCanvas,
        bounds: bounds,
        size: size,
        zoomScale: zoomScale,
        zoom: zoom,
        options: this.options,
      });
    }

    // console.timeEnd('process');

    this._frame = null;
  },

  _animateZoom: function (e) {
    const scale = this._map.getZoomScale(e.zoom),
      offset = this._map
        ._getCenterOffset(e.center)
        ._multiplyBy(-scale)
        .subtract(this._map._getMapPanePos());

    L.DomUtil.setTransform(this._canvas, offset, scale);
    L.DomUtil.setTransform(this._secondaryCanvas, offset, scale);
  },
});

export const canvasOverlay = function (userDrawFunc, options) {
  return new CanvasOverlay(userDrawFunc, options);
};

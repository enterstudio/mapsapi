DG.Entrance = DG.Layer.extend({

    options: {
        vectors: []
    },

    statics: {
        SHOW_FROM_ZOOM: DG.Browser.svg ? 16 : 17
    },

    initialize: function (options) { // (Object)
        DG.setOptions(this, options);
    },

    onAdd: function (map) { // (DG.Map)
        this._map = map;
        this._initArrows().addTo(map);
        this._eventHandler = new DG.Entrance.EventHandler(map, this);
        this._eventHandler.enable();

        // hide without event by default
        this._arrows.eachLayer(function (arrow) {
            arrow.setStyle({visibility: 'hidden'});
        });
        this._isShown = false;
    },

    addTo: function (map) { // (DG.Map) -> DG.Entrance
        map.addLayer(this);
        return this;
    },

    onRemove: function () { // (DG.Map)
        this._isShown = false;
        this._removeArrows();
        this._map = null;
        this._eventHandler.disable();
        this._eventHandler = null;
        this._arrows = null;
    },

    removeFrom: function (map) { // (DG.Map) -> DG.Entrance
        map.removeLayer(this);
        return this;
    },

    show: function (fitBounds) { // () -> DG.Entrance
        if (!this._arrows) {
            return this;
        }
        if (fitBounds !== false) {
            this._fitBounds();
        }
        if (this._isAllowedZoom()) {
            this._arrows.eachLayer(function (arrow) {
                arrow.setStyle({visibility: 'visible'});
                if (DG.Path.ANIMATION_AVAILABLE) {
                    arrow.runAnimation('animateArrowPathGeom');
                }
            });
            if (!this._isShown) {
                this._map.fire('entranceshow');
                this._isShown = true;
            }
        }

        return this;
    },

    hide: function () { // () -> DG.Entrance

        if (this.isShown() && this._arrows) {
            this._arrows.eachLayer(function (arrow) {
                arrow.setStyle({visibility: 'hidden'});
            });
            this._isShown = false;
            this._map.fire('entrancehide');
        }

        return this;
    },

    isShown: function () { // () -> Boolean
        return this._isShown;
    },

    getBounds: function () { // () -> DG.LatLngBounds
        return this._arrows.getBounds();
    },

    _initArrows: function () { // () -> DG.FeatureGroup
        this._arrows = DG.featureGroup();

        this.options.vectors
            .map(function (vector) {
                return DG.Wkt.toLatLngs(vector);
            })
            .forEach(function (latlngs) {
                // stroke
                this._arrows.addLayer(DG.Entrance.arrow(latlngs, this._getArrowStrokeOptions()));
                // basis
                this._arrows.addLayer(DG.Entrance.arrow(latlngs, this._getArrowOptions()));
            }, this);

        return this._arrows;
    },

    _removeArrows: function () {
        this._map.removeLayer(this._arrows.clearLayers());
    },

    _getFitZoom: function () {
        return this._map.projectDetector.getProject().maxZoom || DG.Entrance.SHOW_FROM_ZOOM;
    },

    _fitBounds: function () {
        var map = this._map,
            fitZoom,
            bounds = this.getBounds();

        if (!map.getBounds().contains(bounds) || !this._isAllowedZoom()) {
            fitZoom = this._getFitZoom();
            if (!map.projectDetector.getProject()) {
                map.once('moveend', function () {
                    map.setZoom(this._getFitZoom());
                }, this);
            }
            map.setView(bounds.getCenter(), fitZoom, {
                animate : true
            });
        }
    },

    _isAllowedZoom: function () {
        return this._map.getZoom() >= DG.Entrance.SHOW_FROM_ZOOM;
    },

    _getArrowStrokeOptions: function () {
        return {
            clickable: false,
            color: '#fff',
            weight: 6,
            byZoom: {
                16: {
                    marker: {
                        viewBox: '0 0 24 24',
                        refX: 12,
                        refY: 12,
                        markerHeight: 24,
                        markerWidth: 24,
                        path: {
                            d:  'M9.313,18.984c2.246-1.468,7.101-5.562,' +
                                '7.101-5.562c0.781-0.781,0.781-2.047,0-' +
                                '2.828c0,0-5.242-4.023-7.101-5.102C9.74' +
                                ',5.354,8.583,5.93,8.125,6.5C7.902,6.77' +
                                '7,9,11.614,9,11.614v0.789c0,0-0.879,4.' +
                                '237-0.905,5.285C8.09,17.891,9.108,19.1' +
                                '18,9.313,18.984z'
                        }
                    },
                    lastPointOffset: 2,
                    vmlEndArrow: 'none',
                    weight: 6,
                    iconWidth: 4
                },
                17: {
                    marker: {
                        viewBox: '0 0 24 24',
                        refX: 12,
                        refY: 12,
                        markerHeight: 24,
                        markerWidth: 24,
                        path: {
                            d:  'M7.912,21.498c3.106-2.029,9.859-7.873,' +
                                '9.859-7.873c2.059-1.807,2.142-1.542,0.' +
                                '146-3.208c0,0-7.434-6.084-10.005-7.576' +
                                'C7.583,2.649,6.903,3.446,6.271,4.233c-' +
                                '0.308,0.384,2.209,6.051,2.209,6.051v3.' +
                                '388c0,0-2.215,4.583-2.25,6.03C6.222,19' +
                                '.986,7.629,21.684,7.912,21.498z'
                        }
                    },
                    lastPointOffset: 0,
                    vmlEndArrow: 'none',
                    weight: 7,
                    iconWidth: 6
                },
                18: {
                    marker: {
                        viewBox: '0 0 24 24',
                        refX: 12,
                        refY: 12,
                        markerHeight: 24,
                        markerWidth: 24,
                        path: {
                            d:  'M7.61,22.688c4.045-2.642,11.312-8.906,' +
                                '11.312-8.906c1.92-1.781,1.938-2-0.124-' +
                                '3.781c0,0-8.151-6.334-11.5-8.276C6.87,' +
                                '1.475,5.516,2.62,5.732,3.093c2.146,4.6' +
                                '94,2.063,4.741,2.612,7.469l0.016,2.75c' +
                                '0,0-1.573,5.458-2.619,7.958C5.599,21.6' +
                                '11,7.241,22.93,7.61,22.688z'
                        }
                    },
                    lastPointOffset: !DG.Browser.vml ? -5 : -2,
                    vmlEndArrow: 'none',
                    weight: 8,
                    iconWidth: 8
                },
                19: {
                    marker: {
                        viewBox: '0 0 24 24',
                        refX: 12,
                        refY: 12,
                        markerHeight: 27,
                        markerWidth: 27,
                        path: {
                            d:  'M6.254472,23.8475c4.560355,-2.972281 1' +
                                '2.747538,-10.032785 12.747538,-10.0327' +
                                '85c2.167521,-2.006556 2.178242,-2.2533' +
                                '53 -0.13949,-4.25991c0,0 -9.185101,-7.' +
                                '13562 -12.962148,-9.324594c-0.482861,-' +
                                '0.278985 -2.006558,1.008645 -1.759761,' +
                                '1.534428c2.414306,5.290015 2.414306,5.' +
                                '290015 3.272724,8.294486l0,3.433681c0,' +
                                '0 -2.081665,5.933829 -3.261997,8.75588' +
                                '9c-0.160951,0.386288 1.684652,1.867062' +
                                ' 2.103134,1.598804z'
                        }
                    },
                    lastPointOffset: !DG.Browser.vml ? -5 : -2,
                    vmlEndArrow: 'none',
                    weight: 10,
                    iconWidth: 12
                }
            }
        };
    },

    _getArrowOptions: function () {
        return {
            clickable: false,
            color: '#0085a0',
            weight: 3,
            byZoom: {
                16: {
                    marker: {
                        refX: 12,
                        refY: 12,
                        markerHeight: 24,
                        markerWidth: 24,
                        path: {
                            d:  'M11.068,13.011L9.5,17.285l6.379-5.169L9' +
                                '.313,7.19l1.717,3.824'
                        }
                    },
                    lastPointOffset: 2,
                    weight: 2,
                    iconWidth: 4
                },
                17: {
                    marker: {
                        refX: 12,
                        refY: 12,
                        markerHeight: 24,
                        markerWidth: 24,
                        path: {
                            d:  'M10.354,13.969l-2.184,5.18L16.993,12L7.' +
                                '912,5.188l2.38,4.781'
                        }
                    },
                    lastPointOffset: 0,
                    weight: 3,
                    iconWidth: 6
                },
                18: {
                    marker: {
                        refX: 12,
                        refY: 12,
                        markerHeight: 24,
                        markerWidth: 24,
                        path: {
                            d:  'M10.281,13.781L7.42,21.271l11.488-9.308' +
                                'L7.083,3.093L10.219,10'
                        }
                    },
                    lastPointOffset: !DG.Browser.vml ? -5 : 0,
                    weight: 4,
                    iconWidth: 8
                },
                19: {
                    marker: {
                        refX: 12,
                        refY: 12,
                        markerHeight: 27,
                        markerWidth: 27,
                        path: {
                            d:  'M9.344783,13.814714l-3.326375,8.476902' +
                                'l12.983603,-10.51565l-13.305513,-9.979' +
                                '137l3.648286,7.940389'
                        }
                    },
                    lastPointOffset: !DG.Browser.vml ? -5 : 0,
                    weight: 5,
                    iconWidth: 12
                }
            }
        };
    }
});

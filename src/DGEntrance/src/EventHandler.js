L.DG.Entrance.EventHandler = L.Handler.extend({

    _map: null,
    _entrance: null,

    initialize: function (map, entrance) { // (L.Map, L.DG.Entrance)
        this._map = map;
        this._entrance = entrance;

        this._map.on({
            'layeradd': this._removeEntrance,
            'zoomend': this._showOrHideEntrance
        }, this);

        if (L.Browser.ie) {
            this._map.on('moveend', this._refresh, this); //JSAPI-3379
        }
    },

    _showOrHideEntrance: function () { // (L.Event)
        if (this._map.getZoom() >= L.DG.Entrance.SHOW_FROM_ZOOM) {
            this._entrance.show(false);
        }
        else {
            this._entrance.hide();
        }
    },

    _refresh: function () {
        var arrows = this._entrance._arrows;
        if (arrows) {
            Object.keys(arrows._layers).forEach(function (arrow) {
                var item = arrows._layers[arrow]._container;
                item.parentNode.insertBefore(item, item);
            }, this);
        }
    },

    _removeEntrance: function (e) { // (L.LayerEvent)
        if (e.layer instanceof L.Popup ||
            (e.layer instanceof L.DG.Entrance && e.layer !== this._entrance)) {

            this._entrance.removeFrom(this._map);

        }
    },

    remove: function () {
        this._map.off({
            'zoomend': this._showOrHideEntrance,
            'layeradd': this._removeEntrance
        }, this);

        if (L.Browser.ie) {
            this._map.off('moveend', this._refresh, this); //JSAPI-3379
        }
    }
});

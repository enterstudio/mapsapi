DG.Map.addInitHook(function () {
    if (!this._copyright) {
        DG.control.attribution().addTo(this);
    }

    this._tln = 'dgTiles';

    this.baseLayer = new (DG.TileLayer.extend({
        onRemove: function (map) {
            map.projectDetector.disable();
            DG.TileLayer.prototype.onRemove.call(this, map);
        }
    })
    )('__TILE_SERVER__', {
            subdomains: '0123456789',
            errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX28t5R0k5UAAAAH0lEQVR4Xu3AAQkAAADCMPunNsdhWxwAAAAAAAAAwAEhAAABg2UP5AAAAABJRU5ErkJggg==',
            detectRetina: true,
            maxNativeZoom: 18
        }
    ).addTo(this);
});

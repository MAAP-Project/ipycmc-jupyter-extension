"use strict";
// Copyright (c) Flynn Platt
// Distributed under the terms of the Modified BSD License.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapCMCView = exports.MapCMCModel = void 0;
const base_1 = require("@jupyter-widgets/base");
const version_1 = require("./version");
const plot_1 = require("./plot");
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
const CMC_Module = require("maap-common-mapping-client");
const CMC = CMC_Module.CMC;
require('maap-common-mapping-client/dist/bundle.css');
require('maap-common-mapping-client/dist/assets/mapskin/css/mapskin.min.css');
function importAll(r) {
    r.keys().forEach(r);
}
importAll(require.context('file-loader?emitFile=true&outputPath=assets/cesium/Workers/&name=[name].[ext]!maap-common-mapping-client/dist/assets/cesium/Workers', true, /\.(js)/));
// const def_loc = [0.0, 0.0];
class MapCMCModel extends base_1.DOMWidgetModel {
    defaults() {
        return Object.assign(Object.assign({}, super.defaults()), { _model_name: MapCMCModel.model_name, _model_module: MapCMCModel.model_module, _model_module_version: MapCMCModel.model_module_version, _view_name: MapCMCModel.view_name, _view_module: MapCMCModel.view_module, _view_module_version: MapCMCModel.view_module_version, _argv: [], _state: {}, _workspace_base_url: '' });
    }
}
exports.MapCMCModel = MapCMCModel;
MapCMCModel.serializers = Object.assign({}, base_1.DOMWidgetModel.serializers);
MapCMCModel.model_name = 'MapCMCModel';
MapCMCModel.model_module = version_1.MODULE_NAME;
MapCMCModel.model_module_version = version_1.MODULE_VERSION;
MapCMCModel.view_name = 'MapCMCView'; // Set to null if no view
MapCMCModel.view_module = version_1.MODULE_NAME; // Set to null if no view
MapCMCModel.view_module_version = version_1.MODULE_VERSION;
class MapCMCView extends base_1.DOMWidgetView {
    _syncCMC() {
        const state = this.cmc._store.getState();
        const prevState = this.model.get('_state');
        this.model.set('_state', {
            date: moment_1.default.utc(state.map.get('date')).toISOString(),
            layers: state.map.get('layers').toJS(),
            areaSelections: state.map
                .get('areaSelections')
                .toList()
                .toJS(),
            plot: state.plot.toJS(),
        });
        this.touch();
        const currState = this.model.get('_state');
        if (currState.plot.commandGenCtr >= 0 &&
            currState.plot.commandGenCtr !== prevState.plot.commandGenCtr) {
            this.loadPlotCommand();
        }
    }
    render() {
        this.model.on('change:_argv', this.argvUpdate, this);
        // standard HTML DOM change from JS
        const wrapperDiv = document.createElement('div');
        wrapperDiv.style.width = '100%';
        wrapperDiv.style.height = '500px';
        const appDiv = document.createElement('div');
        appDiv.style.width = '100%';
        appDiv.style.height = '100%';
        wrapperDiv.appendChild(appDiv);
        this.el.appendChild(wrapperDiv);
        this.appDiv = appDiv;
        this.displayed.then(() => this.render_cmc());
    }
    render_cmc() {
        let baseUrl = path_1.default.join(this.model.get('_workspace_base_url'), '/static/lab');
        this.cmc = new CMC({ target: this.appDiv, base_url: baseUrl });
        this._syncCMC();
        this.cmc._store.subscribe(() => {
            this._syncCMC();
        });
        this.cmc.render().then(() => {
            this.cmc.dispatch.initializeMap();
        });
        console.log(this.cmc);
    }
    argvUpdate() {
        const argv = this.model.get('_argv');
        const func = argv.splice(0, 1)[0];
        switch (func) {
            case 'loadLayerConfig':
                this.loadLayerConfig(argv);
                break;
            case 'setDate':
                this.setDate(argv);
                break;
            case 'setProjection':
                this.setProjection(argv);
                break;
            default:
                console.warn(`WARN: unknown function '${func}'`);
                break;
        }
    }
    loadLayerConfig(argv) {
        const [url, type, defaultOps] = argv;
        this.cmc.dispatch.loadLayerSource({
            url,
            type,
        }, defaultOps);
    }
    setDate(argv) {
        const [dateStr, formatStr] = argv;
        const date = moment_1.default.utc(dateStr, formatStr);
        if (date.isValid()) {
            this.cmc.dispatch.setDate(date);
        }
    }
    setProjection(argv) {
        const [projStr] = argv;
        this.cmc.dispatch.setMapProjection(projStr);
    }
    loadPlotCommand() {
        const currState = this.model.get('_state');
        const commandStr = plot_1.generatePlotCommand(currState.plot.commandInfo);
        // @ts-ignore: context doesn't exist in manager
        const callback = this.model.widget_manager.context._appendCellWithContent;
        if (callback) {
            callback(commandStr);
        }
    }
}
exports.MapCMCView = MapCMCView;
//# sourceMappingURL=widget.js.map
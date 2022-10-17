"use strict";
// Copyright (c) Flynn Platt
// Distributed under the terms of the Modified BSD License.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("@jupyter-widgets/base");
const notebook_1 = require("@jupyterlab/notebook");
const widgetExports = __importStar(require("./widget"));
const version_1 = require("./version");
const EXTENSION_ID = 'ipycmc_jupyter_extension:plugin';
/**
 * The example plugin.
 */
const examplePlugin = {
    id: EXTENSION_ID,
    requires: [base_1.IJupyterWidgetRegistry, notebook_1.INotebookTracker],
    activate: activateWidgetExtension,
    autoStart: true
};
exports.default = examplePlugin;
/**
 * Activate the widget extension.
 */
function activateWidgetExtension(app, registry, notebooks) {
    registry.registerWidget({
        name: version_1.MODULE_NAME,
        version: version_1.MODULE_VERSION,
        exports: widgetExports,
    });
    const appendCellWithContent = (content) => {
        if (notebooks) {
            const current = notebooks.currentWidget;
            if (current) {
                // @ts-ignore: activateById doesn't exist in app.shell
                app.shell.activateById(current.id);
                notebook_1.NotebookActions.insertBelow(current.content);
                notebook_1.NotebookActions.paste(current.content);
                current.content.mode = 'edit';
                // @ts-ignore: could be null
                current.content.activeCell.model.value.text = content;
            }
        }
    };
    // Use a very hacky hack to attach the notebook tracker somewhere the widget can see
    if (notebooks) {
        notebooks.currentChanged.connect(() => {
            // @ts-ignore: missing keys
            const context = notebooks.currentWidget.context;
            // @ts-ignore: missing keys
            if (!context._appendCellWithContent) {
                // @ts-ignore: missing keys
                context._appendCellWithContent = appendCellWithContent;
            }
        });
    }
}
//# sourceMappingURL=plugin.js.map
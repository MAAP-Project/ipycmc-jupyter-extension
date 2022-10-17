"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePlotCommand = void 0;
const moment_1 = __importDefault(require("moment"));
function generatePlotCommand(commandInfo) {
    const { plotType, startDate, endDate, geometry, datasets } = commandInfo;
    return [
        `# Initialize parameter variables`,
        `plotType = "${plotType}"`,
        `startDate = "${moment_1.default(startDate)
            .utc()
            .toISOString()}"`,
        `endDate = "${moment_1.default(endDate)
            .utc()
            .toISOString()}"`,
        `ds = [${datasets.map((l) => '"' + l + '"').join(', ')}]`,
        `geometry = ${JSON.stringify(geometry)}`,
        `# Retrieve the data`,
        `data = ipycmc_jupyter_extension.retrieve_data(plotType, startDate, endDate, ds, geometry)`,
        `# Plot the data`,
        `ipycmc_jupyter_extension.plot_data(plotType, data)`,
    ].join('\n');
}
exports.generatePlotCommand = generatePlotCommand;
//# sourceMappingURL=plot.js.map
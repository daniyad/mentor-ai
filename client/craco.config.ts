import { PyodidePlugin } from "@pyodide/webpack-plugin";

module.exports = {
    webpack: {
        plugins: [new PyodidePlugin({ globalLoadPyodide: true })],
    }
};
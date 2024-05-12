import { loadPyodide, PyodideInterface } from "pyodide";

export class PythonTester {
    private pyodide: PyodideInterface | null = null;
    private outputs: string[] = [];

    constructor(){
        this.initPyodide();
    }

    async initPyodide() {
        try {
            this.pyodide = await loadPyodide({
                indexURL: `${window.location.origin}/pyodide`,
                stdout: (msg: string) => this.outputs.push(msg),
            });
        } catch (error) {
            console.error(`Error loading Pyodide: ${error}`)
        }
    }

    async run(code: string): Promise<any> {
        if (!this.pyodide) {
            throw new Error("Pyodide is not initialized");
        }

        try {
            return await this.pyodide.runPythonAsync(code);
        } catch (error) {
            console.error("Python code execution error:", error);
            throw error;
        }
    }

    async assertUsingStdOut(code: string, expectedOutput: any): Promise<boolean> {
        if(!this.pyodide) {
            throw new Error("Pyodide is not initialized");
        }

        const previousOutputLength = this.outputs.length;
        this.pyodide.runPython(code);

        if (previousOutputLength === this.outputs.length){
            console.log("Python script did not log to STDOUT");
        }

        if (this.outputs.length === 0) {
            console.error("No output to check");
        }
        const actualOutput = this.outputs[this.outputs.length - 1];
        console.log(`result:${actualOutput}, ${expectedOutput}`)

        return actualOutput === expectedOutput;
    } 
}
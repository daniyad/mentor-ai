
export class PythonTester {
    private pyodide: any | null = null;

    constructor() {
        this.initPyodide();
    }

    async initPyodide() {
        this.pyodide = await window.loadPyodide({
            indexUrl: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/"
        });
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

    async assertUsingStdOut(code: string, expected_output: any): Promise<boolean> {
        if(!this.pyodide) {
            throw new Error("Pyodide is not initialized");
        }

        const mainResult = await this.pyodide.runPythonAsync(code);
        return mainResult == expected_output;
    } 

    async assertUsingJson(code: string, expected_json: Object): Promise<boolean> {
        if(!this.pyodide) {
            throw new Error("Pyodide is not initialized");
        }

        const mainResult = await this.pyodide.runPythonAsync(code);

        return mainResult == expected_json;
    }

    async assertUsingPython(code: string, assertions: string): Promise<{ passed: boolean, results: any[] }> {
        if (!this.pyodide) {
            throw new Error("Pyodide is not initialized");
        }

        let results: any[] = [];
        let passed = true;

        try {
            // Run the main code
            const mainResult = await this.pyodide.runPythonAsync(code);

            // Run assertions
            const assertionResults = await this.pyodide.runPythonAsync(`
            import json
            try:
                ${assertions}
                json.dumps({'result': 'success'})
            except AssertionError as e:
                json.dumps({'result': 'failure', 'message': str(e)})
            `);

            const parsedResults = JSON.parse(assertionResults);
            if (parsedResults.result === 'failure') {
                passed = false;
                results.push({
                    assertion: assertions,
                    error: parsedResults.message,
                    success: false
                });
            } else {
                results.push({
                    assertion: assertions,
                    success: true
                });
            }
        } catch (error) {
            console.error("Error while running assertions:", error);
            passed = false;
            results.push({
                assertion: assertions,
                error: error instanceof Error ? error.message : 'Unknown error',
                success: false
            });
        }

        return {
            passed,
            results
        };
    }
}
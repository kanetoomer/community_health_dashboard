const { spawn } = require("child_process");

const runPythonScript = (scriptPath, args = []) => {
  return new Promise((resolve, reject) => {
    // Use PYTHON_CMD from environment if set; otherwise default to "python3"
    const pythonExecutable = process.env.PYTHON_CMD || "python3";
    const pyProc = spawn(pythonExecutable, [scriptPath, ...args]);

    let dataString = "";
    let errorString = "";

    pyProc.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    pyProc.stderr.on("data", (data) => {
      errorString += data.toString();
    });

    pyProc.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(`Python script exited with code ${code}: ${errorString}`)
        );
      }
      try {
        const parsedData = JSON.parse(dataString);
        resolve(parsedData);
      } catch (error) {
        resolve(dataString);
      }
    });
  });
};

module.exports = runPythonScript;

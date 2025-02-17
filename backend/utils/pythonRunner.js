const { spawn } = require("child_process");

const runPythonScript = (scriptPath, args = []) => {
  return new Promise((resolve, reject) => {
    const process = spawn("python3", [scriptPath, ...args]);

    let dataString = "";
    let errorString = "";

    process.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    process.stderr.on("data", (data) => {
      errorString += data.toString();
    });

    process.on("close", (code) => {
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

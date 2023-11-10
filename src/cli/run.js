const cp = require("child_process");
const getNewPort = require("get-port");
const http = require("http");
const servers = require("./servers");
const getCmd = require("../get-cmd");
const daemonConf = require("../conf");

const signals = ["SIGINT", "SIGTERM", "SIGHUP"];

function getPort(id) {
  return new Promise((resolve, reject) => {
    const { host, port } = daemonConf;
    const options = {
      host,
      port,
      path: `/_/servers/${id}/port`,
      method: "GET"
    };
    const req = http.request(options, res => {
      let body = "";
      req.on("error", reject);
      res.on("data", function(chunk) {
        body += chunk;
      });
      res.on("end", () => {
        if (!res.complete) {
          reject(
            new Error("HTTP connection terminated before response complete")
          );
        }
        resolve(body ? parseInt(body, 10) : getNewPort());
      });
    });
    req.on("error", reject);
    req.end();
  });
}

module.exports = {
  // For testing purpose, allows stubbing cp.spawnSync
  _spawnSync(...args) {
    cp.spawnSync(...args);
  },

  // For testing purpose, allows stubbing process.exit
  _exit(...args) {
    process.exit(...args);
  },

  spawn(cmd, opts = {}) {
    const cleanAndExit = (code = 0) => {
      servers.rm(opts);
      this._exit(code);
    };

    const startServer = port => {
      const serverAddress = `http://localhost:${port}`;

      process.env.PORT = port;
      servers.add(serverAddress, { ...opts, port });

      signals.forEach(signal => process.on(signal, cleanAndExit));

      const [command, ...args] = getCmd(cmd);
      const { status, error } = this._spawnSync(command, args, {
        stdio: "inherit",
        cwd: process.cwd()
      });

      if (error) throw error;
      cleanAndExit(status);
    };

    if (opts.port) {
      startServer(opts.port);
    } else {
      getPort(servers.getId(opts))
        .then(startServer)
        .catch(err => {
          throw err;
        });
    }
  }
};

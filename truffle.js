module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 4712388
    },
    staging: {
      host: "10.46.35.61",
      port: 8545,
      network_id: "*",
      gas: 4712388
    },
    production: {
      host: "10.46.35.62",
      port: 8646,
      network_id: "*",
      gas: 4712388
    }
  }
};

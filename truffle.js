module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 4712388
    },
    production: {
      host: "localhost",
      port: 8646,
      network_id: "*",
      gas: 4712388
    }
  }
};

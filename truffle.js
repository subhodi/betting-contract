module.exports = {
  networks: {
    development: {
      host: "10.244.48.83",
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

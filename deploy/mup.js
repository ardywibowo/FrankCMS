module.exports = {
  servers: {
    one: {
      host: 'frankstanford.com',
      username: 'randy',
      pem: "../keys/digitalocean",
      opts: {
          port: 22,
      }
    }
  },

  meteor: {
    name: 'frank-stanford',
    path: '../',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      PORT: 3000,
      ROOT_URL: 'http://frankstanford.com',
      MONGO_URL: 'mongodb://127.0.0.1:27017/meteor'
    },

    dockerImage: 'abernix/meteord:base',
    deployCheckWaitTime: 240
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};

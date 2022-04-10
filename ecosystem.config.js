module.exports = {
  apps : [{
    script: 'server.js',
    watch: '.'
  }, {
  }],

  deploy : {
    production : {
      key: '/Users/rpgpunzalan/Documents/pem/agila.pem',
      user : 'ubuntu',
      host : 'agila.rpinnotech.com',
      ref  : 'origin/master',
      repo : 'git@github.com:rpgpunzalan/arphie-node.git',
      path : '/home/ubuntu/arphie-node',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production --name arphie-node',
    }
  }
};

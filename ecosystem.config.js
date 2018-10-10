
module.exports = {
  apps: [{
    name: "defold-twof-nodejs",
    script: "/root/defold-twof-nodejs/current/index.js",
    instances: 1
  }],
  deploy: {
    // "production" is the environment name
    production: {
      // SSH key path, default to $HOME/.ssh
      key: process.env.HOME+ "/.ssh/id_rsa",
      // SSH user
      user: "root",
      // SSH host
      host: ["128.199.80.90"],
      // SSH options with no command-line flag, see 'man ssh'
      // can be either a single string or an array of strings
      'ssh_options': "StrictHostKeyChecking=no",
      // GIT remote/branch
      ref: "origin/master",
      // GIT remote
      repo: "git@github.com:holyxiaoxin/defold-twof-nodejs.git",
      // path in the server
      path: "/root/defold-twof-nodejs",
      // Pre-setup command or path to a script on your local machine
      'pre-setup': "ls -la",
      // Post-setup commands or path to a script on the host machine
      // eg: placing configurations in the shared dir etc
      'post-setup': "npm install && pm2 start . --name defold-twof-nodejs",
      // pre-deploy action
      'pre-deploy-local': "echo 'This is a local executed command'",
      // post-deploy action
      'post-deploy': "npm install && pm2 reload defold-twof-nodejs",
    },
  }
}

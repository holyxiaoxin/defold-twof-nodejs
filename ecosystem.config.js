
module.exports = {
  apps: [{
    name: "the-war-of-art",
    script: "/root/the-war-of-art/current/index.js",
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
      repo: "git@github.com:holyxiaoxin/the-war-of-art.git",
      // path in the server
      path: "/root/the-war-of-art",
      // Pre-setup command or path to a script on your local machine
      'pre-setup': "ls -la",
      // Post-setup commands or path to a script on the host machine
      // eg: placing configurations in the shared dir etc
      'post-setup': "pm2 start . --name the-war-of-art",
      // pre-deploy action
      'pre-deploy-local': "echo 'This is a local executed command'",
      // post-deploy action
      'post-deploy': "pm2 reload the-war-of-art",
    },
  }
}

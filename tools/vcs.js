#!/usr/bin/env node

const {spawn} = require('child_process');

const [command, site] = process.argv.slice(2);

function runSite(site) {
  let params = `src/sites/${site}/main.js`;
  if (command === 'build') params = `--dest dist/${site} ${params}`;

  const cmd = `vue-cli-service ${command} ${params}`;
  // eslint-disable-next-line no-console
  console.log(cmd);
  spawn(cmd, {
    stdio: 'inherit',
    shell: true
  });
}

if (site) {
  runSite(site);
  return;
}

const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const inquirer = require('inquirer');

const sites = fs.readdirSync(path.join(__dirname, '../src/sites'));
inquirer
  .prompt([
    {
      type: 'list',
      name: 'site',
      message: `Which game will you ${command}?`,
      choices: sites
    }
  ])
  .then(({site}) => runSite(site));

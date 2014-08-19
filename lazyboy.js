#!/usr/bin/env node


/*
 * lazyboy - Command line laziness redefined!
 * http://arvindr21.github.io/lazyboy
 *
 * Copyright (c) 2014 Arvind Ravulavaru
 * Licensed under the MIT license.
 */


var program = require('commander');
var shell = require('shelljs');
var fs = require('fs');
var colors = require('colors');
var file = '.cdb';


program
  .version('lazyBoy v0.0.1'.green)
  .option('-a, --add [command -> shortcut]', 'Enter a command that you would like to shortcut.', 'null')
  .option('-r, --remove [shortcut]', 'Enter the shortcut to be removed from the saved commands.', 'null')
  .option('-x, --execute [shortcut]', 'Enter the shortcut to run the saved command.', 'null')
  .option('-p, --print', 'Prints the list of saved shortcuts')
  .option('-i, --import [commands]', 'Imports the commands that was exported from another Lazyboy collection', 'null')
  .option('-e, --export', 'Exports all the commands in your Lazyboy collection');


program.on('--help', function() {
  shell.echo('  ' + 'Example Usage:'.underline);
  shell.echo('');
  shell.echo('  > Add new command and its shortcut'.blue);
  shell.echo('    $ lb -a "git init -> gi"'.green);
  shell.echo('  > Execute a shortcut'.blue);
  shell.echo('    $ lb -x "gi"'.green);
  shell.echo('  > Print saved shortcuts'.blue);
  shell.echo('    $ lb -p'.green);
  shell.echo('  > Remove a shortcut'.blue);
  shell.echo('    $ lb -r "gi"'.green);
  shell.echo('  > Export your Lazyboy shortcuts'.blue);
  shell.echo('    $ lb -e'.green);
  shell.echo('  > import Lazyboy shortcuts'.blue);
  shell.echo('    $ lb -i \'[{"command":"git init","shortcut":"gi"},{"command":"ls -ltr","shortcut":"l"}]\''.green);
  shell.echo('');
});

program.parse(process.argv);


if (!fs.existsSync(file)) {
  fs.writeFileSync(file, '[]');
}

if (program.rawArgs.length == 2) {
  shell.echo('Please enter valid argumets'.red);
  program.help();
}

if (program.add && program.rawArgs.indexOf('-a') > 0) {
  var _a = program.add;
  if (_a == 'null') {
    shell.echo('Please enter a valid command.'.red);
    helpAdd();
  } else {
    if (_a.indexOf('->') > 0) {

      var _c = JSON.parse(fs.readFileSync(file)),
        _o = {
          command: _a.split('->')[0].trim(),
          shortcut: _a.split('->')[1].trim()
        };

      if (checkDuplicate(_c, _o)) {
        _c.push(_o);

        fs.writeFileSync(file, JSON.stringify(_c, null, 0));
        shell.echo('A new entry has been successfully added'.green);
        _print(_c);
      }


    } else {
      shell.echo('You need separate the command and shortcut with a "->"'.red);
      helpAdd();
    }
  }
}

if (program.remove && program.rawArgs.indexOf('-r') > 0) {
  var _r = program.remove;
  if (_r == 'null') {
    shell.echo('Please enter a valid command.'.red);
    helpRemove();
  } else {
    var _c = JSON.parse(fs.readFileSync(file)),
      deleted = false;
    for (var i = 0; i < _c.length; i++) {
      if (_c[i]['shortcut'] == _r) {
        _c.splice(i, 1);
        if (_c.length == 0) {
          fs.writeFileSync(file, '[]');
          shell.echo('The shortcut has been successfully deleted'.green);
          shell.echo('There are no commands in your Lazyboy collection.'.magenta);
        } else {
          fs.writeFileSync(file, JSON.stringify(_c, null, 0));
          shell.echo('The shortcut has been successfully deleted'.green);
          _print(_c);
        }
        deleted = true;
        return;
      }
    };

    if (!deleted)
      shell.echo('No Matching shortcut found'.red);
  }
}

if (program.rawArgs[2] != '-x' && program.rawArgs[2] != '-p' && program.rawArgs[2] != '-e' && program.rawArgs[2] != '-i' && program.rawArgs[2] != '-a' && program.rawArgs[2] != '-r') {
  executeCommand(program.rawArgs[2], '0');
}

if (program.execute && program.rawArgs.indexOf('-x') > 0) {
  executeCommand(program.execute, '1');
}

if (program.export) {
  shell.echo(fs.readFileSync(file, 'utf-8'));
}

if (program.import && program.rawArgs.indexOf('-i') > 0) {
  var _i = program.import;
  if (_i == 'null') {
    shell.echo('Please enter a valid export data.'.red);
    helpImport();
  } else {
    try {
      var _ij = JSON.parse(_i),
        _c = JSON.parse(fs.readFileSync(file)),
        added = _c.length;

      _c = unique(_c.concat(_ij));
      added = _c.length - added;

      if (added > 0) {
        fs.writeFileSync(file, JSON.stringify(_c, null, 0));
        shell.echo(added + ' shortcuts have been merged with your Lazyboy collection'.green);
        _print(_c);
      } else {
        shell.echo(added + ' shortcuts have been merged with your Lazyboy collection'.magenta);
      }

    } catch (err) {
      shell.echo('Invalid export data.'.red, err);
      helpImport();
    }
  }
}

if (program.print) {
  var commands = JSON.parse(fs.readFileSync(file));
  _print(commands);
}

function _print(commands) {
  if (commands.length > 0) {
    var op = '';
    for (var i = 0; i < commands.length; i++) {
      op += '\t' + commands[i].shortcut.green + ' \t ' + commands[i].command.blue + '\n'
    };
    shell.echo('List of saved commands : \n'.magenta);
    shell.echo('\tShortcut\tCommand'.grey);
    shell.echo(op);
  } else {
    shell.echo('There are no commands in your Lazyboy collection.'.magenta);
    helpAdd();
  }
}

function helpAdd() {
  shell.echo('');
  shell.echo('  > Add new command and its shortcut'.blue);
  shell.echo('    $ lb -a "git init -> gi"'.green);
}

function helpRemove() {
  shell.echo('');
  shell.echo('  > Remove a shortcut'.blue);
  shell.echo('    $ lb -r "gi"'.green);
}

function helpImport() {
  shell.echo('  > import Lazyboy shortcuts'.blue);
  shell.echo('    $ lb -i \'[{"command":"git init","shortcut":"gi"},{"command":"ls -ltr","shortcut":"l"}]\''.green);
}

function executeCommand(_x, _m) {
  if (_x == 'null') {
    shell.echo('Please enter a valid shortcut to execute'.red);
    shell.echo('To see a list of saved shortcuts, run '.blue);
    shell.echo('    $ lb -p'.green);
  } else {
    var _c = JSON.parse(fs.readFileSync(file)),
      command;
    for (var i = 0; i < _c.length; i++) {
      if (_c[i]['shortcut'] == _x) {
        command = _c[i]['command']
      }
    };
    if (command) {
      var msg = 'Executing "' + command + '"...';
      shell.echo(msg.green);
      if (command.indexOf('*') > 0) {
        if (_m == "1") {
          command = processCommand(command, 4);
        } else {
          command = processCommand(command, 3);
        }
        shell.exec(command);
      } else {
        shell.exec(command);
      }
    } else {
      shell.echo('The entered shortcut is not saved yet!'.red);
      helpAdd();
    }
  }
}

function checkDuplicate(_c, _o) {
  for (var i = 0; i < _c.length; i++) {
    if (_c[i]['command'] == _o['command'] || _c[i]['shortcut'] == _o['shortcut']) {
      shell.echo('An entry already exists with the given command or shortcut'.red);
      _print(_c);
      return false;
    }
  };
  return true;
}

function processCommand(command, _c) {

  if (program.rawArgs.length > _c && command.match(/\*/g).length + _c == program.rawArgs.length) {
    var _d = command.split('*').filter(function(e) {
      return e
    });
    command = '';
    for (var i = 0, j = _c; i < _d.length; i++) {
      command += _d[i];
      var _t = program.rawArgs[j++]
      if (_t) {
        command += "\"" + _t + "\"";
      }
    };
    return command;
  } else {
    shell.echo('Please enter valid data for the arguments'.red);
    shell.echo('    $ ' + command.blue);
    return false;
  }
}

function unique(obj) {
  var uniques = [];
  var stringify = {};
  for (var i = 0; i < obj.length; i++) {
    var keys = Object.keys(obj[i]);
    keys.sort(function(a, b) {
      return a - b
    });
    var str = '';
    for (var j = 0; j < keys.length; j++) {
      str += JSON.stringify(keys[j]);
      str += JSON.stringify(obj[i][keys[j]]);
    }
    if (!stringify.hasOwnProperty(str)) {
      uniques.push(obj[i]);
      stringify[str] = true;
    }
  }
  return uniques;
}

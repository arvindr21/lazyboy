# lazyboy [![NPM version](https://badge-me.herokuapp.com/api/npm/lazyboy.png)](http://badges.enytc.com/for/npm/lazyboy) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/arvindr21/lazyboy/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[![NPM](https://nodei.co/npm/lazyboy.png?downloads=true&stars=true)](https://nodei.co/npm/lazyboy/)

#### > _Command line laziness redefined!_

The sole purpose of `lazyboy` (_a.k.a `lb`_) is to make you more lazier when dealing with CLI. How many times did you type `got init` instead of `git init` and the "smart" CLI corrects you!

But what if you had a shortcut say `i` to run `git init` everytime?? would'nt that be convinent? 

So, here is a CLI that does exatcly the same for you!! 

##Contents

* [Installation](#installation)
* [Options](#options)
* [Documentation](#documentation)

## Installation
Install the module globally :  
```bash
$ npm install -g lazyboy
```
## Options
```bash
Usage: lb [options]

Options:

    -h, --help                       output usage information
    -V, --version                    output the version number
    -a, --add [command -> shortcut]  Enter a command that you would like to shortcut.
    -r, --remove [shortcut]          Enter the shortcut to be removed from the saved commands.
    -x, --execute [shortcut]         Enter the shortcut to run the saved command.
    -p, --print                      Prints the list of saved shortcuts
    -i, --import [commands]          Imports the commands that was exported from another Lazyboy collection
    -e, --export                     Exports all the commands in your Lazyboy collection

  Example Usage:

  > Add new command and its shortcut
    $ lb -a "git init -> gi"
  > Execute a shortcut
    $ lb -x "gi"
  > Print saved shortcuts
    $ lb -p
  > Remove a shortcut
    $ lb -r "gi"
  > Export your Lazyboy shortcuts
    $ lb -e
  > import Lazyboy shortcuts
    $ lb -i '[{"command":"git init","shortcut":"gi"},{"command":"ls -ltr","shortcut":"l"}]'
```

## Documentation
### Adding and Executing shortcuts
You can add a new shortcut by running 
```bash
$ lb -a "git init -> i"
```
do notice the `->`. The left hand side of `->` is the command and the right hand side part is the shortcut.

_PS : You can name your shortcut charcters, numbers, etc.._

Now, you can execute the command by running
```bash
$ lb -x i
```
or 
```bash
$ lb i
```

Simple right??

Another example. Do you use the Python's `SimpleHTTPServer` module to launch a new static server? And you have to type 
```bash
$ python -m SimpleHTTPServer

```
or
```bash
$ python -m http.server
```

You can create an alias like 
```bash
$ lb -a "python -m SimpleHTTPServer -> ps"
```
and you can run the below command in the folder where you want to spwan the HTTP server
```bash
$ lb -x ps
```
or 
```bash
$ lb ps
```
Sweet right? And the best thing is, this module is language agnositic. It can store any command line statements as shortcuts!

You can also add dynamic commands like 
```bash
$ lb -a "git commit -m * -> c"
```
here `*` is the placeholder. And you can execute the command like 
```bash
$ lb -x c "Initial Commit"
```
or 
```bash
$ lb c "Initial Commit"
```
This will run  `git commit -m "Initial Commit"` for you.

And if you are like me creating new repos and pushing them to Github, you must have this shortcut 

```bash
$ lb -a "git init && git add -A && git commit -m * && git remote add origin * && git push origin master -> r"
```

And then the next time when you want to initialize and push the current folder to Github all you need to do is 

```bash
 $ lb r "inital commit" "https://github.com/arvindr21/lb.git"
 ```
And bam!!! You code will be initialized, staged, commited locally and pushed to Github! 

_PS : The order of arguments in the actual command should match with the arguments while using `lazyboy`_ 
### Prinitng shortcuts
Running 
```bash
 $ lb -p
 ```

will list all the shortcuts you have saved so far 
```bash
List of saved commands :

	Shortcut	Command
	i 	 git init
	r 	 git init && git add -A && git commit -m * && git remote add origin * && git push origin master
```

### Removing shortcuts
If you want to remove any shortcuts, you can run
```bash
$ lb -r i
 ```
where `i` is the name of the shortcut. 

### Importing & Exporting shortcuts
You can export your saved shortcuts and then share them with your near and dear ones! All you need to do is run
```bash
$ lb -e
```
And you can share the output
```bash
$ lb -e
[{"command":"git init","shortcut":"i"},{"command":"git init && git add -A && git commit -m * && git remote add origin * && git push origin master","shortcut":"r"}]
```

And you can import the same using

```bash
$ lb -i '[{"command":"git init","shortcut":"i"},{"command":"git init && git add -A && git commit -m * && git remote add origin * && git push origin master","shortcut":"r"}]'
```

Do notice the single quotes before and after the JSON.

## Contributing
See the [CONTRIBUTING Guidelines](https://github.com/arvindr21/lazyboy/blob/master/CONTRIBUTING.md)

## License
Copyright (c) 2014 Arvind Ravulavaru. Licensed under the MIT license.

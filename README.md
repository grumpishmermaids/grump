
##**What is a Grump?**
A Grump is any task or set of tasks you want to be able to run with a single command from your terminal. 
__________________

##**What is Grump?**


Grump is a command line utility for Mac that enables the saving and sharing of simple node and bash scripts (i.e. Grumps). Grump enables you to run your favorite scripts on any machine with an internet connection. Additionally with the ability to dynamically set variables at run time, sharing scripts between people is easy.

**tl;dr** the inspiration came from this chart (courtesy [XKCD](http://xkcd.com)):
![XKCD Automation](http://imgs.xkcd.com/comics/is_it_worth_the_time.png)


**IF YOU CAN'T SHARE** This is a good chart- that accurately describes the reality of task automation

**IF YOU CAN SHARE** it is a bad chart. Every additional person that can use the automation increases the net time saved: ipso facto we enabled sharing the automation, maybe someday we will remake this chart in 3d.


__________________________

##**How do I use Grump to run Grumps?**
Grump is currently an [NPM module](http://npmjs.com). Get Grumpy by running ```$ npm install grump -g``` (requires npm to be installed)

Once you have Grump installed it's a simple as ```$ grump <grump_command>``` in the terminal.

If there are multiple Grumps by the same name you will be prompted to select which Grump you want to install on your machine. This will then be the default Grump run by that particular command -- to use other Grumps by the same name, type in ```<owner>/<grump_command>``` and Grump will run that one.

Grump will then prompt you for variables.

Have fun, get Grumpy! 

__________________________

##**How do I find Grumps to use?**
GrumpJS.com has our full library of available grumps-- we are actively working to improve the explore Grumps feature.

__________________________

##**How do I turn my node and bash scripts into Grumps?**
1. Be sure to include a grump.json (see grump.json)
2. Ensure that any user input you will want on initialization or at runtime follows our convention (see variables)
3. Host your Grump on github in a public repo
4. Go to our upload page at GrumpJS.com
5. Upload your grump
6. Test it out (if you need to delete it you can always login with github and remove it from our library)

##**How do I write a grump?**
1. follow our grump conventions (*note that Grump currently only support scripts written in node and bash-- but cannot install requirements for node files-- so anything required beyond Node’s core modules will not work.*)
2. upload your grump on grumpJS.com



__________________________




##**Grump Conventions:**

#####**1. All your code is hosted in a public github repo**

####**2. Your repo includes a grump.json in the root directory**
  **a.** Reference our grump template (below)

  **b.** The grump.json file must include the following fields:
  * i. **defaultCommand** (i.e. what the user types in, another key for each command (including defaultCommand) 
  * ii. **scriptType:** “bash” or “node”. 
  * iii. **scriptPath:** the path of the file you want us to run when the command is entered (path is relative to the root directory).

####**3. Variables are named using the convention ```Grump_<var>```***
**a.**. Grump will prompt the user for every variable included in the grump.json and in your script that follows the convention ```Grump_<var>```.

**b.**  to include variables in grump.json
include a “vars” object: for each variable create an object in the vars object with a persist property (either true or false) -- see below for explanation of variable types.

**c.** Variables can be of two types:
* i. **Persisting Variables:** are set the first time the script is run, and never again. (e.g. connection      strings to your. 
* ii. **Non-Persisting variables:** are set each time the script is run. (e.g. passwords you dont want to store)

##**Grump.json template:**
```
{
  "defaultCommand": "<defaultCommand>",
  "commands": {
    "<defaultCommand>": {
      "scriptType": "<node || bash>",
      "scriptPath": "<path of file to run when script is invoked>",
      "vars": {
        "<name of var1>": {
          "persist": true
        },
        "<name of var2>": {
          "persist": false
        }
      }
    }
  }
}
```

> Written with [StackEdit](https://stackedit.io/).

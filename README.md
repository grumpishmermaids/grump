# grump
Find, use, and share useful actions from the command line

## grump.json - the one stop info shop for any given grump ##
*OBJECTIVE: use a single grump.json file (or json object in a database in the case of the server) as a one-stop shop for all information related to a single grump command/repo*

*REASON: avoid complexity of having bits and pieces of info stored in multiple locations and formats*

##### Our server, the command’s github repo, and the user’s library may have different versions of this grump.json object. #####
REASON/RULE: Information grows with each step.

1) The server contains a minimum amount of data (which it stores in its own database, and serves to client requests for info). This data is (at minimum):
```
{
	"author": (github handle),
	"defaultCommand": (e.g. helloworld),
	"repo": (github repo)
}
```

2) The github repo contains a grump.json file (which the script write must for now build off of a template). It contains more required fields:
```
{
	"author": "keitharm",
	"repo": "https://github.com/keitharm/myGrump",
	"defaultCommand": "helloWorld",
	//"npmDependencies": "false",  //optional automatic npm install for nodejs scripts with a package.json, not necessary for mvp
	"subcommands": {
		"helloWorld": {
			"scriptType": "bash",
			"scriptPath": "hello_world.sh"
		},
		"goodbyeWorld: {
			"scriptType": "nodejs",
			"scriptPath": "goodbyeWorld.js"
		}
	},
	"SOME OTHER THINGS KEITH ADDS FOR VARIABLE HANDLING": {
	}
}
```

3) User gets full version of repo’s grump.json at clone time. User MAY modify their own grump.json when setting configs, depending on how Keith implements that.
```
{
	"author": "keitharm",
	"repo": "https://github.com/keitharm/myGrump",
	"defaultCommand": "helloWorld",
	//"npmDependencies": "false",  //optional automatic npm install for nodejs scripts with a package.json, not necessary for mvp
	"subcommands": {
		"helloWorld": {
			"scriptType": "bash",
			"scriptPath": "hello_world.sh"
		},
		"goodbyeWorld: {
			"scriptType": "nodejs",
			"scriptPath": "goodbyeWorld.js"
		}
	},
	"SOME OTHER THINGS KEITH ADDS FOR VARIABLE HANDLING": {
	},
	"SOME OTHER OTHER THINGS KEITH MAY ADD (OR NOT) FOR LOCAL CONFIGURATION SAVING": {}
}
```

At any step, old grump.json version is modified (either merge or overwrite, not decided yet) by new grump.json version.

*RULE: As long as flow is always 1 -> 2 -> 3, we never have problems.* Information in grump.json only grows.

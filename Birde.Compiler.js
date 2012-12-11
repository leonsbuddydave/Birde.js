/**
* This is where madness returns. This is a loose prototype of a small compiler
* designed to concatenate Event functions without compromising their scope.
* Dedicated to Logan Meers - may its source be printed on his tombstone.
*
* None of this is currently documented, in an attempt to protect the innocent.
*/
var Compiler = function()
{
	this.functions = [];

	this.compiledFunction = function(){}

	for (var key in arguments)
	{
		this.functions.push(arguments[key].toString());
	}

	this.cleanAll = function()
	{
		var i = 0;
		while (i < this.functions.length)
		{
			this.functions[i] = this.cleanFunction(this.functions[i]);
			i++;
		}
	}

	this.cleanFunction = function(f)
	{
		return f
			.replace(/function[\s]*\([\w+]*\)[\s]*\{/gi, '')
			.replace(/[\s]*\}[\s]*$/g, '');
	}

	this.compileFunctions = function()
	{
		this.cleanAll();
		var concatFunctions = "";

		var i = 0;
		while (i < this.functions.length)
		{
			concatFunctions += "(function() {" + this.functions[i] + "})();";
			i++;
		}

		this.compiledFunction = eval("(function(){" + concatFunctions + "})");

		return this.compiledFunction;
	}

	this.add = function(f)
	{
		var e = this.cleanFunction( f.toString() );
		this.functions.push( e );

		var fstr = this.compiledFunction.toString();

		var result = "(" + fstr.substr(0, fstr.lastIndexOf("}")) + "(function(){" + e + "})();})";

		this.compiledFunction = eval( result );
	}

	this.compileFunctions();
}
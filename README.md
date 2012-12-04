Lightweight Readme:

Birde Engine is designed for making HTML5/Canvas applications easier to produce using easy methods that should already be familiar to JQuery users.

I'll be populating the /examples folder as time goes on, but here's a summary:

Every active object in Birde is called an Actor - Actors can hold attributes, have methods bound to them, trigger events, catch events, etc.

Actors are manipulated through ActorGroups returned by using CSS-style selectors (much like JQuery). Since Actors have IDs and can hold multiple classes, 
the syntax might be very familiar:

////////////////////////////////////////////////////////////////////

```javascript
B("#test0")
```
returns an ActorGroup containing one Actor with the ID of "test0".

```javascript
B(".testClass")
```
returns objects that have the class "testClass".

```javascript
B(".testClass .otherClass")
```
returns objects that have both classes.

```javascript
B(".testClass, .otherClass")
```
returns objects that have either class or both classes.
(any number of selectors can be separated by commas and the end result will be combined)

```javascript
B("#test0 > .testClass")
```
returns only Actors of class "testClass" that are direct descendents of "#test0".

```javascript
B(".testClass[someAttribute]")
```
returns "testClass" objects that have "someAttribute" defined, regardless of value.

```javascript
B(".testClass[x=200]")
```
gets all Actors of class "testClass" that have the attribute "x" set to "200".

```javascript
B() or B("*")
```

returns the entire scenegraph.

////////////////////////////////////////////////////////////////////

Operations can be performed on any selector and be applied to everything inside it. For example:

```javascript
B(".testClass").attr("x", 200);
```

will move all instances of "testClass" to "x = 200".

Birde also supports method chaining for methods that don't support an explicit value:

```javascript
B(".testClass")
	.attr("x", 200)
	.find(".otherClass")
	.bind("step", function()
	{
		// called on the step function
	});
```


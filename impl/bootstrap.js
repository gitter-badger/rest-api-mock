function storyFile(cwd, story) {
    return (cwd + "/usecases/" + story + ".json");
}

function loadStory( cwd, story ) {
    var jsonfile = require('jsonfile');

    var file = storyFile(cwd, story);

    var rval = jsonfile.readFileSync(file);
    console.log("Story loaded: " + ( rval ? "yes" : "no" ));

    return rval;
}

/**
 *
 * supports this format:
 * ----------------------------------------
 * {
    "on" : {
      "name": "endpoint-1",
      "description": "simple get example to create an get-endpoint",

      "endpoint": {
        "method": "get",
        "pattern": "/item/:id",
        "path": "/item/5"
      },

      "log": true
    },

    "action" : "simple-success-action"
  }
 */
function setupUsecase(server, root, actions, usecase) {
    console.log( ".. setup usecase: " + usecase.name);

    // currently only strings supported.
    var file;

    if( usecase.action ) {
        var S = require( "string" );
        var rel = S( actions ).replaceAll('*', usecase.action).s;

         var path = require( "path" );

         console.log( ">>> relative path."  );
         console.log( "... root: " + root );
         console.log( "... rel: " + rel );

         file = (path.dirname(root) + "/" + rel);
         // file = path.resolve ... relative(root, rel));
         // file = path.resolve();
    } else
        throw "Not supported";

    var js = require( file );
    var jsDef = js.apply();

    server.on(usecase.on).response(jsDef.args, jsDef.call);

    console.log( ">>>> jsDef.call : " + jsDef.call)
}

module.exports = function(build, config, cwd, story) {
    var Server = require("../server.js" );
    var server = new Server(config);

    if( story ) {
        var sf = storyFile(cwd, story);
        var loaded = loadStory(cwd, story);

        var actionsPattern = loaded.actions;
        var cases = loaded.story;

        var _ = require( 'underscore' );
        _.each( cases, function( usecase ) {
            setupUsecase(server, sf, actionsPattern, usecase); // server, storyfile, actions, usecase
        });
    }

    server.start();
};
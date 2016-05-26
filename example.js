/**
 * Simple example how to use the rest-api-mock.
 *
 * @author asiebert (aka drdrej)
 */

// import api:
var Server = require("./server.js" );

// creates a server instance
var server = new Server({
    name: "example"
});

server.on({
    name: "mock-get-function",
    description: "response json, generated by function",

    endpoint : {
        method: "get",
        pattern: "/item/:id",
        path: "/item/1"
    },

    log: true
}).response(
    function () {
        return {
            success: true
        };
    });

server.on({
    name: "mock-get-function-with-params",
    description: "response json, generated by function, with injected params",

    endpoint : {
        method: "get",
        pattern: "/item/:id",
        path: "/item/2"
    },

    log: true
}).response(
    ["json:///json/path",
     "query://param1",
     "path://id"],

    function ( p1, p2, p3 ) {
        return {
            success: true,
            values: "custom",
            p1: p1,
            p2: p2,
            p3: p3
        };
    });

server.on({
    name: "mock-get-json",
    description: "response custom json.",

    endpoint : {
        method: "get",

        pattern: "/item/:id",
        path: "/item/3"
    },

    log: true
}).ok({
    "success" : true,
    "buildBy" : "mock-get-json"
});


server.on({
    name: "err-example",
    description: "...",

    endpoint : {
        method: "get",
        pattern: "/err/:id", // TODO: maybe move to specs! here only usecase!!! match later...
        path: "/err/1"
    },

    log: true
}).error( 404 /*"error message xyz"*/ );

server.on({
    name: "err-example-2",
    description: "error with message",

    endpoint : {
        method: "get",
        pattern: "/err/:id", // TODO: maybe move to specs! here only usecase!!! match later...
        path: "/err/2"
    },

    log: true
}).error( 404, "This request is broken" );

server.on({
    name: "err-example-3",
    description: "error with message",

    endpoint : {
        method: "get",
        pattern: "/err/:id", // TODO: maybe move to specs! here only usecase!!! match later...
        path: "/err/3"
    },

    log: true
}).error( 404, {
    success: false,
    customMsg: "This request is broken"
} );


server.on({
    name: "yyyy",
    description: "dasdasdasd",

    endpoint : {
        method: "get",
        pattern: "/fwd/:id", // TODO: maybe move to specs! here only usecase!!! match later...
        path: "/fwd/1"
    },

    log: true
}).forward( "http://localhost:8383/item/5" );


server.start();

const Container = require('./lib/container.js');
let container = new Container();

function _test(name) {
  return function() {
    console.log("load " + name);
  }
}

container.module("a", _test("aClass"), ["b", "c"]);
container.module("b", _test("bClass"), ["c"]);
container.module("c", _test("cClass"));
container.module("d", _test("dClass"), ["g"]);
container.module("g", _test("gClass"), ["c"]);
container.activate(['production']);



import {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} from 'tapable'

class List {
  getRoutes() { }
}
class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(["newSpeed"]),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"])
    };
  }
  /**
  * You won't get returned value from SyncHook or AsyncParallelHook,
  * to do that, use SyncWaterfallHook and AsyncSeriesWaterfallHook respectively
 **/

  setSpeed(newSpeed) {
    // following call returns undefined even when you returned values
    this.hooks.accelerate.call(newSpeed);
  }

  useNavigationSystemPromise(source, target) {
    const routesList = new List();
    return this.hooks.calculateRoutes.promise(source, target, routesList).then((res) => {
      // res is undefined for AsyncParallelHook
      return routesList.getRoutes();
    });
  }

  useNavigationSystemAsync(source, target, callback) {
    const routesList = new List();
    this.hooks.calculateRoutes.callAsync(source, target, routesList, err => {
      if (err) return callback(err);
      callback(null, routesList.getRoutes());
    });
  }
}

// 注册
const myCar = new Car();
myCar.hooks.accelerate
  .tap("LoggerPlugin", newSpeed => console.log(`Accelerating to ${newSpeed}`));
myCar.hooks.calculateRoutes.tapPromise("GoogleMapsPlugin", (source, target, routesList) => {
  // return a promise
  // return google.maps.findRoute(source, target).then(route => {
  //   routesList.add(route);
  // });
  console.log('---------tabPromise', source, target, routesList)
});

myCar.setSpeed(10)
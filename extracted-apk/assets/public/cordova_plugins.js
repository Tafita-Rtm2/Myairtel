
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "cordova-plugin-app-update.AppUpdate",
          "file": "plugins/cordova-plugin-app-update/www/AppUpdate.js",
          "pluginId": "cordova-plugin-app-update",
        "clobbers": [
          "AppUpdate"
        ]
        },
      {
          "id": "cordova-plugin-appversion.RareloopAppVersion",
          "file": "plugins/cordova-plugin-appversion/www/app-version.js",
          "pluginId": "cordova-plugin-appversion",
        "clobbers": [
          "AppVersion"
        ]
        },
      {
          "id": "cordova-plugin-inappbrowser.inappbrowser",
          "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
          "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
          "cordova.InAppBrowser.open"
        ]
        },
      {
          "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
          "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
          "pluginId": "phonegap-plugin-barcodescanner",
        "clobbers": [
          "cordova.plugins.barcodeScanner"
        ]
        },
      {
          "id": "cordova-plugin-screen-orientation.screenorientation",
          "file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
          "pluginId": "cordova-plugin-screen-orientation",
        "clobbers": [
          "cordova.plugins.screenorientation"
        ]
        },
      {
          "id": "es6-promise-plugin.Promise",
          "file": "plugins/es6-promise-plugin/www/promise.js",
          "pluginId": "es6-promise-plugin",
        "runs": true
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "cordova-plugin-app-update": "2.0.2",
      "cordova-plugin-appversion": "1.0.0",
      "cordova-plugin-inappbrowser": "4.1.0",
      "cordova-plugin-screen-orientation": "3.0.2",
      "es6-promise-plugin": "4.2.2",
      "phonegap-plugin-barcodescanner": "8.1.0"
    };
    // BOTTOM OF METADATA
    });

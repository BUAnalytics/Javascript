(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//Modules
var popsicle = __webpack_require__(7);
//Includes
var BUError_1 = __webpack_require__(2);
var BUMethod;
(function (BUMethod) {
    BUMethod[BUMethod["GET"] = 0] = "GET";
    BUMethod[BUMethod["POST"] = 1] = "POST";
    BUMethod[BUMethod["PUT"] = 2] = "PUT";
    BUMethod[BUMethod["DELETE"] = 3] = "DELETE";
    BUMethod[BUMethod["PATCH"] = 4] = "PATCH";
    BUMethod[BUMethod["OPTIONS"] = 5] = "OPTIONS";
    BUMethod[BUMethod["HEAD"] = 6] = "HEAD";
})(BUMethod = exports.BUMethod || (exports.BUMethod = {}));
var BUAPI = (function () {
    function BUAPI() {
        this.url = 'https://bu-games.bmth.ac.uk';
        this.path = '/api/v1';
    }
    Object.defineProperty(BUAPI.prototype, "hostPrefix", {
        //URL prefix for HTTP requests
        get: function () {
            return (this.url || '') + (this.path || '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BUAPI, "instance", {
        get: function () { return this._instance || (this._instance = new this()); },
        enumerable: true,
        configurable: true
    });
    //! Request Methods
    //Convenience methods for url and path appended requests
    BUAPI.prototype.requestPath = function (path, method, body, error, success) {
        return this.makeRequestWrap(this.hostPrefix + path, method, body, error, success);
    };
    //Convenience methods for url appended requests
    BUAPI.prototype.requestUrl = function (url, method, body, error, success) {
        return this.makeRequestWrap(this.url + url, method, body, error, success);
    };
    //Wrap generic request in a promise if closers were not specified
    BUAPI.prototype.makeRequestWrap = function (url, method, body, error, success) {
        var _this = this;
        if (error !== undefined || success !== undefined) {
            this.makeRequest(url, method, body, error, success);
        }
        else {
            //Create and return promise
            return new Promise(function (resolve) {
                _this.makeRequest(url, method, body, function (error) {
                    throw error;
                }, function (respose) {
                    resolve(respose);
                });
            });
        }
    };
    //Make a generic request to the backend server url, response is sent to error and success closures
    BUAPI.prototype.makeRequest = function (url, method, body, error, success) {
        //Create request object
        var request = {
            method: BUMethod[method],
            url: url, body: body,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        };
        //Authenticate request with access key and secret
        if (this.auth !== undefined) {
            request.headers['AuthAccessKey'] = this.auth.key;
            request.headers['AuthAccessSecret'] = this.auth.secret;
        }
        //Execute http request
        popsicle.request(request)
            .then(function (response) {
            //Check whether response contains error message
            if (response.hasOwnProperty('error') && error !== undefined) {
                var code = BUError_1.BUError[BUError_1.BUError[response.error]];
                if (typeof code !== undefined) {
                    error(code);
                }
                else {
                    error(BUError_1.BUError.Unknown);
                }
                return;
            }
            //Return the successful json object
            if (success !== undefined) {
                success(response.body);
            }
        })
            .catch(function (err) {
            //Check error code
            if (error !== undefined) {
                if (err.code === 'EUNAVAILABLE') {
                    error(BUError_1.BUError.NotFound);
                }
                else if (err.code === 'ESTRINGIFY' || err.code === 'EPARSE') {
                    error(BUError_1.BUError.Json);
                }
                else {
                    error(BUError_1.BUError.Server);
                }
            }
        });
    };
    return BUAPI;
}());
exports.BUAPI = BUAPI;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BUAPI_1 = __webpack_require__(0);
var BUCollection = (function () {
    function BUCollection(name) {
        //Document properties, sending data is moved from documents to buffer
        this.documents = [];
        this.buffer = [];
        this.name = name;
    }
    Object.defineProperty(BUCollection.prototype, "isUploading", {
        //Check whether any documents exist and if any are being uploaded
        get: function () { return this.buffer.length > 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BUCollection.prototype, "isEmpty", {
        get: function () { return this.documents.length <= 0; },
        enumerable: true,
        configurable: true
    });
    //Add single or multiple documents to collection
    BUCollection.prototype.push = function (document) {
        if (this.documents instanceof Array) {
            this.documents = this.documents.concat(document);
        }
        else {
            this.documents.push(document);
        }
    };
    //Upload pending documents to backend server
    BUCollection.prototype.upload = function (error, success) {
        var _this = this;
        if (error !== undefined || success !== undefined) {
            this.makeUpload(error, success);
        }
        else {
            //Create and return promise
            return new Promise(function (resolve) {
                _this.makeUpload(function (error) {
                    throw error;
                }, function (count) {
                    resolve(count);
                });
            });
        }
    };
    BUCollection.prototype.makeUpload = function (error, success) {
        var _this = this;
        //Make sure there are documents available and is not already uploading
        if (this.isUploading || this.isEmpty) {
            return;
        }
        //Move documents to buffer
        this.buffer = this.buffer.concat(this.documents);
        this.documents = [];
        //Convert documents to objects list
        var objects = [];
        for (var _i = 0, _a = this.buffer; _i < _a.length; _i++) {
            var document_1 = _a[_i];
            objects.push(document_1.contents);
        }
        //Upload data to server using api request
        var body = { 'documents': objects };
        BUAPI_1.BUAPI.instance.requestPath('/projects/collections/' + this.name + '/documents', BUAPI_1.BUMethod.POST, body, function (code) {
            //Log error code
            console.log('[BUAnalytics][' + _this.name + '] Failed to push ' + _this.buffer.length + ' documents to server with error code ' + code);
            //Move buffer back to documents list
            _this.documents = _this.documents.concat(_this.buffer);
            _this.buffer = [];
            //Notify error
            if (error !== undefined) {
                error(code);
            }
        }, function (response) {
            //Notify success
            if (success !== undefined) {
                success(_this.buffer.length);
            }
            //Remove buffer contents
            _this.buffer = [];
        });
    };
    return BUCollection;
}());
exports.BUCollection = BUCollection;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BUError;
(function (BUError) {
    //! Core,
    BUError[BUError["Unknown"] = 100] = "Unknown";
    BUError[BUError["Server"] = 200] = "Server";
    BUError[BUError["NotFound"] = 300] = "NotFound";
    BUError[BUError["Connection"] = 400] = "Connection";
    BUError[BUError["Json"] = 500] = "Json";
    //! Users,
    BUError[BUError["USR_Invalid"] = 2000] = "USR_Invalid";
    BUError[BUError["USR_NotFound"] = 2001] = "USR_NotFound";
    BUError[BUError["USR_Disabled"] = 2002] = "USR_Disabled";
    BUError[BUError["USR_Access"] = 2003] = "USR_Access";
    BUError[BUError["USR_InvalidLogin"] = 2100] = "USR_InvalidLogin";
    BUError[BUError["USR_InvalidUsername"] = 2101] = "USR_InvalidUsername";
    BUError[BUError["USR_InvalidEmail"] = 2102] = "USR_InvalidEmail";
    BUError[BUError["USR_InvalidPassword"] = 2103] = "USR_InvalidPassword";
    BUError[BUError["USR_InvalidAdmin"] = 2104] = "USR_InvalidAdmin";
    BUError[BUError["USR_InvalidStatus"] = 2105] = "USR_InvalidStatus";
    BUError[BUError["USR_InvalidProjects"] = 2106] = "USR_InvalidProjects";
    BUError[BUError["USR_InvalidProject"] = 2107] = "USR_InvalidProject";
    BUError[BUError["USR_IncorrectLogin"] = 2200] = "USR_IncorrectLogin";
    BUError[BUError["USR_ExistingUsername"] = 2300] = "USR_ExistingUsername";
    BUError[BUError["USR_ExistingEmail"] = 2301] = "USR_ExistingEmail";
    //! Sessions
    BUError[BUError["SES_Invalid"] = 3000] = "SES_Invalid";
    BUError[BUError["SES_Incorrect"] = 3001] = "SES_Incorrect";
    BUError[BUError["SES_Disabled"] = 3002] = "SES_Disabled";
    //! Projects
    BUError[BUError["PRJ_Invalid"] = 41000] = "PRJ_Invalid";
    BUError[BUError["PRJ_NotFound"] = 41001] = "PRJ_NotFound";
    BUError[BUError["PRJ_Incorrect"] = 41002] = "PRJ_Incorrect";
    BUError[BUError["PRJ_Access"] = 41003] = "PRJ_Access";
    BUError[BUError["PRJ_InvalidName"] = 41100] = "PRJ_InvalidName";
    BUError[BUError["PRJ_InvalidVisible"] = 41101] = "PRJ_InvalidVisible";
    BUError[BUError["PRJ_InvalidSubtitle"] = 41102] = "PRJ_InvalidSubtitle";
    BUError[BUError["PRJ_InvalidDescription"] = 41103] = "PRJ_InvalidDescription";
    BUError[BUError["PRJ_InvalidBody"] = 41104] = "PRJ_InvalidBody";
    BUError[BUError["PRJ_InvalidIcon"] = 41105] = "PRJ_InvalidIcon";
    BUError[BUError["PRJ_InvalidImage"] = 41106] = "PRJ_InvalidImage";
    //! Access Keys,
    BUError[BUError["PRJ_ACK_Invalid"] = 42000] = "PRJ_ACK_Invalid";
    BUError[BUError["PRJ_ACK_NotFound"] = 42001] = "PRJ_ACK_NotFound";
    BUError[BUError["PRJ_ACK_Incorrect"] = 42002] = "PRJ_ACK_Incorrect";
    BUError[BUError["PRJ_ACK_InvalidName"] = 42100] = "PRJ_ACK_InvalidName";
    BUError[BUError["PRJ_ACK_InvalidStatus"] = 42101] = "PRJ_ACK_InvalidStatus";
    //! Collections,
    BUError[BUError["PRJ_COL_Invalid"] = 43000] = "PRJ_COL_Invalid";
    BUError[BUError["PRJ_COL_NotFound"] = 43001] = "PRJ_COL_NotFound";
    BUError[BUError["PRJ_COL_Access"] = 43002] = "PRJ_COL_Access";
    BUError[BUError["PRJ_COL_InvalidName"] = 43100] = "PRJ_COL_InvalidName";
    BUError[BUError["PRJ_COL_InvalidBody"] = 43101] = "PRJ_COL_InvalidBody";
})(BUError = exports.BUError || (exports.BUError = {}));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BUAccessKey = (function () {
    function BUAccessKey(key, secret) {
        this.key = key;
        this.secret = secret;
    }
    return BUAccessKey;
}());
exports.BUAccessKey = BUAccessKey;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BUCollection_1 = __webpack_require__(1);
var BUCollectionManager = (function () {
    function BUCollectionManager() {
        //Store collections
        this.collections = {};
        //Upload timer interval
        this.interval = 2000.0;
        this.uploadAllPerform();
    }
    Object.defineProperty(BUCollectionManager, "instance", {
        get: function () { return this._instance || (this._instance = new this()); },
        enumerable: true,
        configurable: true
    });
    //Create collections from array of name
    BUCollectionManager.prototype.create = function (names) {
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            //Check name doesn't exists in collections
            if (Object.keys(this.collections).includes(name_1)) {
                continue;
            }
            //Create new collection if name doesnt exist
            this.collections[name_1] = new BUCollection_1.BUCollection(name_1);
        }
    };
    //Push documents in all collections to backend server
    BUCollectionManager.prototype.uploadAllPerform = function (timer) {
        var _this = this;
        this.uploadAll();
        //Create timer to push all collections every x seconds
        if (this.interval > 0) {
            setInterval(function () {
                _this.uploadAllPerform();
            }, this.interval);
        }
    };
    BUCollectionManager.prototype.uploadAll = function () {
        var _this = this;
        //Push all collections
        Object.keys(this.collections).forEach(function (key) {
            var collection = _this.collections[key];
            collection.upload(function (code) {
                //Notify error
                if (_this.error !== undefined) {
                    _this.error(collection, code);
                }
            }, function (count) {
                //Notify success
                if (_this.success !== undefined) {
                    _this.success(collection, count);
                }
            });
        });
    };
    return BUCollectionManager;
}());
exports.BUCollectionManager = BUCollectionManager;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BUDocument = (function () {
    function BUDocument(contents) {
        this.contents = contents === undefined ? {} : contents;
    }
    BUDocument.prototype.push = function (key, value) {
        this.contents[key] = value;
    };
    return BUDocument;
}());
exports.BUDocument = BUDocument;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(2));
__export(__webpack_require__(0));
__export(__webpack_require__(3));
__export(__webpack_require__(5));
__export(__webpack_require__(1));
__export(__webpack_require__(4));
var BUError_1 = __webpack_require__(2);
exports.Error = BUError_1.BUError;
var BUAPI_1 = __webpack_require__(0);
exports.API = BUAPI_1.BUAPI;
var BUAccessKey_1 = __webpack_require__(3);
exports.AccessKey = BUAccessKey_1.BUAccessKey;
var BUDocument_1 = __webpack_require__(5);
exports.Document = BUDocument_1.BUDocument;
var BUCollection_1 = __webpack_require__(1);
exports.Collection = BUCollection_1.BUCollection;
var BUCollectionManager_1 = __webpack_require__(4);
exports.CollectionManager = BUCollectionManager_1.BUCollectionManager;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("popsicle");

/***/ })
/******/ ])));
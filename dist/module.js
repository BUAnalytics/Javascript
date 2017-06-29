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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//Modules
var popsicle = __webpack_require__(8);
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
                success(JSON.parse(response.body));
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
    //! Core
    BUError[BUError["Unknown"] = 100] = "Unknown";
    BUError[BUError["Server"] = 200] = "Server";
    BUError[BUError["NotFound"] = 300] = "NotFound";
    BUError[BUError["Connection"] = 400] = "Connection";
    BUError[BUError["Json"] = 500] = "Json";
    //! Users
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
    //! Access Keys
    BUError[BUError["ACK_Invalid"] = 42000] = "ACK_Invalid";
    BUError[BUError["ACK_NotFound"] = 42001] = "ACK_NotFound";
    BUError[BUError["ACK_Incorrect"] = 42002] = "ACK_Incorrect";
    BUError[BUError["ACK_InvalidName"] = 42100] = "ACK_InvalidName";
    BUError[BUError["ACK_InvalidStatus"] = 42101] = "ACK_InvalidStatus";
    //! Collections
    BUError[BUError["COL_Invalid"] = 43000] = "COL_Invalid";
    BUError[BUError["COL_NotFound"] = 43001] = "COL_NotFound";
    BUError[BUError["COL_Access"] = 43002] = "COL_Access";
    BUError[BUError["COL_InvalidSize"] = 43100] = "COL_InvalidSize";
    BUError[BUError["COL_InvalidPage"] = 43101] = "COL_InvalidPage";
    BUError[BUError["COL_InvalidSort"] = 43102] = "COL_InvalidSort";
    BUError[BUError["COL_InvalidDir"] = 43103] = "COL_InvalidDir";
    BUError[BUError["COL_InvalidName"] = 43104] = "COL_InvalidName";
    BUError[BUError["COL_InvalidBody"] = 43105] = "COL_InvalidBody";
    //! Visuals
    BUError[BUError["VIS_Invalid"] = 44000] = "VIS_Invalid";
    BUError[BUError["VIS_NotFound"] = 44001] = "VIS_NotFound";
    BUError[BUError["VIS_Access"] = 44002] = "VIS_Access";
    BUError[BUError["VIS_InvalidCollection"] = 44100] = "VIS_InvalidCollection";
    BUError[BUError["VIS_InvalidName"] = 44101] = "VIS_InvalidName";
    BUError[BUError["VIS_InvalidType"] = 44102] = "VIS_InvalidType";
    BUError[BUError["VIS_InvalidOptions"] = 44103] = "VIS_InvalidOptions";
    BUError[BUError["VIS_IncorrectCollection"] = 44200] = "VIS_IncorrectCollection";
    BUError[BUError["VIS_IncorrectType"] = 44201] = "VIS_IncorrectType";
    //! Applications
    BUError[BUError["APP_MissingContName"] = 51000] = "APP_MissingContName";
    BUError[BUError["APP_MissingContEmail"] = 51001] = "APP_MissingContEmail";
    BUError[BUError["APP_MissingContPhone"] = 51002] = "APP_MissingContPhone";
    BUError[BUError["APP_MissingOrgName"] = 51003] = "APP_MissingOrgName";
    BUError[BUError["APP_MissingOrgAddress"] = 51004] = "APP_MissingOrgAddress";
    BUError[BUError["APP_MissingProjDuration"] = 51005] = "APP_MissingProjDuration";
    BUError[BUError["APP_MissingProjPurpose"] = 51006] = "APP_MissingProjPurpose";
    BUError[BUError["APP_MissingProjDescription"] = 51007] = "APP_MissingProjDescription";
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

Object.defineProperty(exports, "__esModule", { value: true });
//Includes
var BUAPI_1 = __webpack_require__(0);
var BUID = (function () {
    function BUID() {
        //Store identifiers
        this.identifiers = [];
        //Upload timer interval
        this.interval = 2000;
        this.size = 100;
    }
    Object.defineProperty(BUID, "instance", {
        get: function () { return this._instance || (this._instance = new this()); },
        enumerable: true,
        configurable: true
    });
    //Return first id in cache list and remove
    BUID.prototype.generate = function () {
        //Check whether identifiers are depleted
        if (this.identifiers.length <= 0) {
            //Log error
            console.log('[BUAnalytics] Identifier cache has been depleted, please adjust your BUID cache size or interval');
            //Generate backup identifier
            return this.UUID();
        }
        //Grab identifier and remove from cache
        return this.identifiers.shift();
    };
    //Start caching identifiers
    BUID.prototype.start = function (size) {
        if (size === void 0) { size = 100; }
        this.size = size;
        this.refreshPerform();
    };
    //Push documents in all collections to backend server
    BUID.prototype.refreshPerform = function (timer) {
        var _this = this;
        //Only refresh if identifier cache is a quarter empty
        if (this.identifiers.length < ((this.size / 4) * 3)) {
            this.refresh();
        }
        //Create timer to push all collections every x seconds
        if (this.interval > 0) {
            setInterval(function () {
                _this.refreshPerform();
            }, this.interval);
        }
    };
    BUID.prototype.refresh = function () {
        var _this = this;
        //Upload data to server using api request
        var count = this.size - this.identifiers.length;
        BUAPI_1.BUAPI.instance.requestPath('/projects/collections/documents/ids/' + count, BUAPI_1.BUMethod.GET, {}, function (code) {
            //Log error code
            console.log('[BUAnalytics] Failed to refresh ' + count + ' identifiers from server with error code ' + code);
        }, function (response) {
            //Cast and add identifiers from response
            _this.identifiers = _this.identifiers.concat(response.ids);
        });
    };
    //Generate bacup random identifier
    BUID.prototype.UUID = function () {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    return BUID;
}());
exports.BUID = BUID;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(2));
__export(__webpack_require__(0));
__export(__webpack_require__(3));
__export(__webpack_require__(6));
__export(__webpack_require__(5));
__export(__webpack_require__(1));
__export(__webpack_require__(4));
var BUError_1 = __webpack_require__(2);
exports.Error = BUError_1.BUError;
var BUAPI_1 = __webpack_require__(0);
exports.API = BUAPI_1.BUAPI;
var BUAccessKey_1 = __webpack_require__(3);
exports.AccessKey = BUAccessKey_1.BUAccessKey;
var BUID_1 = __webpack_require__(6);
exports.ID = BUID_1.BUID;
var BUDocument_1 = __webpack_require__(5);
exports.Document = BUDocument_1.BUDocument;
var BUCollection_1 = __webpack_require__(1);
exports.Collection = BUCollection_1.BUCollection;
var BUCollectionManager_1 = __webpack_require__(4);
exports.CollectionManager = BUCollectionManager_1.BUCollectionManager;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("popsicle");

/***/ })
/******/ ])));
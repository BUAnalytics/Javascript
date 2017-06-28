# Javascript Plugin

BU Analytics plugin for Javascript and Typescript compatible with browsers and NodeJS.

## Installation

To install the plugin execute the npm command in your project environment.

```bash
npm i --save bu-analytics
```

### Browsers

First make sure to include the library in your html header.

```html
<script src="node_modules/bu-analytics/dist/browser.min.js"></script>
```

The library will then be exported under the BU variable for use.

```javascript
//Authenticate
BU.API.instance.auth = new BU.AccessKey('58569825377ba00001ae8315', 'KUygr6BUxhEtsSQ1RJYla2UCtiEE8R')

//Create document
var userDoc = new BU.Document()
```

### Typescript

For Typescript import and consume the library as shown.

```javascript
import { API, AccessKey, Document } from 'bu-analytics'

//Authenticate
API.instance.auth = new AccessKey('58569825377ba00001ae8315', 'KUygr6BUxhEtsSQ1RJYla2UCtiEE8R')

//Create document
const userDoc = new Document()
```

### Javascript

For Javascript require and consume the library as shown.

```javascript
const { API, AccessKey, Document } = require('bu-analytics')

//Authenticate
API.instance.auth = new AccessKey('58569825377ba00001ae8315', 'KUygr6BUxhEtsSQ1RJYla2UCtiEE8R')

//Create document
const userDoc = new Document()
```

## Authentication

To authenticate with the backend you must first create an access key through the web management interface. Then pass these details into the api singleton instance.

```javascript
API.instance.auth = new AccessKey('585913d39dd4c40001c12920', '7BbQYgXi21A56D8ofOypaIkJDUjqoo')
```

The hostname defaults to the university server although we can change this if necessary.

```javascript
API.instance.url = 'http://192.168.0.x'
API.instance.url = '/api/v1'
```

## Creating Collections

We must then create the collections that we would like to use throughout the application. 
This can be done at any point and as many times as needed however collections will not be overwritten if created with a duplicate names.

```javascript
CollectionManager.instance.create([
    'Users',
    'Sessions',
    'Clicks'
])
```

## Creating a Document

We can create a document using a dictionary literal that allows for as many nested values as needed. 
Documents support nested dictionaries, arrays and will encode literal data types when uploading to the backend server.

```javascript
const userDoc = new Document({
    userId: ..,
    name: ..,
    age: ..,
    gender: ..,
    device: {
        type: ..,
        name: ..,
        model: ..
    }
})
```

You can also create documents through the add method or can access the raw dictionary object through the contents property.

```javascript
const userDoc = new Document()
userDoc.push('userId', ..)
userDoc.push('name', ..)
userDoc.push('age', ..)
userDoc.push('gender', ..)
```

## Adding a Document to Collection

You can then add one or more documents to a collection through the collection manager.

```javascript
CollectionManager.instance.collections['Users'].push(userDoc)
CollectionManager.instance.collections['Users'].push([ userDoc1, userDoc2, userDoc3 ])
```

Collections will automatically push all documents to the backend server every two seconds if not empty. 
You can also manually initiate an upload either on all or a specific collection.

```javascript
CollectionManager.instance.uploadAll()
CollectionManager.instance.collections['Users'].upload()
```

You can also use the interval property to configure how often collections are uploaded in milliseconds. 
The default is 2000 milliseconds and setting it to 0 will disable automatic uploads.

```javascript
CollectionManager.instance.interval = 4000
```

## Error Handling

You can subscribe to actions in the collection manager to notify you when collections upload successfully or return errors.

```javascript
CollectionManager.instance.error = (collection, code) => {
  //...
}
 
CollectionManager.instance.success = (collection, count) => {
  //...
}
```

You can also provide error and success actions to an individual collection using the upload method.
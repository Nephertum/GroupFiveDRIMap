define({ "api": [
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./client/client/doc/main.js",
    "group": "/Users/emily/Documents/GroupFiveDRIMap/client/client/doc/main.js",
    "groupTitle": "/Users/emily/Documents/GroupFiveDRIMap/client/client/doc/main.js",
    "name": ""
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./client/doc/main.js",
    "group": "/Users/emily/Documents/GroupFiveDRIMap/client/doc/main.js",
    "groupTitle": "/Users/emily/Documents/GroupFiveDRIMap/client/doc/main.js",
    "name": ""
  },
  {
    "type": "get",
    "url": "/building/listInfo/:id",
    "title": "Request Name and Room List Colour",
    "description": "<p>Given a building id, returns the name and room list colour for that building.</p>",
    "name": "GetBuildingListInfo",
    "group": "Buildings",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique id of building.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "buildingListInfo",
            "description": "<p>Name and room list colour of building.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Buildings"
  },
  {
    "type": "get",
    "url": "/buildings",
    "title": "Request All Buildings",
    "name": "GetBuildings",
    "group": "Buildings",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "buildings",
            "description": "<p>List of all building objects.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Buildings"
  },
  {
    "type": "get",
    "url": "/corridors",
    "title": "Request All Corridors",
    "name": "GetCorridors",
    "group": "Corridors",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "corridors",
            "description": "<p>List of all corridor objects.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Corridors"
  },
  {
    "type": "get",
    "url": "/info/:category/:id",
    "title": "Request an Object",
    "description": "<p>Given an id and catgeory, returns the object from the database.</p>",
    "name": "GetInfo",
    "group": "Entities",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"entrance\"",
              "\"building\"",
              "\"room\"",
              "\"corridor\""
            ],
            "optional": false,
            "field": "category",
            "description": "<p>Category of object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique id of object (first letter of category followed by a number).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "object",
            "description": "<p>The dictionary requested.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Entities"
  },
  {
    "type": "post",
    "url": "/entities/delete",
    "title": "Delete an Existing Entity",
    "name": "PostDeleteEntity",
    "group": "Entities",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique id of object.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Entities"
  },
  {
    "type": "post",
    "url": "/entities/edit",
    "title": "Edit an Existing Entity",
    "description": "<p>Updates a given property of an existing entity to a given value.</p>",
    "name": "PostEditEntity",
    "group": "Entities",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique id of object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"entrance\"",
              "\"building\"",
              "\"room\"",
              "\"corridor\"",
              "\"unmarkedRoom\""
            ],
            "optional": false,
            "field": "category",
            "description": "<p>Category of object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "property",
            "description": "<p>Property of object to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "NewValue",
            "description": "<p>New value for the property.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Entities"
  },
  {
    "type": "post",
    "url": "/entities/add",
    "title": "Add a New Entity",
    "name": "PostNewEntity",
    "group": "Entities",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of new object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"entrance\"",
              "\"building\"",
              "\"room\"",
              "\"corridor\"",
              "\"unmarkedRoom\""
            ],
            "optional": false,
            "field": "category",
            "description": "<p>Category of new object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "latitude",
            "description": "<p>Latitude of new object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "longitude",
            "description": "<p>Longitude of new object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "building",
            "description": "<p>Building where new object is located.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "level",
            "description": "<p>Level new object is located on.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of new object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "weekdayHours",
            "description": "<p>Start of the weekday opening hours of the new object if applicable.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "weekendHours",
            "description": "<p>Start of the weekend opening hours of the new object if applicable.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "latitudeStart",
            "description": "<p>Latitude of starting point for corridors.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "latitudeend",
            "description": "<p>Latitude of ending point for corridors.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "longitudeStart",
            "description": "<p>Longitude of starting point for corridors.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "longitudeEnd",
            "description": "<p>Longitude of ending point for corridors.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "neighbours",
            "description": "<p>Integer list representing all neighbouring corridors.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>Name of the image file for the new object if applicable.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Entities"
  },
  {
    "type": "get",
    "url": "/entrances",
    "title": "Request All Entrances",
    "name": "GetEntrances",
    "group": "Entrances",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "entrances",
            "description": "<p>List of all entrance objects.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Entrances"
  },
  {
    "type": "get",
    "url": "/login",
    "title": "Request Login Page",
    "description": "<p>Requests login page. If already authorised, redirects to data page.</p>",
    "name": "GetLogin",
    "group": "Login",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "File",
            "optional": false,
            "field": "Response",
            "description": "<p>HTML file for login or data page</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Login"
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Send Request to Log in",
    "name": "PostLogin",
    "group": "Login",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of user attempting to log in.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of user attempting to log in.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Login"
  },
  {
    "type": "post",
    "url": "/remove_account",
    "title": "Send Request to Remove a Staff Account",
    "name": "PostRemoveAccount",
    "group": "Login",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of account to be deleted.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Login"
  },
  {
    "type": "post",
    "url": "/signup",
    "title": "Send Request to Create a New Staff Account",
    "name": "PostSignup",
    "group": "Login",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of new user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of new user.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Login"
  },
  {
    "type": "get",
    "url": "/rooms/popupinfo/:id",
    "title": "Request Info for Creating a Popup of a Room",
    "description": "<p>Given a room id, returns the id, name, description, weekday opening hours, weekend opening hours and image name for that room.</p>",
    "name": "GetARoomsPopupInfo",
    "group": "Rooms",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique id of room.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "roompopup",
            "description": "<p>Dictionary of the required info for creating a popup of the room.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Rooms"
  },
  {
    "type": "get",
    "url": "/rooms",
    "title": "Request All Rooms",
    "name": "GetRooms",
    "group": "Rooms",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "rooms",
            "description": "<p>List of all room objects.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Rooms"
  },
  {
    "type": "get",
    "url": "/rooms/drawing",
    "title": "Request Info for Drawing Rooms",
    "description": "<p>Returns the id, name and location of each room.</p>",
    "name": "GetRoomsDrawingInfo",
    "group": "Rooms",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "roomsdrawing",
            "description": "<p>List of dictionaries of the required info for drawing the rooms.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Rooms"
  },
  {
    "type": "get",
    "url": "/rooms/listinfo",
    "title": "Request Info for Writing a List of Rooms",
    "description": "<p>Returns the id, name, latitude, longitude, building and level of each room.</p>",
    "name": "GetRoomsListInfo",
    "group": "Rooms",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "roomsinfo",
            "description": "<p>List of dictionaries of the required info for listing each room.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Rooms"
  },
  {
    "type": "get",
    "url": "/unmarkedRooms",
    "title": "Request All Rooms That are Not Marked on Map",
    "name": "GetUnmarkedRooms",
    "group": "UnmarkedRooms",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "unmarkedRooms",
            "description": "<p>List of all unmarked room objects.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "UnmarkedRooms"
  }
] });

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
    "filename": "./client/doc/main.js",
    "group": "/Users/emily/Documents/GroupFiveDRIMap/client/doc/main.js",
    "groupTitle": "/Users/emily/Documents/GroupFiveDRIMap/client/doc/main.js",
    "name": ""
  },
  {
    "type": "get",
    "url": "/archive",
    "title": "Request All Objects in Archive",
    "name": "GetArchive",
    "group": "Archive",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "archive",
            "description": "<p>List of all archived objects.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Archive"
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
    "url": "/rooms/popupinfo/:id",
    "title": "Request Info for Creating a Popup of a Room",
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
            "description": "<p>List of dictionaries of the required info for drawing each room.</p>"
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
  },
  {
    "type": "get",
    "url": "/info/:category/:id",
    "title": "Request an Object by its id and Category",
    "name": "GetInfo",
    "group": "entities",
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
    "groupTitle": "entities"
  },
  {
    "type": "post",
    "url": "/entities/delete",
    "title": "Delete an Existing Entity",
    "name": "PostDeleteEntity",
    "group": "entities",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdOfDelete",
            "description": "<p>Unique id of object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"archive\"",
              "\"permanent\""
            ],
            "optional": false,
            "field": "deleteType",
            "description": "<p>Type of deletion.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "entities"
  },
  {
    "type": "post",
    "url": "/entities/edit",
    "title": "Edit an Existing Entity",
    "name": "PostEditEntity",
    "group": "entities",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdOfEdit",
            "description": "<p>Unique id of object.</p>"
          },
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
            "field": "property",
            "description": "<p>Property of object to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "editNewValue",
            "description": "<p>New value for the property.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "entities"
  },
  {
    "type": "post",
    "url": "/entities/add",
    "title": "Add a New Entity",
    "name": "PostNewEntity",
    "group": "entities",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newName",
            "description": "<p>Name of new object.</p>"
          },
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
            "description": "<p>Category of new object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newLocation",
            "description": "<p>Map location of new object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "newDescription",
            "description": "<p>Description of new object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "newHoursWeekStart",
            "description": "<p>Start of the weekday opening hours of the new object if applicable.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "newHoursWeekEnd",
            "description": "<p>End of the weekday opening hours of the new object if applicable.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "newHoursWeekendStart",
            "description": "<p>Start of the weekend opening hours of the new object if applicable.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "newHoursWeekendEnd",
            "description": "<p>End of the weekend opening hours of the new object if applicable.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "newImg",
            "description": "<p>Name of the image file for the new object if applicable.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "entities"
  },
  {
    "type": "post",
    "url": "/entities/restore",
    "title": "Restore an Entity From Archive",
    "name": "PostRestoreEntity",
    "group": "entities",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdOfRestore",
            "description": "<p>Unique id of object.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "entities"
  }
] });

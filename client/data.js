/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const key = 'pk.eyJ1Ijoid29yZHlzdW1vIiwiYSI6ImNrdmw4M2tuaDBqMmQyb281YWVrNTd4cjEifQ.K9oZUZYiwAd2sJs2_KTAug'
const options = {
  container: 'minimap',
  lat: 53.53094965890605,
  lng: -1.1095832474735168,
  zoom: 12,
  maxBounds: [
    [-1.1147841887079721, 53.52933045167083], // Southwest coordinates
    [-1.104507565152795, 53.53294975268597] // NorthEast coordinates

  ],
  bearing: -22,
  style: 'mapbox://styles/mapbox/streets-v10'
}
const mappa = new Mappa('MapboxGL', key)
let myMap
let corridors
fetch('/corridors')
  .then(response => response.json())
  .then(function (body) {
    corridors = body
  })
function setup () {
  const canvas = createCanvas(400, 150)
  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options)
  myMap.overlay(canvas)
  myMap.onChange(updateMap)
}
function drawRoute (node) {
  noFill()
  stroke(0, 0, 0)
  strokeWeight(2)
  beginShape()
  const routeStart = myMap.latLngToPixel(node.latitudeStart, node.longitudeStart)
  const routeEnd = myMap.latLngToPixel(node.latitudeEnd, node.longitudeEnd)
  vertex(routeStart.x, routeStart.y)
  vertex(routeEnd.x, routeEnd.y)
  endShape()
  fill(255, 255, 255)
  text(node.name.split(' ')[1], (routeStart.x + routeEnd.x) / 2, (routeStart.y + routeEnd.y) / 2)
}
function updateMap () {
  clear()
  for (const node of corridors) {
    drawRoute(node)
  }
}
function draw () {
  // sets the mouse cursor to a cross symbol while hovering over the map
  cursor(CROSS)
}
function mouseClicked () {
  if (mouseX >= 0 && mouseX <= 400 && mouseY >= 0 && mouseY <= 150) {
    const position = myMap.pixelToLatLng(mouseX, mouseY)
    document.getElementById('latitude').innerText = 'Latitude: ' + position.lat
    document.getElementById('longitude').innerText = 'Longitude: ' + position.lng
  }

  // checks if mouse was clicked over any of the location nodes and zooms in on them
}

// THESE FIRST FUNCTIONS ARE JUST FOR SHORTENING CODE
function getCols (data) {
  const cols = []
  for (let i = 0; i < data.length; i++) {
    for (const k in data[i]) {
      if (cols.indexOf(k) === -1) {
        // Push all keys to the array
        cols.push(k)
      }
    }
  }
  return cols
}

function getCategory (letter) {
  let category
  if (letter === 'a') {
    category = 'archive'
  } else if (letter === 'b') {
    category = 'building'
  } else if (letter === 'c') {
    category = 'corridor'
  } else if (letter === 'r') {
    category = 'room'
  } else if (letter === 'e') {
    category = 'entrance'
  } else if (letter === 'u') {
    category = 'unmarkedRoom'
  }
  return category
}

// FOLLOWING TWO FUNCTIONS MAKE THE TABLES ON THE PAGE
// type variable should be the first letter of the ids, e.g "b" for buildings
function makeTable (data, type, container) {
  if (data.length === 0) {
    container.innerHTML = 'Currently empty'
    return
  }
  const cols = getCols(data)
  // Make a table
  let newHtml = ''
  const tableName = container + 'Tbl'
  newHtml = "<table style='overflow-x:auto;' class='dataTable' id='" + tableName + "'><tr>"

  // Add headings
  let heading
  for (let i = 0; i < cols.length; i++) {
    heading = '<th>' + cols[i] + '</th>' // Headings for each key
    newHtml += heading
  }
  newHtml += '<th></th>' // Heading for delete buttons
  newHtml += '</tr>'

  // Add data as changeable inputs
  let id
  let property
  let rowName
  let inputName
  let deleteBtnName
  for (let i = 0; i < data.length; i++) {
    id = data[i].id
    rowName = 'row' + data[i].id
    newHtml += "<tr id='" + rowName + "'>"
    for (let j = 0; j < cols.length; j++) {
      property = cols[j]
      inputName = id + '-' + property
      if (property === 'id') {
        newHtml += "<td><p id='" + inputName + "'>" + data[i][cols[j]] + '</p></td>'
      } else {
        newHtml += "<td><input id='" + inputName + "' value='" + data[i][cols[j]] + "'></input></td>"
      }
    }
    // Add delete button
    deleteBtnName = 'delete' + id
    newHtml += '<td><i class="fa-solid fa-circle-xmark dataDltBtn" id="' + deleteBtnName + '"></i></td>'
    newHtml += '</tr>'
  }

  // Add an add button
  const addRowName = 'addRow' + container
  const addBtnName = 'plus' + container
  newHtml += '<tr>'
  for (var j = 0; j < cols.length; j++) {
    newHtml += '<td></td>'
  }
  newHtml += '<td id="' + addRowName + '"><i class="fa-solid fa-circle-plus dataPlusBtn" id="' + addBtnName + '"></i></td></tr>'

  // Add table to document
  newHtml += '</table>'
  document.getElementById(container).innerHTML = newHtml

  // Add event listeners that change the background colour when a value is changed
  // and store the change in the global array
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < cols.length; j++) {
      id = data[i].id
      property = cols[j]
      checkChange(id + '-' + property)
    }
  }
  // Add event listeners that delete the row when cross clicked,
  // after a confirmation message is sent
  for (let i = 0; i < data.length; i++) {
    id = data[i].id
    enableDeleteButton('delete' + id)
  }
  // Add event listeners that add a new row when plus button is clicked
  document.getElementById('plus' + container).addEventListener('click', function (e) {
    const container = e.target.id.slice(4)
    tableId = container + 'Tbl'
    type = tableId.charAt(0)
    id = 'new' + numberOfNewObjs + type

    const table = document.getElementById(container + 'Tbl').childNodes[0].childNodes
    console.log(table[table.length - 2])
    let newId = table[table.length - 2].id.slice(3)
    newId = newId.slice(0, 1) + (Number(newId.slice(1)) + 1)
    newRowName = 'row' + newId
    newRow = "<tr id='" + newRowName + "'>"
    for (let j = 0; j < cols.length; j++) {
      if (cols[j] === 'id') {
        newRow += `<td><p id=${newId}>${newId}</p></td>`
      } else {
        property = cols[j]
        inputName = newId + '-' + property
        newRow += `<td><input class='changedValue ${newId}' id=${inputName}></input></td>`
      }
    }
    deleteBtnName = 'delete' + newId
    newRow += '<td><i class="fa-solid fa-circle-xmark dataDltBtn new" id="' + deleteBtnName + '"></i></td>' // Delete button
    newRow += '</tr>'
    document.getElementById('addRow' + container).parentElement.insertAdjacentHTML('beforebegin', newRow)
    enableDeleteButton(deleteBtnName)
    change = ['ADD', newRowName]
    changes.push(change)
    numberOfNewObjs += 1
  })
}

// type variable should be the first letter of the ids, e.g "b" for buildings
function makeArchiveTable (data, container) {
  if (data.length === 0) {
    container.innerHTML = 'Currently empty'
  }
  const cols = ['id', 'name']

  // Make a table
  let newHtml = ''
  const tableName = container + 'Tbl'
  newHtml = "<table class='dataTable' id='" + tableName + "'><tr>"

  // Add headings
  let heading
  for (let i = 0; i < cols.length; i++) {
    heading = '<th>' + cols[i] + '</th>' // Headings for each key
    newHtml += heading
  }
  newHtml += '<th>View Info</th>' // Heading for view info buttons
  newHtml += '<th></th>' // Heading for delete buttons
  newHtml += '<th></th>' // Heading for restore buttons
  newHtml += '</tr>'

  // Add data as unchangeable text
  let id
  let property
  let rowName
  let textName
  let btnName
  for (let i = 0; i < data.length; i++) {
    id = data[i].id
    rowName = 'row' + data[i].id
    newHtml += "<tr id='" + rowName + "'>"
    for (let j = 0; j < cols.length; j++) {
      property = cols[j]
      textName = id + '-' + property
      newHtml += "<td><p id='" + textName + "'>" + data[i][cols[j]] + '</p></td>'
    }
    btnName = 'view' + id
    newHtml += '<td><i class="fas fa-eye dataViewBtn" id="' + btnName + '"></i></td>' // View info button
    btnName = 'delete' + id
    newHtml += '<td><i class="fa-solid fa-circle-xmark dataDltBtn" id="' + btnName + '"></i></td>' // Delete button
    btnName = 'restore' + id
    newHtml += '<td><i class="fa-solid fa-trash-arrow-up dataRestoreBtn" id="' + btnName + '"></i></td>' // Restore button
    newHtml += '</tr>'
  }

  // Add table to document
  newHtml += '</table>'
  document.getElementById(container).innerHTML = newHtml

  // Enable buttons
  for (let i = 0; i < data.length; i++) {
    id = data[i].id
    // delete
    btnName = 'delete' + id
    enableDeleteButton(btnName)
    // view
    btnName = 'view' + id
    enableViewButton(btnName)
    // restore
    btnName = 'restore' + id
    enableRestoreButton(btnName)
  }
}

// FOLLOWING FUNCTIONS ENABLE BUTTONS IN THE TABLES
function enableDeleteButton (id) {
  document.getElementById(id).addEventListener('click', function (e) {
    e.preventDefault()
    const id = e.target.id.slice(6)
    const rowId = 'row' + e.target.id.slice(6)
    if (e.target.classList.contains('new')) {
      functionConfirm('Are you sure you want to delete this? (Note new or already-archived objects cannot be archived)',
        function del () {
          document.getElementById(rowId).remove()
          // changes.push('Deleted ' + id)
        })
    } else {
      functionConfirm('Are you sure you want to delete this?',
        function del () {
          document.getElementById(rowId).remove()
          changes.push(['DELETE', id])
        },
        function archive () {
          archiveTbl = document.getElementById('archiveDataTbl')
          if (!archiveTbl) {
            // Make the archive table
          }
          const elName = document.getElementById(id + '-name').value
          const type = document.getElementById(id + '-id').innerHTML.charAt(0)

          const oldId = id
          elNewId = 'a' + numberofNewArchives + type
          numberofNewArchives += 1

          const rowName = 'row' + oldId
          let newRow = "<tr id='" + rowName + "'>"
          // Add id
          textName = oldId + '-' + oldId
          newRow += "<td><p id='" + textName + "'>tbd</p></td>"
          // Add name
          textName = oldId + '-' + elName
          newRow += "<td><p id='" + textName + "'>" + elName + '</p></td>'
          // Add view button
          let btnName = 'view' + oldId
          newRow += '<td><i class="fas fa-eye dataViewBtn" id="' + btnName + '"></i></td>'
          // Add delete button
          btnName = 'delete' + oldId
          newRow += '<td><i class="fa-solid fa-circle-xmark dataDltBtn" id="' + btnName + '"></i></td>'
          // Add restore button
          btnName = 'restore' + oldId
          newRow += '<td><i class="fa-solid fa-trash-arrow-up dataRestoreBtn" id="' + btnName + '"></i></td>'
          newRow += '</tr>'

          document.getElementById(rowId).remove()

          archiveTbl.insertAdjacentHTML('beforeend', newRow)
          enableDeleteButton('delete' + oldId)
          enableViewButton('view' + oldId)
          enableRestoreButton('restore' + oldId)
          changes.push(id + ' archived')
        })
    }
  })
}

function enableViewButton (id) {
  document.getElementById(id).addEventListener('click', function (e) {
    elId = e.target.id.substring(4)
    popup(elId)
  })
}

function enableRestoreButton (id) {
  document.getElementById(id).addEventListener('click', function (e) {
    const elId = e.target.id.substring(7)
    const type = elId.charAt(0)
    const category = getCategory(type)
    let origType = type
    let newIdText = elId
    let classes = ''
    if (type === 'a') {
      origType = elId.charAt(elId.length - 1)
      newIdText = 'tbd'
      classes = 'changedValue'
      changes.push(elId + ' restored')
    } else {
      removeChange = elId + ' archived'
      changes = changes.filter(function (e) { return e !== removeChange })
    }
    origCategory = getCategory(origType)

    const tblName = origCategory + 'DataTbl'
    tbl = document.getElementById(tblName)
    const container = origCategory + 'Data'

    fetch('/info/' + category + '/' + elId)
      .then(response => response.json())
      .then(function (body) {
        cols = getCols([body])
        rowName = 'row' + body.id
        newRow = "<tr id='" + rowName + "'>"
        for (let j = 0; j < cols.length; j++) {
          property = cols[j]
          inputName = elId + '-' + property
          if (property === 'id') {
            newRow += "<td><p id='" + inputName + "'>" + newIdText + '</p></td>'
          } else {
            newRow += "<td><input class='" + classes + "' id='" + inputName + "' value='" + body[cols[j]] + "'></input></td>"
          }
        }
        // Add delete button
        deleteBtnName = 'delete' + elId
        newRow += '<td><i class="fa-solid fa-circle-xmark dataDltBtn" id="' + deleteBtnName + '"></i></td>'
        newRow += '</tr>'
        document.getElementById(rowName).remove()
        document.getElementById('addRow' + container).parentElement.insertAdjacentHTML('beforebegin', newRow)
        enableDeleteButton(deleteBtnName)
      })

    alert('Restored')
  })
}

// FUNCTIONS FOR SAVING CHANGES
function checkChange (id) {
  document.getElementById(id).addEventListener('input', function (e) {
    e.preventDefault()
    box = document.getElementById(e.target.id)
    change = box.id + ' value altered'
    change = box.id.split('-')
    change.push(box.value)
    change.unshift('CHANGE')
    changes = changes.filter(function (e) { return (e[1] !== change[1] || e[2] !== change[2]) })
    if (box.value !== box.defaultValue) {
      box.className += ' changedValue'
      changes.push(change)
      console.log(change)
      if (document.getElementById('undo-' + box.id) == undefined) {
        const undoBtn = document.createElement('i')
        undoBtn.id = 'undo-' + box.id
        undoBtn.className = 'fas fa-undo undoBtn'
        undoBtn.addEventListener('click', () => {
          boxId = e.target.id
          box = document.getElementById(boxId)
          box.value = box.defaultValue
          changes = changes.filter(function (e) { return (e[1] !== change[1] || e[2] !== change[2]) })
          box.classList.remove('changedValue')
          document.getElementById('undo-' + boxId).remove()
        })
        box.parentElement.appendChild(undoBtn)
      }
    } else {
      box.classList.remove('changedValue')
      document.getElementById('undo-' + box.id).remove()
    }
  })
}
function logout () {
  fetch('/logout', {
    credentials: 'include'
  })
    .then(response => {
      if (response.ok) {
        window.location.pathname = '/'
      }
    })
}
function signup () {
  const username = prompt('enter username for new staff member')
  const password = prompt('enter password for new staff member')
  const message = { username, password }
  fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(message)
  })
    .then(response => {
      if (response.ok) {
        alert('account created')
      } else {
        alert('error in account creation')
      }
    })
}
function saveEdit (change) {
  const message = { id: change[1], category: getCategory(change[1].slice(0, 1)), property: change[2], NewValue: change[3] }
  if (change[3] === '') return
  console.log(message)
  fetch('/entities/edit', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })
    .then(response => {
      if (response.ok) {
        console.log('change succesful')
      } else {
        throw Error
      }
    })
    .catch(err => {
      console.log(err)
    })
}
function saveAdd (change) {
  const newId = change[1].slice(3)
  const values = document.querySelectorAll(`.${newId}`)
  if (values.length === 0) return
  const message = {}
  for (const input of values) {
    const property = input.id.split('-')[1]
    if (input.value === '') return
    message[property] = input.value
  }
  message.category = getCategory(newId.slice(0, 1))
  fetch('/entities/add', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })
    .then(response => {
      if (response.ok) {
        return response.text()
      } else {
        throw Error
      }
    })
    .then(result => {
      document.getElementById(newId).id = result
      document.getElementById(result).innerText = result
    })
    .catch(err => {
      console.log(err)
    })
}
function saveDelete (change) {
  const id = change[1]
  const message = { id: id, deleteType: 'permanent' }
  fetch('entities/delete', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })
    .then(response => {
      if (response.ok) {
        console.log('change succesful')
      } else {
        throw Error
      }
    })
    .catch(err => {
      console.log(err)
    })
}

function saveChanges () {
  for (const change of changes) {
    switch (change[0]) {
      case 'ADD':
        saveAdd(change)
        break
      case 'CHANGE':
        saveEdit(change)
        break
      case 'DELETE':
        saveDelete(change)
        break
      default:
        break
    }
  }
  document.querySelectorAll('.changedValue').forEach(element => {
    if (element.value === '') {
      element.classList = []
      element.value = element.defaultValue
    } else {
      element.classList = []
      element.defaultValue = element.value
    }
  })
  document.querySelectorAll('.undoBtn').forEach(element => {
    element.remove()
  })
  // Will go through changes and post them all
}

// FOLLOWING FUNCTIONS MAKE POPUP BOXES
function functionConfirm (msg, del, archive, cancel) {
  const confirmBox = $('#confirm')
  confirmBox.find('.message').text(msg)
  confirmBox.find('.confirmDelete,.confirmArchive,.confirmCancel').unbind().click(function () {
    confirmBox.hide()
  })
  confirmBox.find('.confirmDelete').click(del)
  if (archive !== undefined) {
    confirmBox.find('.confirmArchive').click(archive)
    confirmBox.find('.confirmArchive').show()
  } else {
    confirmBox.find('.confirmArchive').hide()
  }
  confirmBox.find('.confirmCancel').click(cancel)
  confirmBox.show()
}

function msgAndCancel (msg, cancel) {
  const infoBox = $('#info')
  infoBox.find('.message').text(msg)
  infoBox.find('.confirmCancel').unbind().click(function () {
    infoBox.hide()
  })
  infoBox.find('.confirmCancel').click(cancel)
  infoBox.show()
}

function popup (id) {
  const type = id.charAt(0)
  category = getCategory(type)
  console.log(id, category)
  fetch('/info/' + category + '/' + id)
    .then(response => response.json())
    .then(function (body) {
      const send = JSON.stringify(body)
      msgAndCancel(send)
    })
}

// ON LOAD, MAKE ALL THE TABLES
window.addEventListener('load', function (e) {
  // Global storage
  numberOfNewObjs = 0 // Used for unique ids
  numberofNewArchives = 0 // Used for unique ids
  changes = [] // Used for save changes at the end
  // Make tables
  fetch('/buildings')
    .then(response => response.json())
    .then(function (body) {
      makeTable(body, 'b', 'buildingData')
    })
  fetch('/entrances')
    .then(response => response.json())
    .then(function (body) {
      makeTable(body, 'e', 'entranceData')
    })
  fetch('/corridors')
    .then(response => response.json())
    .then(function (body) {
      makeTable(body, 'c', 'corridorData')
    })
  fetch('/rooms')
    .then(response => response.json())
    .then(function (body) {
      makeTable(body, 'r', 'roomData')
    })
  fetch('/unmarkedRooms')
    .then(response => response.json())
    .then(function (body) {
      makeTable(body, 'u', 'unmarkedRoomData')
    })
  fetch('/archive')
    .then(response => response.json())
    .then(function (body) {
      makeArchiveTable(body, 'archiveData')
    })
})

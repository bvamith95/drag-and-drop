const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
    listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
    const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
    arrayNames.forEach((arrayName, index) => {
      localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
    });
}

// Filter Arrays to remove empty items
function filterArray(array){
    const filteredArray = array.filter(item => item !== null);
    return filteredArray;
} 

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {


  // List Item
  const listEl = document.createElement('li');
  listEl.textContent = item;
  listEl.id = index;
  listEl.classList.add('drag-item');
  listEl.draggable = true;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;


  // Append
  columnEl.appendChild(listEl);

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) =>{
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) =>{
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) =>{
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) =>{
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();

}

// Update Item - Delete if necessary, or update Array value
function updateItem(id, column){
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if(!selectedColumnEl[id].textContent){
      delete selectedArray[id];
    }else{
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}


// Add to Column List, Reset Textbox

function addToColumn(column){
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent ='';
  updateDOM();
}


// Show Add Item Input Box
function showInputBox(column){
  addBtns[column].getElementsByClassName.visiblility = 'hidden' ;
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

//Hide Add Item Input Box
function hideInputBox(column){
  addBtns[column].getElementsByClassName.visiblility = 'visible' ;
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allow arrays to reflect Drag and Drop function
function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map(i=> i.textContent); 
  progressListArray = Array.from(progressList.children).map(i => i.textContent); 
  completeListArray = Array.from(completeList.children).map( i => i.textContent); 
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);
  updateDOM();
}

// When Item starts dragging
function drag(e) {
   draggedItem = e.target;
    dragging = true;
}

// Columns Allows for items to Drop
function allowDrop(e){
  e.preventDefault();
}

// When item enter column Area
function dragEnter(column) {
  console.log(listColumns[column]);
  listColumns[column].classList.add('over');
  currentColumn = column ;
}

// Dropping item in Column
function drop(e) {
  e.preventDefault();
  // Remove background Color / Padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  // Add item to Column
  const parent =listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  rebuildArrays();
}


// On Load
updateDOM();
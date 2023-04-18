import Todo from './todo.js';
import Drag from './drag.js';
import SortableApp from './sortable.js';


const todo = new Todo;
const dragNative = new Drag;
const sortableApp = new SortableApp;


function main() {
    todo.start();
    sortableApp.start();
    // dragNative.start();


}

main();
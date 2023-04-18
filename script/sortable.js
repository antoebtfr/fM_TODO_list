class SortableApp {
    constructor() {}

    start() {
        new Sortable(document.getElementById('tasks-list-container'), {});
        console.log('SortableApp is initialized...');
    }

}

export default SortableApp;
class SortableApp {
    constructor() {}

    start() {
        console.log('SortableApp is initialized...');
        new Sortable(document.getElementById('tasks-list-container'), {});
    }

}

export default SortableApp;
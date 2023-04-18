class Drag {
    constructor() {

    }

    start() {
        console.log('Drag is initialized...');
        this.events();
    }

    events() {
        $('#tasks-container').on('dragstart', '.task-item', this.dragstart_handler);
        $('#drag-target').on('drop', this.drop_handler);
        $('#drag-target').on('dragover', this.dragover_handler);
    }

    dragstart_handler(e) {
        e.originalEvent.dataTransfer.setData("text/html", e.target.outerHTML);
        e.originalEvent.dataTransfer.dropEffect = "move";
    }

    dragover_handler(e) {
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = "move";
        e.stopPropagation();
    }

    drop_handler(e) {
        console.log("drop");
        e.preventDefault();

        const data = e.originalEvent.dataTransfer.getData("text/html");
        $(data).insertAfter($(e.target));
        e.stopPropagation();



    }

}

export default Drag;
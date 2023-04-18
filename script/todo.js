import hooks from "./hooks.js";

class Todo {

    constructor() {
        this.lightModeButton = $('.ico-sun');
        this.darkModeButton = $('.ico-moon');
        this.sectionContainer = $('section.container');
        this.lightModeBackgroundColor = 'hsl(0, 0%, 98%)';
        this.darkModeBackgroundColor = 'hsl(235, 21%, 11%)';
        this.activeMode = 'dark';

        this.idCounter = 1;
        this.itemsLeftNumber;
        this.selectedFilter;

        this.messageNoTaskCompleted = 'Pas de tâche complétée pour le moment';
        this.messageNoTaskActive = 'Pas de tâche active pour le moment';
        this.messageNoTaskAll = 'Pas de tâche pour le moment';

        this.mobileMode = false;
    }

    start() {
        console.log('Todo is initialized...');
        this.events();


        if (localStorage.getItem('theme_mode')) {
            this.activeMode = localStorage.getItem('theme_mode');
        }

        if (this.activeMode === 'light') {
            this.activateLightMode();
        } else if (this.activeMode === 'dark') {
            this.activateDarkMode();
        } else {
            alert('ERROR NO THEMEMODE LOADED');
        }


        this.screenSizeChecker();
        this.countItemsLeft();

        if (!this.mobileMode) {
            this.filterLogic();
        } else {
            this.filterLogicMobile();
        }

        this.appendHooks();
    }

    events() {
        this.lightModeButton.on('click', this.activateLightMode.bind(this));
        this.darkModeButton.on('click', this.activateDarkMode.bind(this));
        $('.task-add-input').keypress(e => {
            if (e.which == '13') {
                this.createTask();
            }
        })
        $('.task-input-container .task-check-box').on('click', this.createTask.bind(this));
        $('#tasks-container').on('click', '.task-item[data-status="active"] .task-check-box', this.completeTask.bind(this));
        $('#tasks-container').on('click', '.task-item[data-status="active"] p', this.completeTask.bind(this));
        $('#tasks-container').on('click', '.task-item[data-status="completed"] .task-check-box', this.activateTask.bind(this));
        $('#tasks-container').on('click', '.task-item[data-status="completed"] p', this.activateTask.bind(this));


        $('#tasks-container').on('click', '.task-cross', this.deleteTask.bind(this));


        // Filters events

        $('.tasks-filter-active').on('click', this.activeFilter.bind(this));
        $('.tasks-filter-completed').on('click', this.completedFilter.bind(this));
        $('.tasks-filter-all').on('click', this.allFilter.bind(this));
        //Mobile

        // Clear Completed 

        $('.tasks-clear-completed').on('click', this.clearCompleted.bind(this));

    }


    activateLightMode() {
        this.sectionContainer.addClass('lightmode');
        $('body').css('background-color', this.lightModeBackgroundColor);
        this.activeMode = 'light';
        this.saveModeInLocalStorage();
    }

    activateDarkMode() {
        this.sectionContainer.removeClass('lightmode');
        $('body').css('background-color', this.darkModeBackgroundColor);
        this.activeMode = 'dark';
        this.saveModeInLocalStorage();
    }

    saveModeInLocalStorage() {
        localStorage.setItem('theme_mode', this.activeMode);
    }

    createTask() {
        const input = $('.task-add-input');

        if (!input.val()) {
            return false;
        }

        const newTask = {
            id: this.idCounter,
            status: 'active',
            content: input.val()
        };

        const taskTemplate = `
        <div class="task-item" data-id='${newTask.id}' data-status='${newTask.status}' draggable="true">

        <div class="left">
          <div class="task-check-box"></div>
          <p> ${newTask.content}
          </p>
        </div>

        <div class="task-cross-delete">
          <svg class="task-cross" xmlns="http://www.w3.org/2000/svg" width="25" height="25">
            <path fill="#494C6B" fill-rule="evenodd"
              d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" />
          </svg>
        </div>
      </div>
        `


        $('.tasks-list-container').append(taskTemplate);
        this.idCounter++;

        this.addItemsLeft();


        if (this.selectedFilter === "completed") {
            this.completedFilter();
        }

        if (this.selectedFilter === "active") {
            this.activeFilter();
        }

        if (this.selectedFilter === "all") {
            this.allFilter();
        }


        input.val('');
        return true;

    }

    completeTask(e) {
        $(e.target).parents('.task-item').attr('data-status', 'completed');
        this.removeItemsLeft();

        if (this.selectedFilter === 'active') {
            this.activeFilter();
        }
    }

    activateTask(e) {
        $(e.target).parents('.task-item').attr('data-status', 'active');
        this.addItemsLeft();
    }

    deleteTask(e) {

        const task = $(e.target).parents('.task-item');

        if (task.data('status') === "active") {
            this.removeItemsLeft();
        }

        task.remove();

        hooks.call('afterDeleteTask');

    }

    countItemsLeft() {
        if (this.itemsLeftNumber == undefined) {
            this.itemsLeftNumber = $('.task-item:not([data-status="completed"])').length;
        }

        $('.items-left span').html(this.itemsLeftNumber + ' ');
    }

    addItemsLeft() {
        this.itemsLeftNumber++;
        this.countItemsLeft();
    }

    removeItemsLeft() {
        this.itemsLeftNumber--;
        this.countItemsLeft();
    }

    activeFilter() {

        const tasksActive = $('.tasks-list-container .task-item[data-status="active"]');
        const filterKeyword = 'active';


        tasksActive.removeClass('filtered');
        $('.tasks-list-container .task-item:not([data-status="active"])').addClass('filtered');


        if (!this.mobileMode) {
            this.filterLogic(filterKeyword);
        } else {
            this.filterLogicMobile(filterKeyword);
        }

        tasksActive.css('border-bottom', '1px solid hsl(233, 14%, 35%)');
        tasksActive.last().css('border-bottom', 'none');

        this.noTaskMessageFilterLogic();
    }


    completedFilter() {
        const tasksCompleted = $('.tasks-list-container .task-item[data-status="completed"]');
        const filterKeyword = 'completed';

        tasksCompleted.removeClass('filtered');
        $('.tasks-list-container .task-item:not([data-status="completed"])').addClass('filtered');

        if (!this.mobileMode) {
            this.filterLogic(filterKeyword);
        } else {
            this.filterLogicMobile(filterKeyword);
        }

        tasksCompleted.css('border-bottom', '1px solid hsl(233, 14%, 35%)');
        tasksCompleted.last().css('border-bottom', 'none');

        this.noTaskMessageFilterLogic();
    }


    allFilter() {
        const tasks = $('.task-item');
        const filterKeyword = 'all';

        tasks.removeClass('filtered');

        if (!this.mobileMode) {
            this.filterLogic(filterKeyword);
        } else {
            this.filterLogicMobile(filterKeyword);
        }

        tasks.css('border-bottom', '1px solid hsl(233, 14%, 35%)');
        tasks.last().css('border-bottom', 'none');

        this.noTaskMessageFilterLogic();
    }

    filterLogic(filter) {

        if (this.selectedFilter === undefined) {
            this.selectedFilter = $('.tasks-filter-container .selected').html().toLowerCase();
        }

        if (this.selectedFilter === filter) {
            return false;
        }

        if (filter) {
            $('.tasks-filter-container .selected').removeClass('selected');
            $('.tasks-filter-' + filter).addClass('selected');
            this.selectedFilter = filter;
            return;
        }


        this.selectedFilter = $('.tasks-filter-container .selected').html().toLowerCase();

    }

    filterLogicMobile(filter) {

        if (this.selectedFilter === undefined) {
            this.selectedFilter = $('.tasks-filter-container-mobile .selected').html().toLowerCase();
        }

        if (this.selectedFilter === filter) {
            return false;
        }

        if (filter) {
            $('.tasks-filter-container-mobile .selected').removeClass('selected');
            $('.tasks-filter-' + filter).addClass('selected');
            this.selectedFilter = filter;
            return;
        }

    }

    showNoTaskMessage(message) {
        const container = $('.no-tasks-message-container');

        if (message) {
            container.html(message);
        }

        container.addClass('active');

        return;
    }

    hideNoTaskMessage() {
        $('.no-tasks-message-container').removeClass('active');
    }

    noTaskMessageFilterLogic() {

        switch (this.selectedFilter) {
            case 'active':
                if ($('.task-item[data-status="active"]').length) {
                    this.hideNoTaskMessage();
                } else {
                    this.showNoTaskMessage(this.messageNoTaskActive);
                }
                break;
            case 'completed':
                if ($('.task-item[data-status="completed"]').length) {
                    this.hideNoTaskMessage();
                } else {
                    this.showNoTaskMessage(this.messageNoTaskCompleted);
                }
                break;
            case 'all':
                if ($('.task-item').length) {
                    this.hideNoTaskMessage();
                } else {
                    this.showNoTaskMessage(this.messageNoTaskAll);
                }
                break;
        }
    }

    clearCompleted() {
        $('.tasks-list-container .task-item[data-status="completed"]').remove();
        this.noTaskMessageFilterLogic();
    }

    screenSizeChecker() {
        if (window.screen.width <= 700) {
            this.mobileMode = true;
        }
    }

    appendHooks() {
        hooks.add('afterDeleteTask', this.noTaskMessageFilterLogic.bind(this));
    }
}



export default Todo;
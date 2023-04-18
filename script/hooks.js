const hooks = {
    queue: {},

    add: function (name, fn) {
        if (!hooks.queue[name]) {
            hooks.queue[name] = [];
        }
        hooks.queue[name].push(fn);
    },

    // add: function (name, fn) {
    //     let queueName = hooks.queue[name];
    //     !queueName ? queueName = [] : queueName.push(fn);
    // },


    call: function (name, ...params) {
        if (hooks.queue[name]) {
            hooks.queue[name].forEach(fn => fn(...params));
            delete hooks.queue[name];
        }
    }
};

export default hooks;
import Vue from 'vue';

export const undoRedoMixin = {
    data() {
        return {
            undoStack: [],
            redoStack: [],
        };
    },
    methods: {
        addToUndoStack(action) {
            this.undoStack.push(action);
        },
        undo() {
            if (this.undoStack.length > 0) {
                const lastAction = this.undoStack.pop();
                this.redoStack.push(lastAction);
            }
        },
        redo() {
            if (this.redoStack.length > 0) {
                const nextAction = this.redoStack.pop();
                this.undoStack.push(nextAction);
            }
        },
    },
};

Vue.mixin(undoRedoMixin);
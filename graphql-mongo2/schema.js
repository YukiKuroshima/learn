const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const graphql = require('graphql');
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLBoolean = graphql.GraphQLBoolean;
const GraphQLID = graphql.GraphQLID;
const GraphQLString = graphql.GraphQLString;
const GraphQLList = graphql.GraphQLList;
const GraphQLNonNull = graphql.GraphQLNonNull;
const GraphQLSchema = graphql.GraphQLSchema;

// Mongoose Schema definition
const TODO = mongoose.model('Todo', new Schema({
  id: mongoose.Schema.Types.ObjectId,
  title: String,
  completed: Boolean,
}));

const COMPOSE_URI_DEFAULT = 'mongodb://graphqltodosuser:graphqltodospassword@candidate.12.mongolayer.com:11219,candidate.60.mongolayer.com:10594/graphqltodos?replicaSet=set-569540e711469f811f0000a2';
mongoose.connect(process.env.COMPOSE_URI || COMPOSE_URI_DEFAULT, (error) => {
  if (error) console.error(error);
  else console.log('mongo connected');
});

const TodoType = new GraphQLObjectType({
  name: 'todo',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'Todo id',
    },
    title: {
      type: GraphQLString,
      description: 'Task title',
    },
    completed: {
      type: GraphQLBoolean,
      description: 'Flag to mark if the task is completed',
    },
  }),
});

// resolve a quer
const promiseListAll = () => (
  new Promise((resolve, reject) => {
    TODO.find((err, todos) => {
      if (err) reject(err);
      else resolve(todos);
    });
  })
);

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    todos: {
      type: new GraphQLList(TodoType),
      resolve: () => (
        promiseListAll()
      ),
    },
  }),
});


const MutationAdd = {
  type: TodoType,
  description: 'Add a Todo',
  args: {
    title: {
      name: 'Todo title',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (root, args) => {
    const newTodo = new TODO({
      title: args.title,
      completed: false,
    });
    newTodo.id = newTodo._id;
    return new Promise((resolve, reject) => {
      newTodo.save(function (err) {
        if (err) reject(err);
        else resolve(newTodo);
      });
    });
  },
};

var MutationToggle = {
  type: TodoType,
  description: 'Toggle the todo',
  args: {
    id: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      TODO.findById(args.id, (err, todo) => {
        if (err) {
          reject(err)
          return
        }

        if (!todo) {
          reject('Todo NOT found')
          return
        } else {
          todo.completed = !todo.completed
          todo.save((err) => {
            if (err) reject(err)
            else resolve(todo)
          })
        }
      })
    })
  }
}

var MutationDestroy = {
  type: TodoType,
  description: 'Destroy the todo',
  args: {
    id: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      TODO.findById(args.id, (err, todo) => {
        if (err) {
          reject(err)
        } else if (!todo) {
          reject('Todo NOT found')
        } else {
          todo.remove((err) => {
            if (err) reject(err)
            else resolve(todo)
          })
        }
      })
    })
  }
}

var MutationToggleAll = {
  type: new GraphQLList(TodoType),
  description: 'Toggle all todos',
  args: {
    checked: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      TODO.find((err, todos) => {
        if (err) {
          reject(err)
          return
        }
        TODO.update({
          _id: {
            $in: todos.map((todo) => todo._id)
          }
        }, {
          completed: args.checked
        }, {
          multi: true
        }, (err) => {
          if (err) reject(err)
          else promiseListAll().then(resolve, reject)
        })
      })
    })
  }
}

var MutationClearCompleted = {
  type: new GraphQLList(TodoType),
  description: 'Clear completed',
  resolve: () => {
    return new Promise((resolve, reject) => {
      TODO.find({ completed: true }, (err, todos) => {
        if (err) {
          reject(err)
        } else {
          TODO.remove({
            _id: {
              $in: todos.map((todo) => todo._id)
            },
          }, (err) => {
            if (err) reject(err);
            else resolve(todos);
          });
        }
      });
    });
  },
};

const MutationSave = {
  type: TodoType,
  description: 'Edit a todo',
  args: {
    id: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLString),
    },
    title: {
      name: 'Todo title',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      TODO.findById(args.id, (err, todo) => {
        if (err) {
          reject(err);
          return;
        }

        if (!todo) {
          reject('Todo NOT found');
          return;
        }

        todo.title = args.title;
        todo.save((err) => {
          if (err) reject(err);
          else resolve(todo);
        });
      });
    });
  },
};

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd,
    toggle: MutationToggle,
    toggleAll: MutationToggleAll,
    destroy: MutationDestroy,
    clearCompleted: MutationClearCompleted,
    save: MutationSave,
  },
});

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

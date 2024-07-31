/* eslint-disable prettier/prettier */
import type { SVGProps } from 'react'

import * as Checkbox from '@radix-ui/react-checkbox'
// import { useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'


// import { useQuery, useMutation, useQueryClient } from 'react-query'


import { api } from '@/utils/client/api'
/**
 * QUESTION 3:
 * -----------
 * A todo has 2 statuses: "pending" and "completed"
 *  - "pending" state is represented by an unchecked checkbox
 *  - "completed" state is represented by a checked checkbox, darker background,
 *    and a line-through text
 *
 * We have 2 backend apis:
 *  - (1) `api.todo.getAll`       -> a query to get all todos
 *  - (2) `api.todoStatus.update` -> a mutation to update a todo's status
 *
 * Example usage for (1) is right below inside the TodoList component. For (2),
 * you can find similar usage (`api.todo.create`) in src/client/components/CreateTodoForm.tsx
 *
 * If you use VSCode as your editor , you should have intellisense for the apis'
 * input. If not, you can find their signatures in:
 *  - (1) src/server/api/routers/todo-router.ts
 *  - (2) src/server/api/routers/todo-status-router.ts
 *
 * Your tasks are:
 *  - Use TRPC to connect the todos' statuses to the backend apis
 *  - Style each todo item to reflect its status base on the design on Figma
 *
 * Documentation references:
 *  - https://trpc.io/docs/client/react/useQuery
 *  - https://trpc.io/docs/client/react/useMutation
 *
 *
 *
 *
 *
 * QUESTION 4:
 * -----------
 * Implement UI to delete a todo. The UI should look like the design on Figma
 *
 * The backend api to delete a todo is `api.todo.delete`. You can find the api
 * signature in src/server/api/routers/todo-router.ts
 *
 * NOTES:
 *  - Use the XMarkIcon component below for the delete icon button. Note that
 *  the icon button should be accessible
 *  - deleted todo should be removed from the UI without page refresh
 *
 * Documentation references:
 *  - https://www.sarasoueidan.com/blog/accessible-icon-buttons
 *
 *
 *
 *
 *
 * QUESTION 5:
 * -----------
 * Animate your todo list using @formkit/auto-animate package
 *
 * Documentation references:
 *  - https://auto-animate.formkit.com
 */
type StatusFilter = 'all' | 'pending' | 'completed';
interface TodoListProps {
  statusFilter: StatusFilter;
}
export const TodoList = ({ statusFilter }: TodoListProps) => {

  const animationConfig = {
    duration: 100,
    easing: 'ease-in-out',
    delay: 0,
  }

  const [parent] = useAutoAnimate(animationConfig)

  const { data: todos = [] } = api.todo.getAll.useQuery({
    statuses: ['completed', 'pending'],
  })

  // Handle checkbox change

  const apiContext = api.useContext()

  const updateTodoStatus = api.todoStatus.update.useMutation({
    onSuccess: () => {
      apiContext.todo.getAll.refetch()
    },
  })

  const handleStatusChange = (todo: { status: "completed" | "pending"; id: number; body: string }) => {
    updateTodoStatus.mutate({
      todoId: todo.id,
      status: todo.status === 'pending' ? 'completed' : 'pending',
    })
  }


  // Delete todo mutation
  const { mutate: deleteTodo } = api.todo.delete.useMutation({
    onSuccess: () => {
      apiContext.todo.getAll.refetch()// Refetch todos after deleting a todo
    },
  })
  // Handle delete button click
  const handleDeleteClick = (todoId: number) => {
    deleteTodo({ id: todoId })
  }

  const filteredTodos = todos.filter(todo => {
    if (statusFilter === 'all') { return true }
    return todo.status === statusFilter
  })



  return (
    <div>

      <ul ref={parent} className="grid grid-cols-1 gap-y-3">
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <div
              className={`flex items-center rounded-12 px-4 py-4 shadow-sm ${todo.status === 'completed' ? 'border-gray-700 bg-gray-100' : 'border-gray-200'
                }`}
            >
              <Checkbox.Root
                id={String(todo.id)}
                className={`flex h-6 w-6 items-center justify-center rounded-6 border ${todo.status === 'completed' ? 'border-gray-700 bg-gray-700' : 'border-gray-300'
                  } focus:outline-none`}
                checked={todo.status === 'completed'}
                onCheckedChange={() => handleStatusChange(todo)}
              >
                <Checkbox.Indicator>
                  <CheckIcon
                    className={`h-4 w-4 ${todo.status === 'completed' ? 'text-white' : 'text-transparent'}`}
                    style={{
                      // margin: '0 0 0 200px'
                    }} />
                </Checkbox.Indicator>


              </Checkbox.Root>

              <label
                className={`block pl-3 font-medium ${todo.status === 'completed' ? 'line-through text-gray-400' : ''
                  }`}
                htmlFor={String(todo.id)}
              >
                {todo.body}
              </label>
              <button
                onClick={() => handleDeleteClick(todo.id)}
                aria-label="Delete todo"
                className="ml-4 p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-700"
                style={{
                  float: 'right',
                  position: 'absolute',
                  margin: '0 0 0 350px',

                }}
              >
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </li>
        ))}
      </ul>

    </div >
  )
}

const XMarkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}

/* eslint-disable prettier/prettier */
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'

import { CreateTodoForm } from '@/client/components/CreateTodoForm'
import { TodoList } from '@/client/components/TodoList'

/**
 * QUESTION 6:
 * -----------
 * Implement quick filter/tab feature so that we can quickly find todos with
 * different statuses ("pending", "completed", or both). The UI should look like
 * the design on Figma.
 *
 * NOTE:
 *  - For this question, you must use RadixUI Tabs component. Its Documentation
 *  is linked below.
 *
 * Documentation references:
 *  - https://www.radix-ui.com/docs/primitives/components/tabs
 */

type StatusFilter = 'all' | 'pending' | 'completed';
const Index = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  return (
    <main className="mx-auto w-[480px] pt-12">
      <div className="rounded-12 bg-white p-8 shadow-sm">
        <h1 className="text-center text-4xl font-extrabold text-gray-900">
          Todo App
        </h1>

        <Tabs defaultValue="all" className="pt-10">
          <TabsList className="flex space-x-6 mb-6 ">
            <TabsTrigger
              value="all"
              className="px-6 py-2 text-base border border-gray-300 font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:border-0"
              onClick={() => setStatusFilter('all')}
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="px-4 py-2 text-base border border-gray-300 font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:border-0"
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="px-4 py-2 text-base border border-gray-300 font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:border-0"
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TodoList statusFilter={statusFilter} />
          </TabsContent>
          <TabsContent value="pending">
            <TodoList statusFilter={statusFilter} />
          </TabsContent>
          <TabsContent value="completed">
            <TodoList statusFilter={statusFilter} />
          </TabsContent>
        </Tabs>

        <div className="pt-10">
          <CreateTodoForm />
        </div>
      </div>
    </main>
  )
}

export default Index

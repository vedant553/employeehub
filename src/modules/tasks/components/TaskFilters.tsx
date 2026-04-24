import * as React from 'react'
import { Input, Select, InputWrapper } from '@hryantra/ui'
import { Search } from 'lucide-react'

export function TaskFilters() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <div className="w-full sm:w-64">
        <InputWrapper leftIcon={<Search className="size-4" />}>
           <Input placeholder="Search tasks..." type="search" hasLeftIcon />
        </InputWrapper>
      </div>
      <Select className="w-full sm:w-auto">
         <option value="">All Statuses</option>
         <option value="todo">To Do</option>
         <option value="in_progress">In Progress</option>
         <option value="blocked">Blocked</option>
         <option value="completed">Completed</option>
      </Select>
      <Select className="w-full sm:w-auto">
         <option value="">All Priorities</option>
         <option value="urgent">Urgent</option>
         <option value="high">High</option>
         <option value="medium">Medium</option>
         <option value="low">Low</option>
      </Select>
    </div>
  )
}

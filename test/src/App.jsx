import React from 'react'
import ApiFetch from './components/ApiFetch'
import ErrorBoundary from './ErroreBoundary'
import TodoList from './components/TodoList'

const App = () => {
  return (
    <div>
      {/* <h1>Hello World</h1> */}
      <ErrorBoundary>
        <TodoList />
        {/* <ApiFetch/> */}
      </ErrorBoundary>
    </div>
  )
}

export default App

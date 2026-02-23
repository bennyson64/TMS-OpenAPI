import {BugReportForm} from './components/taskForm'
import DisplayForm from './components/displayForm'
export default function App() {
  return(
    <div className="flex items-center justify-center gap-10 p-18">
      <BugReportForm />
      <DisplayForm />
    </div>
  )
}
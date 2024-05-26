import BudgetDetails from "../components/Details/Budget";
import BudgetList from '../components/List/Budget';

export function Component() {
  return (
    <>
      <BudgetDetails />
      <BudgetList />
    </>
  )
}

Component.displayName = "Budget";
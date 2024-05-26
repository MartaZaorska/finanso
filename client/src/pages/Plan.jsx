import PlanDetails from "../components/Details/Plan";
import GoalList from '../components/List/Goal';
import PaymentList from '../components/List/Payment';

export function Component() {
  return (
    <>
      <PlanDetails />
      <GoalList />
      <PaymentList />
    </>
  )
}

Component.displayName = "Plan";
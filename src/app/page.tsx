import { getDataAction } from './_libs/serverActions';
import { BudgetPage } from './_components/features/Budget/BudgetPage';

export default async function HomePage() {
  const data = await getDataAction();

  return (
    <BudgetPage
      initialData={data}
    />
  );
}

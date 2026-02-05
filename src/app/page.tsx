import { LanguageProvider } from '@/context/LanguageContext';
import { InvestmentSimulator } from '@/components/InvestmentSimulator';

export default function Home() {
  return (
    <LanguageProvider>
      <InvestmentSimulator />
    </LanguageProvider>
  );
}

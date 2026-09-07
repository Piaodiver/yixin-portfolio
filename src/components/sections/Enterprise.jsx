import { enterprise } from '../../content/enterprise';
import Section from '../Section';
import SectionHead from '../tech/SectionHead';
import CaseCard from '../CaseCard';

export default function Enterprise() {
  return (
    <Section id="enterprise">
      <SectionHead
        num="02"
        aside="Enterprise"
        title="Systems that shipped, for companies that audit them"
        lede="Nine years of enterprise delivery across SAP, Wiz.AI, and Salesforce — CRM transformation at lighthouse scale, a company's first LLM customer, and Agentforce architecture for twenty-plus APAC enterprises."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {enterprise.map((c) => <CaseCard key={c.slug} item={c} />)}
      </div>
    </Section>
  );
}

import { PageHeader, Empty } from '../components/ui.jsx';

export default function ComingSoon({ title, note }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="panel"><Empty title="Not built yet" hint={note} /></div>
    </>
  );
}

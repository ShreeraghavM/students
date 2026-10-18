import JobDetailClient from './JobDetailClient';

export function generateStaticParams() {
  return [
    { id: 'job_1' },
    { id: 'job_2' },
    { id: 'job_3' },
    { id: 'job_4' },
    { id: 'job_5' },
    { id: 'job_6' },
    { id: 'job_7' },
    { id: 'job_8' },
  ];
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  return <JobDetailClient id={params.id} />;
}

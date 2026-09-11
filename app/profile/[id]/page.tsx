import ProfileClient from './ProfileClient';

export function generateStaticParams() {
  return [
    { id: 'user_admin' },
    { id: 'user_client_sarah' },
    { id: 'user_client_marcus' },
    { id: 'user_student_alex' },
    { id: 'user_student_maya' },
    { id: 'user_student_leo' },
  ];
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  return <ProfileClient id={params.id} />;
}

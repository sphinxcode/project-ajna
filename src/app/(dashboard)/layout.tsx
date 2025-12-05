import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import Image from 'next/image';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email')
    .eq('id', user.id)
    .single();

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden bg-[#FDF8F5]">
      {/* Background Image - Fixed and Full Screen */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <Image
          src="/hd-bg-transparent.png"
          alt="Human Design Background"
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
          quality={100}
        />
      </div>

      {/* Sidebar */}
      <DashboardSidebar user={user} profile={profile} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto bg-transparent">
        {children}
      </main>
    </div>
  );
}

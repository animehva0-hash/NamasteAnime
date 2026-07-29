import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
}

export default async function WatchPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  // Redirect to main anime page - watching is handled inline
  redirect(`/anime/${id}`);
}

import VerifyView from "@/components/VerifyView";

export const metadata = {
  title: "Verify · logbook",
};

export default async function VerifyDeepLink({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <VerifyView initialId={decodeURIComponent(eventId)} />;
}

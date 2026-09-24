import { ChannelHomeView } from "@/features/channels/components/ChannelHomeView";

export default async function ChannelHomePage({ params }) {
  const resolvedParams = await params;
  const handle = resolvedParams?.handle || "demo-restaurant";
  return <ChannelHomeView handle={handle} />;
}

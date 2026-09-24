import { ChannelMenuView } from "@/features/menu/components/ChannelMenuView";

export default async function ChannelMenuPage({ params }) {
  const resolvedParams = await params;
  const handle = resolvedParams?.handle || "demo-restaurant";
  return <ChannelMenuView handle={handle} />;
}

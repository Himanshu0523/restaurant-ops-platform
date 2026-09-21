import { ChannelMenuView } from "@/features/menu/components/ChannelMenuView";

export default function ChannelMenuPage({ params }) {
  const handle = params?.handle || "demo-restaurant";
  return <ChannelMenuView handle={handle} />;
}

import { ChannelHomeView } from "@/features/channels/components/ChannelHomeView";

export default function ChannelHomePage({ params }) {
  const handle = params?.handle || "demo-restaurant";
  return <ChannelHomeView handle={handle} />;
}

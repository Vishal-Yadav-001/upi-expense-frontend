import { ChatPanel } from "@/components/chat/ChatPanel";
import { ArtifactPanel } from "@/components/artifacts/ArtifactPanel";

export default function Home() {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Column: Chat */}
      <div className="w-1/2 flex flex-col h-full">
        <ChatPanel />
      </div>

      {/* Right Column: Artifacts */}
      <div className="w-1/2 flex flex-col h-full bg-card/10">
        <ArtifactPanel />
      </div>
    </div>
  );
}

import Image from "next/image";
import { Text } from "@/components/atoms/Text";

/** Avatar stack + short copy (hero, bottom-left). */
export function HeroNote({ text }: { text: string }) {
  return (
    <div className="absolute bottom-[14cqw] left-[3.4cqw] z-20 w-[17cqw] animate-from-left [animation-delay:1.4s]">
      <Image src="/images/avatars.png" alt="Happy customers" width={246} height={154} className="mb-[5.5cqw] w-[7cqw]" />
      <Text className="indent-[3.7cqw] text-[#444]">{text}</Text>
    </div>
  );
}

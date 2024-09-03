import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sidebarItemsVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemsVariants>["variant"];
}

export default function SidebarItem({
  label,
  id,
  icon: Icon,
  variant,
}: SidebarItemProps) {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      variant={"transparent"}
      size={"sm"}
      asChild
      className={cn(sidebarItemsVariants({ variant }))}>
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate capitalize">{label}</span>
      </Link>
    </Button>
  );
}

import { toast } from "@/components/ui/use-toast"

export function showPaywallToast(message?: string) {
  toast({
    title: "Pro 플랜 필요",
    description: message || "이 기능은 Pro 이상 요금제에서 제공됩니다.",
    variant: "default",
    action: {
      label: "업그레이드",
      onClick: () => {
        window.location.href = "/pricing"
      },
    },
  })
}

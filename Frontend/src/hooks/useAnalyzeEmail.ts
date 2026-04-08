import { useMutation } from "@tanstack/react-query";
import { analyzeEmail } from "@/services/api";

export function useAnalyzeEmail() {
  return useMutation({
    mutationFn: (emailText: string) => analyzeEmail(emailText),
  });
}

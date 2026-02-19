import { CheckCircle, XCircle } from "lucide-react";

export function FinalizedCell({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle className="h-5 w-5 text-emerald-500" />
  ) : (
    <XCircle className="h-5 w-5 text-gray-400" />
  );
}

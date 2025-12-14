import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Spinner } from "./ui/spinner";

type DeploymentStatus = "idle" | "deploying" | "live" | "error";

type StatusBadgeProps = {
  status: DeploymentStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "live":
      return (
        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Live
        </Badge>
      );
    case "deploying":
      return (
        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          <Spinner />
          Deploying
        </Badge>
      );
    case "error":
      return (
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
          <AlertCircle className="w-3 h-3 mr-1" />
          Error
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-secondary">
          Not Deployed
        </Badge>
      );
  }
}

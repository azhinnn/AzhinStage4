import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

import { CircleDot, MinusCircleIcon, PlayCircleIcon } from "lucide-react";

export const appointmentStatus = [
  {
    value: "checkedIn",
    label: "Checked In",
    icon: CircleDot,
  },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircledIcon,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: CrossCircledIcon,
  },
];

export const visitStatus = [
  {
    value: "checkedIn",
    label: "Checked In",
    icon: CircleDot,
  },
  {
    value: "notArived",
    label: "Not Arrived",
    icon: MinusCircleIcon,
  },
  {
    value: "arrived",
    label: "Arrived",
    icon: PlayCircleIcon,
  },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircledIcon,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: CrossCircledIcon,
  },
];

export const waitingStatus = [
  {
    value: "pending",
    label: "Pending",
    icon: CircleDot,
  },
  {
    value: "accepted",
    label: "Accepted",
    icon: CheckCircledIcon,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: CrossCircledIcon,
  },
];

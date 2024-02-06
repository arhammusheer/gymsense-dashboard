type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface Usage {
  weekday: Weekday;
  usage: number;
  max: number;
}

export const usage: Usage[] = [
  {
    max: 20,
    usage: 17,
    weekday: "monday",
  },
  {
    max: 20,
    usage: 13,
    weekday: "tuesday",
  },
  {
    max: 20,
    usage: 14,
    weekday: "wednesday",
  },
  {
    max: 20,
    usage: 17,
    weekday: "thursday",
  },
  {
    max: 20,
    usage: 7,
    weekday: "friday",
  },
  {
    max: 20,
    usage: 4,
    weekday: "saturday",
  },
  {
    max: 20,
    usage: 19,
    weekday: "sunday",
  },
];

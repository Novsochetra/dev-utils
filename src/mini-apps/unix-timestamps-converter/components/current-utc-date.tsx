import { useState, useEffect } from "react";
import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";

let utcInterval: NodeJS.Timeout;

export const CurrentUTCDate = () => {
  const [utcDateValue, setUTCDateValue] = useState(
    format(new UTCDate(), "EEE dd MMM yyyy HH:mm:ss"),
  );

  useEffect(() => {
    if (utcInterval) {
      clearInterval(utcInterval);
    }

    utcInterval = setInterval(() => {
      const now = new UTCDate();
      setUTCDateValue(format(now, "EEE dd MMM yyyy HH:mm:ss"));
    }, 1000);

    return () => {
      clearInterval(utcInterval);
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center">
      <p className="text-sm font-semibold mb-2">UTC Date & Time</p>
      <p className="text-sm">{utcDateValue}</p>
    </div>
  );
};

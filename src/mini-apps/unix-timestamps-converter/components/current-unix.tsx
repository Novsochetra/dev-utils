import { useState, useEffect } from "react";
import { getUnixTime } from "date-fns";
import { UTCDate } from "@date-fns/utc";

let utcInterval: NodeJS.Timeout;

export const CurrentUnix = () => {
  const [currentUnixValue, setCurrentUnixValue] = useState(
    getUnixTime(new UTCDate()),
  );

  useEffect(() => {
    if (utcInterval) {
      clearInterval(utcInterval);
    }

    utcInterval = setInterval(() => {
      const now = new UTCDate();
      setCurrentUnixValue(getUnixTime(now));
    }, 1000);

    return () => {
      clearInterval(utcInterval);
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center">
      <p className="text-sm font-semibold mb-2">Unix Time</p>
      <p className="text-sm">{currentUnixValue}</p>
    </div>
  );
};

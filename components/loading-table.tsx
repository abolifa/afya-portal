import React from "react";
import { Skeleton } from "./ui/skeleton";

const LoadingTable = () => {
  return (
    <div className="flex flex-col gap-2 bg-background p-5 rounded-lg shadow border">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

export default LoadingTable;

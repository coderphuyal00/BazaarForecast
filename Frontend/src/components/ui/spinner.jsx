import { Spinner } from "@material-tailwind/react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <Spinner className="animate-spin h-16 w-16 text-gray-900/50" color="color-gray-300"/>
    </div>
  );
}

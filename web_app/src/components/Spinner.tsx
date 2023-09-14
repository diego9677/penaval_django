import clsx from "clsx";

type Props = {
  color: "white" | "primary";
  size?: "md" | "lg";
};

export const Spinner = ({ color, size = 'md' }: Props) => {
  return (
    <div className={clsx(color === 'white' ? 'text-gray-100' : 'text-blue-600')}>
      <i className={clsx('animate-spin las la-circle-notch', size === 'md' ? 'la-lg' : 'la-3x')} />
    </div>
  );
};

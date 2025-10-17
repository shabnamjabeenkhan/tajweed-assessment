import { cn } from "~/lib/utils";

type WorkspaceIconProps = {
  intent?: 'primary' | 'secondary' | 'accent' | 'gray' | 'danger' | 'success' | 'warning' | 'info' | 'neutral';
};

const intentClasses = {
  primary: 'before:bg-blue-600',
  secondary: 'before:bg-purple-600',
  accent: 'before:bg-emerald-600',
  gray: 'before:bg-gray-600',
  danger: 'before:bg-red-600',
  success: 'before:bg-green-600',
  warning: 'before:bg-orange-600',
  info: 'before:bg-cyan-600',
  neutral: 'before:bg-gray-950 dark:before:bg-white'
};

export const WorkspaceIcon: React.FC<WorkspaceIconProps> = ({ intent = 'primary' }) => {
    return (
      <span
        className={cn(
          'block size-3 relative before:absolute before:inset-0 before:rounded-full before:m-auto before:size-2',
          intentClasses[intent]
        )}
      />
    );
};
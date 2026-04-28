export const Group = ({
  children,
  title,
  description,
  className,
  last = false,
}: {
  children: React.ReactNode;
  title: string;
  description?: string | React.ReactNode;
  last?: boolean;
  className?: string;
}) => (
  <div className={last ? 'mb-0' : 'mb-8'}>
    <h3 className="title-h3 mb-4">{title}</h3>
    {description && (
      <p className="mb-4 body-regular-base-paragraph">{description}</p>
    )}
    <div className={className}>{children}</div>
  </div>
);

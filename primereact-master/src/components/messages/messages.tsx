import React, { useMemo } from 'react';
import { Button, ButtonProps } from 'primereact/button';
import cn from 'classnames';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import { MessagesProps } from './types';

const icons = {
  info: <IconInfoCircle className="icon-4xl" />,
  error: <IconAlertCircle className="icon-4xl" />,
  success: <IconCircleCheck className="icon-4xl" />,
  warn: <IconAlertTriangle className="icon-4xl" />,
  secondary: <IconInfoCircle className="icon-4xl" />,
  contrast: <IconInfoCircle className="icon-4xl" />,
};

const buttonSeverity: Record<string, ButtonProps['severity']> = {
  error: 'danger',
  warn: 'warning',
  info: 'info',
  success: 'success',
  secondary: 'secondary',
  contrast: 'contrast',
};

export const Messages: React.FC<MessagesProps> = ({
  severity = 'info',
  summary,
  detail,
  icon,
  children,
  dataTest,
  className,
  isAlignCenterTitle,
  closable = false,
  onClose,
  closeMessage = 'Hide Message',
  withoutIcon = false,
}) => {
  const handleClick = () => {
    if (onClose) {
      onClose(false);
    }
  };

  const defaultIcon = useMemo(() => icons[severity] ?? icons.info, [severity]);
  // Добавил прямую проверку, чтобы не ломать мозг в шаблоне
  const isExistsIcon = useMemo(() => Boolean(icon), [icon]);

  return (
    <div
      className={cn(
        'p-message p-component p-message-enter-done',
        `p-message-${severity}`,
        className
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-pc-name="messages"
      data-pc-section="root"
      data-test={dataTest && `${dataTest}-message`}
    >
      <div className="p-message-wrapper" data-pc-section="wrapper">
        <div className="p-message-inner" data-pc-section="inner">
          <div
            className={cn(
              'p-message-header',
              isAlignCenterTitle && 'p-message-header-vertical-center'
            )}
          >
            {!withoutIcon && (
              <div className={cn('p-message-icon')}>
                {!isExistsIcon && defaultIcon}
                {isExistsIcon && icon}
              </div>
            )}
            <div
              className={cn([
                'p-message-header-content',
                !summary || !detail
                  ? 'p-message-header-content-centered'
                  : 'p-message-header-content-column',
              ])}
            >
              {summary ? (
                <div
                  className="p-message-summary line-height-normal"
                  data-test={dataTest && `${dataTest}-message-summary`}
                >
                  {summary}
                </div>
              ) : null}
              {detail ? (
                <div
                  className="p-message-detail line-height-normal"
                  data-test={dataTest && `${dataTest}-message-detail`}
                >
                  {detail}
                </div>
              ) : null}
            </div>
            {closable && (
              <Button
                className="p-message-close-button"
                size="small"
                severity={buttonSeverity[severity]}
                outlined
                icon={<IconX className="icon-md" />}
                aria-label={closeMessage}
                onClick={handleClick}
                data-test={dataTest && `${dataTest}-message-close`}
              />
            )}
          </div>
          {children && (
            <div
              className="p-message-content"
              data-pc-section="content"
              data-test={dataTest && `${dataTest}-message-block`}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

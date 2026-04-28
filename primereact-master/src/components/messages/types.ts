import { type MessagesMessage } from 'primereact/messages';

export interface MessagesProps extends MessagesMessage {
  children?: React.ReactNode;
  dataTest?: string;
  className?: string;
  isAlignCenterTitle?: boolean;
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: (value: boolean) => void;
  closeMessage?: string;
  withoutIcon?: boolean;
}

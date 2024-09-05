import { IconCopy } from '../icons/IconCopy';
import { useToaster } from '../Toaster/useToaster';

export function useWriteToClipBoard() {
  const { toast } = useToaster();

  return function writeToClipboard(identifer: string, text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast(
          <div className="flex flex-row items-center gap-2">
            Put
            <div className="badge badge-accent">{identifer}</div> to your clipboard <IconCopy />
          </div>,
        );
      })
      .catch(() => {
        toast(<div>Failed to put requested item to your clipboard</div>);
      });
  };
}

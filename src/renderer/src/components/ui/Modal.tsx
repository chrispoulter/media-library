import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export const Modal = ({
    onClose,
    children,
    className,
}: ModalProps): React.JSX.Element => (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
            <Dialog.Content
                className={clsx(
                    'fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900',
                    className
                )}
            >
                {children}
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);

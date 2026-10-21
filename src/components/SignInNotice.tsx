"use client";

import { AnimatePresence, motion } from "motion/react";
import { useClerk } from "@clerk/nextjs";

const SignInNotice = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { openSignIn } = useClerk();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div key="wrap" className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              className="pointer-events-auto w-full max-w-sm rounded-3xl bg-card p-6 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <h3 className="font-serif text-2xl text-light-bg">Sign in to continue</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Word meanings are free for everyone. The AI chat and voice assistant need a free account.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onClose();
                    openSignIn();
                  }}
                  className="rounded-full bg-primary py-3 text-sm font-medium text-background"
                >
                  Sign in
                </button>
                <button onClick={onClose} className="py-2 text-sm text-muted-foreground">
                  Not now
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SignInNotice;
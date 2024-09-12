import { useAtomValue } from "jotai";
import { PropsWithChildren } from "react";
import { authAtom } from "./atoms/authAtom";
import { s3GarageClient } from "@/api/garage/s3-garage-client";

export function AtomEffects({ children }: PropsWithChildren) {
  const auth = useAtomValue(authAtom);

  s3GarageClient.setToken(auth.token);

  return children;
}
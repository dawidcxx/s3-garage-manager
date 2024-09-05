import { atom } from "jotai";
import { Toast } from "./Toast";

export const toastAtom = atom<Toast[]>([]);

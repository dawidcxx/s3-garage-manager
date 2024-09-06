import { isNil } from "./isNil";

export function isEmptyString(value: string | null | undefined): boolean {
    return isNil(value) || value.trim() === '';
}
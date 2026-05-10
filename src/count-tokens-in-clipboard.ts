import { Clipboard, showToast, Toast } from "@raycast/api";
import { countTokens } from "gpt-tokenizer/encoding/o200k_base";

function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}

function getCharacterCount(text: string): number {
  return Array.from(text).length;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export default async function Command(): Promise<void> {
  try {
    const clipboardText = await Clipboard.readText();

    if (!clipboardText || clipboardText.trim().length === 0) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No clipboard text found",
        message: "Copy some text first.",
      });

      return;
    }

    const tokenCount = countTokens(clipboardText);
    const characterCount = getCharacterCount(clipboardText);

    await showToast({
      style: Toast.Style.Success,
      title: `${formatInteger(tokenCount)} tokens`,
      message: `OpenAI o200k_base · ${formatInteger(characterCount)} characters`,
    });
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Could not count tokens",
      message: getErrorMessage(error),
    });
  }
}

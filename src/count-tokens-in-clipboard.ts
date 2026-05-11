import { Clipboard, showToast, Toast } from "@raycast/api";
import { countTokens } from "gpt-tokenizer/encoding/o200k_base";

function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}

function getWordCount(text: string): number {
  const words = text.trim().match(/\S+/gu);

  return words?.length ?? 0;
}

function getCharacterCount(text: string): number {
  return Array.from(text).length;
}

function getLineCount(text: string): number {
  return text.split(/\r\n|\r|\n/u).length;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export default async function Command(): Promise<void> {
  const toast = await showToast({
    style: Toast.Style.Animated,
    title: "Counting tokens...",
  });

  try {
    const clipboardText = await Clipboard.readText();

    if (!clipboardText || clipboardText.trim().length === 0) {
      toast.style = Toast.Style.Failure;
      toast.title = "No clipboard text found";
      toast.message = "Copy some text first.";

      return;
    }

    const tokenCount = countTokens(clipboardText);
    const wordCount = getWordCount(clipboardText);
    const lineCount = getLineCount(clipboardText);
    const characterCount = getCharacterCount(clipboardText);

    toast.style = Toast.Style.Success;
    toast.title = `${formatInteger(tokenCount)} tokens`;
    toast.message = `o200k_base · ${formatInteger(wordCount)} words · ${formatInteger(lineCount)} lines · ${formatInteger(characterCount)} characters`;
  } catch (error) {
    toast.style = Toast.Style.Failure;
    toast.title = "Could not count tokens";
    toast.message = getErrorMessage(error);
  }
}

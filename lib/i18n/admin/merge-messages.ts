/** Deep-merge message trees (for locale catalogs) */
type MessageTree = { [key: string]: string | MessageTree };

export function mergeMessages<T extends MessageTree>(
  base: T,
  extra: MessageTree,
): T {
  const result: MessageTree = { ...base };

  for (const key of Object.keys(extra)) {
    const extraVal = extra[key];
    const baseVal = result[key];

    if (
      extraVal &&
      typeof extraVal === "object" &&
      baseVal &&
      typeof baseVal === "object"
    ) {
      result[key] = mergeMessages(baseVal as MessageTree, extraVal as MessageTree);
    } else {
      result[key] = extraVal;
    }
  }

  return result as T;
}
